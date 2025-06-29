<template>
  <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="text-xl text-blue-100 max-w-2xl mx-auto">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>
