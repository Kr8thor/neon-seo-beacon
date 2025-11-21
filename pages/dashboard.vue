<template>
  <div class="dashboard-page min-h-screen bg-background">
    <!-- Sticky Header -->
    <header class="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div>
            <h1 class="text-2xl font-bold text-text-primary">Dashboard</h1>
            <p class="text-sm text-text-muted">
              Last updated {{ formatRelativeTime(lastRefresh) }}
            </p>
          </div>

          <!-- Toolbar Actions -->
          <div class="flex items-center gap-3">
            <!-- Search -->
            <div class="relative">
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Search audits..."
                class="w-48 lg:w-64 px-4 py-2 pl-10 text-sm border border-border rounded-lg bg-surface focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Refresh Button -->
            <button
              @click="refreshDashboard"
              :disabled="loading"
              class="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              title="Refresh (Ctrl+R)"
            >
              <svg class="w-5 h-5 text-text-secondary" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <!-- New Audit Button -->
            <button
              @click="showNewAuditModal = true"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
            >
              New Audit
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- KPI Cards Row -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Avg SEO Score"
          :value="statistics.avgScore"
          unit="/100"
          :trend="scoreTrend"
          icon="chart"
        />
        <KPICard
          title="Total Audits"
          :value="statistics.total"
          trend="This month"
          icon="document"
        />
        <KPICard
          title="Critical Issues"
          :value="statistics.criticalFindings"
          severity="critical"
          icon="alert"
        />
        <KPICard
          title="Completed"
          :value="statistics.completed"
          :total="statistics.total"
          icon="check"
        />
      </section>

      <!-- Main Dashboard Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Score Overview -->
        <div class="lg:col-span-1">
          <div class="bg-surface rounded-token-xl border border-border p-6 shadow-card">
            <h3 class="text-lg font-semibold text-text-primary mb-4">Overall Score</h3>
            <div class="flex justify-center">
              <ScoreGauge :score="statistics.avgScore" size="lg" label="Average" />
            </div>
            <div class="mt-4 grid grid-cols-2 gap-4 text-center">
              <div>
                <p class="text-2xl font-bold text-text-primary">{{ statistics.completed }}</p>
                <p class="text-sm text-text-muted">Completed</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-text-primary">{{ statistics.processing }}</p>
                <p class="text-sm text-text-muted">In Progress</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Score Trend Chart -->
        <div class="lg:col-span-2">
          <div class="bg-surface rounded-token-xl border border-border p-6 shadow-card h-full">
            <TrendChart
              :data="trendData"
              title="Score Trend (30 days)"
              :height="220"
            />
          </div>
        </div>
      </section>

      <!-- Recent Audits Table -->
      <section class="mb-8">
        <div class="bg-surface rounded-token-xl border border-border shadow-card overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 class="text-lg font-semibold text-text-primary">Recent Audits</h2>
            <NuxtLink to="/sites" class="text-sm text-primary hover:underline">
              View all
            </NuxtLink>
          </div>

          <div v-if="loading" class="p-8 text-center">
            <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p class="mt-2 text-sm text-text-muted">Loading audits...</p>
          </div>

          <div v-else-if="filteredAudits.length === 0" class="p-8 text-center">
            <svg class="w-12 h-12 text-text-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-text-secondary">No audits yet</p>
            <button @click="showNewAuditModal = true" class="mt-2 text-sm text-primary hover:underline">
              Start your first audit
            </button>
          </div>

          <table v-else class="w-full">
            <thead class="bg-neutral-50 dark:bg-neutral-800/50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Score</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Website</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Issues</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="audit in filteredAudits.slice(0, 10)"
                :key="audit.id"
                class="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
                @click="viewAudit(audit.id)"
              >
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium"
                    :class="getScoreBadgeClass(audit.score)"
                  >
                    {{ audit.score }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-text-primary font-medium truncate max-w-xs">
                  {{ audit.url }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                    :class="getStatusClass(audit.status)"
                  >
                    {{ audit.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-text-secondary">
                  {{ audit.findings?.length || 0 }}
                </td>
                <td class="px-6 py-4 text-sm text-text-muted">
                  {{ formatDate(audit.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Critical Issues -->
      <section v-if="criticalIssues.length > 0">
        <div class="bg-surface rounded-token-xl border border-border shadow-card overflow-hidden">
          <div class="px-6 py-4 border-b border-border">
            <h2 class="text-lg font-semibold text-text-primary">Top Critical Issues</h2>
          </div>
          <div class="divide-y divide-border">
            <div
              v-for="issue in criticalIssues.slice(0, 5)"
              :key="issue.id"
              class="p-4 hover:bg-severity-critical-bg cursor-pointer transition-colors"
              @click="viewAudit(issue.auditId)"
            >
              <div class="flex items-start gap-3">
                <span class="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-severity-critical"></span>
                <div class="min-w-0 flex-1">
                  <p class="font-medium text-text-primary">{{ issue.title }}</p>
                  <p class="text-sm text-text-secondary truncate">{{ issue.description }}</p>
                  <p class="text-xs text-text-muted mt-1">{{ issue.auditUrl }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- New Audit Modal -->
    <Teleport to="body">
      <div
        v-if="showNewAuditModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        @click="showNewAuditModal = false"
      >
        <div
          class="bg-surface rounded-token-xl shadow-elevated max-w-md w-full mx-4 p-6 border border-border"
          @click.stop
        >
          <h3 class="text-xl font-bold text-text-primary mb-6">Create New Audit</h3>

          <form @submit.prevent="createAudit">
            <div class="mb-4">
              <label for="url" class="block text-sm font-medium text-text-secondary mb-2">
                Website URL
              </label>
              <input
                id="url"
                v-model="newAuditUrl"
                type="url"
                required
                placeholder="https://example.com"
                class="w-full px-4 py-2 border border-border rounded-lg bg-surface focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div class="mb-6">
              <label for="type" class="block text-sm font-medium text-text-secondary mb-2">
                Audit Type
              </label>
              <select
                id="type"
                v-model="newAuditType"
                class="w-full px-4 py-2 border border-border rounded-lg bg-surface focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="quick">Quick Scan (30 seconds)</option>
                <option value="standard">Standard Audit (1-2 minutes)</option>
                <option value="comprehensive">Comprehensive (3-5 minutes)</option>
              </select>
            </div>

            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="showNewAuditModal = false"
                class="px-4 py-2 text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creatingAudit"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {{ creatingAudit ? 'Creating...' : 'Start Audit' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuditStore } from '~/stores/auditStore'
import { useDesignTokens } from '~/composables/useDesignTokens'
import ScoreGauge from '~/components/charts/ScoreGauge.vue'
import TrendChart from '~/components/charts/TrendChart.vue'
import KPICard from '~/components/KPICard.vue'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const auditStore = useAuditStore()
const { getScoreLevel } = useDesignTokens()

// State
const showNewAuditModal = ref(false)
const creatingAudit = ref(false)
const newAuditUrl = ref('')
const newAuditType = ref('standard')
const searchQuery = ref('')
const lastRefresh = ref(Date.now())

// Computed
const loading = computed(() => auditStore.loading)
const statistics = computed(() => auditStore.statistics)
const criticalIssues = computed(() => auditStore.criticalIssues)

const filteredAudits = computed(() => {
  let audits = auditStore.filteredAudits
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    audits = audits.filter(a => a.url.toLowerCase().includes(query))
  }
  return audits
})

const scoreTrend = computed(() => {
  // Mock trend - would come from actual data
  return '+4'
})

const trendData = computed(() => {
  // Generate mock trend data - would come from API
  const data = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      date,
      value: Math.floor(70 + Math.random() * 25),
    })
  }
  return data
})

// Methods
async function refreshDashboard() {
  await auditStore.fetchAudits(true)
  lastRefresh.value = Date.now()
}

async function createAudit() {
  creatingAudit.value = true
  try {
    const audit = await auditStore.createAudit(newAuditUrl.value, {
      type: newAuditType.value,
    })
    showNewAuditModal.value = false
    newAuditUrl.value = ''
    newAuditType.value = 'standard'
    router.push(`/audit/${audit.id}`)
  } catch (error) {
    console.error('Error creating audit:', error)
    alert('Failed to create audit')
  } finally {
    creatingAudit.value = false
  }
}

function viewAudit(id: string) {
  router.push(`/audit/${id}`)
}

function formatRelativeTime(timestamp: number): string {
  const ms = Date.now() - timestamp
  if (ms < 60000) return 'Just now'
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ago`
  if (ms < 86400000) return `${Math.floor(ms / 3600000)}h ago`
  return new Date(timestamp).toLocaleDateString()
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getScoreBadgeClass(score: number): string {
  const level = getScoreLevel(score)
  return `bg-score-${level}-bg text-score-${level}`
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    completed: 'bg-score-excellent-bg text-score-excellent',
    processing: 'bg-severity-info-bg text-severity-info',
    queued: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    failed: 'bg-severity-critical-bg text-severity-critical',
  }
  return classes[status] || classes.queued
}

// Lifecycle
onMounted(() => {
  auditStore.fetchAudits()
})

// Keyboard shortcuts
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault()
          document.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
          break
        case 'n':
          e.preventDefault()
          showNewAuditModal.value = true
          break
        case 'r':
          e.preventDefault()
          refreshDashboard()
          break
      }
    }
  }
  window.addEventListener('keydown', handleKeydown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})

// SEO
useHead({
  title: 'Dashboard | Neon SEO Beacon',
  meta: [
    { name: 'description', content: 'Monitor your SEO audits, track performance, and manage website optimization.' },
  ],
})
</script>

<style scoped>
/* Additional dashboard-specific styles can go here */
</style>
