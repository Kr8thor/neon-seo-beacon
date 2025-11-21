/**
 * Chart Configuration Composable
 * Factory functions for creating Chart.js configurations
 */

import { computed, type Ref } from 'vue'
import { useDesignTokens } from './useDesignTokens'

export interface TrendDataPoint {
  date: Date | string
  value: number
}

export interface CategoryData {
  name: string
  value: number
  impact?: number
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'info'
}

export function useChartConfig() {
  const { getScoreLevel } = useDesignTokens()

  // Get color for score value
  const getScoreColor = (score: number): string => {
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

  // Get color for severity level
  const getSeverityColor = (severity: string): string => {
    const colors: Record<string, string> = {
      critical: 'hsl(0, 84%, 60%)',
      high: 'hsl(27, 96%, 61%)',
      medium: 'hsl(45, 93%, 47%)',
      low: 'hsl(199, 89%, 48%)',
      info: 'hsl(217, 91%, 60%)',
    }
    return colors[severity] || colors.info
  }

  // Score gauge chart configuration
  const useScoreGaugeChart = (score: Ref<number>) => {
    return computed(() => ({
      type: 'doughnut' as const,
      data: {
        labels: ['Score', 'Remaining'],
        datasets: [{
          data: [score.value, 100 - score.value],
          backgroundColor: [
            getScoreColor(score.value),
            'rgba(200, 200, 200, 0.15)',
          ],
          borderColor: 'transparent',
          borderWidth: 0,
          hoverOffset: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        cutout: '75%',
        rotation: -90,
        circumference: 180,
      },
    }))
  }

  // Trend line chart configuration
  const useTrendLineChart = (data: Ref<TrendDataPoint[]>, comparison?: Ref<TrendDataPoint[]>) => {
    return computed(() => {
      const formatDate = (date: Date | string): string => {
        const d = new Date(date)
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }

      const datasets = [
        {
          label: 'Score',
          data: data.value.map(d => d.value),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 6,
        }
      ]

      if (comparison?.value?.length) {
        datasets.push({
          label: 'Previous',
          data: comparison.value.map(d => d.value),
          borderColor: 'rgba(156, 163, 175, 0.5)',
          backgroundColor: 'rgba(156, 163, 175, 0.05)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        })
      }

      return {
        type: 'line' as const,
        data: {
          labels: data.value.map(d => formatDate(d.date)),
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'index' as const,
              intersect: false,
            },
          },
          scales: {
            y: {
              min: 0,
              max: 100,
              grid: { drawBorder: false },
            },
            x: {
              grid: { display: false },
            },
          },
        },
      }
    })
  }

  // Horizontal bar chart for category breakdown
  const useCategoryBarChart = (categories: Ref<CategoryData[]>) => {
    return computed(() => ({
      type: 'bar' as const,
      data: {
        labels: categories.value.map(c => c.name),
        datasets: [{
          label: 'Score',
          data: categories.value.map(c => c.value),
          backgroundColor: categories.value.map(c =>
            c.severity ? getSeverityColor(c.severity) : getScoreColor(c.value)
          ),
          borderRadius: 4,
        }],
      },
      options: {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            min: 0,
            max: 100,
            grid: { drawBorder: false },
          },
          y: {
            grid: { display: false },
          },
        },
      },
    }))
  }

  // Radar chart for multi-dimensional scores
  const useRadarChart = (categories: Ref<CategoryData[]>) => {
    return computed(() => ({
      type: 'radar' as const,
      data: {
        labels: categories.value.map(c => c.name),
        datasets: [{
          label: 'Score',
          data: categories.value.map(c => c.value),
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgb(59, 130, 246)',
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(59, 130, 246)',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            angleLines: { display: true },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    }))
  }

  return {
    getScoreColor,
    getSeverityColor,
    useScoreGaugeChart,
    useTrendLineChart,
    useCategoryBarChart,
    useRadarChart,
  }
}
