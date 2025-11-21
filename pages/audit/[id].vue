<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              SEO Audit Results
            </h1>
            <p class="mt-1 text-gray-500 dark:text-gray-400" v-if="audit">
              {{ audit.url }}
            </p>
          </div>
          <div v-if="audit" class="text-right">
            <div class="text-sm text-gray-500">Status</div>
            <span
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                statusClasses[audit.status] || 'bg-gray-100 text-gray-800'
              ]"
            >
              {{ audit.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading audit results...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
      </div>

      <!-- Results -->
      <div v-else-if="audit">
        <!-- Score Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <!-- Overall Score -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Score</div>
            <div class="mt-2 flex items-baseline">
              <span
                :class="[
                  'text-4xl font-bold',
                  scoreColor(audit.score)
                ]"
              >
                {{ audit.score || 0 }}
              </span>
              <span class="ml-1 text-gray-500">/100</span>
            </div>
          </div>

          <!-- Pages Analyzed -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Pages Analyzed</div>
            <div class="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
              {{ summary.totalPages || 0 }}
            </div>
          </div>

          <!-- Total Issues -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Issues</div>
            <div class="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
              {{ summary.totalIssues || 0 }}
            </div>
          </div>

          <!-- Critical Issues -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Critical Issues</div>
            <div class="mt-2 text-4xl font-bold text-red-600">
              {{ summary.issuesBySeverity?.critical || 0 }}
            </div>
          </div>
        </div>

        <!-- Issues by Severity -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Issues by Severity</h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div
                v-for="(count, severity) in summary.issuesBySeverity"
                :key="severity"
                class="text-center"
              >
                <div
                  :class="[
                    'text-2xl font-bold',
                    severityColors[severity] || 'text-gray-600'
                  ]"
                >
                  {{ count }}
                </div>
                <div class="text-sm text-gray-500 capitalize">{{ severity }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Issues -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Top Issues</h2>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="issue in topIssues"
              :key="issue.issue_id"
              class="px-6 py-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span
                      :class="[
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                        severityBadges[issue.severity] || 'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ issue.severity }}
                    </span>
                    <span class="text-sm text-gray-500">{{ issue.category }}</span>
                  </div>
                  <h3 class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {{ issue.title }}
                  </h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {{ issue.description }}
                  </p>
                  <p class="mt-2 text-sm text-indigo-600 dark:text-indigo-400">
                    {{ issue.recommendation }}
                  </p>
                </div>
                <div class="ml-4 text-right">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ issue.count }} {{ issue.count === 1 ? 'page' : 'pages' }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="!topIssues.length" class="px-6 py-8 text-center text-gray-500">
              No issues found
            </div>
          </div>
        </div>

        <!-- Pages List -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Analyzed Pages</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="page in pages" :key="page.id">
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 dark:text-white truncate max-w-md">
                      {{ page.url }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="['text-sm font-medium', scoreColor(page.score)]">
                      {{ page.score || '-' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ page.issuesCount || 0 }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ page.responseTime }}ms
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- AI Recommendations -->
        <div v-if="recommendations" class="bg-white dark:bg-gray-800 rounded-lg shadow mt-8">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">AI Recommendations</h2>
          </div>
          <div class="p-6">
            <p class="text-gray-700 dark:text-gray-300 mb-4">{{ recommendations.summary }}</p>
            <div class="space-y-4">
              <div
                v-for="(rec, index) in recommendations.recommendations"
                :key="index"
                class="border-l-4 pl-4"
                :class="priorityBorder[rec.priority]"
              >
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ rec.title }}</span>
                  <span class="text-xs text-gray-500">{{ rec.priority }} priority</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ rec.implementation }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const auditId = route.params.id as string;

const loading = ref(true);
const error = ref<string | null>(null);
const audit = ref<any>(null);
const summary = ref<any>({});
const topIssues = ref<any[]>([]);
const pages = ref<any[]>([]);
const recommendations = ref<any>(null);

const statusClasses: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

const severityColors: Record<string, string> = {
  critical: "text-red-600",
  high: "text-orange-600",
  medium: "text-yellow-600",
  low: "text-blue-600",
  info: "text-gray-600",
};

const severityBadges: Record<string, string> = {
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-blue-100 text-blue-800",
  info: "bg-gray-100 text-gray-800",
};

const priorityBorder: Record<string, string> = {
  critical: "border-red-500",
  high: "border-orange-500",
  medium: "border-yellow-500",
  low: "border-blue-500",
};

const scoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
};

onMounted(async () => {
  try {
    const { data } = await useFetch(`/api/sites/${auditId}/results`);

    if (data.value?.success) {
      audit.value = data.value.data.audit;
      summary.value = data.value.data.summary;
      topIssues.value = data.value.data.topIssues || [];
      pages.value = data.value.data.pages || [];
      recommendations.value = data.value.data.recommendations;
    } else {
      error.value = "Failed to load audit results";
    }
  } catch (e: any) {
    error.value = e.message || "An error occurred";
  } finally {
    loading.value = false;
  }
});
</script>
