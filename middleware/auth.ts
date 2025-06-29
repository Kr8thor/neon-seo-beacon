export default defineNuxtRouteMiddleware(async (to, from) => {
  // Get user from both client and server contexts
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  
  // For server-side rendering, verify user session properly
  if (process.server) {
    try {
      // Get session from server-side Supabase client
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session?.user) {
        // Redirect to login if no valid session
        throw createError({
          statusCode: 401,
          statusMessage: 'Authentication required'
        })
      }
      
      // Session is valid, continue
      return
    } catch (error) {
      console.error('Server-side auth error:', error)
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }
  }
  
  // Client-side authentication check
  if (process.client) {
    // Wait for auth state to be determined
    await new Promise((resolve) => {
      const unwatch = watch(user, (newUser) => {
        if (newUser !== null) {
          unwatch()
          resolve(newUser)
        }
      }, { immediate: true })
      
      // Timeout after 5 seconds to prevent infinite waiting
      setTimeout(() => {
        unwatch()
        resolve(null)
      }, 5000)
    })
    
    // If user is not authenticated, redirect to login
    if (!user.value) {
      return navigateTo('/auth/login')
    }
  }
})
