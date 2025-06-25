<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-gray-600">Monitor your SEO performance and manage audits</p>
          </div>
          <button 
            @click="showNewAuditModal = true"
            class="btn btn-primary"
          >
            <PlusIcon class="w-5 h-5 mr-2" />
            New Audit
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon class="w-6 h-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Audits</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalAudits }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon class="w-6 h-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Avg. Score</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.averageScore }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <GlobeAltIcon class="w-6 h-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Websites</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.uniqueWebsites }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon class="w-6 h-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">This Month</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.thisMonth }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Audits -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recent Audits</h2>
            <NuxtLink to="/audits" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </NuxtLink>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Website
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="audit in recentAudits" :key="audit.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ audit.url }}</div>
                    <div class="text-sm text-gray-500">{{ audit.domain }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                      audit.score >= 90 ? 'bg-green-100 text-green-800' :
                      audit.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      audit.score >= 50 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    ]">
                      {{ audit.score || '-' }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    audit.status === 'completed' ? 'bg-green-100 text-green-800' :
                    audit.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    audit.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  ]">
                    {{ audit.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(audit.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex space-x-2">
                    <button 
                      v-if="audit.status === 'completed'"
                      @click="viewAudit(audit.id)"
                      class="text-blue-600 hover:text-blue-700"
                    >
                      View
                    </button>
                    <button 
                      v-if="audit.status === 'processing'"
                      @click="watchProgress(audit.id)"
                      class="text-purple-600 hover:text-purple-700"
                    >
                      Watch
                    </button>
                    <button 
                      @click="deleteAudit(audit.id)"
                      class="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- New Audit Modal -->
    <div 
      v-if="showNewAuditModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showNewAuditModal = false"
    >
      <div 
        class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Create New Audit</h3>
        
        <form @submit.prevent="createAudit">
          <div class="mb-4">
            <label for="url" class="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <input
              id="url"
              v-model="newAudit.url"
              type="url"
              required
              placeholder="https://example.com"
              class="input w-full"
            />
          </div>
          
          <div class="mb-6">
            <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
              Audit Type
            </label>
            <select 
              id="type"
              v-model="newAudit.type"
              class="input w-full"
            >
              <option value="quick">Quick Scan (30 seconds)</option>
              <option value="standard">Standard Audit (1-2 minutes)</option>
              <option value="comprehensive">Comprehensive (3-5 minutes)</option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button"
              @click="showNewAuditModal = false"
              class="btn btn-outline"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="creatingAudit"
              class="btn btn-primary"
            >
              {{ creatingAudit ? 'Creating...' : 'Start Audit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  PlusIcon, 
  ChartBarIcon, 
  CheckCircleIcon, 
  GlobeAltIcon, 
  ClockIcon 
} from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const notificationStore = useNotificationStore()

// Reactive data
const showNewAuditModal = ref(false)
const creatingAudit = ref(false)
const recentAudits = ref([])
const stats = ref({
  totalAudits: 0,
  averageScore: 0,
  uniqueWebsites: 0,
  thisMonth: 0
})

const newAudit = reactive({
  url: '',
  type: 'standard'
})

// Load dashboard data
onMounted(async () => {
  await Promise.all([
    loadRecentAudits(),
    loadStats()
  ])
})

async function loadRecentAudits() {
  try {
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    recentAudits.value = data.map(audit => ({
      ...audit,
      domain: new URL(audit.url).hostname
    }))
  } catch (error) {
    console.error('Error loading recent audits:', error)
    notificationStore.error('Failed to load recent audits')
  }
}

async function loadStats() {
  try {
    // This would typically be a database function or aggregated query
    const { data, error } = await supabase
      .from('audits')
      .select('score, url, created_at')
      .eq('user_id', user.value.id)

    if (error) throw error

    const audits = data || []
    const uniqueUrls = new Set(audits.map(a => a.url))
    const thisMonth = audits.filter(a => {
      const auditDate = new Date(a.created_at)
      const now = new Date()
      return auditDate.getMonth() === now.getMonth() && 
             auditDate.getFullYear() === now.getFullYear()
    })

    const completedAudits = audits.filter(a => a.score !== null)
    const avgScore = completedAudits.length > 0 
      ? Math.round(completedAudits.reduce((sum, a) => sum + a.score, 0) / completedAudits.length)
      : 0

    stats.value = {
      totalAudits: audits.length,
      averageScore: avgScore,
      uniqueWebsites: uniqueUrls.size,
      thisMonth: thisMonth.length
    }
  } catch (error) {
    console.error('Error loading stats:', error)
    notificationStore.error('Failed to load statistics')
  }
}

async function createAudit() {
  creatingAudit.value = true
  
  try {
    const response = await $fetch('/api/audits', {
      method: 'POST',
      body: {
        url: newAudit.url,
        type: newAudit.type
      }
    })

    if (response.success) {
      notificationStore.success('Audit started successfully!')
      showNewAuditModal.value = false
      newAudit.url = ''
      newAudit.type = 'standard'
      
      // Refresh audits list
      await loadRecentAudits()
      await loadStats()
      
      // Navigate to audit progress page
      await navigateTo(`/audits/${response.audit.id}`)
    }
  } catch (error) {
    console.error('Error creating audit:', error)
    notificationStore.error(error.data?.message || 'Failed to create audit')
  } finally {
    creatingAudit.value = false
  }
}

function viewAudit(auditId) {
  navigateTo(`/audits/${auditId}`)
}

function watchProgress(auditId) {
  navigateTo(`/audits/${auditId}/progress`)
}

async function deleteAudit(auditId) {
  if (!confirm('Are you sure you want to delete this audit?')) {
    return
  }

  try {
    const { error } = await supabase
      .from('audits')
      .delete()
      .eq('id', auditId)
      .eq('user_id', user.value.id)

    if (error) throw error

    notificationStore.success('Audit deleted successfully')
    await loadRecentAudits()
    await loadStats()
  } catch (error) {
    console.error('Error deleting audit:', error)
    notificationStore.error('Failed to delete audit')
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// SEO
const { setPageMeta } = useSEO()
setPageMeta({
  title: 'Dashboard | Neon SEO Beacon',
  description: 'Manage your SEO audits, track performance, and monitor website optimization progress.'
})
</script>