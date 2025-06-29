<template>
  <Teleport to="body">
    <div class="notification-container fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <TransitionGroup
        name="notification"
        tag="div"
        class="space-y-3"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item glass-strong rounded-2xl border border-white/20 shadow-xl max-w-sm w-full pointer-events-auto overflow-hidden"
          :class="getNotificationClass(notification.type)"
          @click="removeNotification(notification.id)"
        >
          <!-- Progress Bar -->
          <div 
            v-if="notification.duration"
            class="absolute top-0 left-0 h-1 bg-current opacity-30 transition-all ease-linear"
            :style="{ 
              width: `${getProgressWidth(notification)}%`,
              transitionDuration: `${notification.duration}ms`
            }"
          ></div>
          
          <div class="p-4">
            <div class="flex items-start space-x-3">
              <!-- Icon -->
              <div class="flex-shrink-0 mt-0.5">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="getIconContainerClass(notification.type)"
                >
                  <component 
                    :is="getIcon(notification.type)" 
                    class="w-5 h-5"
                    :class="getIconClass(notification.type)"
                  />
                </div>
              </div>
              
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h4 
                  v-if="notification.title"
                  class="text-sm font-semibold text-gray-900 dark:text-white mb-1"
                >
                  {{ notification.title }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ notification.message }}
                </p>
                
                <!-- Action Button -->
                <button
                  v-if="notification.action"
                  class="mt-3 text-xs font-medium hover:underline transition-colors"
                  :class="getActionClass(notification.type)"
                  @click.stop="handleAction(notification)"
                >
                  {{ notification.action.text }}
                </button>
              </div>
              
              <!-- Close Button -->
              <button
                class="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                @click.stop="removeNotification(notification.id)"
              >
                <XMarkIcon class="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

interface NotificationAction {
  text: string
  handler: () => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  action?: NotificationAction
  createdAt: number
}

const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notifications as Notification[])

// Get notification styling classes
const getNotificationClass = (type: string) => {
  const baseClasses = 'animate-slide-in-right hover-lift cursor-pointer'
  
  switch (type) {
    case 'success':
      return `${baseClasses} border-green-200/50 dark:border-green-700/50`
    case 'error':
      return `${baseClasses} border-red-200/50 dark:border-red-700/50`
    case 'warning':
      return `${baseClasses} border-yellow-200/50 dark:border-yellow-700/50`
    case 'info':
    default:
      return `${baseClasses} border-blue-200/50 dark:border-blue-700/50`
  }
}

// Get icon component for notification type
const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
      return XCircleIcon
    case 'warning':
      return ExclamationTriangleIcon
    case 'info':
    default:
      return InformationCircleIcon
  }
}

// Get icon container styling
const getIconContainerClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-100 dark:bg-green-900/30'
    case 'error':
      return 'bg-red-100 dark:bg-red-900/30'
    case 'warning':
      return 'bg-yellow-100 dark:bg-yellow-900/30'
    case 'info':
    default:
      return 'bg-blue-100 dark:bg-blue-900/30'
  }
}

// Get icon color classes
const getIconClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-600 dark:text-green-400'
    case 'error':
      return 'text-red-600 dark:text-red-400'
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'info':
    default:
      return 'text-blue-600 dark:text-blue-400'
  }
}

// Get action button color classes
const getActionClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
    case 'error':
      return 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300'
    case 'info':
    default:
      return 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
  }
}

// Calculate progress bar width
const getProgressWidth = (notification: Notification) => {
  if (!notification.duration) return 100
  
  const elapsed = Date.now() - notification.createdAt
  const progress = Math.max(0, 100 - (elapsed / notification.duration) * 100)
  return progress
}

// Remove notification
const removeNotification = (id: string) => {
  notificationStore.remove(id)
}

// Handle action click
const handleAction = (notification: Notification) => {
  if (notification.action?.handler) {
    notification.action.handler()
  }
  removeNotification(notification.id)
}
</script>

<style scoped>
.notification-container {
  max-height: 100vh;
  overflow-y: auto;
}

/* Transition animations */
.notification-enter-active {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
}

.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.notification-move {
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.320, 1);
}

/* Custom scrollbar for container */
.notification-container::-webkit-scrollbar {
  width: 4px;
}

.notification-container::-webkit-scrollbar-track {
  background: transparent;
}

.notification-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.notification-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .notification-container {
    top: 1rem;
    right: 1rem;
    left: 1rem;
  }
  
  .notification-item {
    max-width: none;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .notification-enter-active,
  .notification-leave-active,
  .notification-move {
    transition: none !important;
  }
  
  .notification-enter-from,
  .notification-leave-to {
    transform: none !important;
  }
}
</style>
