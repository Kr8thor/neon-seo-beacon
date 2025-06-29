<template>
  <div
    class="modern-dashboard min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900"
  >
    <!-- Custom Cursor -->
    <div
      ref="cursor"
      class="custom-cursor pointer-events-none fixed w-5 h-5 rounded-full bg-blue-500/50 backdrop-blur-sm z-50 transition-all duration-100 ease-out"
      :class="{ hover: cursorHover, click: cursorClick }"
    ></div>

    <!-- Header Section -->
    <header class="relative overflow-hidden">
      <div class="glass-strong border-b border-white/20 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <div class="flex items-center space-x-3 animate-slide-in-left">
              <div
                class="w-10 h-10 bg-gradient-neon rounded-xl flex items-center justify-center shadow-glow"
              >
                <svg
                  class="w-6 h-6 text-white"
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
              <h1 class="text-xl font-bold text-gradient">Neon SEO Beacon</h1>
            </div>

            <!-- Navigation -->
            <nav class="hidden md:flex space-x-8 animate-slide-in-right">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                class="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200 hover-lift font-medium"
                @mouseenter="handleHover"
                @mouseleave="handleHoverEnd"
              >
                {{ item.name }}
              </a>
            </nav>

            <!-- User Actions -->
            <div class="flex items-center space-x-4 animate-slide-in-right">
              <button
                class="neu-raised px-4 py-2 text-sm font-medium text-gray-700 hover-scale micro-bounce"
                @click="handleButtonClick"
                @mouseenter="handleHover"
                @mouseleave="handleHoverEnd"
              >
                Settings
              </button>
              <div
                class="w-8 h-8 bg-gradient-cosmic rounded-full hover-scale cursor-pointer"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Stats -->
      <section class="mb-12 animate-fade-in">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(stat, index) in heroStats"
            :key="stat.title"
            class="glass rounded-2xl p-6 hover-lift card-hover-lift transition-all duration-300 scroll-reveal"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @mouseenter="handleHover"
            @mouseleave="handleHoverEnd"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ stat.title }}
                </p>
                <p
                  class="text-2xl font-bold text-gray-900 dark:text-white mt-1"
                >
                  <span ref="counter" :data-target="stat.value">0</span>
                  <span class="text-sm text-gray-500">{{ stat.suffix }}</span>
                </p>
                <p class="text-xs text-green-600 mt-1 flex items-center">
                  <svg
                    class="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    ></path>
                  </svg>
                  {{ stat.change }}
                </p>
              </div>
              <div
                class="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-glow"
              >
                <component :is="stat.icon" class="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Dashboard Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Chart -->
        <div class="lg:col-span-2">
          <div
            class="glass-strong rounded-3xl p-8 h-96 hover-lift transition-all duration-500 scroll-reveal"
            @mouseenter="handleHover"
            @mouseleave="handleHoverEnd"
          >
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                SEO Performance
              </h3>
              <div class="flex space-x-2">
                <button
                  v-for="period in ['7D', '30D', '90D']"
                  :key="period"
                  class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
                  :class="
                    activePeriod === period
                      ? 'bg-blue-500 text-white shadow-glow'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  "
                  @click="activePeriod = period"
                >
                  {{ period }}
                </button>
              </div>
            </div>

            <!-- Chart Container -->
            <div class="h-full relative">
              <canvas ref="chartCanvas" class="w-full h-full"></canvas>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="loading-spinner mx-auto mb-4"></div>
                  <p class="text-gray-500">Loading chart data...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Recent Audits -->
          <div class="glass rounded-2xl p-6 scroll-reveal">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Recent Audits
            </h3>
            <div class="space-y-3">
              <div
                v-for="(audit, index) in recentAudits"
                :key="audit.id"
                class="flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 hover-scale micro-bounce cursor-pointer"
                :style="{ animationDelay: `${index * 0.1}s` }"
                @mouseenter="handleHover"
                @mouseleave="handleHoverEnd"
              >
                <div
                  class="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm"
                >
                  {{ audit.score }}
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 dark:text-white text-sm">
                    {{ audit.url }}
                  </p>
                  <p class="text-xs text-gray-500">{{ audit.date }}</p>
                </div>
                <div class="flex items-center space-x-1">
                  <div
                    class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  ></div>
                  <span class="text-xs text-green-600">Complete</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="glass rounded-2xl p-6 scroll-reveal">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Quick Actions
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="action in quickActions"
                :key="action.name"
                class="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800 hover-lift micro-bounce transition-all duration-300 group"
                @click="handleActionClick(action)"
                @mouseenter="handleHover"
                @mouseleave="handleHoverEnd"
              >
                <component
                  :is="action.icon"
                  class="w-6 h-6 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform"
                />
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ action.name }}
                </p>
              </button>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div class="glass rounded-2xl p-6 scroll-reveal">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Performance
            </h3>
            <div class="space-y-4">
              <div
                v-for="metric in performanceMetrics"
                :key="metric.name"
                class="flex items-center justify-between"
              >
                <span
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >{{ metric.name }}</span
                >
                <div class="flex items-center space-x-2">
                  <div
                    class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                      :style="{ width: `${metric.value}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-bold text-gray-900 dark:text-white"
                    >{{ metric.value }}%</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom Section -->
      <section class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- SEO Opportunities -->
        <div class="glass rounded-2xl p-6 scroll-reveal">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            SEO Opportunities
          </h3>
          <div class="space-y-4">
            <div
              v-for="opportunity in seoOpportunities"
              :key="opportunity.id"
              class="flex items-start space-x-3 p-4 rounded-xl bg-white/30 dark:bg-gray-800/30 hover-lift"
              @mouseenter="handleHover"
              @mouseleave="handleHoverEnd"
            >
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                  ></path>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ opportunity.title }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ opportunity.description }}
                </p>
                <div class="flex items-center mt-2 space-x-2">
                  <span
                    class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full"
                  >
                    {{ opportunity.impact }}
                  </span>
                  <span class="text-xs text-gray-500">{{
                    opportunity.effort
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="glass rounded-2xl p-6 scroll-reveal">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors"
              @mouseenter="handleHover"
              @mouseleave="handleHoverEnd"
            >
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white"
              >
                <component :is="activity.icon" class="w-4 h-4" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ activity.action }}
                </p>
                <p class="text-xs text-gray-500">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Floating Action Button -->
    <div class="fixed bottom-8 right-8 z-40">
      <button
        class="w-14 h-14 bg-gradient-neon rounded-full shadow-glow hover-scale micro-bounce flex items-center justify-center text-white animate-float"
        @click="handleFabClick"
        @mouseenter="handleHover"
        @mouseleave="handleHoverEnd"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// Reactive data
const cursor = ref<HTMLElement>();
const chartCanvas = ref<HTMLCanvasElement>();
const cursorHover = ref(false);
const cursorClick = ref(false);
const activePeriod = ref("30D");

// Navigation items
const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Audits", href: "/audits" },
  { name: "Reports", href: "/reports" },
  { name: "Settings", href: "/settings" },
];

// Hero statistics
const heroStats = [
  {
    title: "Total Audits",
    value: 1247,
    suffix: "",
    change: "+12% from last month",
    icon: "ChartBarIcon",
  },
  {
    title: "Avg. SEO Score",
    value: 85,
    suffix: "%",
    change: "+8% from last month",
    icon: "TrendingUpIcon",
  },
  {
    title: "Issues Fixed",
    value: 342,
    suffix: "",
    change: "+23% from last month",
    icon: "CheckCircleIcon",
  },
  {
    title: "Active Projects",
    value: 12,
    suffix: "",
    change: "+2 this month",
    icon: "FolderIcon",
  },
];

// Recent audits
const recentAudits = [
  { id: 1, url: "example.com", score: 92, date: "2 hours ago" },
  { id: 2, url: "mysite.org", score: 78, date: "5 hours ago" },
  { id: 3, url: "testsite.net", score: 89, date: "1 day ago" },
  { id: 4, url: "demo.com", score: 95, date: "2 days ago" },
];

// Quick actions
const quickActions = [
  { name: "New Audit", icon: "PlusIcon", action: "new-audit" },
  { name: "Reports", icon: "DocumentTextIcon", action: "reports" },
  { name: "Analytics", icon: "ChartPieIcon", action: "analytics" },
  { name: "Help", icon: "QuestionMarkCircleIcon", action: "help" },
];

// Performance metrics
const performanceMetrics = [
  { name: "Page Speed", value: 92 },
  { name: "Mobile Friendly", value: 88 },
  { name: "SEO Score", value: 85 },
  { name: "Accessibility", value: 79 },
];

// SEO opportunities
const seoOpportunities = [
  {
    id: 1,
    title: "Optimize Image Alt Text",
    description: "15 images missing alt text descriptions",
    impact: "High Impact",
    effort: "Low Effort",
  },
  {
    id: 2,
    title: "Improve Meta Descriptions",
    description: "8 pages with missing or short meta descriptions",
    impact: "Medium Impact",
    effort: "Medium Effort",
  },
  {
    id: 3,
    title: "Fix Broken Links",
    description: "3 internal links returning 404 errors",
    impact: "High Impact",
    effort: "Low Effort",
  },
];

// Recent activity
const recentActivity = [
  {
    id: 1,
    action: "Completed audit for example.com",
    time: "2 minutes ago",
    icon: "CheckCircleIcon",
  },
  {
    id: 2,
    action: "Generated report for client",
    time: "1 hour ago",
    icon: "DocumentTextIcon",
  },
  {
    id: 3,
    action: "Fixed 5 SEO issues",
    time: "3 hours ago",
    icon: "WrenchIcon",
  },
];

// Event handlers
const handleHover = () => {
  cursorHover.value = true;
};

const handleHoverEnd = () => {
  cursorHover.value = false;
};

const handleButtonClick = () => {
  cursorClick.value = true;
  setTimeout(() => {
    cursorClick.value = false;
  }, 150);
};

const handleActionClick = (action: any) => {
  console.log("Action clicked:", action.action);
  handleButtonClick();
};

const handleFabClick = () => {
  console.log("FAB clicked");
  handleButtonClick();
};

// Mouse tracking for custom cursor
const updateCursorPosition = (e: MouseEvent) => {
  if (cursor.value) {
    cursor.value.style.left = e.clientX + "px";
    cursor.value.style.top = e.clientY + "px";
  }
};

// Lifecycle
onMounted(() => {
  // Add mouse tracking
  document.addEventListener("mousemove", updateCursorPosition);

  // Initialize scroll reveal animations
  const { $gsap, $ScrollTrigger } = useNuxtApp();

  if ($gsap && $ScrollTrigger) {
    // Animate scroll reveal elements
    $gsap.fromTo(
      ".scroll-reveal",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".scroll-reveal",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      },
    );

    // Animate counters
    const counters = document.querySelectorAll("[data-target]");
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target") || "0");
      $gsap.to(counter, {
        textContent: target,
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: counter,
          start: "top 80%",
          once: true,
        },
      });
    });
  }
});

onUnmounted(() => {
  document.removeEventListener("mousemove", updateCursorPosition);
});
</script>

<style scoped>
.modern-dashboard {
  cursor: none;
}

@media (max-width: 768px) {
  .modern-dashboard {
    cursor: auto;
  }

  .custom-cursor {
    display: none;
  }
}
</style>
