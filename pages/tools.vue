<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          SEO Tools
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Comprehensive SEO analysis and optimization tools for your website.
        </p>
      </div>
      
      <!-- Tools Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <NuxtLink
          to="/dashboard"
          class="glass rounded-2xl p-6 hover-scale border border-white/20 group"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            SEO Audit Dashboard
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Comprehensive website analysis with detailed insights and recommendations.
          </p>
        </NuxtLink>
        
        <!-- More tools coming soon -->
        <div class="glass rounded-2xl p-6 border border-white/20 opacity-75">
          <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl mb-4 flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Speed Analysis
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Page speed insights and performance optimization recommendations.
          </p>
          <div class="mt-4">
            <span class="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>
        
        <div class="glass rounded-2xl p-6 border border-white/20 opacity-75">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mb-4 flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Keyword Research
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Discover profitable keywords and analyze search competition.
          </p>
          <div class="mt-4">
            <span class="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'SEO Tools - Neon SEO Beacon',
  meta: [
    { name: 'description', content: 'Professional SEO tools for website analysis, speed optimization, and keyword research.' }
  ]
})
</script>
