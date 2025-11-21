<template>
  <div class="score-gauge" :class="`gauge-${size}`">
    <div class="gauge-container">
      <Doughnut
        :data="chartData"
        :options="chartOptions"
        ref="chartRef"
      />
      <div class="gauge-center">
        <span class="gauge-value" :class="scoreColorClass">{{ displayValue }}</span>
        <span v-if="label" class="gauge-label">{{ label }}</span>
      </div>
    </div>
    <p v-if="subtitle" class="gauge-subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { useDesignTokens } from '~/composables/useDesignTokens'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = withDefaults(defineProps<{
  score: number
  label?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  animated?: boolean
}>(), {
  size: 'md',
  showValue: true,
  animated: true,
})

const chartRef = ref()
const displayValue = ref(0)
const { getScoreLevel } = useDesignTokens()

const scoreColorClass = computed(() => {
  const level = getScoreLevel(props.score)
  return `text-score-${level}`
})

const getScoreColorValue = (score: number): string => {
  const level = getScoreLevel(score)
  const colors: Record<string, string> = {
    excellent: 'hsl(142, 76%, 36%)',
    good: 'hsl(142, 69%, 58%)',
    average: 'hsl(45, 93%, 47%)',
    poor: 'hsl(27, 96%, 61%)',
    critical: 'hsl(0, 84%, 60%)',
  }
  return colors[level] || colors.average
}

const chartData = computed(() => ({
  labels: ['Score', 'Remaining'],
  datasets: [{
    data: [props.score, 100 - props.score],
    backgroundColor: [
      getScoreColorValue(props.score),
      'rgba(200, 200, 200, 0.15)',
    ],
    borderColor: 'transparent',
    borderWidth: 0,
    hoverOffset: 0,
  }],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  cutout: '75%',
  rotation: -90,
  circumference: 180,
  animation: {
    animateRotate: props.animated,
    animateScale: false,
    duration: props.animated ? 800 : 0,
  },
}))

// Animate display value
const animateValue = (from: number, to: number, duration = 800) => {
  if (!props.animated) {
    displayValue.value = to
    return
  }

  const startTime = Date.now()
  const update = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    displayValue.value = Math.round(from + (to - from) * eased)

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }
  update()
}

onMounted(() => {
  animateValue(0, props.score)
})

watch(() => props.score, (newVal, oldVal) => {
  animateValue(oldVal || 0, newVal)
})
</script>

<style scoped>
.score-gauge {
  @apply flex flex-col items-center;
}

.gauge-container {
  @apply relative;
}

.gauge-sm .gauge-container { @apply w-24 h-16; }
.gauge-md .gauge-container { @apply w-32 h-20; }
.gauge-lg .gauge-container { @apply w-48 h-28; }

.gauge-center {
  @apply absolute inset-0 flex flex-col items-center justify-end pb-2;
}

.gauge-value {
  @apply font-bold leading-none;
}

.gauge-sm .gauge-value { @apply text-xl; }
.gauge-md .gauge-value { @apply text-3xl; }
.gauge-lg .gauge-value { @apply text-5xl; }

.gauge-label {
  @apply text-xs text-gray-400 dark:text-gray-500 mt-0.5;
}

.gauge-subtitle {
  @apply text-sm text-gray-500 dark:text-gray-400 mt-2 text-center;
}
</style>
