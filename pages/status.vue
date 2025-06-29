<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
        <p class="text-xl text-gray-600">
          Real-time status of all Neon SEO Beacon services
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-semibold text-gray-900">
            All Systems Operational
          </h2>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span class="text-green-600 font-medium">Operational</span>
          </div>
        </div>

        <div class="space-y-4">
          <div
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div>
              <h3 class="font-medium text-gray-900">SEO Analysis API</h3>
              <p class="text-sm text-gray-600">
                Core SEO analysis functionality
              </p>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span class="text-green-600 text-sm">Operational</span>
            </div>
          </div>

          <div
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div>
              <h3 class="font-medium text-gray-900">Dashboard</h3>
              <p class="text-sm text-gray-600">User interface and dashboard</p>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span class="text-green-600 text-sm">Operational</span>
            </div>
          </div>

          <div
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div>
              <h3 class="font-medium text-gray-900">Authentication</h3>
              <p class="text-sm text-gray-600">User login and authentication</p>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span class="text-green-600 text-sm">Operational</span>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-gray-200">
          <p class="text-sm text-gray-500">
            Last updated: June 26, 2025 at 2:52 PM UTC
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Status - Neon SEO Beacon",
  meta: [
    {
      name: "description",
      content:
        "Check the real-time status of Neon SEO Beacon services and infrastructure.",
    },
  ],
});
</script>
