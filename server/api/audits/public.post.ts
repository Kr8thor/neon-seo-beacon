import type { H3Event } from 'h3'
import { createSupabaseClient } from '~/server/utils/supabase'
import { logger } from '~/server/utils/logger'
import { checkIPRateLimit, setRateLimitHeaders } from '~/server/utils/secureRateLimit'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // IP-based rate limiting
    const rateLimitResult = await checkIPRateLimit(event, {
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxRequests: 10, // 10 audits per 5 minutes
      blockDuration: 15 * 60 * 1000 // 15 minutes block
    })
    
    setRateLimitHeaders(event, rateLimitResult)
    
    if (!rateLimitResult.allowed) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Too many requests. Please try again later.'
      })
    }

    // Get and validate request body
    const body = await readBody(event)
    const { url } = body

    // Validate URL
    if (!url || typeof url !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL is required'
      })
    }

    // Sanitize URL
    let cleanUrl = url.trim()
    if (!cleanUrl.match(/^https?:\/\//)) {
      cleanUrl = 'https://' + cleanUrl
    }

    // Basic URL validation
    try {
      new URL(cleanUrl)
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Please enter a valid URL'
      })
    }

    // Get client info for logging
    const clientIP = getClientIP(event)
    const userAgent = getHeader(event, 'user-agent') || 'unknown'

    // Log the request
    logger.info('Public audit request', {
      url: cleanUrl,
      ip: clientIP,
      userAgent: userAgent.substring(0, 100)
    })

    // Create audit record - using minimal fields that exist in database
    const supabase = createSupabaseClient()
    
    // Generate a random UUID for public user_id (you'll need to create this user)
    const publicUserId = 'ac67a5be-b6cb-40f0-95a3-d60d5d60ac46' // Real UUID from Supabase
    
    const { data: audit, error } = await supabase
      .from('audits')
      .insert({
        url: cleanUrl,
        user_id: publicUserId,
        status: 'pending'
      })
      .select('id, url, status, created_at')
      .single()

    if (error) {
      logger.error('Database error during audit creation', error, {
        url: cleanUrl,
        ip: clientIP
      })
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create audit. Please try again.'
      })
    }

    // Success response
    return {
      success: true,
      audit: {
        id: audit.id,
        url: audit.url,
        status: audit.status,
        created_at: audit.created_at
      }
    }
    
  } catch (error: any) {
    if (error.statusCode) {
      logger.warn('Public audit API error', {
        statusCode: error.statusCode,
        message: error.statusMessage,
        ip: getClientIP(event)
      })
      throw error
    } else {
      logger.error('Unexpected error in public audit API', error, {
        ip: getClientIP(event)
      })
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal server error. Please try again.'
      })
    }
  }
})

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
