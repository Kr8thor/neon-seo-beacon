<template>
  <div class="kpi-card" :class="{ [`severity-${severity}`]: severity }">
    <div class="kpi-icon" v-if="icon">
      <component :is="iconComponent" class="w-5 h-5" />
    </div>
    <div class="kpi-content">
      <p class="kpi-title">{{ title }}</p>
      <div class="kpi-value-row">
        <span class="kpi-value" :class="valueColorClass">{{ displayValue }}</span>
        <span v-if="unit" class="kpi-unit">{{ unit }}</span>
        <span v-if="total" class="kpi-total">/ {{ total }}</span>
      </div>
      <div v-if="trend" class="kpi-trend" :class="trendClass">
        <svg v-if="trendDirection === 'up'" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <svg v-else-if="trendDirection === 'down'" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        <span>{{ trendText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useDesignTokens } from '~/composables/useDesignTokens'

const props = withDefaults(defineProps<{
  title: string
  value: number | string
  unit?: string
  total?: number
  trend?: string | number
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'info'
  icon?: 'chart' | 'document' | 'alert' | 'check' | 'users' | 'clock'
}>(), {})

const { getScoreLevel } = useDesignTokens()

// Format display value
const displayValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

// Determine value color based on context
const valueColorClass = computed(() => {
  if (props.severity) {
    return `text-severity-${props.severity}`
  }
  if (typeof props.value === 'number' && props.unit === '/100') {
    const level = getScoreLevel(props.value as number)
    return `text-score-${level}`
  }
  return 'text-text-primary'
})

// Parse trend direction and text
const trendDirection = computed(() => {
  if (!props.trend) return null
  if (typeof props.trend === 'number') {
    return props.trend > 0 ? 'up' : props.trend < 0 ? 'down' : 'stable'
  }
  if (props.trend.startsWith('+')) return 'up'
  if (props.trend.startsWith('-')) return 'down'
  return null
})

const trendText = computed(() => {
  if (typeof props.trend === 'number') {
    return Math.abs(props.trend).toString()
  }
  return props.trend
})

const trendClass = computed(() => {
  if (trendDirection.value === 'up') return 'text-score-excellent'
  if (trendDirection.value === 'down') return 'text-score-critical'
  return 'text-text-muted'
})

// Icon components
const iconComponent = computed(() => {
  const icons: Record<string, any> = {
    chart: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
        ])
      }
    },
    document: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
        ])
      }
    },
    alert: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' })
        ])
      }
    },
    check: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
        ])
      }
    },
    users: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
        ])
      }
    },
    clock: {
      render() {
        return h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })
        ])
      }
    },
  }
  return icons[props.icon || ''] || null
})
</script>

<style scoped>
.kpi-card {
  @apply bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700;
  @apply shadow-sm transition-all duration-200 hover:shadow-lg;
}

.severity-critical { @apply border-l-4 border-l-red-500; }
.severity-high { @apply border-l-4 border-l-orange-500; }
.severity-medium { @apply border-l-4 border-l-yellow-500; }
.severity-low { @apply border-l-4 border-l-blue-500; }
.severity-info { @apply border-l-4 border-l-blue-400; }

.kpi-icon {
  @apply w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-3;
}

.kpi-content {
  @apply space-y-1;
}

.kpi-title {
  @apply text-sm font-medium text-gray-500 dark:text-gray-400;
}

.kpi-value-row {
  @apply flex items-baseline gap-1;
}

.kpi-value {
  @apply text-2xl font-bold;
}

.kpi-unit {
  @apply text-sm text-gray-400 dark:text-gray-500;
}

.kpi-total {
  @apply text-sm text-gray-400 dark:text-gray-500;
}

.kpi-trend {
  @apply flex items-center gap-1 text-xs font-medium;
}
</style>
