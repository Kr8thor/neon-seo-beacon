<template>
  <div>
    <AppHeader
      title="Community"
      subtitle="Connect with other SEO professionals and share insights"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Join Our SEO Community
        </h1>
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with fellow SEO professionals, share strategies, and stay
          updated with the latest industry trends.
        </p>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-xl font-semibold mb-4">Discord Community</h3>
            <p class="text-gray-600 mb-4">
              Join our active Discord server with 1000+ SEO professionals
            </p>
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Join Discord
            </button>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-xl font-semibold mb-4">Monthly Webinars</h3>
            <p class="text-gray-600 mb-4">
              Learn from industry experts in our monthly webinar series
            </p>
            <button
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              View Schedule
            </button>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="text-xl font-semibold mb-4">Knowledge Sharing</h3>
            <p class="text-gray-600 mb-4">
              Share your SEO wins and learn from others' experiences
            </p>
            <button
              class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Start Sharing
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  title: "Community - Neon SEO Beacon",
  description: "Join our community of SEO professionals",
});
</script>
