<template>
  <div class="app-container">
    <!-- Floating Background Elements (Lazy loaded) -->
    <LazyWrapper
      v-if="!reducedMotion && showEnhancements"
      :component="() => import('~/components/modern/FloatingElements.vue')"
      skeleton-type="custom"
      skeleton-height="100vh"
      skeleton-width="100%"
    >
      <ModernFloatingElements
        density="low"
        :show-orbs="true"
        :show-shapes="false"
        :show-particles="false"
        :show-grid="false"
        :animated="true"
      />
    </LazyWrapper>

    <!-- Custom Cursor (Lazy loaded) -->
    <LazyWrapper
      v-if="enableCustomCursor && showEnhancements"
      :component="() => import('~/components/modern/CustomCursor.vue')"
      skeleton-type="custom"
      skeleton-height="0"
      skeleton-width="0"
    >
      <ModernCustomCursor
        :disabled="reducedMotion || isMobile"
        :show-ring="true"
        :show-trail="false"
        blend-mode="difference"
      />
    </LazyWrapper>

    <!-- Main Application -->
    <NuxtPage />

    <!-- Notification System (Lazy loaded) -->
    <LazyWrapper
      v-if="showEnhancements"
      :component="() => import('~/components/modern/NotificationSystem.vue')"
      skeleton-type="custom"
      skeleton-height="0"
      skeleton-width="0"
    >
      <ModernNotificationSystem />
    </LazyWrapper>

    <!-- Fast Loading Overlay -->
    <Transition name="loading-fade">
      <div
        v-if="isAppLoading"
        class="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
      >
        <LoadingSpinner
          size="xl"
          variant="primary"
          text="Loading Marden SEO Audit..."
          :show-dots="true"
        />
      </div>
    </Transition>

    <!-- Theme Toggle (Development) -->
    <button
      v-if="showDevTools"
      class="fixed bottom-4 left-4 z-40 w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center hover-scale micro-bounce"
      @click="toggleDarkMode"
      title="Toggle Dark Mode"
    >
      <svg
        v-if="darkMode"
        class="w-5 h-5 text-yellow-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        ></path>
      </svg>
      <svg
        v-else
        class="w-5 h-5 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";

// Global app configuration
useHead({
  htmlAttrs: {
    lang: "en",
  },
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "format-detection", content: "telephone=no" },
    { name: "theme-color", content: "#3b82f6" },
    { name: "color-scheme", content: "light dark" },
  ],
  link: [
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    { rel: "manifest", href: "/site.webmanifest" },
  ],
});

// Reactive state
const isAppLoading = ref(true);
const darkMode = ref(false);
const reducedMotion = ref(false);
const isMobile = ref(false);
const enableCustomCursor = ref(false); // Temporarily disabled due to positioning issues
const showDevTools = ref(true);
const showEnhancements = ref(false);

// Dark mode toggle
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", darkMode.value);
    localStorage.setItem("darkMode", darkMode.value.toString());
  }
};

// Initialize app settings
const initializeApp = async () => {
  try {
    if (typeof window === "undefined") return;

    // Check device capabilities
    isMobile.value =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    // Check for reduced motion preference
    reducedMotion.value = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    darkMode.value = savedDarkMode ? savedDarkMode === "true" : prefersDark;
    document.documentElement.classList.toggle("dark", darkMode.value);

    // Disable custom cursor on mobile or if reduced motion is preferred
    enableCustomCursor.value = !isMobile.value && !reducedMotion.value;

    // Hide loading screen faster
    await new Promise((resolve) => setTimeout(resolve, 300));
    isAppLoading.value = false;

    // Enable enhancements after main app loads
    setTimeout(() => {
      showEnhancements.value = true;
    }, 1000);
  } catch (error) {
    console.error("App initialization error:", error);
    isAppLoading.value = false;
  }
};

// Handle media query changes
const handleMediaQueryChange = (e) => {
  if (e.media === "(prefers-reduced-motion: reduce)") {
    reducedMotion.value = e.matches;
    enableCustomCursor.value = !isMobile.value && !e.matches;
  } else if (e.media === "(prefers-color-scheme: dark)") {
    if (!localStorage.getItem("darkMode")) {
      darkMode.value = e.matches;
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", e.matches);
      }
    }
  }
};

// Keyboard shortcuts
const handleKeyDown = (e) => {
  // Toggle dark mode with Ctrl/Cmd + D
  if ((e.ctrlKey || e.metaKey) && e.key === "d") {
    e.preventDefault();
    toggleDarkMode();
  }
};

// Error handling
onErrorCaptured((error) => {
  console.error("Global error caught:", error);
  return false;
});

// Lifecycle hooks
onMounted(async () => {
  await nextTick();

  // Initialize app
  await initializeApp();

  if (typeof window !== "undefined") {
    // Add event listeners
    document.addEventListener("keydown", handleKeyDown);

    // Media query listeners
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    reducedMotionQuery.addEventListener("change", handleMediaQueryChange);
    darkModeQuery.addEventListener("change", handleMediaQueryChange);

    // Clean up on unmount
    onUnmounted(() => {
      document.removeEventListener("keydown", handleKeyDown);
      reducedMotionQuery.removeEventListener("change", handleMediaQueryChange);
      darkModeQuery.removeEventListener("change", handleMediaQueryChange);
    });
  }
});
</script>

<style>
/* Global app styles */
.app-container {
  position: relative;
  min-height: 100vh;
  background: var(--app-background, transparent);
  color: var(--app-foreground, inherit);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

/* Loading transition */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.5s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar for the app */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #2563eb, #7c3aed);
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

/* Focus styles for accessibility */
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Selection styles */
::selection {
  background: rgba(59, 130, 246, 0.2);
  color: inherit;
}

.dark ::selection {
  background: rgba(59, 130, 246, 0.3);
}

/* Prevent text selection on UI elements */
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hardware acceleration for smooth animations */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* Reduced motion fallbacks */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .glass,
  .glass-strong {
    background: rgba(255, 255, 255, 0.9) !important;
    border: 2px solid #000 !important;
  }

  .dark .glass,
  .dark .glass-strong {
    background: rgba(0, 0, 0, 0.9) !important;
    border: 2px solid #fff !important;
  }
}

/* Print styles */
@media print {
  .app-container {
    background: white !important;
    color: black !important;
  }

  .fixed,
  .glass,
  .glass-strong,
  .floating-elements,
  .custom-cursor,
  .notification-container {
    display: none !important;
  }
}
</style>
