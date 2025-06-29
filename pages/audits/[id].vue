<template>
  <div class="audit-results-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
    <!-- Header -->
    <header class="glass-strong border-b border-white/20 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.back()"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ audit ? `Audit Results: ${audit.url}` : 'Loading Audit...' }}
            </h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              v-if="audit && audit.status === 'completed'"
              @click="exportReport"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Export PDF
            </button>
            <button
              @click="refreshAudit"
              :disabled="loading"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading audit results...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Audit</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <button
          @click="refreshAudit"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Processing State -->
      <div v-else-if="audit && (audit.status === 'processing' || audit.status === 'queued')" class="space-y-8">
        <!-- Progress Card -->
        <div class="glass rounded-3xl p-8 text-center">
          <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {{ audit.status === 'queued' ? 'Audit Queued' : 'Analyzing Your Website' }}
          </h2>
          
          <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            {{ audit.status === 'queued' 
              ? 'Your audit is in the queue and will start processing shortly.'
              : 'We\'re performing a comprehensive SEO analysis of your website. This may take a few minutes.' 
            }}
          </p>

          <!-- Progress Bar -->
          <div class="max-w-md mx-auto mb-6">
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                class="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
            <p class="text-sm text-gray-500 mt-2">{{ currentProgress?.message || 'Starting analysis...' }}</p>
          </div>

          <div class="flex justify-center space-x-4">
            <button
              @click="refreshAudit"
              class="px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/20 rounded-lg transition-all duration-200"
            >
              Refresh Status
            </button>
          </div>
        </div>

        <!-- Audit Info -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="glass rounded-2xl p-6">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Website</h3>
            <p class="text-blue-600 dark:text-blue-400 break-all">{{ audit.url }}</p>
          </div>
          <div class="glass rounded-2xl p-6">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Audit Type</h3>
            <p class="text-gray-600 dark:text-gray-400 capitalize">{{ audit.type || 'Standard' }}</p>
          </div>
          <div class="glass rounded-2xl p-6">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Started</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ formatDate(audit.created_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Completed Results -->
      <div v-else-if="audit && audit.status === 'completed'" class="space-y-8">
        <!-- Score Overview -->
        <div class="glass rounded-3xl p-8">
          <div class="text-center mb-8">
            <div class="relative inline-block">
              <svg class="w-32 h-32" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(229, 231, 235, 0.3)"
                  stroke-width="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  :stroke="getScoreColor(audit.score)"
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="314"
                  :stroke-dashoffset="314 - (audit.score / 100) * 314"
                  transform="rotate(-90 60 60)"
                  class="transition-all duration-1000"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-3xl font-bold text-gray-900 dark:text-white">
                    {{ audit.score }}
                  </div>
                  <div class="text-sm text-gray-500">/ 100</div>
                </div>
              </div>
            </div>
            
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-2">
              SEO Score: {{ getScoreLabel(audit.score) }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              Analysis completed in {{ formatProcessingTime(audit.processing_time_ms) }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ audit.results?.technical?.passes || 0 }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Passed Checks</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-600">{{ audit.results?.technical?.warnings || 0 }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Warnings</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-red-600">{{ audit.results?.technical?.errors || 0 }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Issues</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ audit.results?.performance?.loadTime || 0 }}ms</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Load Time</div>
            </div>
          </div>
        </div>

        <!-- Results Sections -->
        <div v-if="audit.results" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Meta Tags Analysis -->
          <div class="glass rounded-2xl p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meta Tags</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-5 h-5 rounded-full mt-0.5" :class="audit.results.title ? 'bg-green-500' : 'bg-red-500'"></div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 dark:text-white">Title Tag</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ audit.results.title || 'Missing title tag' }}
                    <span v-if="audit.results.title" class="ml-2 text-xs text-gray-500">
                      ({{ audit.results.title.length }} chars)
                    </span>
                  </p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-5 h-5 rounded-full mt-0.5" :class="audit.results.metaDescription ? 'bg-green-500' : 'bg-red-500'"></div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 dark:text-white">Meta Description</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ audit.results.metaDescription || 'Missing meta description' }}
                    <span v-if="audit.results.metaDescription" class="ml-2 text-xs text-gray-500">
                      ({{ audit.results.metaDescription.length }} chars)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Content Analysis -->
          <div class="glass rounded-2xl p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Structure</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-700 dark:text-gray-300">H1 Tags</span>
                <span class="font-semibold">{{ audit.results.h1Tags?.length || 0 }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-700 dark:text-gray-300">H2 Tags</span>
                <span class="font-semibold">{{ audit.results.h2Tags?.length || 0 }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-700 dark:text-gray-300">Images</span>
                <span class="font-semibold">{{ audit.results.images?.total || 0 }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-700 dark:text-gray-300">Images with Alt Text</span>
                <span class="font-semibold" :class="getAltTextColor(audit.results.images)">
                  {{ audit.results.images?.withAlt || 0 }} / {{ audit.results.images?.total || 0 }}
                </span>
              </div>
            </div>
          </div>

          <!-- Technical SEO -->
          <div class="glass rounded-2xl p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Technical SEO</h3>
            <div class="space-y-3">
              <div v-for="check in technicalChecks" :key="check.name" class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-5 h-5 rounded-full" :class="check.passed ? 'bg-green-500' : 'bg-red-500'"></div>
                <span class="text-gray-700 dark:text-gray-300">{{ check.name }}</span>
              </div>
            </div>
          </div>

          <!-- Performance -->
          <div class="glass rounded-2xl p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-700 dark:text-gray-300">Load Time</span>
                <span class="font-semibold" :class="getPerformanceColor(audit.results.performance?.loadTime)">
                  {{ audit.results.performance?.loadTime || 0 }}ms
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-700 dark:text-gray-300">HTTP Status</span>
                <span class="font-semibold text-green-600">{{ audit.results.performance?.status || 'N/A' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-700 dark:text-gray-300">Compression</span>
                <span class="font-semibold">{{ audit.results.performance?.compression || 'None' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State for Completed Audit -->
      <div v-else-if="audit && audit.status === 'error'" class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Audit Failed</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ audit.error || 'An unknown error occurred during the audit.' }}</p>
        <div class="flex justify-center space-x-4">
          <button
            @click="retryAudit"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Audit
          </button>
          <button
            @click="$router.push('/dashboard')"
            class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Get route parameter
const route = useRoute()
const auditId = route.params.id

// Reactive state
const loading = ref(true)
const error = ref(null)
const audit = ref(null)
const currentProgress = ref(null)
const progressInterval = ref(null)

// Computed properties
const progressPercentage = computed(() => {
  if (!currentProgress.value) return 0
  const { step, total_steps } = currentProgress.value
  return Math.round((step / total_steps) * 100)
})

const technicalChecks = computed(() => {
  if (!audit.value?.results?.technical) return []
  
  const technical = audit.value.results.technical
  return [
    { name: 'Viewport Meta Tag', passed: technical.hasViewport },
    { name: 'Canonical URL', passed: technical.hasCanonical },
    { name: 'Character Encoding', passed: technical.hasCharset },
    { name: 'Language Attribute', passed: technical.hasLangAttribute },
    { name: 'Structured Data', passed: technical.structuredData?.count > 0 },
    { name: 'Open Graph Tags', passed: Object.keys(technical.openGraph || {}).length > 0 }
  ]
})

// Methods
async function loadAudit() {
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch(`/api/audits/${auditId}`)
    
    if (response.success) {
      audit.value = response.audit
      
      // If audit is still processing, start polling for progress
      if (audit.value.status === 'processing' || audit.value.status === 'queued') {
        startProgressPolling()
      }
    } else {
      error.value = response.error || 'Failed to load audit'
    }
  } catch (err) {
    console.error('Error loading audit:', err)
    error.value = err.data?.message || 'Failed to load audit'
  } finally {
    loading.value = false
  }
}

async function loadProgress() {
  if (!audit.value || audit.value.status === 'completed' || audit.value.status === 'error') {
    return
  }
  
  try {
    const response = await $fetch(`/api/audits/${auditId}/progress`)
    
    if (response.success && response.progress) {
      currentProgress.value = response.progress
      
      // If audit is now completed, reload the audit data
      if (response.progress.step >= response.progress.total_steps) {
        setTimeout(() => {
          loadAudit()
        }, 2000)
      }
    }
  } catch (err) {
    console.error('Error loading progress:', err)
  }
}

function startProgressPolling() {
  // Poll progress every 2 seconds
  progressInterval.value = setInterval(() => {
    loadProgress()
  }, 2000)
}

function stopProgressPolling() {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
    progressInterval.value = null
  }
}

async function refreshAudit() {
  await loadAudit()
}

async function retryAudit() {
  if (!audit.value) return
  
  try {
    const response = await $fetch('/api/audits', {
      method: 'POST',
      body: {
        url: audit.value.url,
        type: audit.value.type || 'standard'
      }
    })

    if (response.success) {
      // Navigate to the new audit
      await navigateTo(`/audits/${response.audit.id}`)
    }
  } catch (err) {
    console.error('Error retrying audit:', err)
    alert('Failed to retry audit: ' + (err.data?.message || err.message))
  }
}

function exportReport() {
  alert('PDF export feature coming soon!')
}

// Utility functions
function getScoreColor(score) {
  if (score >= 80) return '#10b981' // green
  if (score >= 60) return '#f59e0b' // yellow
  return '#ef4444' // red
}

function getScoreLabel(score) {
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Good'
  if (score >= 70) return 'Average'
  if (score >= 60) return 'Needs Work'
  return 'Poor'
}

function getAltTextColor(images) {
  if (!images || images.total === 0) return 'text-gray-600'
  const percentage = (images.withAlt / images.total) * 100
  if (percentage >= 80) return 'text-green-600'
  if (percentage >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

function getPerformanceColor(loadTime) {
  if (!loadTime) return 'text-gray-600'
  if (loadTime < 2000) return 'text-green-600'
  if (loadTime < 4000) return 'text-yellow-600'
  return 'text-red-600'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString()
}

function formatProcessingTime(ms) {
  if (!ms) return 'N/A'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

// Lifecycle
onMounted(() => {
  loadAudit()
})

onUnmounted(() => {
  stopProgressPolling()
})

// SEO
const { setPageMeta } = useSEO()
setPageMeta({
  title: `Audit Results | Neon SEO Beacon`,
  description: 'View detailed SEO audit results and recommendations for your website optimization.'
})
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.glass-strong {
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

@media (prefers-color-scheme: dark) {
  .glass {
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .glass-strong {
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
}
</style>
