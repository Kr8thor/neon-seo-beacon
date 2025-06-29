export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser();

  // If user is already authenticated, redirect to dashboard
  if (user.value) {
    return navigateTo("/dashboard");
  }
});
