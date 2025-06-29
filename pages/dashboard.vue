<template>
  <div>
    <!-- Wrap critical components in error boundary -->
    <UiErrorBoundary 
      title="Dashboard Error"
      message="There was an issue loading your dashboard. Please try refreshing the page."
      :show-details="true"
    >
      <!-- Functional SEO Dashboard -->
      <FunctionalSeoDashboard />
    </UiErrorBoundary>
    
    <!-- New Audit Modal -->
    <div 
      v-if="showNewAuditModal" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      @click="showNewAuditModal = false"
    >
      <div 
        class="glass-strong rounded-3xl shadow-xl max-w-md w-full mx-4 p-8 border border-white/20"
        @click.stop
      >
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Create New Audit</h3>
        
        <form @submit.prevent="createAudit">
          <div class="mb-6">
            <label for="url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website URL
            </label>
            <input
              id="url"
              v-model="newAudit.url"
              type="url"
              required
              placeholder="https://example.com"
              class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
            />
          </div>
          
          <div class="mb-8">
            <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Audit Type
            </label>
            <select 
              id="type"
              v-model="newAudit.type"
              class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
            >
              <option value="quick">Quick Scan (30 seconds)</option>
              <option value="standard">Standard Audit (1-2 minutes)</option>
              <option value="comprehensive">Comprehensive (3-5 minutes)</option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-4">
            <button 
              type="button"
              @click="showNewAuditModal = false"
              class="px-6 py-3 glass border border-white/20 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover-lift micro-bounce transition-all duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="creatingAudit"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Reactive data
const showNewAuditModal = ref(false)
const creatingAudit = ref(false)

const newAudit = reactive({
  url: '',
  type: 'standard'
})

// Function to handle creating new audit
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
      // Show success notification (you can add a notification system)
      console.log('Audit started successfully!')
      showNewAuditModal.value = false
      newAudit.url = ''
      newAudit.type = 'standard'
      
      // Navigate to audit progress page
      await navigateTo(`/audits/${response.audit.id}`)
    }
  } catch (error) {
    console.error('Error creating audit:', error)
    alert('Failed to create audit: ' + (error.data?.message || error.message))
  } finally {
    creatingAudit.value = false
  }
}

// Make showNewAuditModal available globally for the FAB button
provide('showNewAuditModal', showNewAuditModal)

// SEO
const { setPageMeta } = useSEO()
setPageMeta({
  title: 'Dashboard | Neon SEO Beacon',
  description: 'Manage your SEO audits, track performance, and monitor website optimization progress with our cutting-edge dashboard interface.'
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
