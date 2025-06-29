<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full text-center">
      <div class="bg-white rounded-lg shadow p-8">
        <div v-if="loading" class="space-y-4">
          <div class="spinner w-8 h-8 mx-auto"></div>
          <h2 class="text-xl font-semibold text-gray-900">Completing sign in...</h2>
          <p class="text-gray-600">Please wait while we set up your account.</p>
        </div>
        
        <div v-if="error" class="space-y-4">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <ExclamationTriangleIcon class="w-8 h-8 text-red-600" />
          </div>
          <h2 class="text-xl font-semibold text-gray-900">Sign in failed</h2>
          <p class="text-gray-600">{{ error }}</p>
          <div class="space-x-4">
            <NuxtLink to="/auth/login" class="btn btn-primary">
              Try Again
            </NuxtLink>
            <NuxtLink to="/" class="btn btn-outline">
              Go Home
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: false
})

const supabase = useSupabaseClient()
const notificationStore = useNotificationStore()
const route = useRoute()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    // Handle the authentication callback
    const { data, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      error.value = authError.message
      loading.value = false
      return
    }

    if (data.session) {
      // User is authenticated, redirect to dashboard
      notificationStore.success('Successfully signed in!')
      await navigateTo('/dashboard')
    } else {
      // Check for auth code in URL to exchange for session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(route.query.code)
      
      if (exchangeError) {
        error.value = exchangeError.message
        loading.value = false
        return
      }
      
      // Redirect to dashboard after successful exchange
      notificationStore.success('Successfully signed in!')
      await navigateTo('/dashboard')
    }
  } catch (err) {
    console.error('Auth callback error:', err)
    error.value = 'An unexpected error occurred during sign in.'
    loading.value = false
  }
})

// SEO
const { setPageMeta } = useSEO()
setPageMeta({
  title: 'Completing Sign In | Neon SEO Beacon',
  description: 'Completing your authentication with Neon SEO Beacon.'
})
</script>
