<template>
  <div id="app" class="min-h-screen flex flex-col">
    <!-- Skip to main content link for accessibility -->
    <a 
      href="#main-content" 
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
    >
      Skip to main content
    </a>
    
    <!-- Navigation -->
    <AppNavigation />
    
    <!-- Main Content -->
    <main id="main-content" class="flex-1">
      <slot />
    </main>
    
    <!-- Footer -->
    <AppFooter />
    
    <!-- Global Notifications -->
    <Teleport to="body">
      <div 
        v-if="notification" 
        class="fixed top-4 right-4 z-50 max-w-sm w-full"
      >
        <div :class="[
          'p-4 rounded-lg shadow-lg border',
          notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        ]">
          <div class="flex items-start">
            <div class="flex-1">
              <h4 v-if="notification.title" class="font-medium mb-1">
                {{ notification.title }}
              </h4>
              <p class="text-sm">{{ notification.message }}</p>
            </div>
            <button 
              @click="clearNotification"
              class="ml-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

// Global notification system
const notificationStore = useNotificationStore()
const notification = computed(() => notificationStore.notification)

function clearNotification() {
  notificationStore.clear()
}

// Auto-clear notifications after 5 seconds
watch(notification, (newNotification) => {
  if (newNotification) {
    setTimeout(() => {
      notificationStore.clear()
    }, 5000)
  }
})

// Global error handling
onErrorCaptured((error) => {
  console.error('Global error:', error)
  notificationStore.show({
    type: 'error',
    title: 'Something went wrong',
    message: 'Please try again or contact support if the problem persists.'
  })
  return false
})
</script>