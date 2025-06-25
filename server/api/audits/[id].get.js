export default defineEventHandler(async (event) => {
  try {
    const auditId = getRouterParam(event, 'id')
    
    if (!auditId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Audit ID is required'
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

    // Get audit from database
    const supabase = serverSupabaseServiceRole(event)
    const { data: audit, error } = await supabase
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .eq('user_id', user.id)
      .single()

    if (error || !audit) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Audit not found'
      })
    }

    return {
      success: true,
      audit: {
        id: audit.id,
        url: audit.url,
        status: audit.status,
        score: audit.score,
        results: audit.results,
        error: audit.error,
        processing_time_ms: audit.processing_time_ms,
        created_at: audit.created_at,
        completed_at: audit.completed_at
      }
    }
  } catch (error) {
    console.error('Get audit error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

async function getCurrentUser(event) {
  const supabase = serverSupabaseUser(event)
  return supabase
}
