<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Settings
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Manage your account preferences and application settings.
        </p>
      </div>

      <!-- Settings Sections -->
      <div class="space-y-8">
        <!-- Profile Settings -->
        <div class="glass rounded-2xl p-6 border border-white/20">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Profile Settings
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <!-- Preferences -->
        <div class="glass rounded-2xl p-6 border border-white/20">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Preferences
          </h2>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                  Email Notifications
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Receive email updates about your audits
                </p>
              </div>
              <button
                class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                  Dark Mode
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Use dark theme for the interface
                </p>
              </div>
              <button
                class="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div class="glass rounded-2xl p-6 border border-white/20">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Security
          </h2>

          <div class="space-y-4">
            <button
              class="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200"
            >
              Change Password
            </button>

            <div class="text-sm text-gray-600 dark:text-gray-300">
              Last password change: Never
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end">
          <button
            class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 hover-scale"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Protect this page - require authentication
definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Settings - Neon SEO Beacon",
  meta: [
    {
      name: "description",
      content: "Manage your account settings and preferences.",
    },
  ],
});
</script>
