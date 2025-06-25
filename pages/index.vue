<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
      <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div class="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            Professional SEO Audits
            <span class="block text-3xl md:text-5xl mt-2">Powered by AI</span>
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Get comprehensive SEO analysis with AI-powered recommendations. 
            Identify issues, track progress, and dominate search rankings.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NuxtLink 
              to="/auth/register" 
              class="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold"
            >
              Start Free Trial
            </NuxtLink>
            <NuxtLink 
              to="/demo" 
              class="btn btn-outline btn-lg px-8 py-4 text-lg font-semibold text-white border-white hover:bg-white hover:text-blue-900"
            >
              View Demo
            </NuxtLink>
          </div>
          <p class="mt-4 text-blue-200">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need for SEO success
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and insights 
            needed to improve your search engine rankings.
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="text-center p-6">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <component :is="feature.icon" class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-blue-600 text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Ready to improve your SEO?
        </h2>
        <p class="text-xl mb-8 text-blue-100">
          Join thousands of businesses that trust Neon SEO Beacon for their SEO success.
        </p>
        <NuxtLink 
          to="/auth/register" 
          class="btn btn-white btn-lg px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-gray-100"
        >
          Start Your Free Trial
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { 
  ChartBarIcon, 
  LightBulbIcon, 
  CogIcon, 
  ShieldCheckIcon, 
  BoltIcon, 
  GlobeAltIcon 
} from '@heroicons/vue/24/outline'

const { setPageMeta, generateWebsiteSchema, generateOrganizationSchema } = useSEO()

// SEO
setPageMeta({
  title: 'Professional SEO Audit Tool | Neon SEO Beacon',
  description: 'Get comprehensive SEO audits with AI-powered insights. Identify technical issues, analyze content, and get actionable recommendations to improve your search rankings.',
  keywords: 'SEO audit, website analysis, search engine optimization, SEO tools, technical SEO, SEO checker'
})

// Structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(generateWebsiteSchema())
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify(generateOrganizationSchema())
    }
  ]
})

const features = [
  {
    title: 'Comprehensive Analysis',
    description: 'Analyze technical SEO, content quality, performance, and more in one comprehensive audit.',
    icon: ChartBarIcon
  },
  {
    title: 'AI-Powered Insights',
    description: 'Get intelligent recommendations powered by advanced AI to prioritize your SEO efforts.',
    icon: LightBulbIcon
  },
  {
    title: 'Real-time Monitoring',
    description: 'Track your SEO progress over time with automated monitoring and alerts.',
    icon: BoltIcon
  },
  {
    title: 'Easy Integration',
    description: 'Connect with popular tools and platforms through our robust API and integrations.',
    icon: CogIcon
  },
  {
    title: 'Enterprise Security',
    description: 'Your data is protected with enterprise-grade security and privacy controls.',
    icon: ShieldCheckIcon
  },
  {
    title: 'Global Coverage',
    description: 'Analyze websites from any location with our global network of audit servers.',
    icon: GlobeAltIcon
  }
]
</script>