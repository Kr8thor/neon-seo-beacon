// ESLint configuration for Nuxt 3 + TypeScript project
import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default [
  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      '.nuxt/**',
      '.output/**',
      'dist/**',
      'coverage/**',
      '*.min.js',
      'public/**',
      '.git/**',
      'test-results/**',
      'playwright-report/**',
      '**/*.d.ts',
      'supabase/functions/**'
    ]
  },
  
  // Base JavaScript configuration
  js.configs.recommended,
  
  // TypeScript files configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true
      },
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        NodeJS: 'readonly',
        
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        performance: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        
        // Nuxt auto-imports
        defineNuxtConfig: 'readonly',
        defineNuxtPlugin: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        defineEventHandler: 'readonly',
        useRuntimeConfig: 'readonly',
        useSupabaseUser: 'readonly',
        useSupabaseClient: 'readonly',
        useRoute: 'readonly',
        useHead: 'readonly',
        useNuxtApp: 'readonly',
        navigateTo: 'readonly',
        createError: 'readonly',
        readBody: 'readonly',
        getQuery: 'readonly',
        getRouterParam: 'readonly',
        getHeader: 'readonly',
        getCookie: 'readonly',
        setCookie: 'readonly',
        setHeader: 'readonly',
        setResponseStatus: 'readonly',
        getMethod: 'readonly',
        getRequestURL: 'readonly',
        getURL: 'readonly',
        watch: 'readonly',
        
        // Testing globals
        axe: 'readonly',
        gtag: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      // Basic rules
      'no-console': 'off',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Turn off base rule
      'no-undef': 'error',
      'no-useless-escape': 'error',
      
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-this-alias': 'warn'
    }
  },
  
  // Vue files with TypeScript
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      },
      globals: {
        // Vue template globals
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        process: 'readonly',
        
        // Nuxt auto-imports in Vue
        defineNuxtConfig: 'readonly',
        defineNuxtPlugin: 'readonly',
        defineEventHandler: 'readonly',
        useRuntimeConfig: 'readonly',
        useRoute: 'readonly',
        useHead: 'readonly',
        useNuxtApp: 'readonly',
        navigateTo: 'readonly',
        useSupabaseUser: 'readonly',
        useSupabaseClient: 'readonly',
        createError: 'readonly',
        
        // Vue 3 specific
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'off', // Vue templates have special scoping
      'no-unused-vars': 'off'
    }
  },
  
  // JavaScript files configuration
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        
        // Nuxt auto-imports
        defineNuxtConfig: 'readonly',
        defineNuxtPlugin: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        useRuntimeConfig: 'readonly',
        useSupabaseUser: 'readonly',
        useSupabaseClient: 'readonly',
        useRoute: 'readonly',
        useHead: 'readonly',
        navigateTo: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      'no-debugger': 'error',
      'no-unused-vars': 'warn',
      'no-undef': 'error'
    }
  },
  
  // Config files - more lenient
  {
    files: [
      '*.config.{js,ts,mjs}',
      '**/config/*.{js,ts}',
      'lighthouserc.js',
      'tailwind.config.{js,ts}'
    ],
    languageOptions: {
      globals: {
        module: 'writable',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly'
      }
    },
    rules: {
      'no-undef': 'error',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },
  
  // Test and script files - more lenient rules
  {
    files: [
      'test*/**/*.{js,ts}', 
      'tests/**/*.{js,ts}', 
      'scripts/**/*.{js,ts}',
      '**/*.test.{js,ts}',
      '**/*.spec.{js,ts}'
    ],
    languageOptions: {
      globals: {
        // Testing globals
        console: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        performance: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        global: 'writable',
        __dirname: 'readonly',
        require: 'readonly',
        axe: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-useless-escape': 'off'
    }
  }
]
