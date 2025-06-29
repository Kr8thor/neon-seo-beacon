<template>
  <div>
    <slot v-if="!hasError" />
    <div v-else class="error-boundary-fallback">
      <div
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-lg mx-auto"
      >
        <div class="flex items-center">
          <svg
            class="w-8 h-8 text-red-500 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
          <div>
            <h3 class="text-lg font-medium text-red-800 dark:text-red-200">
              {{ title }}
            </h3>
            <p class="text-red-600 dark:text-red-300 mt-1">
              {{ message }}
            </p>
          </div>
        </div>

        <div class="mt-4 flex space-x-3">
          <button
            @click="retry"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          <button
            @click="reportError"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Report Issue
          </button>
        </div>

        <details v-if="showDetails && errorDetails" class="mt-4">
          <summary
            class="cursor-pointer text-sm text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200"
          >
            Technical Details
          </summary>
          <pre
            class="mt-2 text-xs bg-red-100 dark:bg-red-900/30 p-3 rounded border overflow-auto max-h-32"
            >{{ errorDetails }}</pre
          >
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  message?: string;
  showDetails?: boolean;
  onRetry?: () => void;
  onReport?: (error: Error) => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Something went wrong",
  message: "An unexpected error occurred. Please try refreshing the page.",
  showDetails: false,
});

const hasError = ref(false);
const errorDetails = ref<string>("");
const errorInstance = ref<Error | null>(null);

// Handle Vue component errors
onErrorCaptured((error: Error, instance, info: string) => {
  console.error("Error boundary caught error:", error, info);

  hasError.value = true;
  errorInstance.value = error;
  errorDetails.value = `${error.message}\n\nComponent: ${info}\n\nStack: ${error.stack}`;

  // Report error to monitoring service (implement as needed)
  if (process.client) {
    // You can integrate with Sentry, LogRocket, etc. here
    console.error("Component error:", {
      error: error.message,
      stack: error.stack,
      componentInfo: info,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  // Prevent the error from propagating
  return false;
});

const retry = () => {
  hasError.value = false;
  errorDetails.value = "";
  errorInstance.value = null;

  if (props.onRetry) {
    props.onRetry();
  } else {
    // Default retry: reload the page
    if (process.client) {
      window.location.reload();
    }
  }
};

const reportError = () => {
  if (props.onReport && errorInstance.value) {
    props.onReport(errorInstance.value);
  } else {
    // Default error reporting
    if (process.client && errorInstance.value) {
      const subject = encodeURIComponent("Error Report: " + props.title);
      const body = encodeURIComponent(`
Error: ${errorInstance.value.message}
URL: ${window.location.href}
Time: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}

Stack Trace:
${errorInstance.value.stack}

Details:
${errorDetails.value}
      `);

      window.open(
        `mailto:support@yourdomain.com?subject=${subject}&body=${body}`,
      );
    }
  }
};

// Clear error state when component unmounts
onUnmounted(() => {
  hasError.value = false;
  errorDetails.value = "";
  errorInstance.value = null;
});
</script>

<style scoped>
.error-boundary-fallback {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
</style>
