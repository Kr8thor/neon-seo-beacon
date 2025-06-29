// Global type extensions for Neon SEO Beacon

declare global {
  namespace globalThis {
    var publicRateLimitStore: Map<string, { count: number; resetTime: number }> | undefined
  }
  
  interface RateLimitRecord {
    count: number
    resetTime: number
  }

  // Google Analytics gtag function
  function gtag(...args: any[]): void

  // Nuxt global functions
  function defineNuxtConfig(config: any): any
}

export {}
