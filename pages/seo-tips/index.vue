<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            SEO Tips & Guides
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
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
                class="input w-full"
              />
            </div>
            <select 
              v-model="selectedCategory"
              class="input sm:w-48"
            >
              <option value="">All Categories</option>
              <option 
                v-for="category in categories" 
                :key="category.category"
                :value="category.category"
              >
                {{ category.category }} ({{ category.count }})
              </option>
            </select>
          </div>
          
          <!-- Tags Filter -->
          <div v-if="tags.length" class="mt-4">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in tags.slice(0, 10)" 
                :key="tag.tag"
                @click="toggleTag(tag.tag)"
                :class="[
                  'px-3 py-1 rounded-full text-sm transition-colors',
                  selectedTags.includes(tag.tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                #{{ tag.tag }} ({{ tag.count }})
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Featured Articles -->
    <section v-if="featuredArticles.length && !searchQuery && !selectedCategory && !selectedTags.length" class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <article 
            v-for="article in featuredArticles" 
            :key="article._path"
            class="group"
          >
            <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div v-if="article.image" class="aspect-video">
                <img 
                  :src="article.image" 
                  :alt="article.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div class="p-6">
                <div v-if="article.category" class="mb-3">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ article.category }}
                  </span>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  <NuxtLink :to="article._path">
                    {{ article.title }}
                  </NuxtLink>
                </h3>
                <p class="text-gray-600 mb-4">{{ article.description }}</p>
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <span>{{ formatDate(article.publishedAt) }}</span>
                  <span v-if="article.readingTime">{{ article.readingTime }} min read</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
    
    <!-- Articles Grid -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ getArticlesSectionTitle() }}
          </h2>
          <span class="text-gray-500">
            {{ filteredArticles.length }} article{{ filteredArticles.length !== 1 ? 's' : '' }}
          </span>
        </div>
        
        <!-- Loading State -->
        <div v-if="pending" class="flex justify-center py-12">
          <LoadingSpinner message="Loading articles..." />
        </div>
        
        <!-- No Results -->
        <div v-else-if="filteredArticles.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlassIcon class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
          <p class="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
          <button 
            @click="clearFilters"
            class="btn btn-outline"
          >
            Clear Filters
          </button>
        </div>
        
        <!-- Articles List -->
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article 
            v-for="article in paginatedArticles" 
            :key="article._path"
            class="group"
          >
            <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
              <div v-if="article.image" class="aspect-video">
                <img 
                  :src="article.image" 
                  :alt="article.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div class="p-6 flex-1 flex flex-col">
                <div class="flex-1">
                  <div v-if="article.category" class="mb-3">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ article.category }}
                    </span>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    <NuxtLink :to="article._path">
                      {{ article.title }}
                    </NuxtLink>
                  </h3>
                  <p class="text-gray-600 mb-4">{{ article.description }}</p>
                  
                  <!-- Tags -->
                  <div v-if="article.tags?.length" class="mb-4">
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-for="tag in article.tags.slice(0, 3)" 
                        :key="tag"
                        class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        #{{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center justify-between text-sm text-gray-500 mt-auto">
                  <span>{{ formatDate(article.publishedAt) }}</span>
                  <span v-if="article.readingTime">{{ article.readingTime }} min read</span>
                </div>
              </div>
            </div>
          </article>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-12 flex justify-center">
          <nav class="flex items-center space-x-2">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
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
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const { getFeaturedTips, getAllTags, getAllCategories } = useContent()
const { setPageMeta } = useSEO()

// Reactive data
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedTags = ref([])
const currentPage = ref(1)
const articlesPerPage = 12

// Load data
const { data: allArticles, pending } = await useAsyncData('seo-tips', () => {
  return queryContent('/seo-tips')
    .sort({ publishedAt: -1 })
    .find()
})

const { data: featuredArticles } = await useAsyncData('featured-tips', () => {
  return getFeaturedTips(3)
})

const { data: tags } = await useAsyncData('seo-tips-tags', () => {
  return getAllTags()
})

const { data: categories } = await useAsyncData('seo-tips-categories', () => {
  return getAllCategories()
})

// Computed properties
const filteredArticles = computed(() => {
  if (!allArticles.value) return []
  
  let filtered = allArticles.value
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(article => article.category === selectedCategory.value)
  }
  
  // Tags filter
  if (selectedTags.value.length) {
    filtered = filtered.filter(article => 
      selectedTags.value.every(tag => article.tags?.includes(tag))
    )
  }
  
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / articlesPerPage)
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage
  const end = start + articlesPerPage
  return filteredArticles.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const current = currentPage.value
  const total = totalPages.value
  
  // Show 5 pages around current page
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Watch for filter changes and reset pagination
watch([searchQuery, selectedCategory, selectedTags], () => {
  currentPage.value = 1
})

// Methods
function toggleTag(tag) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedTags.value = []
  currentPage.value = 1
}

function getArticlesSectionTitle() {
  if (searchQuery.value) return 'Search Results'
  if (selectedCategory.value) return `${selectedCategory.value} Articles`
  if (selectedTags.value.length) return 'Tagged Articles'
  return 'All Articles'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// SEO
setPageMeta({
  title: 'SEO Tips & Guides | Neon SEO Beacon',
  description: 'Learn the latest SEO strategies, techniques, and best practices. Comprehensive guides on technical SEO, content optimization, and search rankings.',
  keywords: 'SEO tips, SEO guides, search engine optimization, SEO strategies, SEO best practices, technical SEO, content SEO'
})
</script>