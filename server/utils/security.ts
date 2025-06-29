import type { H3Event } from 'h3'
import { logger } from './logger'
import crypto from 'crypto'

// CSRF Protection
interface CSRFConfig {
  tokenLength: number
  headerName: string
  cookieName: string
  excludeRoutes: string[]
}

const DEFAULT_CSRF_CONFIG: CSRFConfig = {
  tokenLength: 32,
  headerName: 'x-csrf-token',
  cookieName: 'csrf-token',
  excludeRoutes: ['/api/health', '/api/audits/public']
}

export function generateCSRFToken(): string {
  return crypto.randomBytes(DEFAULT_CSRF_CONFIG.tokenLength).toString('hex')
}

export function validateCSRFToken(event: H3Event, config: CSRFConfig = DEFAULT_CSRF_CONFIG): boolean {
  const method = event.node.req.method?.toLowerCase()
  
  // Only validate for state-changing methods
  if (!['post', 'put', 'patch', 'delete'].includes(method || '')) {
    return true
  }
  
  const url = event.node.req.url || ''
  
  // Check if route is excluded
  if (config.excludeRoutes.some(route => url.startsWith(route))) {
    return true
  }
  
  const tokenHeader = getHeader(event, config.headerName)
  const tokenCookie = getCookie(event, config.cookieName)
  
  if (!tokenHeader || !tokenCookie) {
    logger.security('Missing CSRF token', { 
      url, 
      method,
      hasHeader: !!tokenHeader,
      hasCookie: !!tokenCookie,
      ip: getClientIP(event)
    })
    return false
  }
  
  // Constant-time comparison to prevent timing attacks
  const isValid = crypto.timingSafeEqual(
    Buffer.from(tokenHeader),
    Buffer.from(tokenCookie)
  )
  
  if (!isValid) {
    logger.security('Invalid CSRF token', {
      url,
      method,
      ip: getClientIP(event)
    })
  }
  
  return isValid
}

export function setCSRFToken(event: H3Event): string {
  const token = generateCSRFToken()
  
  setCookie(event, DEFAULT_CSRF_CONFIG.cookieName, token, {
    httpOnly: false, // Client needs to read it for headers
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 hours
  })
  
  return token
}

// Request Validation
interface ValidationConfig {
  maxBodySize: number
  maxUrlLength: number
  maxHeaderSize: number
  allowedContentTypes: string[]
  blockedUserAgents: RegExp[]
}

const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  maxBodySize: 1024 * 1024, // 1MB
  maxUrlLength: 2048,
  maxHeaderSize: 8192,
  allowedContentTypes: [
    'application/json',
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'text/plain'
  ],
  blockedUserAgents: [
    /bot/i,
    /spider/i,
    /crawler/i,
    /scanner/i,
    /curl/i,
    /wget/i
  ]
}

export function validateRequest(
  event: H3Event, 
  config: ValidationConfig = DEFAULT_VALIDATION_CONFIG
): { valid: boolean; error?: string } {
  try {
    // Check URL length
    const url = event.node.req.url || ''
    if (url.length > config.maxUrlLength) {
      logger.security('URL too long', { 
        urlLength: url.length,
        maxAllowed: config.maxUrlLength,
        ip: getClientIP(event)
      })
      return { valid: false, error: 'URL too long' }
    }
    
    // Check content length
    const contentLength = getHeader(event, 'content-length')
    if (contentLength && parseInt(contentLength) > config.maxBodySize) {
      logger.security('Request body too large', {
        contentLength: parseInt(contentLength),
        maxAllowed: config.maxBodySize,
        ip: getClientIP(event)
      })
      return { valid: false, error: 'Request too large' }
    }
    
    // Check content type for POST/PUT requests
    const method = event.node.req.method?.toLowerCase()
    if (['post', 'put', 'patch'].includes(method || '')) {
      const contentType = getHeader(event, 'content-type')
      if (contentType && !config.allowedContentTypes.some(type => 
        contentType.toLowerCase().includes(type.toLowerCase())
      )) {
        logger.security('Invalid content type', {
          contentType,
          allowedTypes: config.allowedContentTypes,
          ip: getClientIP(event)
        })
        return { valid: false, error: 'Invalid content type' }
      }
    }
    
    // Check User-Agent for suspicious patterns
    const userAgent = getHeader(event, 'user-agent') || ''
    if (config.blockedUserAgents.some(pattern => pattern.test(userAgent))) {
      logger.security('Suspicious user agent detected', {
        userAgent: userAgent.substring(0, 100),
        ip: getClientIP(event)
      })
      return { valid: false, error: 'Forbidden' }
    }
    
    // Check for suspicious headers
    const suspiciousHeaders = [
      'x-forwarded-host',
      'x-forwarded-proto',
      'x-rewrite-url',
      'x-original-url'
    ]
    
    for (const header of suspiciousHeaders) {
      const value = getHeader(event, header)
      if (value && value !== getHeader(event, 'host')) {
        logger.security('Suspicious header detected', {
          header,
          value: value.substring(0, 100),
          ip: getClientIP(event)
        })
        // Don't block, but log for monitoring
      }
    }
    
    return { valid: true }
    
  } catch (error) {
    logger.error('Request validation error', error)
    return { valid: false, error: 'Validation failed' }
  }
}

// Input Sanitization
export function sanitizeInput(input: any, options: {
  maxLength?: number
  allowedChars?: RegExp
  stripHtml?: boolean
} = {}): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  let sanitized = input.trim()
  
  // Strip HTML if requested
  if (options.stripHtml) {
    sanitized = sanitized.replace(/<[^>]*>/g, '')
  }
  
  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>'"&]/g, '')
  
  // Apply character filter
  if (options.allowedChars) {
    sanitized = sanitized.replace(options.allowedChars, '')
  }
  
  // Limit length
  if (options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength)
  }
  
  return sanitized
}

// SQL Injection Protection (for direct queries)
export function escapeSQL(input: string): string {
  return input.replace(/'/g, "''").replace(/;/g, '\\;')
}

// XSS Protection
export function escapeHtml(input: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }
  
  return input.replace(/[&<>"'/]/g, (char) => escapeMap[char])
}

function getClientIP(event: H3Event): string {
  const headers = [
    'cf-connecting-ip',
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip'
  ]
  
  for (const header of headers) {
    const value = getHeader(event, header)
    if (value) {
      return value.split(',')[0].trim()
    }
  }
  
  return 'unknown'
}
