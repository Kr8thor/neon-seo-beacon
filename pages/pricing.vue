<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Start with our free plan and upgrade as your SEO needs grow. All plans
          include our comprehensive SEO analysis engine.
        </p>
      </div>
    </section>

    <!-- Pricing Toggle -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-center">
          <div class="bg-gray-100 rounded-lg p-1 flex">
            <button
              @click="isAnnual = false"
              :class="[
                'px-6 py-2 rounded-md font-medium transition-colors',
                !isAnnual
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500',
              ]"
            >
              Monthly
            </button>
            <button
              @click="isAnnual = true"
              :class="[
                'px-6 py-2 rounded-md font-medium transition-colors relative',
                isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500',
              ]"
            >
              Annual
              <span
                class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full"
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="pb-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Free Plan -->
          <div class="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p class="text-gray-600 mb-4">Perfect for getting started</p>
              <div class="mb-4">
                <span class="text-4xl font-bold text-gray-900">$0</span>
                <span class="text-gray-600">/month</span>
              </div>
              <NuxtLink to="/auth/register" class="btn btn-secondary w-full">
                Get Started Free
              </NuxtLink>
            </div>

            <ul class="space-y-3">
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>5 audits per month</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>Basic SEO analysis</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>Core Web Vitals</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>Technical SEO insights</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>Email support</span>
              </li>
            </ul>
          </div>

          <!-- Pro Plan -->
          <div
            class="bg-white rounded-lg shadow-lg border-2 border-blue-500 p-8 relative"
          >
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span
                class="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium"
              >
                Most Popular
              </span>
            </div>

            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <p class="text-gray-600 mb-4">For growing businesses</p>
              <div class="mb-4">
                <span class="text-4xl font-bold text-gray-900">
                  ${{ isAnnual ? "39" : "49" }}
                </span>
                <span class="text-gray-600">/month</span>
                <div v-if="isAnnual" class="text-sm text-green-600">
                  $588/year (save $120)
                </div>
              </div>
              <NuxtLink
                to="/auth/register?plan=pro"
                class="btn btn-primary w-full"
              >
                Start Pro Trial
              </NuxtLink>
            </div>

            <ul class="space-y-3">
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>100 audits per month</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>Advanced AI recommendations</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>Historical tracking</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>Competitor analysis</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>Priority support</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>API access</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>Custom reports</span>
              </li>
            </ul>
          </div>

          <!-- Agency Plan -->
          <div class="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Agency</h3>
              <p class="text-gray-600 mb-4">For agencies and enterprises</p>
              <div class="mb-4">
                <span class="text-4xl font-bold text-gray-900">
                  ${{ isAnnual ? "159" : "199" }}
                </span>
                <span class="text-gray-600">/month</span>
                <div v-if="isAnnual" class="text-sm text-green-600">
                  $1,908/year (save $480)
                </div>
              </div>
              <NuxtLink
                to="/auth/register?plan=agency"
                class="btn btn-primary w-full"
              >
                Start Agency Trial
              </NuxtLink>
            </div>

            <ul class="space-y-3">
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>1,000 audits per month</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>White-label reports</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>Team collaboration</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>Custom branding</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>Dedicated support</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>Advanced API</span>
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-3" />
                <span>SLA guarantee</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Comparison -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Compare Features
          </h2>
          <p class="text-xl text-gray-600">See what's included in each plan</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-4 px-6 font-semibold text-gray-900">
                  Features
                </th>
                <th class="text-center py-4 px-6 font-semibold text-gray-900">
                  Free
                </th>
                <th class="text-center py-4 px-6 font-semibold text-gray-900">
                  Pro
                </th>
                <th class="text-center py-4 px-6 font-semibold text-gray-900">
                  Agency
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="feature in features" :key="feature.name">
                <td class="py-4 px-6 font-medium text-gray-900">
                  {{ feature.name }}
                </td>
                <td class="py-4 px-6 text-center">
                  <component
                    :is="getFeatureIcon(feature.free)"
                    :value="feature.free"
                  />
                </td>
                <td class="py-4 px-6 text-center">
                  <component
                    :is="getFeatureIcon(feature.pro)"
                    :value="feature.pro"
                  />
                </td>
                <td class="py-4 px-6 text-center">
                  <component
                    :is="getFeatureIcon(feature.agency)"
                    :value="feature.agency"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div class="space-y-8">
          <div
            v-for="faq in faqs"
            :key="faq.question"
            class="bg-white rounded-lg p-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ faq.question }}
            </h3>
            <p class="text-gray-600">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { CheckIcon, XMarkIcon } from "@heroicons/vue/24/outline";

// SEO
useHead({
  title: "Pricing - Neon SEO Beacon",
  meta: [
    {
      name: "description",
      content:
        "Choose the perfect SEO audit plan for your needs. Start free and upgrade as you grow.",
    },
    { property: "og:title", content: "Pricing - Neon SEO Beacon" },
    {
      property: "og:description",
      content:
        "Choose the perfect SEO audit plan for your needs. Start free and upgrade as you grow.",
    },
  ],
});

// Reactive data
const isAnnual = ref(false);

// Features comparison data
const features = [
  { name: "Monthly Audits", free: "5", pro: "100", agency: "1,000" },
  { name: "SEO Analysis", free: true, pro: true, agency: true },
  { name: "AI Recommendations", free: false, pro: true, agency: true },
  { name: "Historical Tracking", free: false, pro: true, agency: true },
  { name: "API Access", free: false, pro: true, agency: true },
  { name: "White-label Reports", free: false, pro: false, agency: true },
  { name: "Team Collaboration", free: false, pro: false, agency: true },
  { name: "Custom Branding", free: false, pro: false, agency: true },
  {
    name: "Support Level",
    free: "Email",
    pro: "Priority",
    agency: "Dedicated",
  },
];

// FAQ data
const faqs = [
  {
    question: "Can I change my plan anytime?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes! Our Free plan includes 5 audits per month with no time limit. Pro and Agency plans include a 14-day free trial.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also pay by invoice.",
  },
  {
    question: "Is there a setup fee?",
    answer:
      "No, there are no setup fees or hidden costs. You only pay the monthly or annual subscription fee.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your current billing period.",
  },
  {
    question: "Do you offer discounts for nonprofits?",
    answer:
      "Yes, we offer special pricing for qualified nonprofits and educational institutions. Contact us for more information.",
  },
];

// Methods
function getFeatureIcon(value) {
  if (value === true) {
    return "CheckIcon";
  } else if (value === false) {
    return "XMarkIcon";
  } else {
    return "span";
  }
}

// Components for feature table
const FeatureCheck = {
  template: '<CheckIcon class="w-5 h-5 text-green-500 mx-auto" />',
};

const FeatureX = {
  template: '<XMarkIcon class="w-5 h-5 text-gray-300 mx-auto" />',
};

const FeatureValue = {
  props: ["value"],
  template: '<span class="font-medium text-gray-900">{{ value }}</span>',
};

// Define components
const components = {
  CheckIcon: FeatureCheck,
  XMarkIcon: FeatureX,
  span: FeatureValue,
};
</script>
