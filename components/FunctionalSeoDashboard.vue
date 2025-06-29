<template>
  <div
    class="functional-seo-dashboard min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900"
  >
    <!-- Header -->
    <header class="glass-strong border-b border-white/20 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
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
            <h1
              class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Neon SEO Beacon
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <button
              @click="refreshDashboard"
              :disabled="loading"
              class="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/20 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <svg
                class="w-4 h-4"
                :class="{ 'animate-spin': loading }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
            </button>
            <div class="w-8 h-8 bg-gradient-cosmic rounded-full"></div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Quick Audit Section -->
      <section class="mb-8">
        <div class="glass rounded-3xl p-8 text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Start Your SEO Audit
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Enter any website URL to get a comprehensive SEO analysis in
            minutes. Our advanced tools will scan your site for 50+ SEO factors.
          </p>

          <form @submit.prevent="createQuickAudit" class="max-w-2xl mx-auto">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <input
                  v-model="quickAuditUrl"
                  type="url"
                  placeholder="https://example.com"
                  required
                  class="w-full px-6 py-4 bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 text-lg"
                />
              </div>
              <button
                type="submit"
                :disabled="creatingAudit || !quickAuditUrl"
                class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              >
                {{ creatingAudit ? "Analyzing..." : "Analyze Now" }}
              </button>
            </div>

            <div class="flex flex-wrap justify-center gap-3 mt-6">
              <button
                v-for="auditType in auditTypes"
                :key="auditType.id"
                type="button"
                @click="selectedAuditType = auditType.id"
                :class="[
                  'px-4 py-2 rounded-xl border transition-all duration-200',
                  selectedAuditType === auditType.id
                    ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300'
                    : 'bg-white/50 border-gray-200 text-gray-600 hover:bg-white/70 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400',
                ]"
              >
                {{ auditType.name }}
                <span class="text-xs opacity-75 ml-1"
                  >({{ auditType.duration }})</span
                >
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- SEO Service Buttons -->
      <section class="mb-8">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          SEO Analysis Tools
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            v-for="service in seoServices"
            :key="service.id"
            @click="handleServiceClick(service)"
            class="group glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 text-center"
          >
            <div
              class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                v-html="service.icon"
              ></svg>
            </div>
            <h4 class="font-semibold text-gray-900 dark:text-white text-sm">
              {{ service.name }}
            </h4>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {{ service.description }}
            </p>
          </button>
        </div>
      </section>

      <!-- Recent Audits & Stats -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Audits -->
        <div class="lg:col-span-2">
          <div class="glass rounded-3xl p-8">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                Recent Audits
              </h3>
              <button
                @click="loadAudits"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Refresh
              </button>
            </div>

            <div v-if="loadingAudits" class="text-center py-8">
              <div
                class="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
              ></div>
              <p class="text-gray-600 dark:text-gray-400 mt-2">
                Loading audits...
              </p>
            </div>

            <div v-else-if="audits.length === 0" class="text-center py-8">
              <svg
                class="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
              <p class="text-gray-600 dark:text-gray-400">
                No audits yet. Create your first audit above!
              </p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="audit in audits"
                :key="audit.id"
                @click="viewAudit(audit)"
                class="flex items-center space-x-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 cursor-pointer group"
              >
                <div class="flex-shrink-0">
                  <div
                    :class="[
                      'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold',
                      getScoreColorClass(audit.score),
                    ]"
                  >
                    {{ audit.score || "?" }}
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <h4
                    class="font-medium text-gray-900 dark:text-white truncate"
                  >
                    {{ audit.url }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ formatDate(audit.created_at) }}
                    <span v-if="audit.processing_time_ms" class="ml-2">
                      • {{ (audit.processing_time_ms / 1000).toFixed(1) }}s
                    </span>
                  </p>
                </div>

                <div class="flex-shrink-0">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      getStatusColorClass(audit.status),
                    ]"
                  >
                    {{ capitalizeFirst(audit.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="space-y-6">
          <!-- Stats Cards -->
          <div class="glass rounded-2xl p-6">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Statistics
            </h3>
            <div class="space-y-4">
              <div
                v-for="stat in statistics"
                :key="stat.label"
                class="flex items-center justify-between"
              >
                <span
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >{{ stat.label }}</span
                >
                <span class="text-lg font-bold text-gray-900 dark:text-white">{{
                  stat.value
                }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="glass rounded-2xl p-6">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Quick Actions
            </h3>
            <div class="space-y-3">
              <button
                v-for="action in quickActions"
                :key="action.id"
                @click="handleQuickAction(action)"
                class="w-full flex items-center space-x-3 p-3 rounded-xl bg-white/30 dark:bg-gray-800/30 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 text-left"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    v-html="action.icon"
                  ></svg>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 dark:text-white text-sm">
                    {{ action.name }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ action.description }}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Service Modal -->
    <div
      v-if="selectedService"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="selectedService = null"
    >
      <div
        class="glass-strong rounded-3xl shadow-xl max-w-2xl w-full p-8 border border-white/20"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ selectedService.name }}
          </h3>
          <button
            @click="selectedService = null"
            class="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ selectedService.fullDescription }}
        </p>

        <div class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Website URL
            </label>
            <input
              v-model="serviceUrl"
              type="url"
              placeholder="https://example.com"
              class="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
            />
          </div>

          <div class="flex justify-end space-x-4">
            <button
              @click="selectedService = null"
              class="px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/20 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              @click="runService"
              :disabled="!serviceUrl || runningService"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ runningService ? "Running..." : "Run Analysis" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Button -->
    <button
      @click="showQuickAuditModal"
      class="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center text-white z-40"
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
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";

// Reactive state
const loading = ref(false);
const loadingAudits = ref(true);
const creatingAudit = ref(false);
const runningService = ref(false);
const quickAuditUrl = ref("");
const serviceUrl = ref("");
const selectedAuditType = ref("standard");
const selectedService = ref(null);
const audits = ref([]);

// Audit types
const auditTypes = [
  { id: "quick", name: "Quick Scan", duration: "30s" },
  { id: "standard", name: "Standard", duration: "2m" },
  { id: "comprehensive", name: "Deep Dive", duration: "5m" },
];

// SEO Services
const seoServices = [
  {
    id: "meta-analysis",
    name: "Meta Tags",
    description: "Title & descriptions",
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>',
    fullDescription:
      "Analyze your page titles, meta descriptions, and other meta tags for SEO optimization.",
  },
  {
    id: "performance",
    name: "Performance",
    description: "Speed & loading",
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>',
    fullDescription:
      "Test your website loading speed, performance metrics, and optimization opportunities.",
  },
  {
    id: "mobile-friendly",
    name: "Mobile Check",
    description: "Mobile optimization",
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>',
    fullDescription:
      "Check how your website performs on mobile devices and identify mobile SEO issues.",
  },
  {
    id: "structured-data",
    name: "Schema",
    description: "Structured data",
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>',
    fullDescription:
      "Analyze structured data markup and schema implementation for better search visibility.",
  },
  {
    id: "links",
    name: "Link Analysis",
    description: "Internal & external links",
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>',
    fullDescription:
      "Examine your internal and external link structure for SEO optimization opportunities.",
  },
  {
    id: "content",
    name: "Content",
    description: "SEO content audit",
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>',
    fullDescription:
      "Analyze your content structure, headings, keyword usage, and content optimization.",
  },
];

// Quick Actions
const quickActions = [
  {
    id: "competitor-analysis",
    name: "Competitor Analysis",
    description: "Compare with competitors",
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>',
  },
  {
    id: "keyword-research",
    name: "Keyword Research",
    description: "Find new keywords",
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>',
  },
  {
    id: "site-monitoring",
    name: "Site Monitoring",
    description: "Set up monitoring",
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>',
  },
  {
    id: "export-report",
    name: "Export Report",
    description: "Download PDF report",
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>',
  },
];

// Computed statistics
const statistics = computed(() => [
  { label: "Total Audits", value: audits.value.length },
  {
    label: "Avg Score",
    value: audits.value.length
      ? Math.round(
          audits.value.reduce((sum, audit) => sum + (audit.score || 0), 0) /
            audits.value.length,
        )
      : 0,
  },
  {
    label: "Completed",
    value: audits.value.filter((audit) => audit.status === "completed").length,
  },
  {
    label: "This Month",
    value: audits.value.filter((audit) => {
      const auditDate = new Date(audit.created_at);
      const now = new Date();
      return (
        auditDate.getMonth() === now.getMonth() &&
        auditDate.getFullYear() === now.getFullYear()
      );
    }).length,
  },
]);

// Methods
async function createQuickAudit() {
  if (!quickAuditUrl.value || creatingAudit.value) return;

  creatingAudit.value = true;

  try {
    const response = await $fetch("/api/audits", {
      method: "POST",
      body: {
        url: quickAuditUrl.value,
        type: selectedAuditType.value,
      },
    });

    if (response.success) {
      // Show success notification
      console.log("Audit created:", response.audit);

      // Reset form
      quickAuditUrl.value = "";

      // Refresh audits list
      await loadAudits();

      // Navigate to audit progress
      await navigateTo(`/audits/${response.audit.id}`);
    }
  } catch (error) {
    console.error("Error creating audit:", error);
    alert("Failed to create audit: " + (error.data?.message || error.message));
  } finally {
    creatingAudit.value = false;
  }
}

async function loadAudits() {
  loadingAudits.value = true;

  try {
    const response = await $fetch("/api/audits");
    if (response.success) {
      audits.value = response.audits || [];
    }
  } catch (error) {
    console.error("Error loading audits:", error);
  } finally {
    loadingAudits.value = false;
  }
}

async function refreshDashboard() {
  loading.value = true;
  await loadAudits();
  loading.value = false;
}

function handleServiceClick(service) {
  selectedService.value = service;
  serviceUrl.value = "";
}

async function runService() {
  if (!serviceUrl.value || runningService.value) return;

  runningService.value = true;

  try {
    // Create a specialized audit for this service
    const response = await $fetch("/api/seo/analyze", {
      method: "POST",
      body: {
        url: serviceUrl.value,
        options: {
          includeImages: true,
          checkMobile: selectedService.value.id === "mobile-friendly",
          includePerformance: selectedService.value.id === "performance",
        },
      },
    });

    if (response.success) {
      console.log("Service analysis complete:", response.data);

      // Show results in a modal or navigate to results page
      alert(`Analysis complete! Score: ${response.data.score}/100`);

      selectedService.value = null;
      serviceUrl.value = "";
    }
  } catch (error) {
    console.error("Error running service:", error);
    alert("Analysis failed: " + (error.data?.message || error.message));
  } finally {
    runningService.value = false;
  }
}

function handleQuickAction(action) {
  console.log("Quick action:", action.id);
  alert(`${action.name} - Feature coming soon!`);
}

function viewAudit(audit) {
  navigateTo(`/audits/${audit.id}`);
}

function showQuickAuditModal() {
  // Scroll to the quick audit section
  document.querySelector(".functional-seo-dashboard").scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Utility functions
function getScoreColorClass(score) {
  if (!score) return "bg-gray-400";
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

function getStatusColorClass(status) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "processing":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    case "queued":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    case "error":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

// Lifecycle
onMounted(() => {
  loadAudits();
});
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.glass-strong {
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

@media (prefers-color-scheme: dark) {
  .glass {
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .glass-strong {
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
}
</style>
