<template>
  <div class="min-h-screen hero-section">
    <!-- Hero Section -->
    <section class="relative px-6 lg:px-8 pt-16 pb-24">
      <div class="mx-auto max-w-4xl text-center">
        <!-- MardenSEO Animated Logo -->
        <div class="marden-logo-integration">
          <MardenSEOLogo />
        </div>

        <!-- Fast-loading hero text -->
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Professional
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            SEO Audits
          </span>
          in Seconds
        </h1>
        
        <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Get comprehensive website analysis with actionable SEO recommendations. 
          Trusted by agencies and businesses worldwide.
        </p>

        <!-- Quick Audit Form -->
        <div class="mt-10 audit-form-enhanced">
          <form @submit.prevent="handleQuickAudit" class="flex max-w-md mx-auto">
            <input
              v-model="auditUrl"
              type="url"
              placeholder="Enter website URL..."
              class="flex-1 px-4 py-3 text-base border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              required
            />
            <button
              type="submit"
              :disabled="isLoading"
              class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              <span v-if="!isLoading">Audit</span>
              <LoadingSpinner v-else size="sm" :show-dots="false" />
            </button>
          </form>
          
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Free analysis • No signup required • Results in 30 seconds
          </p>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="auditResults" class="mt-16 mx-auto max-w-4xl">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            SEO Analysis Results
          </h3>
          
          <!-- SEO Score -->
          <div class="flex items-center space-x-4 mb-6">
            <div class="relative w-20 h-20">
              <div class="w-full h-full rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
              <div 
                class="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-600 transition-all duration-1000"
                :style="{ 
                  strokeDasharray: `${auditResults.score * 2.51}, 251`,
                  transform: 'rotate(-90deg)'
                }"
              ></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ auditResults.score }}
                </span>
              </div>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                Overall SEO Score
              </h4>
              <p class="text-gray-600 dark:text-gray-400">
                {{ getScoreDescription(auditResults.score) }}
              </p>
            </div>
          </div>

          <!-- Quick Issues -->
          <div class="grid md:grid-cols-2 gap-4">
            <div v-for="issue in auditResults.topIssues" :key="issue.type" 
                 class="p-4 border rounded-lg"
                 :class="issue.severity === 'high' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' : 
                         issue.severity === 'medium' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20' :
                         'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'">
              <h5 class="font-medium text-gray-900 dark:text-white">{{ issue.title }}</h5>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ issue.description }}</p>
            </div>
          </div>

          <!-- CTA for detailed analysis -->
          <div class="mt-6 text-center">
            <button
              @click="navigateToFullReport"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Detailed Report
              <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Preview (Static for fast loading) -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Comprehensive SEO Analysis
        </h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Technical SEO</h3>
            <p class="text-gray-600 dark:text-gray-400">Page speed, mobile-friendliness, and technical optimization analysis</p>
          </div>
          
          <div class="text-center">
            <div class="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8M7 8h10M9 12h6m-6 4h6"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Content Analysis</h3>
            <p class="text-gray-600 dark:text-gray-400">Meta tags, headings, keyword optimization, and content structure</p>
          </div>
          
          <div class="text-center">
            <div class="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Performance</h3>
            <p class="text-gray-600 dark:text-gray-400">Core Web Vitals, loading speed, and user experience metrics</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { SEOAuditResult } from '~/types'

const auditUrl = ref('')
const isLoading = ref(false)
const auditResults = ref<SEOAuditResult | null>(null)

const handleQuickAudit = async () => {
  if (!auditUrl.value) return
  
  isLoading.value = true
  try {
    const response = await $fetch('/api/audits/public', {
      method: 'POST',
      body: {
        url: auditUrl.value,
        options: {
          includePerformance: true,
          includeImages: true
        }
      }
    })
    
    auditResults.value = response
  } catch (error) {
    console.error('Audit failed:', error)
    // Show error toast or message
  } finally {
    isLoading.value = false
  }
}

const getScoreDescription = (score: number): string => {
  if (score >= 90) return 'Excellent SEO'
  if (score >= 70) return 'Good SEO'
  if (score >= 50) return 'Needs Improvement'
  return 'Poor SEO'
}

const navigateToFullReport = () => {
  // Navigate to detailed report page
  navigateTo(`/dashboard/reports/${auditResults.value?.id}`)
}
</script>

<style scoped>
/* Custom animations for performance */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heroGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.5), 0 0 60px rgba(147, 51, 234, 0.3);
  }
}

@keyframes backgroundPulse {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Enhanced hero section styling */
.hero-section {
  background: linear-gradient(-45deg, #f8fafc, #e0e7ff, #f1f5f9, #ddd6fe);
  background-size: 400% 400%;
  animation: backgroundPulse 15s ease infinite;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

/* Logo integration glow effect */
.marden-logo-integration {
  position: relative;
  animation: heroGlow 4s ease-in-out infinite;
  border-radius: 2rem;
  padding: 1rem;
  margin-bottom: 2rem;
}

/* Enhanced audit form styling */
.audit-form-enhanced {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (prefers-color-scheme: dark) {
  .audit-form-enhanced {
    background: rgba(31, 41, 55, 0.9);
    border: 1px solid rgba(107, 114, 128, 0.2);
  }
  
  .hero-section {
    background: linear-gradient(-45deg, #1f2937, #374151, #111827, #4c1d95);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .marden-logo-integration {
    padding: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .audit-form-enhanced {
    padding: 1.5rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .hero-section,
  .marden-logo-integration {
    animation: none !important;
  }
}
</style>