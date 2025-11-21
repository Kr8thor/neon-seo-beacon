<template>
  <div
    class="dashboard-widget"
    :class="[
      `widget-${widget.sizeX}x${widget.sizeY}`,
      {
        'widget-minimized': isMinimized,
        'widget-dragging': isDragging,
        'widget-error': hasError
      }
    ]"
    :style="gridStyle"
    :draggable="!isMinimized"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <!-- Widget Header -->
    <header class="widget-header">
      <div class="widget-title-area">
        <div class="drag-handle" v-if="!isMinimized">
          <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
          </svg>
        </div>
        <h3 class="widget-title">{{ widget.title }}</h3>
        <span v-if="widget.badge" class="widget-badge" :class="`badge-${widget.badge.type}`">
          {{ widget.badge.text }}
        </span>
      </div>
      <div class="widget-controls">
        <button
          v-if="widget.refreshable"
          @click="refresh"
          class="widget-btn"
          :class="{ 'animate-spin': isRefreshing }"
          title="Refresh"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button
          @click="toggleMinimize"
          class="widget-btn"
          :title="isMinimized ? 'Expand' : 'Minimize'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="isMinimized" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          v-if="widget.removable !== false"
          @click="$emit('remove', widget.id)"
          class="widget-btn widget-btn-danger"
          title="Remove widget"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Widget Content -->
    <div v-show="!isMinimized" class="widget-content">
      <!-- Loading State -->
      <div v-if="isLoading" class="widget-loading">
        <div class="skeleton-loader">
          <div class="skeleton-line w-3/4"></div>
          <div class="skeleton-line w-1/2"></div>
          <div class="skeleton-line w-2/3"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="widget-error-content">
        <svg class="w-8 h-8 text-severity-high mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ errorMessage }}</p>
        <button @click="refresh" class="mt-2 text-xs text-primary hover:underline">
          Try again
        </button>
      </div>

      <!-- Normal Content -->
      <div v-else class="widget-slot">
        <Suspense>
          <template #default>
            <slot />
          </template>
          <template #fallback>
            <div class="widget-loading">
              <div class="skeleton-loader">
                <div class="skeleton-line w-3/4"></div>
                <div class="skeleton-line w-1/2"></div>
              </div>
            </div>
          </template>
        </Suspense>
      </div>
    </div>

    <!-- Footer (optional) -->
    <footer v-if="$slots.footer && !isMinimized" class="widget-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface WidgetBadge {
  text: string
  type: 'success' | 'warning' | 'error' | 'info'
}

export interface Widget {
  id: string
  title: string
  sizeX: number
  sizeY: number
  posX?: number
  posY?: number
  minimized?: boolean
  visible?: boolean
  refreshable?: boolean
  removable?: boolean
  badge?: WidgetBadge
}

const props = defineProps<{
  widget: Widget
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  remove: [id: string]
  refresh: [id: string]
  minimize: [id: string, minimized: boolean]
  dragstart: [id: string]
  dragend: [id: string, position: { x: number; y: number }]
}>()

// Local state
const isMinimized = ref(props.widget.minimized || false)
const isDragging = ref(false)
const isRefreshing = ref(false)

// Computed
const isLoading = computed(() => props.loading || isRefreshing.value)
const hasError = computed(() => !!props.error)
const errorMessage = computed(() => props.error || 'Failed to load widget')

const gridStyle = computed(() => {
  if (props.widget.posX !== undefined && props.widget.posY !== undefined) {
    return {
      gridColumn: `${props.widget.posX + 1} / span ${props.widget.sizeX}`,
      gridRow: `${props.widget.posY + 1} / span ${props.widget.sizeY}`,
    }
  }
  return {}
})

// Methods
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
  emit('minimize', props.widget.id, isMinimized.value)
}

const refresh = async () => {
  isRefreshing.value = true
  emit('refresh', props.widget.id)
  // Auto-reset after 2 seconds if parent doesn't handle
  setTimeout(() => {
    isRefreshing.value = false
  }, 2000)
}

const onDragStart = (e: DragEvent) => {
  isDragging.value = true
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', props.widget.id)
  }
  emit('dragstart', props.widget.id)
}

const onDragEnd = (e: DragEvent) => {
  isDragging.value = false
  // Calculate new grid position based on drop location
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  emit('dragend', props.widget.id, { x: e.clientX, y: e.clientY })
}

// Expose for parent component
defineExpose({
  refresh,
  toggleMinimize,
  isMinimized,
})
</script>

<style scoped>
.dashboard-widget {
  @apply rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800;
  @apply shadow-sm transition-all duration-200 ease-in-out;
  @apply flex flex-col overflow-hidden;
}

.dashboard-widget:hover {
  @apply shadow-lg;
}

.widget-dragging {
  @apply opacity-50 ring-2 ring-blue-500 cursor-grabbing;
}

.widget-minimized {
  @apply h-auto;
}

.widget-error {
  @apply border-orange-500;
}

/* Grid sizes */
.widget-1x1 { min-height: 200px; }
.widget-2x1 { min-height: 200px; }
.widget-1x2 { min-height: 400px; }
.widget-2x2 { min-height: 400px; }
.widget-3x2 { min-height: 400px; }
.widget-3x3 { min-height: 600px; }

/* Header */
.widget-header {
  @apply flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700;
  @apply bg-gray-50 dark:bg-gray-800;
}

.widget-title-area {
  @apply flex items-center gap-2;
}

.drag-handle {
  @apply cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700;
}

.widget-title {
  @apply text-sm font-semibold text-gray-900 dark:text-white truncate;
}

.widget-badge {
  @apply text-xs px-2 py-0.5 rounded-full font-medium;
}

.badge-success { @apply bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400; }
.badge-warning { @apply bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400; }
.badge-error { @apply bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400; }
.badge-info { @apply bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400; }

.widget-controls {
  @apply flex items-center gap-1;
}

.widget-btn {
  @apply p-1.5 rounded-md text-gray-400;
  @apply hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white;
  @apply transition-colors duration-150;
}

.widget-btn-danger:hover {
  @apply bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400;
}

/* Content */
.widget-content {
  @apply flex-1 p-4 overflow-auto;
}

.widget-slot {
  @apply h-full;
}

.widget-loading {
  @apply flex items-center justify-center h-full min-h-[100px];
}

.widget-error-content {
  @apply flex flex-col items-center justify-center h-full text-center p-4;
}

/* Skeleton loader */
.skeleton-loader {
  @apply w-full space-y-3;
}

.skeleton-line {
  @apply h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse;
}

/* Footer */
.widget-footer {
  @apply px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800;
  @apply text-xs text-gray-500;
}
</style>
