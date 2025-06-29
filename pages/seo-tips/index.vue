<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <section class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            SEO Tips & Guides
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Learn the latest SEO strategies, techniques, and best practices to improve your website's search rankings.
          </p>
        </div>
        
        <!-- Search and Filters -->
        <div class="mt-8 max-w-2xl mx-auto">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search articles..."
                class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              />
            </div>
            <select 
              v-model="selectedCategory"
              class="px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 sm:w-48"
            >
              <option value="">All Categories</option>
              <option value="technical">Technical SEO</option>
              <option value="content">Content Optimization</option>
              <option value="local">Local SEO</option>
              <option value="analytics">Analytics & Tracking</option>
            </select>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Articles Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {{ getArticlesSectionTitle() }}
        </h2>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading articles..." />
        </div>
        
        <!-- Articles Grid -->
        <div v-else-if="filteredArticles.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article 
            v-for="article in paginatedArticles" 
            :key="article.id"
            class="group glass rounded-2xl overflow-hidden border border-white/20 hover-scale"
          >
            <div v-if="article.image" class="aspect-video">
              <img 
                :src="article.image" 
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-6">
              <div v-if="article.category" class="mb-3">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {{ article.category }}
                </span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <a :href="article.url" class="hover:underline">
                  {{ article.title }}
                </a>
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">{{ article.description }}</p>
              <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{{ formatDate(article.publishedAt) }}</span>
                <span v-if="article.readingTime">{{ article.readingTime }} min read</span>
              </div>
            </div>
          </article>
        </div>
        
        <!-- No Results -->
        <div v-else class="text-center py-12">
          <div class="text-gray-400 dark:text-gray-500 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No articles found</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">Try adjusting your search or filters</p>
          <button 
            @click="clearFilters"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-12 flex justify-center">
          <nav class="flex items-center space-x-2">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div class="flex space-x-1">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  currentPage === page 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Mock SEO articles data (replace with real data from your CMS/API)
const mockArticles = [
  {
    id: 1,
    title: "Technical SEO Fundamentals: A Complete Guide",
    description: "Master the technical aspects of SEO including site structure, crawling, indexing, and Core Web Vitals optimization.",
    category: "technical",
    image: "/images/seo-tips/technical-seo.jpg",
    url: "/seo-tips/technical-seo-fundamentals",
    publishedAt: "2025-06-20",
    readingTime: 12
  },
  {
    id: 2,
    title: "Content Optimization Strategies That Work",
    description: "Learn how to create and optimize content that ranks well and provides value to your audience.",
    category: "content",
    image: "/images/seo-tips/content-optimization.jpg",
    url: "/seo-tips/content-optimization-strategies",
    publishedAt: "2025-06-18",
    readingTime: 8
  },
  {
    id: 3,
    title: "Local SEO: Dominate Your Local Market",
    description: "Complete guide to local SEO including Google My Business optimization, local citations, and review management.",
    category: "local",
    image: "/images/seo-tips/local-seo.jpg",
    url: "/seo-tips/local-seo-guide",
    publishedAt: "2025-06-15",
    readingTime: 10
  },
  {
    id: 4,
    title: "SEO Analytics: Measuring What Matters",
    description: "Set up proper SEO tracking and learn which metrics actually indicate SEO success.",
    category: "analytics",
    image: "/images/seo-tips/seo-analytics.jpg",
    url: "/seo-tips/seo-analytics-guide",
    publishedAt: "2025-06-12",
    readingTime: 15
  },
  {
    id: 5,
    title: "Core Web Vitals Optimization Guide",
    description: "Improve your Core Web Vitals scores and boost both user experience and search rankings.",
    category: "technical",
    image: "/images/seo-tips/core-web-vitals.jpg",
    url: "/seo-tips/core-web-vitals-optimization",
    publishedAt: "2025-06-10",
    readingTime: 9
  },
  {
    id: 6,
    title: "Keyword Research in 2025: Advanced Techniques",
    description: "Modern keyword research strategies using semantic search and user intent analysis.",
    category: "content",
    image: "/images/seo-tips/keyword-research.jpg",
    url: "/seo-tips/keyword-research-2025",
    publishedAt: "2025-06-08",
    readingTime: 11
  }
]

// Reactive data
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const isLoading = ref(false)
const articlesPerPage = 6

// Computed properties
const filteredArticles = computed(() => {
  let filtered = mockArticles
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    )
  }
  
  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(article => article.category === selectedCategory.value)
  }
  
  return filtered
})

const totalPages = computed(() => {
  if (!filteredArticles.value || filteredArticles.value.length === 0) return 1
  return Math.ceil(filteredArticles.value.length / articlesPerPage)
})

const paginatedArticles = computed(() => {
  if (!filteredArticles.value) return []
  const start = (currentPage.value - 1) * articlesPerPage
  const end = start + articlesPerPage
  return filteredArticles.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const current = currentPage.value
  const total = totalPages.value
  
  if (total <= 1) return [1]
  
  // Show 5 pages around current page
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages.length > 0 ? pages : [1]
})

// Watch for filter changes and reset pagination
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})

// Methods
function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
  currentPage.value = 1
}

function getArticlesSectionTitle() {
  if (searchQuery.value) return 'Search Results'
  if (selectedCategory.value) {
    const categoryNames: Record<string, string> = {
      technical: 'Technical SEO',
      content: 'Content Optimization',
      local: 'Local SEO',
      analytics: 'Analytics & Tracking'
    }
    return `${categoryNames[selectedCategory.value] || selectedCategory.value} Articles`
  }
  return 'Latest SEO Articles'
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// SEO
useHead({
  title: 'SEO Tips & Guides | Neon SEO Beacon',
  meta: [
    { name: 'description', content: 'Learn the latest SEO strategies, techniques, and best practices. Comprehensive guides on technical SEO, content optimization, and search rankings.' },
    { name: 'keywords', content: 'SEO tips, SEO guides, search engine optimization, SEO strategies, SEO best practices, technical SEO, content SEO' }
  ]
})
</script>
