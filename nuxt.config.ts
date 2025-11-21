export default defineNuxtConfig({
  modules: [
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "@vueuse/nuxt",
  ],

  // App configuration
  app: {
    head: {
      title: "Neon SEO Beacon - Professional SEO Analysis Tool",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Neon SEO Beacon provides comprehensive website analysis, technical SEO insights, and AI-powered recommendations for businesses and agencies.",
        },
        {
          name: "keywords",
          content:
            "SEO audit, website analysis, technical SEO, SEO tools, search engine optimization, Neon SEO Beacon",
        },
        { name: "author", content: "Neon SEO Beacon" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Neon SEO Beacon" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@neonseobeacon" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "canonical", href: "https://audit.mardenseo.com" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap",
        },
      ],
    },
  },

  // CSS Configuration
  css: [
    "~/assets/css/main.css",
    "~/assets/css/glassmorphism.css",
    "~/assets/css/animations.css",
  ],

  // Content configuration
  content: {
    highlight: {
      theme: {
        default: "github-light",
        dark: "github-dark",
      },
      preload: process.env.NODE_ENV === 'production' ? [] : [
        "json",
        "js",
        "ts",
        "html",
        "css",
        "vue",
        "bash",
        "sql",
        "python",
      ],
    },
    markdown: {
      toc: {
        depth: 3,
        searchDepth: 3,
      },
      remarkPlugins: [],
      rehypePlugins: [],
    },
    documentDriven: true,
  },

  // Supabase configuration - Fixed for Railway
  supabase: {
    // Ensure environment variables are properly read during build
    url: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://cehtwnfdqjehmztnnbch.supabase.co',
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlaHR3bmZkcWplaG16dG5uYmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NjM2MDgsImV4cCI6MjA2NTUzOTYwOH0.2Y2h_VpTnVlPVwbMzQaz2-f0Hgtrd_fWp5i1Z6-KkVk',
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/callback",
      exclude: [
        "/", // Homepage
        "/pricing", // Pricing page
        "/demo", // Demo page
        "/register", // Registration page
        "/auth/register", // Alt registration path
        "/forgot-password", // Password reset
        "/auth/forgot-password", // Alt password reset path
        "/terms", // Terms of service
        "/privacy", // Privacy policy
        "/seo-tips", // SEO tips section
        "/seo-tips/**", // All SEO tips pages
        "/docs", // Documentation
        "/docs/**", // All documentation pages
        "/help", // Help center
        "/help/**", // All help pages
        "/api/**", // API endpoints
      ],
    },
    // Railway-specific client options
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true
      }
    }
  },

  // Runtime configuration - Fixed for Railway
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseUrl: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || 'https://cehtwnfdqjehmztnnbch.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    redisUrl: process.env.REDIS_URL,
    jwtSecret: process.env.JWT_SECRET,
    csrfSecret: process.env.CSRF_SECRET,
    googlePagespeedApiKey: process.env.GOOGLE_PAGESPEED_API_KEY,
    publicUserId: process.env.PUBLIC_USER_ID, // UUID for anonymous/public audit submissions

    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://cehtwnfdqjehmztnnbch.supabase.co',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'https://audit.mardenseo.com',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://audit.mardenseo.com',
      appName: 'Neon SEO Beacon',
    },
  },

  // Development configuration
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  // TypeScript configuration - Relaxed for faster Railway builds
  typescript: {
    strict: false,
    typeCheck: false,
  },

  // Nitro configuration optimized for Railway
  nitro: {
    preset: 'node-server',
    output: {
      dir: '.output',
      serverDir: '.output/server',
      publicDir: '.output/public'
    },
    // Railway-specific optimizations
    experimental: {
      wasm: false
    },
    minify: true,
    sourceMap: false,
    timing: process.env.NODE_ENV === 'production',
    
    prerender: {
      routes: ["/sitemap.xml", "/robots.txt"],
    },
    routeRules: {
      // Add security headers to all routes
      "/**": {
        headers: {
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        },
      },
      // API routes optimization
      "/api/**": {
        cors: true,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      }
    },
  },

  // Build configuration optimized for Railway
  build: {
    transpile: ["@anthropic-ai/sdk", "@vueuse/nuxt"],
    analyze: false,
  },

  // Vite optimization for Railway
  vite: {
    build: {
      chunkSizeWarningLimit: 2000, // Increase threshold
      sourcemap: false, // Disable sourcemaps for production
      rollupOptions: {
        output: {
          // Optimize chunking for Railway
          manualChunks: undefined // Let Vite handle chunking automatically
        },
      },
    },
    optimizeDeps: {
      include: ["chart.js", "vue-chartjs"],
      exclude: ["@vueuse/nuxt", "fsevents"],
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    },
    // Railway server configuration
    server: {
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0'
    }
  },

  // Experimental features - Disabled for stability
  experimental: {
    payloadExtraction: false,
    writeEarlyHints: false,
  },

  // Performance optimizations for Railway
  ssr: true,
  features: {
    devLogs: false,
  },

  // Disable telemetry for production builds
  telemetry: false,

  // Server configuration for Railway
  devServer: {
    port: Number(process.env.PORT) || 3000,
    host: '0.0.0.0'
  }
});