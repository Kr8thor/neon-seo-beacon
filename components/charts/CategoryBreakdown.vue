<template>
  <div class="category-breakdown">
    <div v-if="title" class="chart-title">{{ title }}</div>
    <div class="chart-container" :style="{ height: `${height}px` }">
      <Bar
        :data="chartData"
        :options="chartOptions"
        ref="chartRef"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useDesignTokens } from '~/composables/useDesignTokens'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Category {
  name: string
  value: number
  impact?: number
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'info'
}

const props = withDefaults(defineProps<{
  categories: Category[]
  title?: string
  total?: number
  height?: number
  horizontal?: boolean
}>(), {
  total: 100,
  height: 200,
  horizontal: true,
})

const chartRef = ref()
const { getScoreLevel, normalizeSeverity } = useDesignTokens()

const getBarColor = (category: Category): string => {
  if (category.severity) {
    const colors: Record<string, string> = {
      critical: 'hsl(0, 84%, 60%)',
      high: 'hsl(27, 96%, 61%)',
      medium: 'hsl(45, 93%, 47%)',
      low: 'hsl(199, 89%, 48%)',
      info: 'hsl(217, 91%, 60%)',
    }
    return colors[normalizeSeverity(category.severity)]
  }

  const level = getScoreLevel(category.value)
  const colors: Record<string, string> = {
    excellent: 'hsl(142, 76%, 36%)',
    good: 'hsl(142, 69%, 58%)',
    average: 'hsl(45, 93%, 47%)',
    poor: 'hsl(27, 96%, 61%)',
    critical: 'hsl(0, 84%, 60%)',
  }
  return colors[level]
}

const chartData = computed(() => ({
  labels: props.categories.map(c => c.name),
  datasets: [{
    label: 'Score',
    data: props.categories.map(c => c.value),
    backgroundColor: props.categories.map(c => getBarColor(c)),
    borderRadius: 4,
    borderSkipped: false,
  }],
}))

const chartOptions = computed(() => ({
  indexAxis: props.horizontal ? 'y' as const : 'x' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      callbacks: {
        label: (context: any) => {
          const category = props.categories[context.dataIndex]
          return category.impact
            ? `Score: ${context.raw} (${category.impact}% impact)`
            : `Score: ${context.raw}`
        },
      },
    },
  },
  scales: {
    x: {
      min: 0,
      max: props.total,
      grid: {
        drawBorder: false,
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        color: '#9ca3af',
        font: { size: 11 },
      },
    },
    y: {
      grid: { display: false },
      ticks: {
        color: '#374151',
        font: { size: 12 },
      },
    },
  },
  animation: {
    duration: 750,
    easing: 'easeOutQuart' as const,
  },
}))
</script>

<style scoped>
.category-breakdown {
  @apply w-full;
}

.chart-title {
  @apply text-sm font-semibold text-gray-900 dark:text-white mb-4;
}

.chart-container {
  @apply w-full;
}
</style>
