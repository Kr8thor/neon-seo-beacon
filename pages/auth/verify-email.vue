<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <NuxtLink to="/" class="inline-flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold">N</span>
          </div>
          <span class="font-bold text-xl text-gray-900">Neon SEO Beacon</span>
        </NuxtLink>
        
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <EnvelopeIcon class="w-8 h-8 text-blue-600" />
        </div>
        
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p class="text-gray-600">
          We've sent a verification link to your email address. 
          Please click the link to activate your account.
        </p>
      </div>

      <!-- Instructions -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="font-semibold text-gray-900 mb-3">What's next?</h3>
        <ol class="space-y-3 text-sm text-gray-600">
          <li class="flex items-start">
            <span class="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">1</span>
            Check your email inbox (and spam folder)
          </li>
          <li class="flex items-start">
            <span class="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">2</span>
            Click the verification link in the email
          </li>
          <li class="flex items-start">
            <span class="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">3</span>
            Start your first SEO audit
          </li>
        </ol>
      </div>

      <!-- Resend Email -->
      <div class="text-center">
        <p class="text-sm text-gray-600 mb-4">
          Didn't receive the email?
        </p>
        <button 
          @click="resendEmail"
          :disabled="resending || cooldown > 0"
          class="btn btn-outline"
        >
          {{ resending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email' }}
        </button>
      </div>

      <!-- Alternative Actions -->
      <div class="text-center space-y-2">
        <div>
          <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-500 text-sm font-medium">
            Already verified? Sign in
          </NuxtLink>
        </div>
        <div>
          <NuxtLink to="/help/contact" class="text-gray-500 hover:text-gray-700 text-sm">
            Need help? Contact support
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { EnvelopeIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: false
})

const supabase = useSupabaseClient()
const notificationStore = useNotificationStore()
const route = useRoute()

const resending = ref(false)
const cooldown = ref(0)

async function resendEmail() {
  const email = route.query.email
  if (!email) {
    notificationStore.error('Email address not found. Please try registering again.')
    return
  }

  resending.value = true
  
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    })

    if (error) {
      notificationStore.error(error.message)
    } else {
      notificationStore.success('Verification email sent!')
      startCooldown()
    }
  } catch (err) {
    notificationStore.error('Failed to resend email. Please try again.')
  } finally {
    resending.value = false
  }
}

function startCooldown() {
  cooldown.value = 60
  const timer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// SEO
const { setPageMeta } = useSEO()
setPageMeta({
  title: 'Verify Email | Neon SEO Beacon',
  description: 'Verify your email address to complete your Neon SEO Beacon account setup.'
})
</script>
