<template>
  <div class="min-h-screen bg-white">
    <!-- Article Header -->
    <article class="max-w-4xl mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <NuxtLink to="/" class="hover:text-gray-700">Home</NuxtLink>
        <ChevronRightIcon class="w-4 h-4" />
        <NuxtLink to="/seo-tips" class="hover:text-gray-700">SEO Tips</NuxtLink>
        <ChevronRightIcon class="w-4 h-4" />
        <span>{{ data?.title }}</span>
      </nav>
      
      <!-- Article Meta -->
      <header class="mb-8">
        <div v-if="data?.category" class="mb-4">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {{ data.category }}
          </span>
        </div>
        
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ data?.title }}</h1>
        
        <p v-if="data?.description" class="text-xl text-gray-600 mb-6">
          {{ data.description }}
        </p>
        
        <div class="flex items-center justify-between text-sm text-gray-500 border-b border-gray-200 pb-6">
          <div class="flex items-center space-x-4">
            <span v-if="data?.author">
              By {{ data.author }}
            </span>
            <span v-if="data?.publishedAt">
              {{ formatDate(data.publishedAt) }}
            </span>
            <span v-if="data?.readingTime">
              {{ data.readingTime }} min read
            </span>
          </div>
          
          <div class="flex items-center space-x-2">
            <button 
              @click="shareArticle"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Share article"
            >
              <ShareIcon class="w-4 h-4" />
            </button>
            <button 
              @click="bookmarkArticle"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Bookmark article"
            >
              <BookmarkIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
      
      <!-- Article Image -->
      <div v-if="data?.image" class="mb-8">
        <img 
          :src="data.image" 
          :alt="data.title"
          class="w-full h-64 md:h-80 object-cover rounded-lg shadow-sm"
        />
      </div>
      
      <!-- Table of Contents -->
      <div v-if="data?.toc && toc?.links?.length" class="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 class="font-semibold text-gray-900 mb-4 flex items-center">
          <ListBulletIcon class="w-5 h-5 mr-2" />
          Table of Contents
        </h2>
        <nav class="space-y-2">
          <div v-for="link in toc.links" :key="link.id" class="ml-0">
            <a 
              :href="`#${link.id}`"
              class="text-blue-600 hover:text-blue-700 text-sm"
            >
              {{ link.text }}
            </a>
            <div v-if="link.children" class="ml-4 mt-1 space-y-1">
              <a 
                v-for="child in link.children"
                :key="child.id"
                :href="`#${child.id}`"
                class="block text-blue-600 hover:text-blue-700 text-sm"
              >
                {{ child.text }}
              </a>
            </div>
          </div>
        </nav>
      </div>
      
      <!-- Article Content -->
      <div class="prose prose-lg max-w-none">
        <ContentRenderer v-if="data" :value="data" />
      </div>
      
      <!-- Article Tags -->
      <div v-if="data?.tags?.length" class="mt-8 pt-8 border-t border-gray-200">
        <h3 class="text-sm font-medium text-gray-900 mb-3">Tags</h3>
        <div class="flex flex-wrap gap-2">
          <NuxtLink 
            v-for="tag in data.tags" 
            :key="tag"
            :to="`/seo-tips?tag=${tag}`"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            #{{ tag }}
          </NuxtLink>
        </div>
      </div>
      
      <!-- Social Sharing -->
      <div class="mt-8 pt-8 border-t border-gray-200">
        <h3 class="text-sm font-medium text-gray-900 mb-4">Share this article</h3>
        <div class="flex space-x-4">
          <button 
            @click="shareOn('twitter')"
            class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter
          </button>
          
          <button 
            @click="shareOn('linkedin')"
            class="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </button>
          
          <button 
            @click="copyLink"
            class="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <LinkIcon class="w-4 h-4 mr-2" />
            Copy Link
          </button>
        </div>
      </div>
    </article>
    
    <!-- Related Articles -->
    <section v-if="relatedArticles?.length" class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <article 
            v-for="article in relatedArticles" 
            :key="article._path"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div v-if="article.image" class="aspect-video">
              <img 
                :src="article.image" 
                :alt="article.title"
                class="w-full h-full object-cover rounded-t-lg"
              />
            </div>
            <div class="p-6">
              <div v-if="article.category" class="mb-2">
                <span class="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {{ article.category }}
                </span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                <NuxtLink :to="article._path" class="hover:text-blue-600">
                  {{ article.title }}
                </NuxtLink>
              </h3>
              <p class="text-gray-600 text-sm mb-4">{{ article.description }}</p>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ formatDate(article.publishedAt) }}</span>
                <span v-if="article.readingTime">{{ article.readingTime }} min read</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { 
  ChevronRightIcon, 
  ShareIcon, 
  BookmarkIcon, 
  ListBulletIcon,
  LinkIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const { getRelatedContent } = useContent()
const { setPageMeta, generateArticleSchema, generateBreadcrumbSchema } = useSEO()
const notificationStore = useNotificationStore()

// Get the article content
const { data } = await useAsyncData(`content-${route.path}`, () => {
  return queryContent(route.path).findOne()
})

// Get table of contents
const { data: toc } = await useAsyncData(`toc-${route.path}`, () => {
  return queryContent(route.path).only(['body']).findOne()
})

// Get related articles
const { data: relatedArticles } = await useAsyncData(`related-${route.path}`, async () => {
  if (!data.value?.tags) return []
  return await getRelatedContent(route.path, data.value.tags, 3)
})

// Error handling
if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article not found'
  })
}

// SEO setup
setPageMeta({
  title: data.value.title,
  description: data.value.description,
  keywords: data.value.tags?.join(', '),
  image: data.value.image,
  type: 'article',
  publishedAt: data.value.publishedAt,
  updatedAt: data.value.updatedAt,
  author: data.value.author,
  section: data.value.category
})

// Structured data
const breadcrumbs = [
  { title: 'Home', to: '/' },
  { title: 'SEO Tips', to: '/seo-tips' },
  { title: data.value.title, to: route.path }
]

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(generateArticleSchema(data.value))
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify(generateBreadcrumbSchema(breadcrumbs))
    }
  ]
})

// Methods
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function shareArticle() {
  if (navigator.share) {
    navigator.share({
      title: data.value.title,
      text: data.value.description,
      url: window.location.href
    })
  } else {
    copyLink()
  }
}

function bookmarkArticle() {
  // This would typically save to user's bookmarks
  notificationStore.success('Article bookmarked!')
}

function shareOn(platform) {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(data.value.title)
  const description = encodeURIComponent(data.value.description)
  
  let shareUrl = ''
  
  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
      break
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
      break
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
      break
  }
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    notificationStore.success('Link copied to clipboard!')
  } catch (error) {
    notificationStore.error('Failed to copy link')
  }
}
</script>