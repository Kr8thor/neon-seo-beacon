import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: {
      commaDangle: 'never',
      braceStyle: '1tbs'
    }
  },
  dirs: {
    src: [
      './components',
      './composables', 
      './layouts',
      './middleware',
      './pages',
      './plugins',
      './server',
      './utils'
    ]
  }
}).append(
  {
    ignores: [
      'dist/**',
      '.nuxt/**',
      '.output/**',
      'node_modules/**',
      '*.d.ts'
    ]
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off'
    }
  }
)