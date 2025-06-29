<template>
  <div class="chart-container relative">
    <canvas ref="chartCanvas" :width="props.width || 800" :height="props.height || 400"></canvas>
    
    <!-- Loading State -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-lg">
      <div class="text-center">
        <div class="loading-spinner mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400">{{ loadingText }}</p>
      </div>
    </div>
    
    <!-- Tooltip -->
    <div
      v-show="tooltip.show"
      ref="tooltipEl"
      class="absolute z-10 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg pointer-events-none"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="font-medium text-gray-900 dark:text-white">{{ tooltip.title }}</div>
      <div class="text-gray-600 dark:text-gray-400">{{ tooltip.value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Chart, type ChartConfiguration } from 'chart.js/auto'

interface Props {
  type: 'line' | 'bar' | 'doughnut' | 'pie' | 'radar'
  data: any
  options?: any
  width?: number
  height?: number
  loading?: boolean
  loadingText?: string
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'line',
  width: 800,
  height: 400,
  loading: false,
  loadingText: 'Loading chart data...',
  animate: true
})

const emit = defineEmits(['chartReady', 'dataPointClick'])

const chartCanvas = ref<HTMLCanvasElement>()
const tooltipEl = ref<HTMLElement>()
const chart = ref<Chart>()

const tooltip = ref({
  show: false,
  x: 0,
  y: 0,
  title: '',
  value: ''
})

// Chart configuration with modern styling
const getChartConfig = (): ChartConfiguration => {
  const isDark = document.documentElement.classList.contains('dark')
  
  const config: ChartConfiguration = {
    type: props.type,
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            color: isDark ? '#e5e7eb' : '#374151',
            font: {
              family: 'Inter',
              size: 12,
              weight: '500'
            }
          }
        },
        tooltip: {
          enabled: false, // We'll use custom tooltip
          external: handleTooltip
        }
      },
      scales: {},
      animation: props.animate ? {
        duration: 1500,
        easing: 'easeInOutQuart',
        delay: (context) => {
          if (context.type === 'data' && context.mode === 'default') {
            return context.dataIndex * 50
          }
          return 0
        }
      } : false,
      onHover: (event, activeElements) => {
        if (chartCanvas.value) {
          chartCanvas.value.style.cursor = activeElements.length > 0 ? 'pointer' : 'default'
        }
      },
      onClick: (event, activeElements) => {
        if (activeElements.length > 0) {
          const element = activeElements[0]
          if (element) {
            emit('dataPointClick', {
              datasetIndex: element.datasetIndex,
              index: element.index,
              value: props.data.datasets[element.datasetIndex].data[element.index]
            })
          }
        }
      },
      ...props.options
    }
  }

  // Configure scales based on chart type
  if (props.type === 'line' || props.type === 'bar') {
    config.options!.scales = {
      x: {
        grid: {
          display: true,
          color: isDark ? '#374151' : '#f3f4f6'
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: {
            family: 'Inter',
            size: 11
          }
        }
      },
      y: {
        grid: {
          display: true,
          color: isDark ? '#374151' : '#f3f4f6'
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: {
            family: 'Inter',
            size: 11
          }
        }
      }
    }
  }

  // Apply modern gradient colors to datasets
  if (props.data.datasets) {
    props.data.datasets.forEach((dataset: any, index: number) => {
      const colors = [
        { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgb(59, 130, 246)' },
        { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgb(168, 85, 247)' },
        { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgb(34, 197, 94)' },
        { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgb(251, 191, 36)' },
        { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgb(239, 68, 68)' }
      ]
      
      const colorIndex = index % colors.length
      
      if (props.type === 'line') {
        const color = colors[colorIndex] || { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgb(99, 102, 241)' }
        dataset.backgroundColor = color.bg
        dataset.borderColor = color.border
        dataset.borderWidth = 2
        dataset.pointBackgroundColor = color.border
        dataset.pointBorderColor = '#ffffff'
        dataset.pointBorderWidth = 2
        dataset.pointRadius = 4
        dataset.pointHoverRadius = 6
        dataset.fill = true
        dataset.tension = 0.4
      } else if (props.type === 'bar') {
        const color = colors[colorIndex] || { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgb(99, 102, 241)' }
        dataset.backgroundColor = color.border
        dataset.borderRadius = 4
        dataset.borderSkipped = false
      }
    })
  }

  return config
}

// Custom tooltip handler
const handleTooltip = (context: any) => {
  const { chart, tooltip: tooltipModel } = context
  
  if (tooltipModel.opacity === 0) {
    tooltip.value.show = false
    return
  }
  
  const position = chart.canvas.getBoundingClientRect()
  const bodyLines = tooltipModel.body.map((b: any) => b.lines)
  
  tooltip.value.show = true
  tooltip.value.x = position.left + tooltipModel.caretX
  tooltip.value.y = position.top + tooltipModel.caretY - 60
  tooltip.value.title = tooltipModel.title[0] || ''
  tooltip.value.value = bodyLines.join(', ')
}

// Initialize chart
const initChart = async () => {
  if (!chartCanvas.value) return
  
  await nextTick()
  
  // Destroy existing chart
  if (chart.value) {
    chart.value.destroy()
  }
  
  const config = getChartConfig()
  chart.value = new Chart(chartCanvas.value, config)
  
  emit('chartReady', chart.value)
}

// Update chart data
const updateChart = () => {
  if (chart.value) {
    chart.value.data = props.data
    chart.value.update('none')
  }
}

// Watch for data changes
watch(() => props.data, updateChart, { deep: true })
watch(() => props.loading, (newVal) => {
  if (!newVal) {
    nextTick(() => initChart())
  }
})

// Dark mode toggle support
const handleThemeChange = () => {
  initChart()
}

onMounted(() => {
  if (!props.loading) {
    initChart()
  }
  
  // Listen for theme changes
  const observer = new MutationObserver(handleThemeChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy()
  }
})

// Expose chart instance
defineExpose({
  chart: chart.value,
  updateChart,
  initChart
})
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-left: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
