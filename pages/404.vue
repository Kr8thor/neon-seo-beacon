<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <!-- 404 Illustration -->
      <div class="mb-8">
        <div class="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.291M20 10a8 8 0 11-16 0 8 8 0 0116 0z"></path>
          </svg>
        </div>
        <h1 class="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      </div>
      
      <!-- Error Message -->
      <div class="mb-8">
        <p class="text-gray-600 mb-6">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
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
              to="/seo-tips" 
              class="btn btn-secondary"
            >
              SEO Tips
            </NuxtLink>
            <NuxtLink 
              to="/help" 
              class="btn btn-secondary"
            >
              Get Help
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <!-- Search -->
      <div class="border-t border-gray-200 pt-6">
        <p class="text-sm text-gray-500 mb-4">
          Or search for what you're looking for:
        </p>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search our site..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="performSearch"
          />
          <button 
            @click="performSearch"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
          >
            <MagnifyingGlassIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

// SEO
useHead({
  title: '404 - Page Not Found',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Reactive data
const searchQuery = ref('')

// Methods
function performSearch() {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}
</script>