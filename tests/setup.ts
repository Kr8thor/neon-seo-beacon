import { vi } from 'vitest'

// Mock Nuxt composables
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $supabase: {
      from: vi.fn(),
      auth: {
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
      }
    }
  }),
  navigateTo: vi.fn(),
  useRuntimeConfig: () => ({
    public: {
      supabaseUrl: 'test-url',
      supabaseAnonKey: 'test-key'
    }
  })
}))

// Mock GSAP globally
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
    to: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn(),
      from: vi.fn(),
      play: vi.fn(),
      pause: vi.fn()
    }))
  },
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
    getAll: vi.fn(() => []),
    killAll: vi.fn()
  }
}))

// Mock Chart.js globally
vi.mock('chart.js/auto', () => ({
  Chart: vi.fn(() => ({
    destroy: vi.fn(),
    update: vi.fn(),
    resize: vi.fn(),
    data: { datasets: [] }
  }))
}))

// Mock Lottie-web globally
vi.mock('lottie-web', () => ({
  loadAnimation: vi.fn(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    destroy: vi.fn()
  })),
  setSpeed: vi.fn(),
  setDirection: vi.fn()
}))

// Mock Canvas API for browser-only libraries
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ({
    fillStyle: '',
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Array(4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: new Array(4) })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn()
  }))
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn()
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn()
}))

// Environment variables
process.env.NUXT_SUPABASE_URL = 'test-url'
process.env.NUXT_SUPABASE_ANON_KEY = 'test-key'
