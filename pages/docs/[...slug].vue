<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <NuxtLink to="/" class="text-blue-600 hover:text-blue-800">Home</NuxtLink>
          </li>
          <li v-for="(crumb, index) in breadcrumbs" :key="index">
            <span class="mx-2 text-gray-400">/</span>
            <NuxtLink 
              :to="crumb.to" 
              :class="index === breadcrumbs.length - 1 ? 'text-gray-900' : 'text-blue-600 hover:text-blue-800'"
            >
              {{ crumb.title }}
            </NuxtLink>
          </li>
        </ol>
      </nav>

      <div class="lg:flex lg:gap-8">
        <!-- Sidebar -->
        <aside class="lg:w-64 mb-8 lg:mb-0">
          <div class="sticky top-8">
            <!-- Documentation Navigation -->
            <nav class="mb-8">
              <h3 class="font-semibold text-gray-900 mb-4">Documentation</h3>
              <ul class="space-y-2">
                <li v-for="item in docNavigation" :key="item._path">
                  <NuxtLink 
                    :to="item._path"
                    :class="[
                      'block py-2 px-3 rounded-lg text-sm transition-colors',
                      $route.path === item._path 
                        ? 'bg-blue-100 text-blue-800 font-medium' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    ]"
                  >
                    {{ item.title }}
                  </NuxtLink>
                </li>
              </ul>
            </nav>

            <!-- Table of Contents -->
            <div v-if="data?.body?.toc?.links?.length">
              <h3 class="font-semibold text-gray-900 mb-4">On This Page</h3>
              <nav class="toc">
                <ul class="space-y-1">
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
        <main class="flex-1 min-w-0">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <!-- Content Header -->
            <header class="mb-8">
              <h1 class="text-4xl font-bold text-gray-900 mb-4">
                {{ data.title }}
              </h1>
              <p v-if="data.description" class="text-xl text-gray-600 mb-4">
                {{ data.description }}
              </p>
              
              <!-- Meta info -->
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span v-if="data.category" class="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {{ data.category }}
                </span>
                <span v-if="data.readTime">{{ data.readTime }} read</span>
                <span v-if="data.updatedAt">
                  Updated {{ formatDate(data.updatedAt) }}
                </span>
              </div>
            </header>

            <!-- Content -->
            <ContentRenderer :value="data" class="prose prose-lg max-w-none" />
            
            <!-- Footer -->
            <footer class="mt-12 pt-8 border-t border-gray-200">
              <!-- Tags -->
              <div v-if="data.tags" class="mb-6">
                <h4 class="font-semibold text-gray-900 mb-3">Tags</h4>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tag in data.tags" 
                    :key="tag"
                    class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              
              <!-- Navigation -->
              <div class="flex justify-between items-center">
                <NuxtLink 
                  v-if="prev" 
                  :to="prev._path"
                  class="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <ChevronLeftIcon class="w-5 h-5 mr-2" />
                  {{ prev.title }}
                </NuxtLink>
                <div v-else></div>
                
                <NuxtLink 
                  v-if="next" 
                  :to="next._path"
                  class="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  {{ next.title }}
                  <ChevronRightIcon class="w-5 h-5 ml-2" />
                </NuxtLink>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const { path } = useRoute()
const { params } = useRoute()

// Fetch current document
const { data } = await useAsyncData(`content-${path}`, () => 
  queryContent(path).findOne()
)

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

// Fetch documentation navigation
const { data: docNavigation } = await useAsyncData('doc-navigation', () =>
  queryContent('/docs')
    .only(['_path', 'title', 'category'])
    .sort({ _path: 1 })
    .find()
)

// Fetch prev/next pages
const [prev, next] = await queryContent('/docs')
  .only(['_path', 'title'])
  .sort({ _path: 1 })
  .findSurround(path)

// SEO
useHead({
  title: data.value.title,
  meta: [
    { name: 'description', content: data.value.description },
    { property: 'og:title', content: data.value.title },
    { property: 'og:description', content: data.value.description },
    { property: 'og:type', content: 'article' }
  ]
})

// Breadcrumbs
const breadcrumbs = computed(() => {
  const segments = path.split('/').filter(Boolean)
  return segments.map((segment, index) => ({
    title: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    to: '/' + segments.slice(0, index + 1).join('/')
  }))
})

// Utility functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>