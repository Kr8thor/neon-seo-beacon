<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">SEO Audit Demo</h1>
            <p class="text-gray-600">
              See how our SEO analysis works with a live example
            </p>
          </div>
          <NuxtLink to="/auth/register" class="btn btn-primary">
            Start Your Free Trial
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Demo Form -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Try a Live SEO Analysis
        </h2>
        <div class="flex gap-4">
          <input
            v-model="demoUrl"
            type="url"
            placeholder="Enter a website URL (e.g., https://example.com)"
            class="input flex-1"
          />
          <button
            @click="runDemoAnalysis"
            :disabled="loading || !demoUrl"
            class="btn btn-primary whitespace-nowrap"
          >
            {{ loading ? "Analyzing..." : "Analyze Now" }}
          </button>
        </div>
        <p class="text-sm text-gray-500 mt-2">
          This demo will perform a real SEO analysis. No registration required!
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow p-8 text-center">
        <div class="spinner w-8 h-8 mx-auto mb-4"></div>
        <p class="text-gray-600">
          Analyzing website... This may take a few moments.
        </p>
      </div>

      <!-- Demo Results -->
      <div v-if="results && !loading" class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900">Analysis Results</h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">Overall Score:</span>
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold',
                results.score >= 90
                  ? 'bg-green-100 text-green-800'
                  : results.score >= 70
                    ? 'bg-yellow-100 text-yellow-800'
                    : results.score >= 50
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800',
              ]"
            >
              {{ results.score }}
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">
              {{ results.meta?.title ? "Yes" : "No" }}
            </div>
            <div class="text-sm text-gray-600">Title Tag</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">
              {{ results.meta?.description ? "Yes" : "No" }}
            </div>
            <div class="text-sm text-gray-600">Meta Description</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">
              {{ results.headers?.h1?.length || 0 }}
            </div>
            <div class="text-sm text-gray-600">H1 Tags</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">
              {{ results.images?.total || 0 }}
            </div>
            <div class="text-sm text-gray-600">Images</div>
          </div>
        </div>

        <!-- Key Findings -->
        <div class="space-y-4">
          <h4 class="font-medium text-gray-900">Key Findings:</h4>

          <!-- Title -->
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <span class="font-medium">Page Title:</span>
              <span class="ml-2">{{ results.meta?.title || "Missing" }}</span>
            </div>
            <div
              :class="results.meta?.title ? 'text-green-600' : 'text-red-600'"
            >
              {{ results.meta?.title ? "✓" : "✗" }}
            </div>
          </div>

          <!-- Description -->
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <span class="font-medium">Meta Description:</span>
              <span class="ml-2">{{
                results.meta?.description ? "Present" : "Missing"
              }}</span>
            </div>
            <div
              :class="
                results.meta?.description ? 'text-green-600' : 'text-red-600'
              "
            >
              {{ results.meta?.description ? "✓" : "✗" }}
            </div>
          </div>

          <!-- Performance -->
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <span class="font-medium">Load Time:</span>
              <span class="ml-2"
                >{{ results.performance?.loadTime || "Unknown" }}ms</span
              >
            </div>
            <div
              :class="
                (results.performance?.loadTime || 0) < 3000
                  ? 'text-green-600'
                  : 'text-yellow-600'
              "
            >
              {{ (results.performance?.loadTime || 0) < 3000 ? "✓" : "!" }}
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg text-center">
          <p class="text-blue-800 mb-3">
            Want a complete analysis with recommendations and monitoring?
          </p>
          <NuxtLink to="/auth/register" class="btn btn-primary">
            Get Full SEO Audit Free
          </NuxtLink>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
        <button
          @click="error = ''"
          class="text-red-600 text-sm mt-2 hover:underline"
        >
          Dismiss
        </button>
      </div>

      <!-- Demo Features -->
      <div class="mt-12 grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div
            class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <ChartBarIcon class="w-8 h-8 text-blue-600" />
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">
            Comprehensive Analysis
          </h3>
          <p class="text-gray-600">
            Get detailed insights into technical SEO, content, and performance.
          </p>
        </div>

        <div class="text-center">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <LightBulbIcon class="w-8 h-8 text-green-600" />
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">AI Recommendations</h3>
          <p class="text-gray-600">
            Receive intelligent suggestions to improve your search rankings.
          </p>
        </div>

        <div class="text-center">
          <div
            class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <BoltIcon class="w-8 h-8 text-purple-600" />
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Real-time Monitoring</h3>
          <p class="text-gray-600">
            Track improvements and get alerts when issues are detected.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ChartBarIcon,
  LightBulbIcon,
  BoltIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  layout: "default",
});

const demoUrl = ref("https://example.com");
const loading = ref(false);
const results = ref(null);
const error = ref("");

async function runDemoAnalysis() {
  if (!demoUrl.value) return;

  loading.value = true;
  error.value = "";
  results.value = null;

  try {
    const response = await $fetch("/api/seo/analyze", {
      method: "POST",
      body: {
        url: demoUrl.value,
        options: {
          includeImages: true,
          checkMobile: true,
          includePerformance: true,
        },
      },
    });

    if (response.success) {
      results.value = response.data;
    } else {
      error.value = response.error || "Analysis failed";
    }
  } catch (err) {
    console.error("Demo analysis error:", err);
    error.value = "Failed to analyze website. Please try again.";
  } finally {
    loading.value = false;
  }
}

// SEO
const { setPageMeta } = useSEO();
setPageMeta({
  title: "SEO Audit Demo | Neon SEO Beacon",
  description:
    "Try our SEO analysis tool for free. See how we analyze websites for technical SEO, content quality, and performance optimization.",
});
</script>
