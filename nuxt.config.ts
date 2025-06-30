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
      title: "Marden SEO Audit - Professional SEO Analysis Tool",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Marden SEO Audit provides comprehensive website analysis, technical SEO insights, and AI-powered recommendations for businesses and agencies.",
        },
        {
          name: "keywords",
          content:
            "SEO audit, website analysis, technical SEO, SEO tools, search engine optimization, Marden SEO",
        },
        { name: "author", content: "Marden SEO Audit" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Marden SEO Audit" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@mardenseo" },
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
      preload: [
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

  // Supabase configuration
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
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
  },

  // Runtime configuration
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    redisUrl: process.env.REDIS_URL,
    jwtSecret: process.env.JWT_SECRET,
    googlePagespeedApiKey: process.env.GOOGLE_PAGESPEED_API_KEY,

    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      apiUrl:
        process.env.NUXT_PUBLIC_API_URL ||
        (process.env.NODE_ENV === "production"
          ? "https://audit.mardenseo.com"
          : "http://localhost:3002"),
      siteUrl:
        process.env.NUXT_PUBLIC_SITE_URL ||
        (process.env.NODE_ENV === "production"
          ? "https://audit.mardenseo.com"
          : "http://localhost:3002"),
    },
  },

  // Development configuration
  devtools: { enabled: true },

  // TypeScript configuration - Relaxed for faster development
  typescript: {
    strict: false,
    typeCheck: false,
  },

  // SEO and Security configuration
  nitro: {
    preset: 'node-server',
    output: {
      dir: '.output',
      serverDir: '.output/server',
      publicDir: '.output/public'
    },
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
      // CSP for production
      ...(process.env.NODE_ENV === "production" && {
        "/**": {
          headers: {
            "Content-Security-Policy":
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none';",
          },
        },
      }),
    },
  },

  // Build configuration
  build: {
    transpile: ["@anthropic-ai/sdk", "@vueuse/nuxt"],
    analyze: false,
  },

  // Vite optimization
  vite: {
    build: {
      chunkSizeWarningLimit: 1500,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Create more efficient chunks
            if (id.includes('node_modules')) {
              if (id.includes('chart.js') || id.includes('vue-chartjs')) {
                return 'vendor-charts';
              }
              if (id.includes('gsap') || id.includes('lottie-web')) {
                return 'vendor-animations';
              }
              if (id.includes('axios') || id.includes('cheerio') || id.includes('xml2js')) {
                return 'vendor-utils';
              }
              if (id.includes('@heroicons/vue')) {
                return 'vendor-ui';
              }
              if (id.includes('vue') || id.includes('@vue')) {
                return 'vendor-vue';
              }
              return 'vendor';
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: ["chart.js", "vue-chartjs", "gsap"],
      exclude: ["@vueuse/nuxt"],
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    },
  },

  // Experimental features
  experimental: {
    payloadExtraction: false,
  },

  // Performance optimizations
  ssr: true,

  // Reduce bundle size
  features: {
    devLogs: false,
  },
});
