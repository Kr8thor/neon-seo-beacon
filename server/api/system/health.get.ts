import { getHealthStatus } from '~/server/utils/monitoring'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const health = await getHealthStatus()
    
    // Set appropriate HTTP status based on health
    if (health.status !== 'healthy') {
      setResponseStatus(event, 503) // Service Unavailable
    }
    
    return health
  } catch (error) {
    console.error('Health check error:', error)
    
    setResponseStatus(event, 500)
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: (error as Error).message
    }
  }
})