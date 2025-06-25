<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <NuxtLink to="/" class="text-blue-600 hover:text-blue-800">Home</NuxtLink>
          </li>
          <li>
            <span class="mx-2 text-gray-400">/</span>
            <NuxtLink to="/seo-tips" class="text-blue-600 hover:text-blue-800">SEO Tips</NuxtLink>
          </li>
          <li>
            <span class="mx-2 text-gray-400">/</span>
            <span class="text-gray-900">{{ data.title }}</span>
          </li>
        </ol>
      </nav>

      <div class="lg:flex lg:gap-8">
        <!-- Table of Contents -->
        <aside class="lg:w-64 mb-8 lg:mb-0 order-2">
          <div class="sticky top-8">
            <!-- Article Meta -->
            <div class="mb-6">
              <h3 class="font-semibold text-gray-900 mb-3">Article Info</h3>
              <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Category:</span>
                  <span :class="[
                    'px-2 py-1 rounded text-xs font-medium',
                    getCategoryColor(data.category)
                  ]">
                    {{ data.category }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Difficulty:</span>
                  <span :class="[
                    'px-2 py-1 rounded text-xs font-medium',
                    getDifficultyColor(data.difficulty)
                  ]">
                    {{ data.difficulty }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Read Time:</span>
                  <span class="text-gray-900">{{ data.readTime }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Updated:</span>
                  <span class="text-gray-900">{{ formatDate(data.updatedAt) }}</span>
                </div>
              </div>
            </div>

            <!-- Table of Contents -->
            <div v-if="data?.body?.toc?.links?.length">
              <h3 class="font-semibold text-gray-900 mb-4">Table of Contents</h3>
              <nav class="toc">
                <ul class="space-y-2">
                  <li v-for="link in data.body.toc.links" :key="link.id">
                    <a 
                      :href="`#${link.id}`"
                      class="text-sm text-gray-600 hover:text-blue-600 block py-1 transition-colors"
                    >
                      {{ link.text }}
                    </a>
                    <ul v-if="link.children" class="mt-1 ml-4 space-y-1">
                      <li v-for="child in link.children" :key="child.id">
                        <a 
                          :href="`#${child.id}`"
                          class="text-xs text-gray-500 hover:text-blue-600 block py-1 transition-colors"
                        >
                          {{ child.text }}
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 order-1">
          <article class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <!-- Article Header -->
            <header class="p-8 pb-6">
              <h1 class="text-4xl font-bold text-gray-900 mb-4">
                {{ data.title }}
              </h1>
              <p class="text-xl text-gray-600 mb-6">
                {{ data.description }}
              </p>
              
              <!-- Author and Meta -->
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span v-if="data.author">By {{ data.author }}</span>
                <span>Published {{ formatDate(data.publishedAt) }}</span>
                <span v-if="data.updatedAt !== data.publishedAt">
                  Updated {{ formatDate(data.updatedAt) }}
                </span>
              </div>
            </header>

            <!-- Article Image -->
            <div v-if="data.image" class="px-8 pb-6">
              <img 
                :src="data.image" 
                :alt="data.title"
                class="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <!-- Article Content -->
            <div class="px-8 pb-8">
              <ContentRenderer :value="data" class="prose prose-lg max-w-none" />
            </div>
            
            <!-- Article Footer -->
            <footer class="px-8 pb-8">
              <!-- Tags -->
              <div v-if="data.tags" class="mb-8">
                <h4 class="font-semibold text-gray-900 mb-3">Tags</h4>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tag in data.tags" 
                    :key="tag"
                    class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors cursor-pointer"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              
              <!-- Social Share -->
              <div class="mb-8">
                <h4 class="font-semibold text-gray-900 mb-3">Share this article</h4>
                <div class="flex space-x-4">
                  <a 
                    :href="`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(data.title)}`"
                    target="_blank"
                    class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </a>
                  <a 
                    :href="`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`"
                    target="_blank"
                    class="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
              
              <!-- Navigation -->
              <div class="border-t border-gray-200 pt-8">
                <div class="flex justify-between items-center">
                  <NuxtLink 
                    v-if="prev" 
                    :to="prev._path"
                    class="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <ChevronLeftIcon class="w-5 h-5 mr-2" />
                    <div>
                      <div class="text-sm text-gray-500">Previous</div>
                      <div>{{ prev.title }}</div>
                    </div>
                  </NuxtLink>
                  <div v-else></div>
                  
                  <NuxtLink 
                    v-if="next" 
                    :to="next._path"
                    class="flex items-center text-blue-600 hover:text-blue-800 font-medium text-right"
                  >
                    <div>
                      <div class="text-sm text-gray-500">Next</div>
                      <div>{{ next.title }}</div>
                    </div>
                    <ChevronRightIcon class="w-5 h-5 ml-2" />
                  </NuxtLink>
                </div>
              </div>
            </footer>
          </article>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const { path } = useRoute()
const config = useRuntimeConfig()

// Fetch current article
const { data } = await useAsyncData(`seo-tip-${path}`, () => 
  queryContent(path).findOne()
)

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

// Fetch prev/next articles
const [prev, next] = await queryContent('/seo-tips')
  .only(['_path', 'title'])
  .sort({ publishedAt: -1 })
  .findSurround(path)

// SEO
useHead({
  title: data.value.title,
  meta: [
    { name: 'description', content: data.value.description },
    { name: 'keywords', content: data.value.tags?.join(', ') },
    { property: 'og:title', content: data.value.title },
    { property: 'og:description', content: data.value.description },
    { property: 'og:type', content: 'article' },
    { property: 'og:image', content: data.value.image },
    { property: 'article:author', content: data.value.author },
    { property: 'article:published_time', content: data.value.publishedAt },
    { property: 'article:modified_time', content: data.value.updatedAt },
    { property: 'article:section', content: data.value.category },
    { property: 'article:tag', content: data.value.tags?.join(',') }
  ]
})

// Computed properties
const shareUrl = computed(() => {
  return encodeURIComponent(`${config.public.siteUrl}${path}`)
})

// Utility functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDifficultyColor = (difficulty) => {
  const colors = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-red-100 text-red-800'
  }
  return colors[difficulty] || 'bg-gray-100 text-gray-800'
}

const getCategoryColor = (category) => {
  const colors = {
    'Technical SEO': 'bg-blue-100 text-blue-800',
    'Content SEO': 'bg-green-100 text-green-800',
    'Local SEO': 'bg-purple-100 text-purple-800',
    'SEO Tools': 'bg-orange-100 text-orange-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}
</script>