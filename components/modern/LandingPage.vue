<template>
  <div
    class="modern-landing overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900"
  >
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center">
      <!-- Animated Background -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute -top-40 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"
        ></div>
        <div
          class="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"
          style="animation-delay: -3s"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-float"
          style="animation-delay: -1.5s"
        ></div>
      </div>

      <!-- Hero Content -->
      <div
        class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div class="space-y-8 animate-fade-in">
          <!-- Main Headline -->
          <div class="space-y-4">
            <div
              class="inline-flex items-center px-4 py-2 bg-blue-100/50 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 animate-slide-in-down"
            >
              <span
                class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"
              ></span>
              New: AI-Powered SEO Analysis
            </div>

            <h1
              class="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              <span class="block animate-slide-in-left">Transform Your</span>
              <span
                class="block text-gradient animate-slide-in-right"
                style="animation-delay: 0.2s"
                >SEO Strategy</span
              >
              <span
                class="block animate-slide-in-left"
                style="animation-delay: 0.4s"
                >Today</span
              >
            </h1>

            <p
              class="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed animate-fade-in"
              style="animation-delay: 0.6s"
            >
              Enterprise-grade SEO auditing platform with AI-powered insights,
              real-time monitoring, and actionable recommendations that actually
              drive results.
            </p>
          </div>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in"
            style="animation-delay: 0.8s"
          >
            <button
              class="group relative px-8 py-4 bg-gradient-neon text-white font-semibold rounded-2xl shadow-glow hover-scale micro-bounce overflow-hidden"
            >
              <span class="relative z-10">Start Free Audit</span>
              <div
                class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
            </button>

            <button
              class="group px-8 py-4 glass border border-white/20 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover-lift micro-bounce"
            >
              <span class="flex items-center">
                <svg
                  class="w-5 h-5 mr-2 group-hover:animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  ></path>
                </svg>
                Watch Demo
              </span>
            </button>
          </div>

          <!-- Social Proof -->
          <div
            class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600 dark:text-gray-400 animate-fade-in"
            style="animation-delay: 1s"
          >
            <div class="flex items-center">
              <div class="flex -space-x-2 mr-3">
                <div
                  class="w-8 h-8 bg-gradient-cosmic rounded-full border-2 border-white"
                ></div>
                <div
                  class="w-8 h-8 bg-gradient-sunset rounded-full border-2 border-white"
                ></div>
                <div
                  class="w-8 h-8 bg-gradient-ocean rounded-full border-2 border-white"
                ></div>
              </div>
              <span>Trusted by 10,000+ businesses</span>
            </div>

            <div class="flex items-center">
              <div class="flex text-yellow-400 mr-2">
                <svg
                  v-for="n in 5"
                  :key="n"
                  class="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
              </div>
              <span>4.9/5 average rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16 scroll-reveal">
          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Why Choose <span class="text-gradient">Neon SEO Beacon</span>?
          </h2>
          <p class="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Advanced SEO auditing powered by cutting-edge AI and real-time
            analytics
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            class="group glass-strong rounded-3xl p-8 hover-lift card-hover-lift scroll-reveal"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="flex items-center mb-6">
              <div
                class="w-12 h-12 bg-gradient-neon rounded-2xl flex items-center justify-center text-white shadow-glow group-hover:animate-pulse"
              >
                <component :is="feature.icon" class="w-6 h-6" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white ml-4">
                {{ feature.title }}
              </h3>
            </div>

            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {{ feature.description }}
            </p>

            <ul class="space-y-2">
              <li
                v-for="benefit in feature.benefits"
                :key="benefit"
                class="flex items-center text-sm text-gray-500 dark:text-gray-400"
              >
                <svg
                  class="w-4 h-4 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                {{ benefit }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Demo Section -->
    <section
      class="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 relative overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Demo Content -->
          <div class="scroll-reveal-left">
            <div
              class="inline-flex items-center px-4 py-2 bg-blue-100/50 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 mb-6"
            >
              <span
                class="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"
              ></span>
              Live Demo
            </div>

            <h2
              class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6"
            >
              See Your Website's <span class="text-gradient">SEO Score</span> in
              Real-Time
            </h2>

            <p
              class="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
            >
              Get instant insights into your website's SEO performance with our
              comprehensive analysis engine.
            </p>

            <div class="space-y-4 mb-8">
              <div
                v-for="(stat, index) in demoStats"
                :key="stat.label"
                class="flex items-center justify-between p-4 glass rounded-xl"
                :style="{ animationDelay: `${index * 0.1}s` }"
              >
                <span class="text-gray-700 dark:text-gray-300 font-medium">{{
                  stat.label
                }}</span>
                <div class="flex items-center">
                  <div
                    class="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"
                  >
                    <div
                      class="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-1000"
                      :style="{ width: `${stat.value}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-bold text-gray-900 dark:text-white"
                    >{{ stat.value }}%</span
                  >
                </div>
              </div>
            </div>

            <button
              class="group px-8 py-4 bg-gradient-neon text-white font-semibold rounded-2xl shadow-glow hover-scale micro-bounce"
            >
              Try Free Audit Now
              <svg
                class="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </button>
          </div>

          <!-- Demo Interface -->
          <div class="scroll-reveal-right">
            <div class="glass-strong rounded-3xl p-8 border border-white/20">
              <!-- Demo URL Input -->
              <div class="mb-6">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Enter your website URL</label
                >
                <div class="flex space-x-3">
                  <input
                    v-model="demoUrl"
                    type="url"
                    placeholder="https://example.com"
                    class="flex-1 px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  />
                  <button
                    class="px-6 py-3 bg-gradient-neon text-white font-semibold rounded-xl hover-scale micro-bounce"
                    @click="runDemoAudit"
                  >
                    Audit
                  </button>
                </div>
              </div>

              <!-- Demo Results -->
              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl"
                >
                  <span class="font-medium text-gray-900 dark:text-white"
                    >Overall SEO Score</span
                  >
                  <div class="flex items-center">
                    <div
                      class="w-16 h-16 rounded-full bg-gradient-conic from-green-400 via-blue-500 to-purple-600 p-1 animate-spin-slow"
                    >
                      <div
                        class="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center"
                      >
                        <span
                          class="text-xl font-bold text-gray-900 dark:text-white"
                          >{{ demoScore }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div
                    class="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl text-center"
                  >
                    <div class="text-2xl font-bold text-green-600 mb-1">
                      {{ demoIssuesFixed }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      Issues Fixed
                    </div>
                  </div>
                  <div
                    class="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl text-center"
                  >
                    <div class="text-2xl font-bold text-blue-600 mb-1">
                      {{ demoOpportunities }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      Opportunities
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div class="glass-strong rounded-3xl p-12 scroll-reveal">
          <h2
            class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Ready to <span class="text-gradient">Supercharge</span> Your SEO?
          </h2>

          <p
            class="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
          >
            Join thousands of businesses already using Neon SEO Beacon to
            improve their search rankings
          </p>

          <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              class="group px-8 py-4 bg-gradient-neon text-white font-semibold rounded-2xl shadow-glow hover-scale micro-bounce"
            >
              Start Your Free Trial
              <svg
                class="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </button>

            <div class="text-sm text-gray-500 dark:text-gray-400">
              No credit card required • 14-day free trial
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// Demo data
const demoUrl = ref("https://example.com");
const demoScore = ref(85);
const demoIssuesFixed = ref(23);
const demoOpportunities = ref(7);

// Features data
const features = [
  {
    title: "AI-Powered Analysis",
    description:
      "Advanced machine learning algorithms analyze your website for comprehensive SEO insights.",
    icon: "CpuChipIcon",
    benefits: [
      "Real-time SEO scoring",
      "Automated issue detection",
      "Smart recommendations",
    ],
  },
  {
    title: "Technical SEO Audit",
    description:
      "Deep technical analysis of your website's performance, structure, and optimization.",
    icon: "Cog6ToothIcon",
    benefits: ["Page speed analysis", "Mobile optimization", "Core Web Vitals"],
  },
  {
    title: "Competitor Analysis",
    description:
      "Compare your SEO performance against competitors and identify opportunities.",
    icon: "ChartBarIcon",
    benefits: [
      "Keyword gap analysis",
      "Backlink comparison",
      "Content opportunities",
    ],
  },
  {
    title: "Content Optimization",
    description:
      "AI-driven content analysis and optimization suggestions for better rankings.",
    icon: "DocumentTextIcon",
    benefits: [
      "Content scoring",
      "Keyword optimization",
      "Readability analysis",
    ],
  },
  {
    title: "Real-time Monitoring",
    description:
      "Continuous monitoring of your SEO performance with instant alerts.",
    icon: "EyeIcon",
    benefits: ["Ranking tracking", "Issue notifications", "Performance alerts"],
  },
  {
    title: "White-label Reports",
    description:
      "Professional, customizable reports for clients and stakeholders.",
    icon: "DocumentChartBarIcon",
    benefits: ["Custom branding", "Automated delivery", "Multiple formats"],
  },
];

// Demo stats
const demoStats = [
  { label: "Page Speed", value: 92 },
  { label: "Mobile Friendly", value: 88 },
  { label: "SEO Score", value: 85 },
  { label: "Accessibility", value: 79 },
];

// Demo audit function
const runDemoAudit = () => {
  // Animate score changes
  const { $gsap } = useNuxtApp();

  if ($gsap) {
    $gsap.to(demoScore, {
      value: Math.floor(Math.random() * 20) + 80,
      duration: 1,
      ease: "power2.out",
    });
    $gsap.to(demoIssuesFixed, {
      value: Math.floor(Math.random() * 10) + 15,
      duration: 1,
      ease: "power2.out",
    });
    $gsap.to(demoOpportunities, {
      value: Math.floor(Math.random() * 5) + 5,
      duration: 1,
      ease: "power2.out",
    });
  }
};

onMounted(() => {
  // Initialize scroll animations
  const { $gsap, $ScrollTrigger } = useNuxtApp();

  if ($gsap && $ScrollTrigger) {
    // Scroll reveal animations
    $gsap.fromTo(
      ".scroll-reveal",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
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

    // Left scroll reveals
    $gsap.fromTo(
      ".scroll-reveal-left",
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".scroll-reveal-left",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );

    // Right scroll reveals
    $gsap.fromTo(
      ".scroll-reveal-right",
      { x: 60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".scroll-reveal-right",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }
});
</script>

<style scoped>
.modern-landing {
  font-family: "Inter", sans-serif;
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
