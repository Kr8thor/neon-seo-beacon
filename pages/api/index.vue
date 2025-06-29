<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
        <p class="text-xl text-gray-600">Integrate with Neon SEO Beacon API</p>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">
          Available Endpoints
        </h2>

        <div class="space-y-6">
          <div class="border border-gray-200 rounded-lg p-6">
            <div class="flex items-center mb-3">
              <span
                class="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono mr-3"
                >GET</span
              >
              <code class="text-gray-800 font-mono">/api/health</code>
            </div>
            <p class="text-gray-600">Check API health status</p>
          </div>

          <div class="border border-gray-200 rounded-lg p-6">
            <div class="flex items-center mb-3">
              <span
                class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono mr-3"
                >POST</span
              >
              <code class="text-gray-800 font-mono">/api/seo/analyze</code>
            </div>
            <p class="text-gray-600 mb-3">Analyze a website for SEO metrics</p>
            <div class="bg-gray-50 p-3 rounded">
              <p class="text-sm text-gray-700 mb-2">Request body:</p>
              <code class="text-sm">{"url": "https://example.com"}</code>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg p-6">
            <div class="flex items-center mb-3">
              <span
                class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono mr-3"
                >POST</span
              >
              <code class="text-gray-800 font-mono">/api/audits</code>
            </div>
            <p class="text-gray-600">
              Create new SEO audit (requires authentication)
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "API Documentation - Neon SEO Beacon",
  meta: [
    {
      name: "description",
      content:
        "Complete API documentation for integrating with Neon SEO Beacon services.",
    },
  ],
});
</script>
