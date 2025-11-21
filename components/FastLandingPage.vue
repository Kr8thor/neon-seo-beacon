<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <section class="relative px-6 lg:px-8 pt-16 pb-24 overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5"></div>
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div class="relative mx-auto max-w-4xl text-center">
        <!-- Logo -->
        <div class="mb-8">
          <div class="inline-flex items-center gap-3 px-4 py-2 bg-surface rounded-full border border-border shadow-sm">
            <div class="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">N</span>
            </div>
            <span class="font-semibold text-text-primary">Neon SEO Beacon</span>
          </div>
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary">
          Professional
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
            SEO Audits
          </span>
          <br class="hidden sm:block" />
          in Seconds
        </h1>

        <p class="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
          Comprehensive website analysis with AI-powered recommendations.
          Everything you need to outrank your competition.
        </p>

        <!-- Quick Audit Form -->
        <div class="mt-10 max-w-lg mx-auto">
          <form @submit.prevent="handleQuickAudit" class="flex gap-2">
            <input
              v-model="auditUrl"
              type="url"
              placeholder="Enter website URL..."
              class="flex-1 px-4 py-3 bg-surface text-text-primary placeholder-text-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            />
            <Button type="submit" variant="primary" size="lg" :loading="isLoading">
              Audit
            </Button>
          </form>
          <p class="mt-3 text-sm text-text-muted">
            Free analysis • No signup required • Results in 30 seconds
          </p>
        </div>

        <!-- Trust badges -->
        <div class="mt-12 flex flex-wrap justify-center gap-6 text-text-muted">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm">10,000+ audits</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm">100+ checks</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm">AI-powered</span>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="auditResults" class="mt-16 mx-auto max-w-4xl">
        <Card>
          <h3 class="text-xl font-semibold mb-4 text-text-primary">
            SEO Analysis Results
          </h3>

          <div class="flex items-center space-x-4 mb-6">
            <div class="relative w-20 h-20">
              <svg class="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" stroke-width="8" fill="none" class="text-border"/>
                <circle
                  cx="40" cy="40" r="36"
                  stroke="currentColor" stroke-width="8" fill="none"
                  class="text-primary"
                  :stroke-dasharray="`${auditResults.score * 2.26} 226`"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xl font-bold text-text-primary">{{ auditResults.score }}</span>
              </div>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-text-primary">Overall SEO Score</h4>
              <p class="text-text-muted">{{ getScoreDescription(auditResults.score) }}</p>
            </div>
          </div>

          <div v-if="auditResults.topIssues?.length" class="grid md:grid-cols-2 gap-4 mb-6">
            <div
              v-for="issue in auditResults.topIssues.slice(0, 4)"
              :key="issue.type"
              class="p-4 rounded-lg border"
              :class="getIssueSeverityClass(issue.severity)"
            >
              <h5 class="font-medium text-text-primary">{{ issue.message }}</h5>
              <p class="text-sm text-text-secondary mt-1">{{ issue.recommendation }}</p>
            </div>
          </div>

          <div class="text-center">
            <Button @click="navigateToFullReport">
              View Detailed Report
              <template #icon>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </template>
            </Button>
          </div>
        </Card>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="py-20 bg-surface">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Everything You Need to Dominate SEO
          </h2>
          <p class="text-lg text-text-secondary max-w-2xl mx-auto">
            Professional-grade tools that rival Ahrefs, Semrush, and Moz - at a fraction of the cost.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Core Audit -->
          <NuxtLink to="/dashboard" class="group">
            <Card hover clickable class="h-full">
              <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-text-primary mb-2">SEO Audit</h3>
              <p class="text-sm text-text-muted">100+ technical SEO checks with actionable recommendations</p>
            </Card>
          </NuxtLink>

          <!-- Historical Trends -->
          <NuxtLink to="/dashboard" class="group">
            <Card hover clickable class="h-full">
              <div class="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-text-primary mb-2">Historical Trends</h3>
              <p class="text-sm text-text-muted">Track SEO score changes over time with visual charts</p>
            </Card>
          </NuxtLink>

          <!-- Competitor Analysis -->
          <NuxtLink to="/dashboard" class="group">
            <Card hover clickable class="h-full">
              <div class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
                </svg>
              </div>
              <h3 class="font-semibold text-text-primary mb-2">Competitor Analysis</h3>
              <p class="text-sm text-text-muted">Compare your site against competitors side-by-side</p>
            </Card>
          </NuxtLink>

          <!-- Scheduled Audits -->
          <NuxtLink to="/dashboard" class="group">
            <Card hover clickable class="h-full">
              <div class="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-text-primary mb-2">Scheduled Audits</h3>
              <p class="text-sm text-text-muted">Automated daily, weekly, or monthly audits with alerts</p>
            </Card>
          </NuxtLink>

          <!-- Keyword Analysis -->
          <NuxtLink to="/dashboard" class="group">
            <Card hover clickable class="h-full">
              <div class="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                <svg class="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                </svg>
              </div>
              <h3 class="font-semibold text-text-primary mb-2">Keyword Density</h3>
              <p class="text-sm text-text-muted">Analyze keyword usage and optimize content targeting</p>
            </Card>
          </NuxtLink>

          <!-- Internal Links -->
          <NuxtLink to="/dashboard" class="group">
            <Card hover clickable class="h-full">
              <div class="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-colors">
                <svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
              </div>
              <h3 class="font-semibold text-text-primary mb-2">Internal Links</h3>
              <p class="text-sm text-text-muted">Analyze link structure and find orphan pages</p>
            </Card>
          </NuxtLink>

          <!-- SERP Preview -->
          <NuxtLink to="/dashboard" class="group">
            <Card hover clickable class="h-full">
              <div class="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-text-primary mb-2">SERP Preview</h3>
              <p class="text-sm text-text-muted">See how your pages appear in Google search results</p>
            </Card>
          </NuxtLink>

          <!-- Export -->
          <NuxtLink to="/dashboard" class="group">
            <Card hover clickable class="h-full">
              <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-text-primary mb-2">Export Reports</h3>
              <p class="text-sm text-text-muted">Download audits as PDF, CSV, or JSON for clients</p>
            </Card>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-20 bg-background">
      <div class="mx-auto max-w-5xl px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-text-primary mb-16">
          How It Works
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 class="font-semibold text-text-primary mb-2">Enter Your URL</h3>
            <p class="text-text-muted">Paste any website URL into our analyzer</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 class="font-semibold text-text-primary mb-2">AI Analysis</h3>
            <p class="text-text-muted">Our engine runs 100+ SEO checks in seconds</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 class="font-semibold text-text-primary mb-2">Get Results</h3>
            <p class="text-text-muted">Receive actionable recommendations instantly</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary to-purple-600">
      <div class="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Improve Your SEO?
        </h2>
        <p class="text-lg text-white/80 mb-8">
          Join thousands of businesses using Neon SEO Beacon to climb search rankings.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button to="/auth/register" variant="secondary" size="lg">
            Get Started Free
          </Button>
          <Button to="/pricing" variant="ghost" size="lg" class="text-white border-white/30 hover:bg-white/10">
            View Pricing
          </Button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 bg-surface border-t border-border">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">N</span>
            </div>
            <span class="font-semibold text-text-primary">Neon SEO Beacon</span>
          </div>
          <nav class="flex gap-6 text-sm text-text-muted">
            <NuxtLink to="/pricing" class="hover:text-text-primary">Pricing</NuxtLink>
            <NuxtLink to="/docs" class="hover:text-text-primary">Documentation</NuxtLink>
            <NuxtLink to="/privacy" class="hover:text-text-primary">Privacy</NuxtLink>
            <NuxtLink to="/terms" class="hover:text-text-primary">Terms</NuxtLink>
          </nav>
          <p class="text-sm text-text-muted">
            © {{ new Date().getFullYear() }} Neon SEO Beacon
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { SEOAuditResults } from '~/types/seo'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'

const auditUrl = ref('')
const isLoading = ref(false)
const auditResults = ref<SEOAuditResults | null>(null)

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
          includeImages: true,
        },
      },
    })

    if (response.success && response.audit) {
      auditResults.value = {
        ...response.audit,
        id: (response.audit as any)?.id || (response as any).id,
        topIssues: (response.audit as any)?.topIssues || []
      } as SEOAuditResults
    } else {
      auditResults.value = response as SEOAuditResults
    }
  } catch (error) {
    console.error('Audit failed:', error)
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

const getIssueSeverityClass = (severity: string): string => {
  const classes: Record<string, string> = {
    high: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
    medium: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
    low: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
  }
  return classes[severity] || classes.low
}

const navigateToFullReport = () => {
  const auditId = auditResults.value?.id
  if (auditId) {
    navigateTo(`/audit/${auditId}`)
  } else {
    navigateTo('/dashboard')
  }
}
</script>
