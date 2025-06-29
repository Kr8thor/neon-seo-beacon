import type { H3Event } from 'h3'
import { logger } from './logger'

interface RequestMetrics {
  startTime: number
  memoryUsageStart: NodeJS.MemoryUsage
}

// Store request metrics
const requestMetrics = new Map<string, RequestMetrics>()

export function startRequestMonitoring(event: H3Event): string {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // Store start time and memory usage
  requestMetrics.set(requestId, {
    startTime: Date.now(),
    memoryUsageStart: process.memoryUsage()
  })

  // Add request ID to event context
  setHeader(event, 'X-Request-ID', requestId)
  
  return requestId
}

export function endRequestMonitoring(event: H3Event, requestId: string, statusCode: number): void {
  const metrics = requestMetrics.get(requestId)
  if (!metrics) return

  const duration = Date.now() - metrics.startTime
  const memoryUsageEnd = process.memoryUsage()
  const method = getMethod(event)
  const url = getRequestURL(event).pathname
  const ip = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || getHeader(event, 'cf-connecting-ip') || 'unknown'
  const userAgent = getHeader(event, 'user-agent')

  // Log HTTP request
  logger.info(`${method} ${url} ${statusCode} ${duration}ms`, {
    ip,
    userAgent,
    requestId,
    statusCode,
    duration
  })

  // Log performance metrics
  logger.debug('Request performance', {
    metric: 'request_duration',
    value: duration,
    unit: 'ms',
    method,
    url,
    statusCode,
    requestId
  })

  logger.debug('Memory usage', {
    metric: 'memory_delta',
    value: memoryUsageEnd.heapUsed - metrics.memoryUsageStart.heapUsed,
    unit: 'bytes',
    method,
    url,
    requestId
  })

  // Check for slow requests
  if (duration > 5000) { // 5 seconds
    logger.security('Slow request detected', {
      type: 'slow_request',
      severity: 'medium',
      method,
      url,
      duration,
      ip,
      userAgent,
      requestId
    })
  }

  // Check for suspicious activity
  if (statusCode === 401 || statusCode === 403) {
    logger.security('Unauthorized access attempt', {
      type: 'unauthorized_access',
      severity: 'medium',
      method,
      url,
      statusCode,
      ip,
      userAgent,
      requestId
    })
  }

  if (statusCode >= 500) {
    logger.security('Server error occurred', {
      type: 'server_error',
      severity: 'high',
      method,
      url,
      statusCode,
      ip,
      userAgent,
      requestId
    })
  }

  // Clean up
  requestMetrics.delete(requestId)
}

export function getSystemMetrics() {
  const usage = process.memoryUsage()
  const uptime = process.uptime()
  
  // Safely get OS info without require()
  let osInfo = {
    loadAverage: [0, 0, 0],
    freemem: 0,
    totalmem: 0,
    cpus: 1
  }
  
  try {
    // Import os module dynamically for server environment
    if (typeof process !== 'undefined' && process.versions?.node) {
      import('os').then((os) => {
        osInfo = {
          loadAverage: process.platform !== 'win32' ? os.loadavg() : [0, 0, 0],
          freemem: os.freemem(),
          totalmem: os.totalmem(),
          cpus: os.cpus().length
        }
      }).catch(() => {
        // Fallback values already set
      })
    }
  } catch (error) {
    // Use fallback values
  }
  
  return {
    memory: {
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      rss: usage.rss
    },
    system: {
      uptime,
      ...osInfo
    },
    process: {
      pid: process.pid,
      version: process.version,
      platform: process.platform,
      arch: process.arch
    }
  }
}

export class MetricsCollector {
  private metrics: Map<string, number[]> = new Map()
  private counters: Map<string, number> = new Map()
  private gauges: Map<string, number> = new Map()

  // Record a timing metric
  recordTiming(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(value)
    
    // Keep only last 100 values
    const values = this.metrics.get(name)!
    if (values.length > 100) {
      values.shift()
    }
  }

  // Increment a counter
  incrementCounter(name: string, value: number = 1): void {
    const current = this.counters.get(name) || 0
    this.counters.set(name, current + value)
  }

  // Set a gauge value
  setGauge(name: string, value: number): void {
    this.gauges.set(name, value)
  }

  // Get metrics summary
  getMetrics() {
    const timings: Record<string, any> = {}
    
    for (const [name, values] of this.metrics.entries()) {
      if (values.length > 0) {
        const sorted = [...values].sort((a, b) => a - b)
        timings[name] = {
          count: values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((a, b) => a + b) / values.length,
          p50: sorted[Math.floor(sorted.length * 0.5)],
          p95: sorted[Math.floor(sorted.length * 0.95)],
          p99: sorted[Math.floor(sorted.length * 0.99)]
        }
      }
    }

    return {
      timings,
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      system: getSystemMetrics()
    }
  }

  // Reset all metrics
  reset(): void {
    this.metrics.clear()
    this.counters.clear()
    this.gauges.clear()
  }
}

// Global metrics collector
export const metricsCollector = new MetricsCollector()

// Health check function
export async function getHealthStatus() {
  const systemMetrics = getSystemMetrics()
  const appMetrics = metricsCollector.getMetrics()
  
  // Check system health
  const memoryUsagePercent = (systemMetrics.memory.heapUsed / systemMetrics.memory.heapTotal) * 100
  const freeMemoryPercent = (systemMetrics.system.freemem / systemMetrics.system.totalmem) * 100
  
  const isHealthy = memoryUsagePercent < 90 && freeMemoryPercent > 10
  
  return {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: systemMetrics.system.uptime,
    memory: {
      usage: memoryUsagePercent,
      available: freeMemoryPercent
    },
    metrics: {
      requests: appMetrics.counters.requests || 0,
      errors: appMetrics.counters.errors || 0,
      audits: appMetrics.counters.audits || 0
    },
    checks: {
      memory: memoryUsagePercent < 90,
      disk: freeMemoryPercent > 10,
      uptime: systemMetrics.system.uptime > 60 // At least 1 minute uptime
    }
  }
}

// Update gauges periodically
setInterval(() => {
  const metrics = getSystemMetrics()
  metricsCollector.setGauge('memory_heap_used', metrics.memory.heapUsed)
  metricsCollector.setGauge('memory_heap_total', metrics.memory.heapTotal)
  metricsCollector.setGauge('system_freemem', metrics.system.freemem)
  metricsCollector.setGauge('system_uptime', metrics.system.uptime)
}, 30000) // Every 30 seconds