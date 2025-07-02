export default defineEventHandler(async (event) => {
  try {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'production',
      message: 'Minimal health check - no dependencies'
    }
  } catch (error: any) {
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    }
  }
})