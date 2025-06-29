import type { H3Event } from 'h3'
import { startRequestMonitoring, endRequestMonitoring, metricsCollector } from '~/server/utils/monitoring'
import { logger } from '~/server/utils/logger'
import { createSupabaseClient } from '~/server/utils/supabase'
import { getCurrentUser } from '~/server/utils/auth'

export default defineEventHandler(async (event: H3Event) => {
  const requestId = startRequestMonitoring(event)
  const startTime = Date.now()
  
  try {
    metricsCollector.incrementCounter('audit_requests')
    // Get request body
    const body = await readBody(event)
    const { url, type = 'standard' } = body

    // Validate URL
    if (!url || !isValidUrl(url)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid URL is required'
      })
    }

    // Get user from JWT token
    const user = await getCurrentUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    // Check rate limits
    const rateLimitResult = await checkRateLimit(event, user.id)
    setRateLimitHeaders(event, rateLimitResult)
    
    if (!rateLimitResult.allowed) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Rate limit exceeded. Please try again later.',
        data: {
          resetTime: rateLimitResult.resetTime
        }
      })
    }

    // Also check IP-based rate limiting for additional security
    const ipRateLimitResult = await checkIPRateLimit(event)
    if (!ipRateLimitResult.allowed) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Too many requests from this IP. Please try again later.'
      })
    }

    // Create audit record
    const supabase = createSupabaseClient()
    const { data: audit, error } = await supabase
      .from('audits')
      .insert({
        user_id: user.id,
        url,
        type,
        status: 'queued',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create audit'
      })
    }

    // Process audit asynchronously using job queue
    const jobId = addAuditJob(audit.id, url, type)

    // Log audit creation
    logger.info('Audit created successfully', {
      event: 'audit_created',
      auditId: audit.id,
      userId: user.id,
      url,
      type,
      jobId,
      requestId
    })

    metricsCollector.incrementCounter('audits_created')
    metricsCollector.recordTiming('audit_creation_time', Date.now() - startTime)

    const response = {
      success: true,
      audit: {
        id: audit.id,
        url: audit.url,
        status: audit.status,
        created_at: audit.created_at
      }
    }

    endRequestMonitoring(event, requestId, 200)
    return response
  } catch (error: any) {
    metricsCollector.incrementCounter('audit_errors')
    
    logger.error('Audit creation failed', error, {
      requestId
    })
    
    endRequestMonitoring(event, requestId, error.statusCode || 500)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

// Helper functions
function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (_) {
    return false
  }
}

// Rate limiting implementation moved to server/utils/secureRateLimit.ts
import { checkRateLimit, checkIPRateLimit, setRateLimitHeaders } from '~/server/utils/secureRateLimit'
import { addAuditJob } from '~/server/utils/auditProcessor'