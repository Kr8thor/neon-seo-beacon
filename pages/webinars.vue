<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Webinars</h1>
        <p class="text-xl text-gray-600">Learn SEO from industry experts</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="mb-4">
            <span
              class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium"
              >Upcoming</span
            >
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Advanced Technical SEO Strategies
          </h3>
          <p class="text-gray-600 mb-4">
            Master technical SEO with our comprehensive guide to crawling,
            indexing, and site architecture.
          </p>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500"
              >July 15, 2025 • 2:00 PM EST</span
            >
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Register
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="mb-4">
            <span
              class="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium"
              >Available</span
            >
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            SEO Audit Fundamentals
          </h3>
          <p class="text-gray-600 mb-4">
            Learn how to conduct comprehensive SEO audits and identify
            optimization opportunities.
          </p>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Recorded • 45 minutes</span>
            <button
              class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Watch Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Webinars - Neon SEO Beacon",
  meta: [
    {
      name: "description",
      content:
        "Join our educational webinars to learn advanced SEO strategies and best practices from industry experts.",
    },
  ],
});
</script>
