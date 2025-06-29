<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions, browse our guides, or get in touch
            with our support team.
          </p>
        </div>

        <!-- Search -->
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <MagnifyingGlassIcon
              class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for help articles..."
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              @keyup.enter="performSearch"
            />
            <button
              @click="performSearch"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-primary px-6 py-2"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Links -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
          Popular Help Topics
        </h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="category in helpCategories"
            :key="category.title"
            :to="category.href"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div class="flex items-start">
              <div
                class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4"
              >
                <component :is="category.icon" class="w-6 h-6 text-blue-600" />
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  {{ category.title }}
                </h3>
                <p class="text-gray-600 text-sm mb-3">
                  {{ category.description }}
                </p>
                <span class="text-blue-600 text-sm font-medium">
                  {{ category.articleCount }} articles →
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Articles -->
    <section class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
          Featured Articles
        </h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="article in featuredArticles"
            :key="article._path"
            class="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              <NuxtLink
                :to="article._path"
                class="hover:text-blue-600 transition-colors"
              >
                {{ article.title }}
              </NuxtLink>
            </h3>
            <p class="text-gray-600 text-sm mb-3">
              {{ article.description }}
            </p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">
                {{ article.category }}
              </span>
              <NuxtLink
                :to="article._path"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Read more →
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Contact Support -->
    <section class="py-12 bg-blue-50">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
        <p class="text-gray-600 mb-8">
          Can't find what you're looking for? Our support team is here to help.
        </p>

        <div class="grid md:grid-cols-3 gap-6">
          <!-- Live Chat -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              <ChatBubbleLeftRightIcon class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p class="text-gray-600 text-sm mb-4">
              Get instant help from our support team
            </p>
            <button class="btn btn-primary w-full">Start Chat</button>
          </div>

          <!-- Email Support -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              <EnvelopeIcon class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p class="text-gray-600 text-sm mb-4">
              Send us a message and we'll respond within 24 hours
            </p>
            <a
              href="mailto:support@neonseobeacon.com"
              class="btn btn-secondary w-full"
            >
              Send Email
            </a>
          </div>

          <!-- Schedule Call -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div
              class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4"
            >
              <PhoneIcon class="w-6 h-6 text-purple-600" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Schedule Call</h3>
            <p class="text-gray-600 text-sm mb-4">
              Book a 15-minute call with our team
            </p>
            <button class="btn btn-secondary w-full">Book Call</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  CogIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
} from "@heroicons/vue/24/outline";

// SEO
useHead({
  title: "Help Center - Neon SEO Beacon",
  meta: [
    {
      name: "description",
      content:
        "Get help with Neon SEO Beacon. Find answers to common questions, browse guides, and contact support.",
    },
    { property: "og:title", content: "Help Center - Neon SEO Beacon" },
    {
      property: "og:description",
      content:
        "Get help with Neon SEO Beacon. Find answers to common questions, browse guides, and contact support.",
    },
  ],
});

// Reactive data
const searchQuery = ref("");

// Help categories
const helpCategories = [
  {
    title: "Getting Started",
    description: "Learn the basics of using Neon SEO Beacon",
    icon: RocketLaunchIcon,
    href: "/help/getting-started",
    articleCount: 8,
  },
  {
    title: "SEO Audits",
    description: "Understanding your SEO audit results",
    icon: DocumentTextIcon,
    href: "/help/audits",
    articleCount: 12,
  },
  {
    title: "Account & Billing",
    description: "Manage your account and subscription",
    icon: CreditCardIcon,
    href: "/help/billing",
    articleCount: 6,
  },
  {
    title: "API & Integrations",
    description: "Connect Neon SEO Beacon with other tools",
    icon: CogIcon,
    href: "/help/api",
    articleCount: 10,
  },
  {
    title: "Security & Privacy",
    description: "Learn about our security measures",
    icon: ShieldCheckIcon,
    href: "/help/security",
    articleCount: 4,
  },
  {
    title: "Troubleshooting",
    description: "Solve common issues and problems",
    icon: QuestionMarkCircleIcon,
    href: "/help/troubleshooting",
    articleCount: 15,
  },
];

// Fetch featured articles
const { data: featuredArticles } = await useAsyncData("help-featured", () =>
  queryContent("/help").where({ featured: true }).limit(6).find(),
);

// Methods
function performSearch() {
  if (searchQuery.value.trim()) {
    navigateTo(`/help/search?q=${encodeURIComponent(searchQuery.value)}`);
  }
}
</script>
