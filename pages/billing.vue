<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Billing & Subscription
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Manage your subscription and billing information.
        </p>
      </div>
      
      <!-- Current Plan -->
      <div class="glass rounded-2xl p-6 border border-white/20 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Current Plan
          </h2>
          <span class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
            Active
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Professional Plan
            </h3>
            <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">
              $29<span class="text-lg text-gray-600 dark:text-gray-400">/month</span>
            </p>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Next Billing Date
            </h4>
            <p class="text-gray-900 dark:text-white">July 27, 2025</p>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Audits Used This Month
            </h4>
            <p class="text-gray-900 dark:text-white">47 / 500</p>
          </div>
        </div>
        
        <div class="mt-6 flex flex-wrap gap-4">
          <button class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
            Upgrade Plan
          </button>
          <button class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors duration-200">
            Cancel Subscription
          </button>
        </div>
      </div>
      
      <!-- Payment Method -->
      <div class="glass rounded-2xl p-6 border border-white/20 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Payment Method
        </h2>
        
        <div class="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <span class="text-white text-xs font-bold">VISA</span>
            </div>
            <div>
              <p class="text-gray-900 dark:text-white font-medium">
                •••• •••• •••• 4242
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Expires 12/27
              </p>
            </div>
          </div>
          
          <button class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
            Update
          </button>
        </div>
      </div>
      
      <!-- Billing History -->
      <div class="glass rounded-2xl p-6 border border-white/20">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Billing History
        </h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <div>
              <p class="text-gray-900 dark:text-white font-medium">
                Professional Plan - June 2025
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                June 27, 2025
              </p>
            </div>
            
            <div class="text-right">
              <p class="text-gray-900 dark:text-white font-medium">$29.00</p>
              <button class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
                Download
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <div>
              <p class="text-gray-900 dark:text-white font-medium">
                Professional Plan - May 2025
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                May 27, 2025
              </p>
            </div>
            
            <div class="text-right">
              <p class="text-gray-900 dark:text-white font-medium">$29.00</p>
              <button class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Protect this page - require authentication
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Billing - Neon SEO Beacon',
  meta: [
    { name: 'description', content: 'Manage your subscription and billing information.' }
  ]
})
</script>
