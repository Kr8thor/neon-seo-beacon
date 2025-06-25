<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Global SEO setup
const { generateOrganizationSchema, generateWebsiteSchema } = useSEO()

// Set global meta tags
useHead({
  htmlAttrs: {
    lang: 'en',
    dir: 'ltr'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'theme-color', content: '#2563eb' },
    { name: 'msapplication-TileColor', content: '#2563eb' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(generateOrganizationSchema())
    },
    {
      type: 'application/ld+json', 
      innerHTML: JSON.stringify(generateWebsiteSchema())
    }
  ]
})

// Global loading state
const nuxtApp = useNuxtApp()
const isLoading = ref(false)

nuxtApp.hook('page:start', () => {
  isLoading.value = true
})

nuxtApp.hook('page:finish', () => {
  isLoading.value = false
})

// Provide global loading state
provide('isLoading', isLoading)
</script>