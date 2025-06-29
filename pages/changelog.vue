<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Changelog</h1>
        <p class="text-xl text-gray-600">Latest updates and improvements</p>
      </div>

      <div class="space-y-8">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-semibold text-gray-900">Version 2.0.0</h2>
            <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Latest</span>
          </div>
          <p class="text-gray-600 mb-4">June 26, 2025</p>
          <div class="space-y-2">
            <div class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span class="text-gray-700">Complete system rebuild with Nuxt 3</span>
            </div>
            <div class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span class="text-gray-700">Enhanced SEO analysis engine with 15+ metrics</span>
            </div>
            <div class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span class="text-gray-700">Real-time progress tracking</span>
            </div>
            <div class="flex items-start">
              <span class="text-green-600 mr-2">✓</span>
              <span class="text-gray-700">Improved performance and reliability</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Changelog - Neon SEO Beacon',
  meta: [
    { name: 'description', content: 'Stay updated with the latest changes, improvements, and new features in Neon SEO Beacon.' }
  ]
})
</script>
