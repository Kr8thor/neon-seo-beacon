# Phase 1.3: Chart Components - Score Visualization

## Context
Create reusable, Chart.js-based visualization components for displaying SEO metrics and trends.

## Deliverables

### 1. Create `components/charts/ScoreGauge.vue`
Circular gauge showing score 0-100:
- Animated arc that fills based on score
- Semantic color (excellent/good/poor)
- Center text with score value
- Optional subtitle
- Smooth animation on value change

Props:
```typescript
interface Props {
  score: number;           // 0-100
  label?: string;          // 'SEO Score', 'Performance', etc.
  size?: 'sm' | 'md' | 'lg'; // Default: 'md'
  showValue?: boolean;     // Show numeric value
  animated?: boolean;      // Animate on mount/change
}
```

### 2. Create `components/charts/TrendChart.vue`
Line/area chart showing score trends over time:
- Time series data (daily for last 30 days)
- Gradient fill under curve
- Comparison band (previous period in lighter color)
- Trend indicator arrow (up/down/stable)
- Interactive tooltips on hover

Props:
```typescript
interface Props {
  data: Array<{ date: Date; value: number }>;
  comparison?: Array<{ date: Date; value: number }>;
  title?: string;
  period?: '7d' | '30d' | '90d';
  height?: number; // Default: 200
}
```

### 3. Create `components/charts/WaterfallChart.vue`
Waterfall chart showing score breakdown by category:
- Shows impact of each factor on total score
- Stacked bars showing contribution
- Ahrefs-style visual hierarchy
- Category labels with percentages

Props:
```typescript
interface Props {
  categories: Array<{
    name: string;
    value: number;      // 0-100
    impact: number;     // How much this contributes to total
    severity?: 'critical' | 'warning' | 'info';
  }>;
  total?: number;       // Target/max score
}
```

### 4. Create `components/charts/HeatmapMatrix.vue`
Color-intensity matrix for performance data:
- Grid of values with color intensity
- Hover tooltips showing exact values
- Legend showing color scale
- Click cells to drill down

Props:
```typescript
interface Props {
  grid: Array<Array<number>>;  // 2D array of values 0-100
  labels?: { rows: string[]; cols: string[] };
  threshold?: number;  // Highlight values above/below
  interactive?: boolean;
}
```

### 5. Create `composables/useChartConfig.ts`
Chart.js configuration factory functions:

```typescript
export function useScoreGaugeChart(score: Ref<number>) {
  return computed(() => ({
    type: 'doughnut',
    data: {
      labels: ['Score', 'Remaining'],
      datasets: [{
        data: [score.value, 100 - score.value],
        backgroundColor: [
          getScoreColor(score.value),
          'rgba(200, 200, 200, 0.2)',
        ],
        borderColor: 'transparent',
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      cutout: '70%',
    },
  }));
}

export function useTrendLineChart(data: Ref<TrendData[]>) {
  return computed(() => ({
    type: 'line',
    data: {
      labels: data.value.map(d => d.date),
      datasets: [{
        label: 'Score',
        data: data.value.map(d => d.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { drawBorder: false },
        },
      },
    },
  }));
}

export function useWaterfallChart(factors: Ref<Factor[]>) {
  return computed(() => ({
    type: 'bar',
    data: {
      labels: factors.value.map(f => f.name),
      datasets: [{
        label: 'Impact',
        data: factors.value.map(f => f.impact),
        backgroundColor: factors.value.map(f => 
          getSeverityColor(f.severity)
        ),
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true },
      },
    },
  }));
}
```

### 6. Create `composables/useChartAnimations.ts`
Smooth animations for chart updates:
- Fade in on initial load
- Smooth value transitions
- Prevent flashing on data updates

```typescript
export function useChartAnimation(
  chartRef: Ref<any>,
  duration = 300
) {
  function animateValue(from: number, to: number) {
    const startTime = Date.now();
    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = from + (to - from) * progress;
      
      if (chartRef.value?.chart) {
        chartRef.value.chart.data.datasets[0].data[0] = current;
        chartRef.value.chart.update('none');
      }
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    update();
  }
  
  return { animateValue };
}
```

## Styling
Add to `assets/css/main.css`:
```css
@layer components {
  .chart-container {
    @apply relative w-full h-full bg-white dark:bg-gray-800 rounded-lg p-4;
  }
  
  .chart-title {
    @apply text-sm font-semibold text-gray-900 dark:text-white mb-4;
  }
  
  .chart-legend {
    @apply flex justify-center gap-4 mt-4 text-xs;
  }
}
```

## Testing
- Render each chart with sample data
- Test animations (scores should animate smoothly)
- Verify responsive behavior on different screen sizes
- Test dark mode colors
- Check accessibility (ARIA labels, sufficient contrast)

## Acceptance Criteria
- ✅ All 5 chart components render correctly
- ✅ Charts animate smoothly without jank
- ✅ Responsive sizing works on mobile/tablet/desktop
- ✅ Dark mode colors display properly
- ✅ Accessibility: sufficient contrast ratios (WCAG AA)
- ✅ No console errors or warnings