<template>
  <div 
    ref="containerRef"
    class="loading-container relative flex items-center justify-center"
    :class="containerClass"
  >
    <!-- Background Effects -->
    <div v-if="showBackground" class="absolute inset-0 glass rounded-2xl"></div>
    
    <!-- Lottie Animation -->
    <div 
      v-if="type === 'lottie' && animationData"
      ref="lottieContainer"
      class="lottie-animation"
    ></div>
    
    <!-- SVG Animations -->
    <div v-else-if="type === 'svg'" class="svg-loader">
      <!-- Orbital Loader -->
      <div v-if="variant === 'orbital'" class="relative w-16 h-16">
        <svg class="w-full h-full animate-spin" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
            stroke-dasharray="40 120"
            class="text-blue-500"
          />
          <circle
            cx="32"
            cy="32"
            r="20"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-dasharray="30 90"
            class="text-purple-500 animate-spin"
            style="animation-direction: reverse; animation-duration: 1.5s;"
          />
          <circle
            cx="32"
            cy="32"
            r="12"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-dasharray="20 60"
            class="text-pink-500"
          />
        </svg>
      </div>
      
      <!-- Pulse Loader -->
      <div v-else-if="variant === 'pulse'" class="flex space-x-2">
        <div
          v-for="i in 3"
          :key="i"
          class="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
          :style="{ animationDelay: `${(i - 1) * 0.2}s` }"
        ></div>
      </div>
      
      <!-- Wave Loader -->
      <div v-else-if="variant === 'wave'" class="flex items-end space-x-1 h-8">
        <div
          v-for="i in 5"
          :key="i"
          class="w-2 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full animate-bounce"
          :style="{ 
            height: `${20 + (i % 2) * 10}px`,
            animationDelay: `${(i - 1) * 0.1}s`,
            animationDuration: '0.6s'
          }"
        ></div>
      </div>
      
      <!-- DNA Helix -->
      <div v-else-if="variant === 'dna'" class="relative w-12 h-12">
        <svg class="w-full h-full" viewBox="0 0 48 48">
          <g class="animate-spin" style="transform-origin: 24px 24px;">
            <path
              d="M12 12 Q24 6 36 12 Q24 18 12 12"
              fill="none"
              stroke="url(#gradient1)"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M12 36 Q24 30 36 36 Q24 42 12 36"
              fill="none"
              stroke="url(#gradient2)"
              stroke-width="2"
              stroke-linecap="round"
            />
            <line x1="24" y1="12" x2="24" y2="36" stroke="url(#gradient3)" stroke-width="1"/>
          </g>
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#3b82f6"/>
              <stop offset="100%" style="stop-color:#8b5cf6"/>
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#8b5cf6"/>
              <stop offset="100%" style="stop-color:#ec4899"/>
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#3b82f6"/>
              <stop offset="50%" style="stop-color:#8b5cf6"/>
              <stop offset="100%" style="stop-color:#ec4899"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <!-- Morphing Shapes -->
      <div v-else-if="variant === 'morph'" class="w-16 h-16">
        <div class="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-morphing"></div>
      </div>
    </div>
    
    <!-- CSS Animations -->
    <div v-else-if="type === 'css'" class="css-loader">
      <!-- Spinner -->
      <div v-if="variant === 'spinner'" class="loading-spinner"></div>
      
      <!-- Dots -->
      <div v-else-if="variant === 'dots'" class="loading-dots">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      
      <!-- Progress Bar -->
      <div v-else-if="variant === 'progress'" class="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
      </div>
    </div>
    
    <!-- Text -->
    <div v-if="text" class="mt-4 text-center">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ text }}</p>
      <p v-if="subtext" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ subtext }}</p>
    </div>
    
    <!-- Progress Percentage -->
    <div v-if="showProgress && progress !== undefined" class="absolute bottom-2 right-2">
      <div class="flex items-center space-x-2 text-xs font-medium text-gray-600 dark:text-gray-400">
        <span>{{ Math.round(progress) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import lottie from 'lottie-web'

interface Props {
  type?: 'lottie' | 'svg' | 'css'
  variant?: 'orbital' | 'pulse' | 'wave' | 'dna' | 'morph' | 'spinner' | 'dots' | 'progress'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  subtext?: string
  showBackground?: boolean
  showProgress?: boolean
  progress?: number
  animationData?: any
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'svg',
  variant: 'orbital',
  size: 'md',
  showBackground: true,
  showProgress: false
})

const containerRef = ref<HTMLElement>()
const lottieContainer = ref<HTMLElement>()
const lottieAnimation = ref<any>()

// Size classes
const sizeClasses = {
  sm: 'w-16 h-16 p-4',
  md: 'w-24 h-24 p-6',
  lg: 'w-32 h-32 p-8',
  xl: 'w-48 h-48 p-12'
}

const containerClass = computed(() => {
  return [
    sizeClasses[props.size],
    props.containerClass
  ].filter(Boolean).join(' ')
})

// Initialize Lottie animation
const initLottie = () => {
  if (props.type === 'lottie' && props.animationData && lottieContainer.value) {
    lottieAnimation.value = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: props.animationData
    })
  }
}

// Cleanup Lottie animation
const destroyLottie = () => {
  if (lottieAnimation.value) {
    lottieAnimation.value.destroy()
    lottieAnimation.value = null
  }
}

watch(() => props.animationData, () => {
  destroyLottie()
  nextTick(() => initLottie())
})

onMounted(() => {
  if (props.type === 'lottie') {
    initLottie()
  }
})

onUnmounted(() => {
  destroyLottie()
})

defineExpose({
  containerRef,
  lottieAnimation
})
</script>

<style scoped>
.loading-container {
  transition: all 0.3s ease;
}

.lottie-animation {
  width: 100%;
  height: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-left: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-dots {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.loading-dots div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #3b82f6;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.loading-dots div:nth-child(1) {
  left: 8px;
  animation: loading-dots1 0.6s infinite;
}

.loading-dots div:nth-child(2) {
  left: 8px;
  animation: loading-dots2 0.6s infinite;
}

.loading-dots div:nth-child(3) {
  left: 32px;
  animation: loading-dots2 0.6s infinite;
}

.loading-dots div:nth-child(4) {
  left: 56px;
  animation: loading-dots3 0.6s infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes loading-dots1 {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

@keyframes loading-dots3 {
  0% { transform: scale(1); }
  100% { transform: scale(0); }
}

@keyframes loading-dots2 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(24px, 0); }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner,
  .loading-dots div,
  .animate-spin,
  .animate-pulse,
  .animate-bounce,
  .animate-morphing {
    animation: none !important;
  }
}
</style>
