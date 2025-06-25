export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()
  
  // If user is not authenticated, redirect to login
  if (!user.value) {
    return navigateTo('/auth/login')
  }
})