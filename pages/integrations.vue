<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Integrations</h1>
        <p class="text-xl text-gray-600">
          Connect with your favorite tools and platforms
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-white rounded-lg shadow-lg p-6 text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center"
          >
            <div class="w-8 h-8 bg-blue-600 rounded"></div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Google Analytics
          </h3>
          <p class="text-gray-600">
            Track your SEO performance with Google Analytics integration.
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6 text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center"
          >
            <div class="w-8 h-8 bg-green-600 rounded"></div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Search Console
          </h3>
          <p class="text-gray-600">
            Import data directly from Google Search Console.
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6 text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center"
          >
            <div class="w-8 h-8 bg-purple-600 rounded"></div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Slack</h3>
          <p class="text-gray-600">
            Get SEO alerts and reports directly in Slack.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Integrations - Neon SEO Beacon",
  meta: [
    {
      name: "description",
      content:
        "Integrate Neon SEO Beacon with your favorite tools including Google Analytics, Search Console, and more.",
    },
  ],
});
</script>
