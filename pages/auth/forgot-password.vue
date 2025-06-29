<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
          <KeyIcon class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 sm:text-sm"
            placeholder="Email address"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="mr-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </span>
            {{ loading ? 'Sending...' : 'Send reset email' }}
          </button>
        </div>

        <div class="text-center">
          <NuxtLink
            to="/auth/login"
            class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 text-sm font-medium"
          >
            Back to login
          </NuxtLink>
        </div>
      </form>

      <!-- Success message -->
      <div v-if="message" class="mt-4 p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg">
        <p class="text-sm text-green-600 dark:text-green-400">{{ message }}</p>
      </div>

      <!-- Error message -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KeyIcon } from '@heroicons/vue/24/outline'

// SEO
useSeoMeta({
  title: 'Reset Password - Neon SEO Beacon',
  description: 'Reset your password for Neon SEO Beacon'
})

// Form state
const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

// Use the proper Supabase composable
const supabase = useSupabaseClient()

const handleSubmit = async () => {
  if (!email.value) {
    error.value = 'Please enter your email address'
    return
  }

  loading.value = true
  error.value = ''
  message.value = ''

  try {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (resetError) throw resetError

    message.value = 'Check your email for a password reset link'
    email.value = ''
  } catch (err: any) {
    error.value = err.message || 'An error occurred while sending the reset email'
  } finally {
    loading.value = false
  }
}
</script>
