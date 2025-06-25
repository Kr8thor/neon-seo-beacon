<template>
  <div :class="containerClass">
    <div :class="spinnerClass"></div>
    <p v-if="message" :class="messageClass">{{ message }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  message: {
    type: String,
    default: ''
  },
  center: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'white', 'gray'].includes(value)
  }
})

const containerClass = computed(() => {
  const classes = []
  
  if (props.center) {
    classes.push('flex flex-col items-center justify-center')
  }
  
  if (props.message) {
    classes.push('space-y-2')
  }
  
  return classes.join(' ')
})

const spinnerClass = computed(() => {
  const classes = ['animate-spin rounded-full border-2']
  
  // Size classes
  switch (props.size) {
    case 'sm':
      classes.push('w-4 h-4')
      break
    case 'md':
      classes.push('w-6 h-6')
      break
    case 'lg':
      classes.push('w-8 h-8')
      break
    case 'xl':
      classes.push('w-12 h-12')
      break
  }
  
  // Color classes
  switch (props.color) {
    case 'blue':
      classes.push('border-gray-300 border-t-blue-600')
      break
    case 'white':
      classes.push('border-gray-400 border-t-white')
      break
    case 'gray':
      classes.push('border-gray-300 border-t-gray-600')
      break
  }
  
  return classes.join(' ')
})

const messageClass = computed(() => {
  const classes = ['text-center']
  
  // Size-based text classes
  switch (props.size) {
    case 'sm':
      classes.push('text-xs')
      break
    case 'md':
      classes.push('text-sm')
      break
    case 'lg':
      classes.push('text-base')
      break
    case 'xl':
      classes.push('text-lg')
      break
  }
  
  // Color classes for text
  switch (props.color) {
    case 'blue':
      classes.push('text-gray-600')
      break
    case 'white':
      classes.push('text-white')
      break
    case 'gray':
      classes.push('text-gray-600')
      break
  }
  
  return classes.join(' ')
})
</script>