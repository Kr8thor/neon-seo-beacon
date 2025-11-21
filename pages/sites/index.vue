<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Sites & Audits
          </h1>
          <p class="mt-1 text-gray-600 dark:text-gray-400">
            Monitor your websites' SEO health
          </p>
        </div>
        <NuxtLink
          to="/audit/new"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          New Audit
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="audits.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No audits yet</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by running your first SEO audit.</p>
        <div class="mt-6">
          <NuxtLink
            to="/audit/new"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Start First Audit
          </NuxtLink>
        </div>
      </div>

      <!-- Audits List -->
      <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pages</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="audit in audits" :key="audit.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                  {{ audit.url }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  v-if="audit.score !== null"
                  :class="['text-sm font-bold', scoreColor(audit.score)]"
                >
                  {{ audit.score }}
                </span>
                <span v-else class="text-sm text-gray-400">-</span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    statusClasses[audit.status]
                  ]"
                >
                  {{ audit.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ audit.page_count || 0 }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-1">
                  <span v-if="audit.critical_issues" class="text-xs text-red-600 font-medium">
                    {{ audit.critical_issues }}C
                  </span>
                  <span v-if="audit.high_issues" class="text-xs text-orange-600 font-medium">
                    {{ audit.high_issues }}H
                  </span>
                  <span class="text-xs text-gray-500">
                    {{ audit.issue_count || 0 }} total
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(audit.created_at) }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <NuxtLink
                  :to="`/audit/${audit.id}`"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                >
                  View
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(true);
const audits = ref<any[]>([]);

const statusClasses: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

const scoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(async () => {
  try {
    const { data } = await useFetch("/api/sites/audits");
    if (data.value?.success) {
      audits.value = data.value.data || [];
    }
  } catch (e) {
    console.error("Failed to load audits", e);
  } finally {
    loading.value = false;
  }
});
</script>
