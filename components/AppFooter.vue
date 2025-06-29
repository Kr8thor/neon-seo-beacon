<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <div class="flex items-center space-x-3 mb-4">
            <div
              class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-sm">N</span>
            </div>
            <span class="font-bold text-xl">Neon SEO Beacon</span>
          </div>
          <p class="text-gray-400 mb-4">
            Professional SEO audit tool with AI-powered insights for agencies
            and businesses.
          </p>
          <div class="flex space-x-4">
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <span class="sr-only">Twitter</span>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <span class="sr-only">LinkedIn</span>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <span class="sr-only">GitHub</span>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Product -->
        <div>
          <h3 class="font-semibold mb-4">Product</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/features"
                class="text-gray-400 hover:text-white transition-colors"
                >Features</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/pricing"
                class="text-gray-400 hover:text-white transition-colors"
                >Pricing</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/api"
                class="text-gray-400 hover:text-white transition-colors"
                >API</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/integrations"
                class="text-gray-400 hover:text-white transition-colors"
                >Integrations</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/changelog"
                class="text-gray-400 hover:text-white transition-colors"
                >Changelog</NuxtLink
              >
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h3 class="font-semibold mb-4">Resources</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/docs"
                class="text-gray-400 hover:text-white transition-colors"
                >Documentation</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/seo-tips"
                class="text-gray-400 hover:text-white transition-colors"
                >SEO Tips</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/blog"
                class="text-gray-400 hover:text-white transition-colors"
                >Blog</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/case-studies"
                class="text-gray-400 hover:text-white transition-colors"
                >Case Studies</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/webinars"
                class="text-gray-400 hover:text-white transition-colors"
                >Webinars</NuxtLink
              >
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="font-semibold mb-4">Support</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/help"
                class="text-gray-400 hover:text-white transition-colors"
                >Help Center</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="text-gray-400 hover:text-white transition-colors"
                >Contact Us</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/status"
                class="text-gray-400 hover:text-white transition-colors"
                >Status</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/community"
                class="text-gray-400 hover:text-white transition-colors"
                >Community</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/security"
                class="text-gray-400 hover:text-white transition-colors"
                >Security</NuxtLink
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div
        class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
      >
        <div class="text-gray-400 mb-4 md:mb-0">
          © {{ currentYear }} Neon SEO Beacon. All rights reserved.
        </div>
        <div class="flex space-x-6 text-sm">
          <NuxtLink
            to="/privacy"
            class="text-gray-400 hover:text-white transition-colors"
            >Privacy Policy</NuxtLink
          >
          <NuxtLink
            to="/terms"
            class="text-gray-400 hover:text-white transition-colors"
            >Terms of Service</NuxtLink
          >
          <NuxtLink
            to="/cookies"
            class="text-gray-400 hover:text-white transition-colors"
            >Cookie Policy</NuxtLink
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>
