<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Simple, transparent pricing
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the plan that fits your needs. Upgrade or downgrade at any time.
        </p>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div 
            v-for="plan in plans" 
            :key="plan.name"
            :class="[
              'bg-white rounded-lg shadow-lg p-8 relative',
              plan.featured ? 'ring-2 ring-blue-600 transform scale-105' : ''
            ]"
          >
            <div v-if="plan.featured" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            
            <div class="text-center">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ plan.name }}</h3>
              <div class="mb-4">
                <span class="text-4xl font-bold text-gray-900">${{ plan.price }}</span>
                <span class="text-gray-600">{{ plan.period }}</span>
              </div>
              <p class="text-gray-600 mb-6">{{ plan.description }}</p>
            </div>
            
            <ul class="space-y-3 mb-8">
              <li v-for="feature in plan.features" :key="feature" class="flex items-start">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span class="text-gray-700">{{ feature }}</span>
              </li>
            </ul>
            
            <NuxtLink 
              :to="plan.cta.link"
              :class="[
                'block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors',
                plan.featured 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              ]"
            >
              {{ plan.cta.text }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        
        <div class="space-y-6">
          <div v-for="faq in faqs" :key="faq.question" class="border-b border-gray-200 pb-6">
            <button 
              @click="toggleFAQ(faq.id)"
              class="w-full text-left flex justify-between items-start"
            >
              <h3 class="text-lg font-semibold text-gray-900 pr-4">{{ faq.question }}</h3>
              <ChevronDownIcon 
                :class="[
                  'w-5 h-5 text-gray-500 transition-transform flex-shrink-0',
                  expandedFAQ === faq.id ? 'transform rotate-180' : ''
                ]"
              />
            </button>
            <div 
              v-show="expandedFAQ === faq.id"
              class="mt-4 text-gray-600"
              v-html="faq.answer"
            ></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

const { setPageMeta, generateFAQSchema } = useSEO()

const expandedFAQ = ref(null)

function toggleFAQ(id) {
  expandedFAQ.value = expandedFAQ.value === id ? null : id
}

// SEO
setPageMeta({
  title: 'Pricing Plans | Neon SEO Beacon',
  description: 'Choose the perfect SEO audit plan for your business. Transparent pricing, no hidden fees. Start with our free trial today.',
  keywords: 'SEO pricing, audit plans, SEO tools cost, website analysis pricing'
})

const plans = [
  {
    name: 'Starter',
    price: '0',
    period: '/month',
    description: 'Perfect for small websites and personal projects',
    features: [
      '5 audits per month',
      'Basic SEO analysis',
      'Performance metrics',
      'Email support',
      'Core web vitals'
    ],
    cta: {
      text: 'Start Free',
      link: '/auth/register'
    }
  },
  {
    name: 'Professional',
    price: '49',
    period: '/month',
    description: 'Great for agencies and growing businesses',
    featured: true,
    features: [
      '100 audits per month',
      'Advanced SEO analysis',
      'AI-powered recommendations',
      'White-label reports',
      'Priority support',
      'Custom branding',
      'API access'
    ],
    cta: {
      text: 'Start Free Trial',
      link: '/auth/register?plan=pro'
    }
  },
  {
    name: 'Enterprise',
    price: '199',
    period: '/month',
    description: 'For large organizations with advanced needs',
    features: [
      'Unlimited audits',
      'Custom integrations',
      'Dedicated support',
      'Advanced analytics',
      'Team collaboration',
      'SLA guarantee',
      'Custom reporting'
    ],
    cta: {
      text: 'Contact Sales',
      link: '/contact'
    }
  }
]

const faqs = [
  {
    id: 1,
    question: 'Can I change my plan at any time?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any charges.'
  },
  {
    id: 2,
    question: 'What happens to my data if I cancel?',
    answer: 'Your data remains accessible for 30 days after cancellation. You can export your data anytime during your subscription.'
  },
  {
    id: 3,
    question: 'Do you offer refunds?',
    answer: 'We offer a 14-day money-back guarantee for all paid plans. No questions asked.'
  },
  {
    id: 4,
    question: 'Is there a free trial?',
    answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.'
  },
  {
    id: 5,
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.'
  }
]

// Structured data for FAQ
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(generateFAQSchema(faqs))
    }
  ]
})
</script>