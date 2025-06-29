<template>
  <div class="animate-pulse">
    <!-- Card skeleton -->
    <div v-if="type === 'card'" class="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 space-y-4">
      <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      <div class="space-y-2">
        <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      </div>
    </div>

    <!-- List skeleton -->
    <div v-else-if="type === 'list'" class="space-y-3">
      <div v-for="i in count" :key="i" class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Text skeleton -->
    <div v-else-if="type === 'text'" class="space-y-2">
      <div v-for="i in count" :key="i" 
           class="h-4 bg-gray-200 dark:bg-gray-700 rounded"
           :class="i === count ? 'w-3/4' : 'w-full'">
      </div>
    </div>

    <!-- Chart skeleton -->
    <div v-else-if="type === 'chart'" class="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
      <div class="flex items-end space-x-2 h-32">
        <div v-for="i in 7" :key="i" 
             class="bg-gray-300 dark:bg-gray-600 rounded"
             :style="{ height: `${Math.random() * 80 + 20}%`, width: '100%' }">
        </div>
      </div>
    </div>

    <!-- Table skeleton -->
    <div v-else-if="type === 'table'" class="space-y-3">
      <div class="grid grid-cols-4 gap-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div v-for="i in 4" :key="i" class="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      <div v-for="row in count" :key="row" class="grid grid-cols-4 gap-4">
        <div v-for="col in 4" :key="col" class="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>

    <!-- Custom skeleton based on height/width -->
    <div v-else 
         class="bg-gray-200 dark:bg-gray-700 rounded"
         :style="{ width, height }">
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'card' | 'list' | 'text' | 'chart' | 'table' | 'custom'
  count?: number
  width?: string
  height?: string
}

withDefaults(defineProps<Props>(), {
  type: 'card',
  count: 3,
  width: '100%',
  height: '200px'
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>