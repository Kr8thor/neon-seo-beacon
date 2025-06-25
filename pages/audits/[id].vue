<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" message="Loading audit details..." />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExclamationTriangleIcon class="w-8 h-8 text-red-600" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Audit Not Found</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <NuxtLink to="/dashboard" class="btn btn-primary">
          Back to Dashboard
        </NuxtLink>
      </div>
    </div>
    
    <!-- Audit Content -->
    <div v-else-if="audit">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <div class="flex items-center justify-between">
            <div>
              <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <NuxtLink to="/dashboard" class="hover:text-gray-700">Dashboard</NuxtLink>
                <ChevronRightIcon class="w-4 h-4" />
                <span>Audit Results</span>
              </nav>
              <h1 class="text-2xl font-bold text-gray-900">{{ audit.url }}</h1>
              <div class="flex items-center space-x-4 mt-2">
                <span :class="[
                  'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                  audit.status === 'completed' ? 'bg-green-100 text-green-800' :
                  audit.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  audit.status === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ audit.status }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ formatDate(audit.created_at) }}
                </span>
                <span v-if="audit.processing_time_ms" class="text-sm text-gray-500">
                  {{ (audit.processing_time_ms / 1000).toFixed(1) }}s
                </span>
              </div>
            </div>
            
            <div class="flex space-x-3">
              <button 
                v-if="audit.status === 'processing'"
                @click="watchProgress"
                class="btn btn-outline"
              >
                <EyeIcon class="w-4 h-4 mr-2" />
                Watch Progress
              </button>
              <button 
                v-if="audit.status === 'completed'"
                @click="exportReport"
                class="btn btn-outline"
              >
                <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
                Export Report
              </button>
              <button 
                @click="runNewAudit"
                class="btn btn-primary"
              >
                <ArrowPathIcon class="w-4 h-4 mr-2" />
                Re-run Audit
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Processing State -->
      <div v-if="audit.status === 'processing'" class="max-w-4xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow p-8 text-center">
          <LoadingSpinner size="xl" message="Analyzing your website..." />
          <div class="mt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Audit in Progress</h3>
            <p class="text-gray-600">
              This usually takes 30-60 seconds. We'll analyze your website's technical SEO, content, and performance.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="audit.status === 'error'" class="max-w-4xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow p-8 text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon class="w-8 h-8 text-red-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Audit Failed</h3>
          <p class="text-gray-600 mb-4">
            {{ audit.error || 'An error occurred while analyzing your website.' }}
          </p>
          <button @click="runNewAudit" class="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
      
      <!-- Results -->
      <div v-else-if="audit.status === 'completed' && audit.results" class="max-w-7xl mx-auto px-4 py-8">
        <!-- Score Overview -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow p-6 text-center">
              <div :class="[
                'w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold',
                audit.score >= 90 ? 'bg-green-100 text-green-800' :
                audit.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                audit.score >= 50 ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              ]">
                {{ audit.score }}
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">Overall Score</h3>
              <p class="text-sm text-gray-600">
                {{ getScoreDescription(audit.score) }}
              </p>
            </div>
          </div>
          
          <div class="lg:col-span-3">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="category in scoreBreakdown" :key="category.name" class="bg-white rounded-lg shadow p-4">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-gray-900">{{ category.name }}</h4>
                  <span :class="[
                    'text-sm font-semibold',
                    category.score >= 90 ? 'text-green-600' :
                    category.score >= 70 ? 'text-yellow-600' :
                    category.score >= 50 ? 'text-orange-600' :
                    'text-red-600'
                  ]">
                    {{ category.score }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    :class="[
                      'h-2 rounded-full',
                      category.score >= 90 ? 'bg-green-500' :
                      category.score >= 70 ? 'bg-yellow-500' :
                      category.score >= 50 ? 'bg-orange-500' :
                      'bg-red-500'
                    ]"
                    :style="{ width: `${category.score}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Issues and Recommendations -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Critical Issues -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <ExclamationCircleIcon class="w-5 h-5 text-red-500 mr-2" />
                Critical Issues
              </h3>
            </div>
            <div class="p-6">
              <div v-if="criticalIssues.length === 0" class="text-center py-8">
                <CheckCircleIcon class="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p class="text-gray-600">No critical issues found!</p>
              </div>
              <div v-else class="space-y-4">
                <div v-for="issue in criticalIssues" :key="issue.id" class="border-l-4 border-red-500 pl-4">
                  <h4 class="font-medium text-gray-900">{{ issue.title }}</h4>
                  <p class="text-sm text-gray-600 mt-1">{{ issue.description }}</p>
                  <div v-if="issue.recommendation" class="mt-2 text-sm text-blue-600">
                    <strong>Fix:</strong> {{ issue.recommendation }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- AI Recommendations -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <LightBulbIcon class="w-5 h-5 text-yellow-500 mr-2" />
                AI Recommendations
              </h3>
            </div>
            <div class="p-6">
              <div v-if="aiRecommendations.length === 0" class="text-center py-8">
                <p class="text-gray-600">No additional recommendations at this time.</p>
              </div>
              <div v-else class="space-y-4">
                <div v-for="rec in aiRecommendations" :key="rec.id" class="border-l-4 border-blue-500 pl-4">
                  <h4 class="font-medium text-gray-900">{{ rec.title }}</h4>
                  <p class="text-sm text-gray-600 mt-1">{{ rec.description }}</p>
                  <div class="flex items-center justify-between mt-2">
                    <span :class="[
                      'text-xs px-2 py-1 rounded-full',
                      rec.impact === 'high' ? 'bg-red-100 text-red-800' :
                      rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    ]">
                      {{ rec.impact }} impact
                    </span>
                    <span :class="[
                      'text-xs px-2 py-1 rounded-full',
                      rec.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                      rec.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    ]">
                      {{ rec.difficulty }} effort
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  ExclamationTriangleIcon, 
  ChevronRightIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  LightBulbIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const notificationStore = useNotificationStore()

const auditId = route.params.id
const loading = ref(true)
const error = ref(null)
const audit = ref(null)

// Load audit data
onMounted(async () => {
  await loadAudit()
  
  // Set up polling for processing audits
  if (audit.value?.status === 'processing') {
    const interval = setInterval(async () => {
      await loadAudit()
      if (audit.value?.status !== 'processing') {
        clearInterval(interval)
      }
    }, 2000)
    
    onUnmounted(() => clearInterval(interval))
  }
})

async function loadAudit() {
  try {
    const { data, error: fetchError } = await supabase
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .eq('user_id', user.value.id)
      .single()

    if (fetchError) {
      error.value = 'Audit not found or access denied'
      return
    }

    audit.value = data
  } catch (err) {
    console.error('Error loading audit:', err)
    error.value = 'Failed to load audit details'
  } finally {
    loading.value = false
  }
}

// Computed properties
const scoreBreakdown = computed(() => {
  if (!audit.value?.results?.breakdown) return []
  
  return [
    { name: 'Technical', score: audit.value.results.breakdown.technical || 0 },
    { name: 'Content', score: audit.value.results.breakdown.content || 0 },
    { name: 'Performance', score: audit.value.results.breakdown.performance || 0 }
  ]
})

const criticalIssues = computed(() => {
  return audit.value?.results?.issues?.filter(issue => issue.severity === 'critical') || []
})

const aiRecommendations = computed(() => {
  return audit.value?.results?.recommendations || []
})

// Methods
function getScoreDescription(score) {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Needs Work'
  return 'Poor'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function watchProgress() {
  navigateTo(`/audits/${auditId}/progress`)
}

async function exportReport() {
  try {
    // This would integrate with a report generation service
    const response = await $fetch(`/api/audits/${auditId}/export`, {
      method: 'GET'
    })
    
    // Create download link
    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seo-audit-${audit.value.url.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    notificationStore.success('Report exported successfully')
  } catch (error) {
    console.error('Export error:', error)
    notificationStore.error('Failed to export report')
  }
}

async function runNewAudit() {
  try {
    const response = await $fetch('/api/audits', {
      method: 'POST',
      body: {
        url: audit.value.url,
        type: 'standard'
      }
    })

    if (response.success) {
      notificationStore.success('New audit started!')
      await navigateTo(`/audits/${response.audit.id}`)
    }
  } catch (error) {
    console.error('Error creating new audit:', error)
    notificationStore.error('Failed to start new audit')
  }
}

// SEO
const { setPageMeta } = useSEO()
setPageMeta({
  title: audit.value ? `Audit Results for ${audit.value.url} | Neon SEO Beacon` : 'Audit Results | Neon SEO Beacon',
  description: 'View comprehensive SEO audit results with actionable recommendations and insights.'
})
</script>