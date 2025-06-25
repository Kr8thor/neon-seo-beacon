export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    // Basic health check
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      environment: config.NODE_ENV || 'development',
      uptime: process.uptime()
    }
    
    // Check database connectivity (Supabase)
    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceKey
    )
    
    try {
      const { error } = await supabase
        .from('audits')
        .select('id')
        .limit(1)
      
      health.database = error ? 'unhealthy' : 'healthy'
    } catch (dbError) {
      health.database = 'unhealthy'
      health.databaseError = dbError.message
    }
    
    // Check AI service (Claude API)
    try {
      if (config.anthropicApiKey) {
        health.ai = 'configured'
      } else {
        health.ai = 'not_configured'
      }
    } catch (aiError) {
      health.ai = 'unhealthy'
      health.aiError = aiError.message
    }
    
    return health
  } catch (error) {
    setResponseStatus(event, 500)
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }
  }
})