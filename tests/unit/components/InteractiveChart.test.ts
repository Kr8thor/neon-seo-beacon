// tests/unit/components/InteractiveChart.test.ts
import { describe, it, expect } from 'vitest'

// Mock chart component logic
const createChartLogic = () => {
  const validateChartData = (data: any) => {
    if (!data) return false
    if (!data.labels || !Array.isArray(data.labels)) return false
    if (!data.datasets || !Array.isArray(data.datasets)) return false
    return true
  }

  const processChartOptions = (options: any = {}) => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      ...options
    }
  }

  const calculateDataRange = (datasets: any[]) => {
    let min = Infinity
    let max = -Infinity
    
    datasets.forEach(dataset => {
      if (dataset.data && Array.isArray(dataset.data)) {
        dataset.data.forEach((value: number) => {
          if (typeof value === 'number') {
            min = Math.min(min, value)
            max = Math.max(max, value)
          }
        })
      }
    })
    
    return { min: min === Infinity ? 0 : min, max: max === -Infinity ? 100 : max }
  }

  return {
    validateChartData,
    processChartOptions,
    calculateDataRange
  }
}

describe('InteractiveChart Component Logic', () => {
  it('should validate chart data correctly', () => {
    const chart = createChartLogic()
    
    const validData = {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [{ data: [10, 20, 30] }]
    }
    
    expect(chart.validateChartData(validData)).toBe(true)
    expect(chart.validateChartData(null)).toBe(false)
    expect(chart.validateChartData({})).toBe(false)
    expect(chart.validateChartData({ labels: [] })).toBe(false)
    expect(chart.validateChartData({ datasets: [] })).toBe(false)
  })

  it('should process chart options with defaults', () => {
    const chart = createChartLogic()
    
    const options = chart.processChartOptions()
    expect(options.responsive).toBe(true)
    expect(options.maintainAspectRatio).toBe(false)
    
    const customOptions = chart.processChartOptions({ responsive: false })
    expect(customOptions.responsive).toBe(false)
    expect(customOptions.maintainAspectRatio).toBe(false)
  })

  it('should calculate data range correctly', () => {
    const chart = createChartLogic()
    
    const datasets = [
      { data: [10, 50, 30] },
      { data: [80, 20, 90] }
    ]
    
    const range = chart.calculateDataRange(datasets)
    expect(range.min).toBe(10)
    expect(range.max).toBe(90)
  })

  it('should handle empty datasets', () => {
    const chart = createChartLogic()
    
    const range = chart.calculateDataRange([])
    expect(range.min).toBe(0)
    expect(range.max).toBe(100)
    
    const rangeWithEmptyData = chart.calculateDataRange([{ data: [] }])
    expect(rangeWithEmptyData.min).toBe(0)
    expect(rangeWithEmptyData.max).toBe(100)
  })

  it('should handle datasets with invalid data', () => {
    const chart = createChartLogic()
    
    const datasetsWithInvalidData = [
      { data: ['invalid', 50, 'also invalid'] },
      { data: [80, null, undefined] }
    ]
    
    const range = chart.calculateDataRange(datasetsWithInvalidData)
    expect(range.min).toBe(50)
    expect(range.max).toBe(80)
  })
})
