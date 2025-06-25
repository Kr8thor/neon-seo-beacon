<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <header class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          SEO Knowledge Base
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Learn SEO best practices, techniques, and strategies to improve your website's search rankings.
        </p>
      </header>

      <!-- Search -->
      <div class="mb-8">
        <div class="max-w-md mx-auto">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search SEO tips..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="mb-8">
        <nav class="flex flex-wrap justify-center gap-2 border-b border-gray-200">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'py-2 px-4 border-b-2 font-medium text-sm transition-colors',
              selectedCategory === category 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ category }}
          </button>
        </nav>
      </div>

      <!-- Articles Grid -->
      <div v-if="filteredArticles.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <article 
          v-for="article in paginatedArticles" 
          :key="article._path"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="p-6">
            <!-- Meta -->
            <div class="flex items-center justify-between mb-3">
              <span :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                getDifficultyColor(article.difficulty)
              ]">
                {{ article.difficulty }}
              </span>
              <span class="text-sm text-gray-500">{{ article.readTime }}</span>
            </div>
            
            <!-- Title -->
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              <NuxtLink 
                :to="article._path" 
                class="hover:text-blue-600 transition-colors"
              >
                {{ article.title }}
              </NuxtLink>
            </h3>
            
            <!-- Description -->
            <p class="text-gray-600 mb-4">{{ article.description }}</p>
            
            <!-- Footer -->
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
              <span class="text-xs text-gray-500">
                {{ formatDate(article.publishedAt) }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MagnifyingGlassIcon class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
        <p class="text-gray-600 mb-4">Try adjusting your search or category filter.</p>
        <button 
          @click="clearFilters"
          class="btn btn-secondary"
        >
          Clear Filters
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center">
        <nav class="flex items-center space-x-2">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span class="px-4 py-2 text-gray-700">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          
          <button 
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

// Meta tags
useHead({
  title: 'SEO Knowledge Base - Neon SEO Beacon',
  meta: [
    { 
      name: 'description', 
      content: 'Comprehensive SEO guides, tutorials, and best practices to improve your website search rankings.' 
    },
    { property: 'og:title', content: 'SEO Knowledge Base - Neon SEO Beacon' },
    { property: 'og:description', content: 'Comprehensive SEO guides, tutorials, and best practices to improve your website search rankings.' }
  ]
})

// Fetch all SEO tips content
const { data: articles } = await useAsyncData('seo-tips', () =>
  queryContent('/seo-tips')
    .where({ _draft: { $ne: true } })
    .sort({ publishedAt: -1 })
    .find()
)

// Reactive data
const searchQuery = ref('')
const selectedCategory = ref('All')
const currentPage = ref(1)
const articlesPerPage = 9

// Computed properties
const categories = computed(() => {
  const cats = ['All', ...new Set(articles.value?.map(a => a.category) || [])]
  return cats.filter(Boolean)
})

const filteredArticles = computed(() => {
  if (!articles.value) return []
  
  return articles.value.filter(article => {
    const matchesCategory = selectedCategory.value === 'All' || article.category === selectedCategory.value
    const matchesSearch = !searchQuery.value || 
      article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / articlesPerPage)
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage
  const end = start + articlesPerPage
  return filteredArticles.value.slice(start, end)
})

// Watchers
watch([selectedCategory, searchQuery], () => {
  currentPage.value = 1
})

// Methods
const getDifficultyColor = (difficulty) => {
  const colors = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-red-100 text-red-800'
  }
  return colors[difficulty] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'All'
  currentPage.value = 1
}
</script>