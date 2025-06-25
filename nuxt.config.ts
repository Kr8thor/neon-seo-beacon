export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  
  // App configuration
  app: {
    head: {
      title: 'Neon SEO Beacon - Enterprise SEO Audit Tool',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Professional SEO audit tool for agencies and businesses. Comprehensive website analysis, technical SEO insights, and AI-powered recommendations.' 
        },
        { name: 'keywords', content: 'SEO audit, website analysis, technical SEO, SEO tools, search engine optimization' },
        { name: 'author', content: 'Neon SEO Beacon' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Neon SEO Beacon' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@neonseobeacon' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://neonseobeacon.com' }
      ]
    }
  },

  // CSS Configuration
  css: [
    '~/assets/css/main.css'
  ],

  // Content configuration
  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      },
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'bash', 'sql', 'python']
    },
    markdown: {
      toc: { 
        depth: 3, 
        searchDepth: 3 
      },
      remarkPlugins: [],
      rehypePlugins: []
    },
    documentDriven: false
  },

  // Supabase configuration
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/register', '/forgot-password']
    }
  },

  // Runtime configuration
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    redisUrl: process.env.REDIS_URL,
    jwtSecret: process.env.JWT_SECRET,
    googlePagespeedApiKey: process.env.GOOGLE_PAGESPEED_API_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      apiUrl: process.env.API_URL || 'http://localhost:3000',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000'
    }
  },

  // Development configuration
  devtools: { enabled: true },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },

  // SEO configuration
  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/robots.txt']
    }
  },

  // Build configuration
  build: {
    transpile: ['@anthropic-ai/sdk']
  },

  // Experimental features
  experimental: {
    payloadExtraction: false
  }
})