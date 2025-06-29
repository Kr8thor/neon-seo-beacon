import type { H3Event } from 'h3'
import { createSupabaseClient } from './supabase'
import { logger } from './logger'
import jwt from 'jsonwebtoken'

interface User {
  id: string
  email: string
  [key: string]: any
}

export async function getCurrentUser(event: H3Event): Promise<User | null> {
  try {
    const config = useRuntimeConfig()
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, config.jwtSecret) as any
    
    if (!decoded.sub) {
      return null
    }
    
    return {
      id: decoded.sub,
      email: decoded.email || '',
      ...decoded
    }
    
  } catch (error) {
    logger.warn('Invalid JWT token', { hasToken: !!authHeader })
    return null
  }
}

export async function getUserFromSupabase(event: H3Event): Promise<User | null> {
  try {
    const supabase = createSupabaseClient()
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader) {
      return null
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (error || !user) {
      return null
    }
    
    return {
      id: user.id,
      email: user.email || '',
      ...user
    }
    
  } catch (error) {
    logger.warn('Failed to authenticate with Supabase', { hasAuthHeader: !!authHeader })
    return null
  }
}
