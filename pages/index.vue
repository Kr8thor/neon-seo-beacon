<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Hero Section -->
    <section class="relative px-4 py-16 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional SEO Audits
            <span class="text-blue-600">Made Simple</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get comprehensive SEO analysis with AI-powered recommendations. 
            Trusted by agencies and businesses worldwide.
          </p>
          
          <!-- URL Input -->
          <div class="max-w-2xl mx-auto mb-8">
            <div class="flex flex-col sm:flex-row gap-4">
              <input
                v-model="websiteUrl"
                type="url"
                placeholder="Enter your website URL (e.g., https://example.com)"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @keyup.enter="startAudit"
              />
              <button
                @click="startAudit"
                :disabled="!websiteUrl || isLoading"
                class="btn btn-primary px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isLoading" class="flex items-center">
                  <div class="spinner mr-2"></div>
                  Analyzing...
                </span>
                <span v-else>Start Free Audit</span>
              </button>
            </div>
          </div>
          
          <!-- Features -->
          <div class="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div class="flex items-center">
              <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
              Free Analysis
            </div>
            <div class="flex items-center">
              <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
              AI-Powered Insights
            </div>
            <div class="flex items-center">
              <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
              Real-time Results
            </div>
            <div class="flex items-center">
              <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
              No Registration Required
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive SEO Analysis
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Get detailed insights into your website's SEO performance with our advanced analysis engine.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <component :is="feature.icon" class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Content -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Learn SEO Best Practices
          </h2>
          <p class="text-xl text-gray-600">
            Stay updated with the latest SEO techniques and strategies.
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <article 
            v-for="article in featuredArticles" 
            :key="article._path"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-3">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {{ article.category }}
                </span>
                <span class="text-sm text-gray-500">{{ article.readTime }}</span>
              </div>
              
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                <NuxtLink 
                  :to="article._path" 
                  class="hover:text-blue-600 transition-colors"
                >
                  {{ article.title }}
                </NuxtLink>
              </h3>
              
              <p class="text-gray-600 mb-4">{{ article.description }}</p>
              
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="tag in article.tags?.slice(0, 2)" 
                    :key="tag"
                    class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
                <NuxtLink 
                  :to="article._path"
                  class="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Read More →
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
        
        <div class="text-center mt-12">
          <NuxtLink 
            to="/seo-tips" 
            class="btn btn-secondary px-8 py-3 text-lg font-semibold"
          >
            View All SEO Tips
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-blue-600">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-white mb-4">
          Ready to Improve Your SEO?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Join thousands of businesses using Neon SEO Beacon to optimize their websites.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/register" class="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
            Start Free Trial
          </NuxtLink>
          <NuxtLink to="/pricing" class="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold">
            View Pricing
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { CheckIcon, ChartBarIcon, CogIcon, DevicePhoneMobileIcon, MagnifyingGlassIcon, RocketLaunchIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'

// Meta tags
useHead({
  title: 'Neon SEO Beacon - Professional SEO Audit Tool',
  meta: [
    { name: 'description', content: 'Professional SEO audit tool with AI-powered insights. Get comprehensive website analysis, technical SEO recommendations, and performance metrics.' },
    { name: 'keywords', content: 'SEO audit, website analysis, technical SEO, SEO tools, search engine optimization' },
    { property: 'og:title', content: 'Neon SEO Beacon - Professional SEO Audit Tool' },
    { property: 'og:description', content: 'Professional SEO audit tool with AI-powered insights. Get comprehensive website analysis, technical SEO recommendations, and performance metrics.' },
    { property: 'og:type', content: 'website' }
  ]
})

// Reactive data
const websiteUrl = ref('')
const isLoading = ref(false)

// Features data
const features = [
  {
    title: 'Technical SEO Analysis',
    description: 'Comprehensive analysis of meta tags, URL structure, site speed, and technical SEO factors.',
    icon: CogIcon
  },
  {
    title: 'Performance Monitoring',
    description: 'Core Web Vitals, page speed insights, and performance optimization recommendations.',
    icon: ChartBarIcon
  },
  {
    title: 'Mobile Optimization',
    description: 'Mobile-first indexing analysis and responsive design evaluation.',
    icon: DevicePhoneMobileIcon
  },
  {
    title: 'Content Analysis',
    description: 'AI-powered content quality assessment and keyword optimization insights.',
    icon: MagnifyingGlassIcon
  },
  {
    title: 'Security Audit',
    description: 'HTTPS implementation, security headers, and website security analysis.',
    icon: ShieldCheckIcon
  },
  {
    title: 'AI Recommendations',
    description: 'Intelligent, prioritized action items powered by Claude AI for maximum impact.',
    icon: RocketLaunchIcon
  }
]

// Fetch featured articles
const { data: featuredArticles } = await useAsyncData('featured-articles', () =>
  queryContent('/seo-tips')
    .where({ featured: true })
    .sort({ publishedAt: -1 })
    .limit(3)
    .find()
)

// Methods
function validateUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

async function startAudit() {
  if (!websiteUrl.value) {
    alert('Please enter a website URL')
    return
  }
  
  if (!validateUrl(websiteUrl.value)) {
    alert('Please enter a valid URL (e.g., https://example.com)')
    return
  }
  
  isLoading.value = true
  
  try {
    // Redirect to audit page with URL parameter
    await navigateTo(`/audit?url=${encodeURIComponent(websiteUrl.value)}`)
  } catch (error) {
    console.error('Error starting audit:', error)
    alert('Failed to start audit. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>