<template>
  <div class="score-overview">
    <!-- Main Score -->
    <div class="score-main">
      <div class="score-circle" :class="scoreColorClass">
        <span class="score-value">{{ score }}</span>
        <span class="score-max">/100</span>
      </div>
      <div class="score-label">
        <span class="score-status" :class="scoreColorClass">{{ scoreLabel }}</span>
        <span class="score-change" :class="changeClass">
          <svg v-if="change !== 0" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="change > 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          {{ Math.abs(change) }} pts
        </span>
      </div>
    </div>

    <!-- Category Breakdown -->
    <div class="score-categories">
      <div v-for="category in categories" :key="category.name" class="category-item">
        <div class="category-header">
          <span class="category-name">{{ category.name }}</span>
          <span class="category-score" :class="getCategoryColorClass(category.score)">
            {{ category.score }}
          </span>
        </div>
        <div class="category-bar">
          <div
            class="category-fill"
            :class="getCategoryColorClass(category.score)"
            :style="{ width: `${category.score}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDesignTokens } from '~/composables/useDesignTokens'

interface Category {
  name: string
  score: number
}

const props = withDefaults(defineProps<{
  score?: number
  change?: number
  categories?: Category[]
}>(), {
  score: 85,
  change: 3,
  categories: () => [
    { name: 'Performance', score: 92 },
    { name: 'SEO', score: 88 },
    { name: 'Accessibility', score: 76 },
    { name: 'Best Practices', score: 83 },
  ]
})

const { getScoreLevel, formatScore } = useDesignTokens()

const scoreLabel = computed(() => formatScore(props.score).label)

const scoreColorClass = computed(() => {
  const level = getScoreLevel(props.score)
  return `text-score-${level}`
})

const changeClass = computed(() => {
  if (props.change > 0) return 'text-score-excellent'
  if (props.change < 0) return 'text-score-critical'
  return 'text-text-muted'
})

const getCategoryColorClass = (score: number) => {
  const level = getScoreLevel(score)
  return `bg-score-${level}`
}
</script>

<style scoped>
.score-overview {
  @apply h-full flex flex-col;
}

.score-main {
  @apply flex items-center gap-4 mb-4;
}

.score-circle {
  @apply relative flex flex-col items-center justify-center;
  @apply w-20 h-20 rounded-full border-4 border-current;
}

.score-value {
  @apply text-2xl font-bold;
}

.score-max {
  @apply text-xs opacity-60;
}

.score-label {
  @apply flex flex-col;
}

.score-status {
  @apply text-lg font-semibold;
}

.score-change {
  @apply flex items-center gap-1 text-sm;
}

.score-categories {
  @apply flex-1 space-y-3;
}

.category-item {
  @apply space-y-1;
}

.category-header {
  @apply flex justify-between items-center text-sm;
}

.category-name {
  @apply text-gray-500 dark:text-gray-400;
}

.category-score {
  @apply font-medium bg-clip-text text-transparent;
}

.category-bar {
  @apply h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden;
}

.category-fill {
  @apply h-full rounded-full transition-all duration-slow;
}
</style>
