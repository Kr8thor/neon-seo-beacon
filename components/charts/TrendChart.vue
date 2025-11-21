<template>
  <div class="trend-chart">
    <div v-if="title" class="chart-header">
      <h4 class="chart-title">{{ title }}</h4>
      <div v-if="trendIndicator" class="trend-indicator" :class="trendClass">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="trendIndicator === 'up'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          <path v-else-if="trendIndicator === 'down'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
        </svg>
        <span>{{ trendText }}</span>
      </div>
    </div>
    <div class="chart-container" :style="{ height: `${height}px` }">
      <Line
        :data="chartData"
        :options="chartOptions"
        ref="chartRef"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface DataPoint {
  date: Date | string
  value: number
}

const props = withDefaults(defineProps<{
  data: DataPoint[]
  comparison?: DataPoint[]
  title?: string
  period?: '7d' | '30d' | '90d'
  height?: number
}>(), {
  period: '30d',
  height: 200,
})

const chartRef = ref()

// Calculate trend
const trendIndicator = computed(() => {
  if (props.data.length < 2) return null
  const latest = props.data[props.data.length - 1].value
  const previous = props.data[0].value
  const diff = latest - previous
  if (diff > 2) return 'up'
  if (diff < -2) return 'down'
  return 'stable'
})

const trendClass = computed(() => {
  if (trendIndicator.value === 'up') return 'text-score-excellent'
  if (trendIndicator.value === 'down') return 'text-score-critical'
  return 'text-text-muted'
})

const trendText = computed(() => {
  if (props.data.length < 2) return ''
  const latest = props.data[props.data.length - 1].value
  const previous = props.data[0].value
  const diff = Math.abs(latest - previous).toFixed(1)
  return `${diff} pts`
})

const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const chartData = computed(() => {
  const datasets = [
    {
      label: 'Score',
      data: props.data.map(d => d.value),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 6,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    }
  ]

  if (props.comparison?.length) {
    datasets.push({
      label: 'Previous Period',
      data: props.comparison.map(d => d.value),
      borderColor: 'rgba(156, 163, 175, 0.5)',
      backgroundColor: 'rgba(156, 163, 175, 0.05)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBackgroundColor: 'rgba(156, 163, 175, 0.5)',
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      borderDash: [5, 5],
    })
  }

  return {
    labels: props.data.map(d => formatDate(d.date)),
    datasets,
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (context: any) => `Score: ${context.raw}`,
      },
    },
  },
  scales: {
    y: {
      min: 0,
      max: 100,
      grid: {
        drawBorder: false,
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        stepSize: 25,
        color: '#9ca3af',
        font: { size: 11 },
      },
    },
    x: {
      grid: { display: false },
      ticks: {
        color: '#9ca3af',
        font: { size: 11 },
        maxTicksLimit: 7,
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  animation: {
    duration: 750,
    easing: 'easeOutQuart',
  },
}))
</script>

<style scoped>
.trend-chart {
  @apply w-full;
}

.chart-header {
  @apply flex items-center justify-between mb-4;
}

.chart-title {
  @apply text-sm font-semibold text-text-primary;
}

.trend-indicator {
  @apply flex items-center gap-1 text-sm font-medium;
}

.chart-container {
  @apply w-full;
}
</style>
