<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Case Studies</h1>
        <p class="text-xl text-gray-600">
          Real success stories from our clients
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4"
              >
                <div class="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  E-commerce Site
                </h3>
                <p class="text-sm text-gray-600">Retail Industry</p>
              </div>
            </div>
            <p class="text-gray-600 mb-4">
              Increased organic traffic by 150% and improved search rankings for
              200+ keywords.
            </p>
            <div class="flex justify-between text-sm">
              <span class="text-green-600 font-medium">+150% Traffic</span>
              <span class="text-blue-600 font-medium">200+ Keywords</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4"
              >
                <div class="w-6 h-6 bg-green-600 rounded"></div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  SaaS Platform
                </h3>
                <p class="text-sm text-gray-600">Technology</p>
              </div>
            </div>
            <p class="text-gray-600 mb-4">
              Achieved first page rankings for competitive keywords and doubled
              lead generation.
            </p>
            <div class="flex justify-between text-sm">
              <span class="text-green-600 font-medium">+200% Leads</span>
              <span class="text-blue-600 font-medium">Page 1 Rankings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Case Studies - Neon SEO Beacon",
  meta: [
    {
      name: "description",
      content:
        "Explore real success stories and case studies from businesses that improved their SEO with Neon SEO Beacon.",
    },
  ],
});
</script>
