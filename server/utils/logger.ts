// Secure production logging system
interface LogLevel {
  ERROR: 'error'
  WARN: 'warn' 
  INFO: 'info'
  DEBUG: 'debug'
}

interface LogEntry {
  timestamp: string
  level: keyof LogLevel
  message: string
  context?: Record<string, any>
  userId?: string
  ip?: string
  requestId?: string
}

class SecureLogger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  
  private sanitizeError(error: any): Record<string, any> {
    if (!error) return {}
    
    // Remove sensitive information from errors
    const sanitized: Record<string, any> = {
      message: error.message || 'Unknown error',
      code: error.code,
      statusCode: error.statusCode
    }
    
    // Only include stack trace in development
    if (this.isDevelopment && error.stack) {
      sanitized.stack = error.stack
    }
    
    return sanitized
  }
  
  private createLogEntry(
    level: keyof LogLevel, 
    message: string, 
    context?: Record<string, any>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: context ? this.sanitizeContext(context) : undefined
    }
  }
  
  private sanitizeContext(context: Record<string, any>): Record<string, any> {
    const sanitized = { ...context }
    
    // Remove sensitive fields
    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'auth', 'authorization',
      'cookie', 'session', 'apiKey', 'privateKey', 'jwt'
    ]
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]'
      }
    }
    
    return sanitized
  }
  
  private output(entry: LogEntry): void {
    if (this.isDevelopment) {
      // Development: Use console with colors
      const colors = {
        error: '\x1b[31m',
        warn: '\x1b[33m',
        info: '\x1b[36m',
        debug: '\x1b[37m'
      }
      const reset = '\x1b[0m'
      
      console.log(
        `${colors[entry.level]}[${entry.level.toUpperCase()}]${reset} ${entry.timestamp} - ${entry.message}`,
        entry.context ? entry.context : ''
      )
    } else {
      // Production: Structured JSON logging
      console.log(JSON.stringify(entry))
    }
  }
  
  error(message: string, error?: any, context?: Record<string, any>): void {
    const sanitizedError = error ? this.sanitizeError(error) : undefined
    const fullContext = { ...context, error: sanitizedError }
    
    this.output(this.createLogEntry('error', message, fullContext))
  }
  
  warn(message: string, context?: Record<string, any>): void {
    this.output(this.createLogEntry('warn', message, context))
  }
  
  info(message: string, context?: Record<string, any>): void {
    this.output(this.createLogEntry('info', message, context))
  }
  
  debug(message: string, context?: Record<string, any>): void {
    if (this.isDevelopment) {
      this.output(this.createLogEntry('debug', message, context))
    }
  }
  
  // Security-specific logging
  security(message: string, context?: Record<string, any>): void {
    this.output(this.createLogEntry('error', `[SECURITY] ${message}`, context))
  }
  
  // Rate limit logging
  rateLimit(message: string, ip: string, userId?: string): void {
    this.output(this.createLogEntry('warn', `[RATE_LIMIT] ${message}`, {
      ip: this.sanitizeIP(ip),
      userId
    }))
  }
  
  private sanitizeIP(ip: string): string {
    // Only log partial IP for privacy
    if (ip.includes(':')) {
      // IPv6 - show first 4 segments
      return ip.split(':').slice(0, 4).join(':') + ':xxxx:xxxx:xxxx:xxxx'
    } else {
      // IPv4 - show first 2 octets
      const parts = ip.split('.')
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.xxx.xxx`
      }
    }
    return 'xxx.xxx.xxx.xxx'
  }
}

export const logger = new SecureLogger()
