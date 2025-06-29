<template>
  <nav class="bg-white shadow-sm border-b sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-3">
            <div
              class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-sm">N</span>
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-xl text-gray-900">
                Neon SEO Beacon
              </span>
              <span class="text-xs text-gray-500 font-medium -mt-1">
                Powered by MardenSEO
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink
            v-for="item in navigation.filter((n) => !n.auth || isAuthenticated)"
            :key="item.title"
            :to="item.to"
            :class="[
              'text-gray-600 hover:text-gray-900 font-medium transition-colors',
              $route.path.startsWith(item.to) ? 'text-blue-600' : '',
            ]"
          >
            {{ item.title }}
          </NuxtLink>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-4">
          <template v-if="!isAuthenticated">
            <NuxtLink
              to="/auth/login"
              class="text-gray-600 hover:text-gray-900 font-medium"
            >
              Sign In
            </NuxtLink>
            <NuxtLink to="/auth/register" class="btn btn-primary">
              Start Free Trial
            </NuxtLink>
          </template>

          <template v-else>
            <!-- User Menu -->
            <div class="relative" ref="userMenuRef">
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <div
                  class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                >
                  <span class="text-white text-sm font-medium">
                    {{ user?.email?.[0]?.toUpperCase() }}
                  </span>
                </div>
                <ChevronDownIcon class="w-4 h-4" />
              </button>

              <!-- Dropdown Menu -->
              <div
                v-show="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              >
                <NuxtLink
                  to="/dashboard"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Dashboard
                </NuxtLink>
                <NuxtLink
                  to="/settings"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Settings
                </NuxtLink>
                <NuxtLink
                  to="/billing"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Billing
                </NuxtLink>
                <hr class="my-1 border-gray-200" />
                <button
                  @click="signOut"
                  class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </template>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Bars3Icon v-if="!showMobileMenu" class="w-6 h-6" />
            <XMarkIcon v-else class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div
        v-show="showMobileMenu"
        class="md:hidden border-t border-gray-200 py-4"
      >
        <div class="space-y-2">
          <NuxtLink
            v-for="item in navigation.filter((n) => !n.auth || isAuthenticated)"
            :key="item.title"
            :to="item.to"
            :class="[
              'block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium',
              $route.path.startsWith(item.to) ? 'text-blue-600 bg-blue-50' : '',
            ]"
            @click="showMobileMenu = false"
          >
            {{ item.title }}
          </NuxtLink>

          <template v-if="!isAuthenticated">
            <hr class="my-2 border-gray-200" />
            <NuxtLink
              to="/auth/login"
              class="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium"
              @click="showMobileMenu = false"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="block mx-4 mt-2 btn btn-primary text-center"
              @click="showMobileMenu = false"
            >
              Start Free Trial
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

// Nuxt composables
const route = useRoute();

// Supabase auth
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// Reactive data
const showMobileMenu = ref(false);
const showUserMenu = ref(false);
const userMenuRef = ref(null);

// Navigation items
const navigation = [
  { title: "Dashboard", to: "/dashboard", auth: true },
  { title: "SEO Tools", to: "/tools", auth: true },
  { title: "Knowledge Base", to: "/seo-tips" },
  { title: "Documentation", to: "/docs" },
  { title: "Help", to: "/help" },
  { title: "Pricing", to: "/pricing" },
];

// Computed
const isAuthenticated = computed(() => !!user.value);

// Methods
function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value;
  if (showMobileMenu.value) {
    showUserMenu.value = false;
  }
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value;
  if (showUserMenu.value) {
    showMobileMenu.value = false;
  }
}

async function signOut() {
  try {
    await supabase.auth.signOut();
    showUserMenu.value = false;
    await navigateTo("/");
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

// Close menus when clicking outside
onMounted(() => {
  function handleClickOutside(event) {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
      showUserMenu.value = false;
    }
  }

  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});

// Close mobile menu on route change
watch(
  () => route.path,
  () => {
    showMobileMenu.value = false;
    showUserMenu.value = false;
  },
);
</script>
