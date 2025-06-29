import { metricsCollector, getSystemMetrics } from '~/server/utils/monitoring'
import { getAllCircuitBreakers } from '~/server/utils/circuitBreaker'
import { getSupabasePool } from '~/server/utils/supabasePool'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get application metrics
    const appMetrics = metricsCollector.getMetrics()
    
    // Get system metrics
    const systemMetrics = getSystemMetrics()
    
    // Get circuit breaker stats
    const circuitBreakers = getAllCircuitBreakers()
    const circuitBreakerStats = circuitBreakers.map(breaker => breaker.getStats())
    
    // Get database pool stats
    const dbPool = getSupabasePool()
    const dbPoolStats = dbPool ? dbPool.getStats() : null
    
    // Get queue stats (if available)
    const { getQueueStats } = await import('~/server/utils/auditProcessor')
    const queueStats = getQueueStats()

    return {
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        application: appMetrics,
        system: systemMetrics,
        services: {
          circuitBreakers: {
            total: circuitBreakers.length,
            stats: circuitBreakerStats
          },
          database: {
            pool: dbPoolStats
          },
          queue: queueStats
        }
      }
    }
  } catch (error) {
    console.error('Metrics collection error:', error)
    
    setResponseStatus(event, 500)
    return {
      success: false,
      error: 'Failed to collect metrics',
      message: (error as Error).message
    }
  }
})