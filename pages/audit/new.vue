<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          New SEO Audit
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Enter a URL to analyze. We'll crawl the site and provide comprehensive SEO recommendations.
        </p>
      </div>

      <!-- Audit Form -->
      <form @submit.prevent="startAudit" class="space-y-6">
        <!-- URL Input -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <label for="url" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Website URL
          </label>
          <div class="mt-2">
            <input
              id="url"
              v-model="form.url"
              type="url"
              required
              placeholder="https://example.com"
              class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3"
            />
          </div>
          <p class="mt-2 text-sm text-gray-500">
            Enter the full URL including https://
          </p>
        </div>

        <!-- Crawl Options -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Crawl Options
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Max Pages -->
            <div>
              <label for="maxPages" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Max Pages
              </label>
              <select
                id="maxPages"
                v-model="form.config.maxPages"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option :value="10">10 pages</option>
                <option :value="25">25 pages</option>
                <option :value="50">50 pages</option>
                <option :value="100">100 pages</option>
                <option :value="250">250 pages</option>
                <option :value="500">500 pages</option>
              </select>
            </div>

            <!-- Max Depth -->
            <div>
              <label for="maxDepth" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Crawl Depth
              </label>
              <select
                id="maxDepth"
                v-model="form.config.maxDepth"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option :value="1">1 level (homepage only)</option>
                <option :value="2">2 levels</option>
                <option :value="3">3 levels</option>
                <option :value="5">5 levels</option>
                <option :value="10">10 levels (deep)</option>
              </select>
            </div>

            <!-- Rate Limit -->
            <div>
              <label for="rateLimit" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Crawl Speed
              </label>
              <select
                id="rateLimit"
                v-model="form.config.rateLimit"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option :value="1">Slow (1 req/sec)</option>
                <option :value="2">Normal (2 req/sec)</option>
                <option :value="5">Fast (5 req/sec)</option>
              </select>
            </div>

            <!-- Respect Robots.txt -->
            <div class="flex items-center">
              <input
                id="respectRobots"
                v-model="form.config.respectRobotsTxt"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label for="respectRobots" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Respect robots.txt
              </label>
            </div>
          </div>
        </div>

        <!-- Analysis Options -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Analysis Options
          </h3>

          <div class="space-y-4">
            <div class="flex items-center">
              <input
                id="includePerformance"
                v-model="form.includePerformance"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label for="includePerformance" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Include Core Web Vitals analysis
              </label>
            </div>

            <div class="flex items-center">
              <input
                id="includeAI"
                v-model="form.includeAIRecommendations"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label for="includeAI" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Include AI-powered recommendations
              </label>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Starting Audit...
            </span>
            <span v-else>Start Audit</span>
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
        </div>
      </form>

      <!-- Progress Modal -->
      <div v-if="auditStarted" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Audit Started
          </h3>

          <div class="space-y-4">
            <div class="flex items-center">
              <svg class="animate-spin h-5 w-5 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ progressMessage }}</span>
            </div>

            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                :style="{ width: `${progressPercent}%` }"
              ></div>
            </div>

            <p class="text-sm text-gray-500">
              Estimated time: {{ auditData?.estimatedTime || 'Calculating...' }}
            </p>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="viewResults"
              class="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const loading = ref(false);
const error = ref<string | null>(null);
const auditStarted = ref(false);
const auditData = ref<any>(null);
const progressMessage = ref("Initializing...");
const progressPercent = ref(0);

const form = reactive({
  url: "",
  config: {
    maxPages: 50,
    maxDepth: 3,
    rateLimit: 2,
    respectRobotsTxt: true,
  },
  includePerformance: true,
  includeAIRecommendations: true,
});

async function startAudit() {
  loading.value = true;
  error.value = null;

  try {
    const response = await $fetch("/api/sites/audit", {
      method: "POST",
      body: {
        url: form.url,
        config: form.config,
        includePerformance: form.includePerformance,
        includeAIRecommendations: form.includeAIRecommendations,
      },
    });

    if (response.success) {
      auditData.value = response.data;
      auditStarted.value = true;

      // Connect to SSE for progress
      connectToStream(response.data.auditId);
    } else {
      error.value = "Failed to start audit";
    }
  } catch (e: any) {
    error.value = e.data?.message || e.message || "Failed to start audit";
  } finally {
    loading.value = false;
  }
}

function connectToStream(auditId: string) {
  const eventSource = new EventSource(`/api/sites/${auditId}/stream`);

  eventSource.addEventListener("progress", (event) => {
    const data = JSON.parse(event.data);
    progressMessage.value = data.message;
    progressPercent.value = (data.step / data.totalSteps) * 100;
  });

  eventSource.addEventListener("complete", (event) => {
    const data = JSON.parse(event.data);
    progressMessage.value = "Complete!";
    progressPercent.value = 100;
    eventSource.close();

    // Navigate to results after a brief delay
    setTimeout(() => {
      router.push(`/audit/${auditId}`);
    }, 1500);
  });

  eventSource.addEventListener("error", () => {
    eventSource.close();
  });
}

function viewResults() {
  if (auditData.value?.auditId) {
    router.push(`/audit/${auditData.value.auditId}`);
  }
}
</script>
