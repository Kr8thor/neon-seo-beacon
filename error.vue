<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <!-- Error Icon -->
      <div class="mb-8">
        <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExclamationTriangleIcon class="w-12 h-12 text-red-600" />
        </div>
        <h1 class="text-6xl font-bold text-gray-900 mb-2">{{ error.statusCode }}</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">{{ errorTitle }}</h2>
      </div>
      
      <!-- Error Message -->
      <div class="mb-8">
        <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
        
        <!-- Helpful Links -->
        <div class="space-y-2">
          <p class="text-sm text-gray-500">Here are some helpful links:</p>
          <div class="flex flex-col sm:flex-row gap-2 justify-center">
            <NuxtLink 
              to="/" 
              class="btn btn-primary"
            >
              Go Home
            </NuxtLink>
            <NuxtLink 
              to="/help" 
              class="btn btn-secondary"
            >
              Get Help
            </NuxtLink>
            <button 
              @click="refresh" 
              class="btn btn-secondary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
      
      <!-- Additional Help -->
      <div class="border-t border-gray-200 pt-6">
        <p class="text-sm text-gray-500 mb-4">
          If you continue experiencing issues, please contact our support team.
        </p>
        <a 
          href="mailto:support@neonseobeacon.com" 
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          support@neonseobeacon.com
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

// Get error from props
const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

// Computed error details
const errorTitle = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'Page Not Found'
    case 403:
      return 'Access Forbidden'
    case 500:
      return 'Server Error'
    case 503:
      return 'Service Unavailable'
    default:
      return 'Something Went Wrong'
  }
})

const errorMessage = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return "The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL."
    case 403:
      return "You don't have permission to access this page. Please check your credentials or contact support."
    case 500:
      return 'We encountered an internal server error. Our team has been notified and is working to fix this issue.'
    case 503:
      return 'Our service is temporarily unavailable. Please try again in a few minutes.'
    default:
      return props.error.statusMessage || 'An unexpected error occurred. Please try again or contact support if the problem persists.'
  }
})

// Methods
function refresh() {
  if (process.client) {
    window.location.reload()
  }
}

// SEO
useHead({
  title: `${props.error.statusCode} - ${errorTitle.value}`,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Log error for debugging
console.error('Error page rendered:', props.error)
</script>