<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">SEO Blog</h1>
        <p class="text-xl text-gray-600">Latest insights and tips from SEO experts</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Complete Guide to Technical SEO</h2>
            <p class="text-gray-600 mb-4">Learn the fundamentals of technical SEO and how to optimize your website's technical foundation.</p>
            <div class="text-sm text-gray-500">June 26, 2025</div>
          </div>
        </article>
        
        <article class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">SEO Trends for 2025</h2>
            <p class="text-gray-600 mb-4">Discover the latest SEO trends and what to expect in search engine optimization.</p>
            <div class="text-sm text-gray-500">June 25, 2025</div>
          </div>
        </article>
        
        <article class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Core Web Vitals Optimization</h2>
            <p class="text-gray-600 mb-4">Improve your website's performance and user experience with Core Web Vitals optimization.</p>
            <div class="text-sm text-gray-500">June 24, 2025</div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Blog - Neon SEO Beacon',
  meta: [
    { name: 'description', content: 'Stay updated with the latest SEO trends, tips, and insights from industry experts.' }
  ]
})
</script>
