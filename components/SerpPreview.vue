<template>
  <div class="serp-preview">
    <div class="serp-preview-header">
      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
        Google Search Preview
      </h3>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <!-- Desktop Preview -->
      <div class="space-y-1">
        <!-- URL breadcrumb -->
        <div class="flex items-center text-sm">
          <img
            v-if="favicon"
            :src="favicon"
            class="w-4 h-4 mr-2 rounded"
            :alt="domain"
          />
          <div v-else class="w-4 h-4 mr-2 rounded bg-gray-200 dark:bg-gray-600"></div>
          <span class="text-gray-600 dark:text-gray-400">{{ domain }}</span>
          <span class="mx-1 text-gray-400">›</span>
          <span class="text-gray-600 dark:text-gray-400 truncate">{{ breadcrumb }}</span>
        </div>

        <!-- Title -->
        <h3
          class="text-xl text-blue-600 dark:text-blue-400 hover:underline cursor-pointer leading-tight"
          :class="{ 'text-red-600 dark:text-red-400': titleTooLong }"
        >
          {{ truncatedTitle }}
        </h3>

        <!-- Meta description -->
        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {{ truncatedDescription }}
        </p>
      </div>

      <!-- Character counts -->
      <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div class="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span class="text-gray-500 dark:text-gray-400">Title:</span>
            <span
              :class="[
                'ml-1 font-medium',
                titleLength >= 30 && titleLength <= 60
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-orange-600 dark:text-orange-400'
              ]"
            >
              {{ titleLength }}/60 chars
            </span>
            <span v-if="titleTooLong" class="text-red-500 ml-1">(truncated)</span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Description:</span>
            <span
              :class="[
                'ml-1 font-medium',
                descriptionLength >= 120 && descriptionLength <= 160
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-orange-600 dark:text-orange-400'
              ]"
            >
              {{ descriptionLength }}/160 chars
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Issues -->
    <div v-if="issues.length > 0" class="mt-3">
      <ul class="text-xs space-y-1">
        <li
          v-for="issue in issues"
          :key="issue"
          class="flex items-center text-orange-600 dark:text-orange-400"
        >
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          {{ issue }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  url: string
  title: string
  description: string
}>()

const domain = computed(() => {
  try {
    return new URL(props.url).hostname.replace('www.', '')
  } catch {
    return props.url
  }
})

const breadcrumb = computed(() => {
  try {
    const path = new URL(props.url).pathname
    return path === '/' ? '' : path.substring(1).replace(/\//g, ' › ')
  } catch {
    return ''
  }
})

const favicon = computed(() => {
  try {
    const host = new URL(props.url).origin
    return `https://www.google.com/s2/favicons?domain=${host}&sz=32`
  } catch {
    return null
  }
})

const titleLength = computed(() => props.title?.length || 0)
const descriptionLength = computed(() => props.description?.length || 0)

const titleTooLong = computed(() => titleLength.value > 60)

const truncatedTitle = computed(() => {
  if (!props.title) return 'No title'
  if (props.title.length <= 60) return props.title
  return props.title.substring(0, 57) + '...'
})

const truncatedDescription = computed(() => {
  if (!props.description) return 'No meta description provided'
  if (props.description.length <= 160) return props.description
  return props.description.substring(0, 157) + '...'
})

const issues = computed(() => {
  const list: string[] = []

  if (!props.title) {
    list.push('Missing title tag')
  } else if (titleLength.value < 30) {
    list.push('Title is too short (< 30 chars)')
  } else if (titleLength.value > 60) {
    list.push('Title is too long (> 60 chars)')
  }

  if (!props.description) {
    list.push('Missing meta description')
  } else if (descriptionLength.value < 120) {
    list.push('Description is too short (< 120 chars)')
  } else if (descriptionLength.value > 160) {
    list.push('Description is too long (> 160 chars)')
  }

  return list
})
</script>

<style scoped>
.serp-preview {
  font-family: Arial, sans-serif;
}
</style>
