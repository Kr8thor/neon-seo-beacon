<template>
  <div
    v-if="isVisible"
    ref="cursorRef"
    class="custom-cursor fixed pointer-events-none z-50 mix-blend-difference"
    :class="cursorClasses"
    :style="cursorStyles"
  >
    <!-- Cursor Dot -->
    <div class="cursor-dot absolute inset-0 rounded-full transition-all duration-150" :class="dotClasses"></div>
    
    <!-- Cursor Ring -->
    <div 
      v-if="showRing"
      class="cursor-ring absolute inset-0 rounded-full border-2 transition-all duration-300"
      :class="ringClasses"
    ></div>
    
    <!-- Cursor Text -->
    <div 
      v-if="cursorText"
      class="cursor-text absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap"
    >
      {{ cursorText }}
    </div>
    
    <!-- Trailing Particles -->
    <div v-if="showTrail" class="cursor-trail absolute inset-0">
      <div
        v-for="particle in trailParticles"
        :key="particle.id"
        class="trail-particle absolute w-1 h-1 bg-blue-500 rounded-full opacity-50"
        :style="{
          left: particle.x + 'px',
          top: particle.y + 'px',
          transform: `scale(${particle.scale})`,
          opacity: particle.opacity
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

interface TrailParticle {
  id: number
  x: number
  y: number
  scale: number
  opacity: number
}

interface Props {
  disabled?: boolean
  showRing?: boolean
  showTrail?: boolean
  magneticStrength?: number
  blendMode?: 'normal' | 'difference' | 'multiply' | 'screen'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  showRing: true,
  showTrail: false,
  magneticStrength: 0.15,
  blendMode: 'difference'
})

// Reactive state
const cursorRef = ref<HTMLElement>()
const isVisible = ref(false)
const isHovering = ref(false)
const isClicking = ref(false)
const cursorText = ref('')
const currentElement = ref<HTMLElement>()

// Position tracking
const position = reactive({
  x: 0,
  y: 0
})

const targetPosition = reactive({
  x: 0,
  y: 0
})

// Trail particles
const trailParticles = ref<TrailParticle[]>([])
let particleId = 0

// Cursor state
const cursorState = ref<'normal' | 'hover' | 'click' | 'text' | 'pointer' | 'grab'>('normal')

// Computed styles
const cursorClasses = computed(() => [
  'will-change-transform',
  {
    'mix-blend-normal': props.blendMode === 'normal',
    'mix-blend-difference': props.blendMode === 'difference',
    'mix-blend-multiply': props.blendMode === 'multiply',
    'mix-blend-screen': props.blendMode === 'screen',
  }
])

const cursorStyles = computed(() => ({
  transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) scale(${getScale()})`,
  width: getSize() + 'px',
  height: getSize() + 'px'
}))

const dotClasses = computed(() => {
  const base = 'bg-current transition-all duration-150'
  
  switch (cursorState.value) {
    case 'hover':
      return `${base} bg-blue-500`
    case 'click':
      return `${base} bg-purple-500 scale-75`
    case 'text':
      return `${base} bg-green-500`
    case 'pointer':
      return `${base} bg-yellow-500`
    case 'grab':
      return `${base} bg-red-500`
    default:
      return `${base} bg-gray-800 dark:bg-gray-200`
  }
})

const ringClasses = computed(() => {
  const base = 'border-current transition-all duration-300'
  
  switch (cursorState.value) {
    case 'hover':
      return `${base} border-blue-500 scale-150`
    case 'click':
      return `${base} border-purple-500 scale-75`
    case 'text':
      return `${base} border-green-500 scale-125`
    default:
      return `${base} border-gray-400 dark:border-gray-600`
  }
})

// Helper functions
const getSize = () => {
  switch (cursorState.value) {
    case 'hover':
      return 32
    case 'click':
      return 16
    case 'text':
      return 24
    case 'pointer':
      return 20
    case 'grab':
      return 28
    default:
      return 20
  }
}

const getScale = () => {
  if (isClicking.value) return 0.8
  if (isHovering.value) return 1.2
  return 1
}

// Event handlers
const handleMouseMove = (e: MouseEvent) => {
  // Use pageX/pageY for accurate positioning that accounts for scroll
  const { pageX, pageY } = e
  
  targetPosition.x = pageX
  targetPosition.y = pageY
  
  // Magnetic effect for interactive elements
  if (currentElement.value && isHovering.value) {
    const rect = currentElement.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2 + window.scrollX
    const centerY = rect.top + rect.height / 2 + window.scrollY
    
    const deltaX = (centerX - pageX) * props.magneticStrength
    const deltaY = (centerY - pageY) * props.magneticStrength
    
    targetPosition.x = pageX + deltaX
    targetPosition.y = pageY + deltaY
  }
  
  // Add trail particle
  if (props.showTrail) {
    addTrailParticle(pageX, pageY)
  }
}

const handleMouseEnter = (e: Event) => {
  const target = e.target as HTMLElement
  const cursorType = target.dataset.cursor || 'hover'
  
  isHovering.value = true
  currentElement.value = target
  cursorState.value = cursorType as any
  cursorText.value = target.dataset.cursorText || ''
  
  // Add custom class to element
  target.classList.add('cursor-active')
}

const handleMouseLeave = (e: Event) => {
  const target = e.target as HTMLElement
  
  isHovering.value = false
  currentElement.value = undefined
  cursorState.value = 'normal'
  cursorText.value = ''
  
  // Remove custom class from element
  target.classList.remove('cursor-active')
}

const handleMouseDown = () => {
  isClicking.value = true
  cursorState.value = 'click'
}

const handleMouseUp = () => {
  isClicking.value = false
  if (isHovering.value) {
    cursorState.value = 'hover'
  } else {
    cursorState.value = 'normal'
  }
}

const handleMouseEnterDocument = () => {
  isVisible.value = true
}

const handleMouseLeaveDocument = () => {
  isVisible.value = false
}

// Trail particle system
const addTrailParticle = (x: number, y: number) => {
  const particle: TrailParticle = {
    id: particleId++,
    x: x - position.x,
    y: y - position.y,
    scale: Math.random() * 0.5 + 0.5,
    opacity: 1
  }
  
  trailParticles.value.push(particle)
  
  // Animate particle
  setTimeout(() => {
    const index = trailParticles.value.findIndex(p => p.id === particle.id)
    if (index > -1 && trailParticles.value[index]) {
      trailParticles.value[index].opacity = 0
      trailParticles.value[index].scale = 0
      
      // Remove after animation
      setTimeout(() => {
        const finalIndex = trailParticles.value.findIndex(p => p.id === particle.id)
        if (finalIndex > -1) {
          trailParticles.value.splice(finalIndex, 1)
        }
      }, 300)
    }
  }, 100)
}

// Animation loop
const animate = () => {
  // Smooth easing for natural cursor movement
  const ease = 0.15
  const deltaX = targetPosition.x - position.x
  const deltaY = targetPosition.y - position.y
  
  position.x += deltaX * ease
  position.y += deltaY * ease
  
  requestAnimationFrame(animate)
}

// Initialize cursor
const initCursor = () => {
  if (props.disabled || typeof window === 'undefined') return
  
  // Check if device supports hover
  if (!window.matchMedia('(hover: hover)').matches) return
  
  // Hide default cursor
  document.body.style.cursor = 'none'
  
  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove, { passive: true })
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('mouseenter', handleMouseEnterDocument)
  document.addEventListener('mouseleave', handleMouseLeaveDocument)
  
  // Add listeners to interactive elements
  const interactiveElements = document.querySelectorAll('a, button, [role="button"], .cursor-pointer, .hover-cursor')
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
  })
  
  // Start animation loop
  animate()
  
  return () => {
    // Cleanup
    document.body.style.cursor = ''
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('mouseenter', handleMouseEnterDocument)
    document.removeEventListener('mouseleave', handleMouseLeaveDocument)
    
    interactiveElements.forEach(element => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    })
  }
}

// Lifecycle
onMounted(() => {
  nextTick(() => {
    const cleanup = initCursor()
    
    onUnmounted(() => {
      if (cleanup) cleanup()
    })
  })
})

// Public API
const setCursorState = (state: string) => {
  cursorState.value = state as any
}

const setCursorText = (text: string) => {
  cursorText.value = text
}

defineExpose({
  setCursorState,
  setCursorText,
  cursorState,
  position
})
</script>

<style scoped>
.custom-cursor {
  will-change: transform;
}

.trail-particle {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

/* Ensure cursor doesn't interfere with text selection */
.custom-cursor * {
  pointer-events: none;
}

/* Hide on mobile devices */
@media (hover: none) and (pointer: coarse) {
  .custom-cursor {
    display: none !important;
  }
}

/* Accessibility: Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .custom-cursor,
  .cursor-dot,
  .cursor-ring,
  .trail-particle {
    transition: none !important;
    animation: none !important;
  }
}
</style>
