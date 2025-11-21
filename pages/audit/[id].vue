<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/dashboard"
              class="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-text-primary">
                SEO Audit Results
              </h1>
              <p class="mt-1 text-text-muted truncate max-w-md" v-if="audit">
                {{ audit.url }}
              </p>
            </div>
          </div>
          <div v-if="audit" class="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              @click="exportReport"
            >
              <template #icon>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </template>
              Export PDF
            </Button>
            <span :class="['status-badge', `status-${audit.status}`]">
              {{ audit.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
        <p class="mt-4 text-text-muted">Loading audit results...</p>
      </div>

      <!-- Error State -->
      <Card v-else-if="error" variant="outlined" class="border-red-500">
        <div class="text-center py-8">
          <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        </div>
      </Card>

      <!-- Results -->
      <div v-else-if="audit" class="space-y-6">
        <!-- Score Overview with Gauge -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Score Gauge -->
          <Card>
            <h3 class="text-sm font-medium text-text-muted mb-4">Overall Score</h3>
            <div class="flex justify-center">
              <ScoreGauge :score="audit.score || 0" size="lg" :showValue="true" />
            </div>
          </Card>

          <!-- KPI Cards -->
          <div class="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              title="Pages Analyzed"
              :value="summary.totalPages || 0"
              icon="document"
            />
            <KPICard
              title="Total Issues"
              :value="summary.totalIssues || 0"
              icon="alert"
            />
            <KPICard
              title="Critical"
              :value="summary.issuesBySeverity?.critical || 0"
              severity="critical"
            />
            <KPICard
              title="High Priority"
              :value="summary.issuesBySeverity?.high || 0"
              severity="high"
            />
          </div>
        </div>

        <!-- Category Breakdown -->
        <Card v-if="categoryData.length">
          <CategoryBreakdown
            :categories="categoryData"
            title="Score by Category"
            :height="250"
          />
        </Card>

        <!-- Issues by Severity -->
        <Card title="Issues by Severity">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div
              v-for="(count, severity) in summary.issuesBySeverity"
              :key="severity"
              class="text-center p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800"
            >
              <div :class="['text-2xl font-bold', severityTextColors[severity as string]]">
                {{ count }}
              </div>
              <div class="text-sm text-text-muted capitalize mt-1">{{ severity }}</div>
            </div>
          </div>
        </Card>

        <!-- Top Issues -->
        <Card title="Top Issues">
          <div class="divide-y divide-border -mx-6">
            <div
              v-for="issue in topIssues"
              :key="issue.issue_id"
              class="px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span :class="['severity-badge', `severity-${issue.severity}`]">
                      {{ issue.severity }}
                    </span>
                    <span class="text-sm text-text-muted">{{ issue.category }}</span>
                  </div>
                  <h3 class="mt-2 text-sm font-medium text-text-primary">
                    {{ issue.title }}
                  </h3>
                  <p class="mt-1 text-sm text-text-secondary line-clamp-2">
                    {{ issue.description }}
                  </p>
                  <p class="mt-2 text-sm text-primary">
                    {{ issue.recommendation }}
                  </p>
                </div>
                <div class="text-right flex-shrink-0">
                  <span class="text-sm font-medium text-text-primary">
                    {{ issue.count }} {{ issue.count === 1 ? 'page' : 'pages' }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="!topIssues.length" class="px-6 py-8 text-center text-text-muted">
              No issues found - great job!
            </div>
          </div>
        </Card>

        <!-- Pages List -->
        <Card title="Analyzed Pages">
          <div class="overflow-x-auto -mx-6">
            <table class="min-w-full">
              <thead class="bg-neutral-50 dark:bg-neutral-800/50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">URL</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Score</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Issues</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Response</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr
                  v-for="page in pages"
                  :key="page.id"
                  class="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td class="px-6 py-4">
                    <div class="text-sm text-text-primary truncate max-w-xs">
                      {{ page.url }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="['text-sm font-medium', getScoreColor(page.score)]">
                      {{ page.score || '-' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-text-secondary">
                    {{ page.issuesCount || 0 }}
                  </td>
                  <td class="px-6 py-4 text-sm text-text-muted">
                    {{ page.responseTime }}ms
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <!-- AI Recommendations -->
        <Card v-if="recommendations" title="AI Recommendations">
          <p class="text-text-secondary mb-6">{{ recommendations.summary }}</p>
          <div class="space-y-4">
            <div
              v-for="(rec, index) in recommendations.recommendations"
              :key="index"
              :class="['border-l-4 pl-4 py-2', priorityBorderColors[rec.priority]]"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-text-primary">{{ rec.title }}</span>
                <span class="text-xs text-text-muted px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800">
                  {{ rec.priority }} priority
                </span>
              </div>
              <p class="text-sm text-text-secondary mt-1">{{ rec.implementation }}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ScoreGauge from '~/components/charts/ScoreGauge.vue'
import CategoryBreakdown from '~/components/charts/CategoryBreakdown.vue'
import KPICard from '~/components/KPICard.vue'
import Card from '~/components/ui/Card.vue'
import Button from '~/components/ui/Button.vue'

const route = useRoute()
const auditId = route.params.id as string

const loading = ref(true)
const error = ref<string | null>(null)
const audit = ref<any>(null)
const summary = ref<any>({})
const topIssues = ref<any[]>([])
const pages = ref<any[]>([])
const recommendations = ref<any>(null)

// Generate category data for breakdown chart
const categoryData = computed(() => {
  const categories = audit.value?.categories || summary.value?.issuesByCategory
  if (!categories) return []

  return Object.entries(categories).map(([name, data]: [string, any]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
    value: typeof data === 'number' ? data : (data.score || 0),
    impact: typeof data === 'number' ? 0 : (data.impact || 0)
  }))
})

// Export PDF report
const exportReport = () => {
  window.open(`/api/audits/${auditId}/export?format=json`, '_blank')
}

const severityTextColors: Record<string, string> = {
  critical: 'text-red-600 dark:text-red-400',
  high: 'text-orange-600 dark:text-orange-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  low: 'text-blue-600 dark:text-blue-400',
  info: 'text-text-muted',
}

const priorityBorderColors: Record<string, string> = {
  critical: 'border-red-500',
  high: 'border-orange-500',
  medium: 'border-yellow-500',
  low: 'border-blue-500',
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600 dark:text-green-400'
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
  if (score >= 40) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

onMounted(async () => {
  try {
    const response = await $fetch<any>(`/api/sites/${auditId}/results`)

    if (response?.success) {
      audit.value = response.data.audit
      summary.value = response.data.summary
      topIssues.value = response.data.topIssues || []
      pages.value = response.data.pages || []
      recommendations.value = response.data.recommendations
    } else {
      error.value = 'Failed to load audit results'
    }
  } catch (e: any) {
    error.value = e.message || 'An error occurred'
  } finally {
    loading.value = false
  }
})

// SEO
useHead({
  title: 'Audit Results | Neon SEO Beacon',
})
</script>

<style scoped>
.status-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium;
}

.status-pending,
.status-queued {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400;
}

.status-processing {
  @apply bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400;
}

.status-completed {
  @apply bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400;
}

.status-failed {
  @apply bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400;
}

.severity-badge {
  @apply inline-flex items-center px-2 py-0.5 rounded text-xs font-medium;
}

.severity-critical {
  @apply bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400;
}

.severity-high {
  @apply bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400;
}

.severity-medium {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400;
}

.severity-low {
  @apply bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400;
}

.severity-info {
  @apply bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
