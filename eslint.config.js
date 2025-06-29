// Simple ESLint config for Nuxt project
export default [
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
      '**/*.d.ts'
    ]
  },
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly'
      }
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error'
    }
  }
]
