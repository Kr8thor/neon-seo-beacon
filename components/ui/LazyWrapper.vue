<template>
  <div>
    <!-- Show skeleton while loading -->
    <SkeletonLoader
      v-if="!componentLoaded"
      :type="skeletonType"
      :count="skeletonCount"
      :width="skeletonWidth"
      :height="skeletonHeight"
    />

    <!-- Render component when loaded -->
    <component
      v-else
      :is="loadedComponent"
      v-bind="$attrs"
      @error="handleError"
    />

    <!-- Error state -->
    <div
      v-if="error"
      class="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20"
    >
      <p class="text-red-600 dark:text-red-400 text-sm">
        Failed to load component.
        <button @click="retryLoad" class="underline hover:no-underline">
          Try again
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  component: () => Promise<any>;
  skeletonType?: "card" | "list" | "text" | "chart" | "table" | "custom";
  skeletonCount?: number;
  skeletonWidth?: string;
  skeletonHeight?: string;
  delay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  skeletonType: "card",
  skeletonCount: 3,
  skeletonWidth: "100%",
  skeletonHeight: "200px",
  delay: 0,
});

const componentLoaded = ref(false);
const loadedComponent = ref(null);
const error = ref(false);

const loadComponent = async () => {
  try {
    error.value = false;

    // Add artificial delay if specified (for demo purposes)
    if (props.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, props.delay));
    }

    const component = await props.component();
    loadedComponent.value = component.default || component;
    componentLoaded.value = true;
  } catch (err) {
    console.error("Failed to load component:", err);
    error.value = true;
  }
};

const retryLoad = () => {
  componentLoaded.value = false;
  loadedComponent.value = null;
  loadComponent();
};

const handleError = (err: Error) => {
  console.error("Component error:", err);
  error.value = true;
};

// Load component on mount
onMounted(() => {
  loadComponent();
});
</script>
