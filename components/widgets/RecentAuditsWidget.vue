<template>
  <div class="recent-audits">
    <div v-if="audits.length === 0" class="empty-state">
      <svg class="w-8 h-8 text-text-muted mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-sm text-text-muted">No audits yet</p>
      <NuxtLink to="/audit/new" class="mt-2 text-sm text-primary hover:underline">
        Start your first audit
      </NuxtLink>
    </div>

    <ul v-else class="audit-list">
      <li v-for="audit in audits" :key="audit.id" class="audit-item">
        <NuxtLink :to="`/audit/${audit.id}`" class="audit-link">
          <div class="audit-info">
            <span class="audit-url">{{ audit.url }}</span>
            <span class="audit-date">{{ formatDate(audit.created_at) }}</span>
          </div>
          <div class="audit-score" :class="getScoreColorClass(audit.score)">
            {{ audit.score }}
          </div>
        </NuxtLink>
      </li>
    </ul>

    <div v-if="audits.length > 0" class="view-all">
      <NuxtLink to="/sites" class="text-sm text-primary hover:underline">
        View all audits
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDesignTokens } from '~/composables/useDesignTokens'

interface Audit {
  id: string
  url: string
  score: number
  created_at: string
}

const props = withDefaults(defineProps<{
  audits?: Audit[]
}>(), {
  audits: () => [
    { id: '1', url: 'example.com', score: 92, created_at: new Date().toISOString() },
    { id: '2', url: 'test-site.org', score: 78, created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '3', url: 'mywebsite.io', score: 65, created_at: new Date(Date.now() - 172800000).toISOString() },
  ]
})

const { getScoreLevel } = useDesignTokens()

const getScoreColorClass = (score: number) => {
  const level = getScoreLevel(score)
  return `text-score-${level} bg-score-${level}-bg`
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86400000)

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}
</script>

<style scoped>
.recent-audits {
  @apply h-full flex flex-col;
}

.empty-state {
  @apply flex flex-col items-center justify-center h-full text-center py-4;
}

.audit-list {
  @apply flex-1 space-y-2 overflow-auto;
}

.audit-item {
  @apply rounded-lg border border-border hover:border-primary transition-colors;
}

.audit-link {
  @apply flex items-center justify-between p-3;
}

.audit-info {
  @apply flex flex-col min-w-0;
}

.audit-url {
  @apply text-sm font-medium text-gray-900 dark:text-white truncate;
}

.audit-date {
  @apply text-xs text-gray-400 dark:text-gray-500;
}

.audit-score {
  @apply px-2 py-1 rounded text-sm font-semibold;
}

.view-all {
  @apply pt-3 text-center border-t border-gray-200 dark:border-gray-700 mt-3;
}
</style>
