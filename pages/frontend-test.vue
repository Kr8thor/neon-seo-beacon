<template>
  <div
    class="showcase-page min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900"
  >
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in">
        <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-4">
          Modern UI/UX Showcase
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Experience cutting-edge design patterns and interactions
        </p>
      </div>

      <!-- Animation Examples -->
      <section class="mb-16">
        <h2
          class="text-2xl font-bold text-gray-900 dark:text-white mb-8 scroll-reveal"
        >
          Loading Animations
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="animation in loadingAnimations"
            :key="animation.variant"
            class="glass-strong rounded-2xl p-8 hover-lift scroll-reveal"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center"
            >
              {{ animation.name }}
            </h3>
            <div class="flex justify-center">
              <ModernLoadingAnimation
                :type="animation.type"
                :variant="animation.variant"
                size="md"
                :show-background="false"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive Elements -->
      <section class="mb-16">
        <h2
          class="text-2xl font-bold text-gray-900 dark:text-white mb-8 scroll-reveal"
        >
          Interactive Components
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Glassmorphism Card -->
          <div class="glass rounded-2xl p-6 hover-lift scroll-reveal">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Glassmorphism
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Translucent backgrounds with blur effects
            </p>
            <button
              class="btn-liquid px-4 py-2 bg-blue-500 text-white rounded-lg hover-scale"
            >
              Hover Me
            </button>
          </div>

          <!-- Neumorphism Card -->
          <div class="neu-raised p-6 hover-lift scroll-reveal">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Neumorphism
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Soft shadows creating tactile depth
            </p>
            <button
              class="neu-inset px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover-scale"
            >
              Press Me
            </button>
          </div>

          <!-- Gradient Card -->
          <div
            class="bg-gradient-cosmic rounded-2xl p-6 text-white hover-lift scroll-reveal"
          >
            <h3 class="text-lg font-semibold mb-4">Gradient Magic</h3>
            <p class="text-blue-100 mb-4">Dynamic gradients with animation</p>
            <button
              class="glass border border-white/20 px-4 py-2 text-white rounded-lg hover-scale"
            >
              Explore
            </button>
          </div>
        </div>
      </section>

      <!-- Notification Tests -->
      <section class="mb-16">
        <h2
          class="text-2xl font-bold text-gray-900 dark:text-white mb-8 scroll-reveal"
        >
          Notification System
        </h2>

        <div class="glass-strong rounded-2xl p-8 scroll-reveal">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              class="px-4 py-3 bg-green-500 text-white rounded-xl hover-scale micro-bounce"
              @click="showSuccessNotification"
            >
              Success
            </button>
            <button
              class="px-4 py-3 bg-red-500 text-white rounded-xl hover-scale micro-bounce"
              @click="showErrorNotification"
            >
              Error
            </button>
            <button
              class="px-4 py-3 bg-yellow-500 text-white rounded-xl hover-scale micro-bounce"
              @click="showWarningNotification"
            >
              Warning
            </button>
            <button
              class="px-4 py-3 bg-blue-500 text-white rounded-xl hover-scale micro-bounce"
              @click="showInfoNotification"
            >
              Info
            </button>
          </div>
        </div>
      </section>

      <!-- Chart Example -->
      <section class="mb-16">
        <h2
          class="text-2xl font-bold text-gray-900 dark:text-white mb-8 scroll-reveal"
        >
          Interactive Charts
        </h2>

        <div class="glass-strong rounded-2xl p-8 scroll-reveal">
          <div class="h-96">
            <ModernInteractiveChart
              type="line"
              :data="chartData"
              :options="chartOptions"
              :animate="true"
              @chart-ready="onChartReady"
              @data-point-click="onDataPointClick"
            />
          </div>
        </div>
      </section>

      <!-- Microinteractions -->
      <section class="mb-16">
        <h2
          class="text-2xl font-bold text-gray-900 dark:text-white mb-8 scroll-reveal"
        >
          Microinteractions
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button
            class="glass-strong rounded-2xl p-6 hover-lift micro-bounce scroll-reveal"
          >
            <div
              class="w-12 h-12 bg-gradient-neon rounded-full mx-auto mb-3 animate-float"
            ></div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Hover Lift
            </p>
          </button>

          <button
            class="glass-strong rounded-2xl p-6 hover-scale micro-bounce scroll-reveal"
          >
            <div
              class="w-12 h-12 bg-gradient-sunset rounded-full mx-auto mb-3 animate-breathe"
            ></div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Scale Effect
            </p>
          </button>

          <button
            class="glass-strong rounded-2xl p-6 hover-glow micro-bounce scroll-reveal"
          >
            <div
              class="w-12 h-12 bg-gradient-ocean rounded-full mx-auto mb-3 animate-pulse-slow"
            ></div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Glow Effect
            </p>
          </button>

          <button
            class="glass-strong rounded-2xl p-6 micro-rotate micro-bounce scroll-reveal"
          >
            <div
              class="w-12 h-12 bg-gradient-cosmic rounded-full mx-auto mb-3 animate-spin"
            ></div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Rotate
            </p>
          </button>
        </div>
      </section>

      <!-- Performance Info -->
      <section>
        <h2
          class="text-2xl font-bold text-gray-900 dark:text-white mb-8 scroll-reveal"
        >
          Performance & Accessibility
        </h2>

        <div class="glass-strong rounded-2xl p-8 scroll-reveal">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div
                class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                Optimized Performance
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Hardware acceleration and smooth 60fps animations
              </p>
            </div>

            <div class="text-center">
              <div
                class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                Accessibility First
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Respects reduced motion and supports screen readers
              </p>
            </div>

            <div class="text-center">
              <div
                class="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-8 h-8 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                Modern Standards
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Built with latest web technologies and best practices
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const notificationStore = useNotificationStore();

// Loading animations showcase
const loadingAnimations = [
  { name: "Orbital", type: "svg", variant: "orbital" },
  { name: "Pulse", type: "svg", variant: "pulse" },
  { name: "Wave", type: "svg", variant: "wave" },
  { name: "DNA Helix", type: "svg", variant: "dna" },
  { name: "Morphing", type: "svg", variant: "morph" },
  { name: "CSS Dots", type: "css", variant: "dots" },
];

// Chart data
const chartData = ref({
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "SEO Score",
      data: [65, 78, 82, 88, 92, 95],
      tension: 0.4,
    },
    {
      label: "Page Speed",
      data: [70, 75, 80, 85, 88, 90],
      tension: 0.4,
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
});

// Notification functions
const showSuccessNotification = () => {
  notificationStore.success("Operation completed successfully!", {
    title: "Success",
    action: {
      text: "View Details",
      handler: () => console.log("View details clicked"),
    },
  });
};

const showErrorNotification = () => {
  notificationStore.error("Something went wrong. Please try again.", {
    title: "Error",
    duration: 10000,
  });
};

const showWarningNotification = () => {
  notificationStore.warning("Your session will expire soon.", {
    title: "Warning",
    action: {
      text: "Extend Session",
      handler: () => console.log("Extend session clicked"),
    },
  });
};

const showInfoNotification = () => {
  notificationStore.info("New features are available! Check them out.", {
    title: "Information",
  });
};

// Chart event handlers
const onChartReady = (chart) => {
  console.log("Chart ready:", chart);
};

const onDataPointClick = (data) => {
  notificationStore.info(`Clicked data point: ${data.value}`);
};

// Initialize scroll animations
onMounted(() => {
  const { $gsap, $ScrollTrigger } = useNuxtApp();

  if ($gsap && $ScrollTrigger) {
    $gsap.fromTo(
      ".scroll-reveal",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".scroll-reveal",
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }
});

// SEO
const { setPageMeta } = useSEO();
setPageMeta({
  title: "Modern UI/UX Showcase | Neon SEO Beacon",
  description:
    "Experience cutting-edge design patterns, animations, and interactions in our modern UI showcase.",
});
</script>
