<template>
  <div
    class="inline-flex items-center justify-center"
    :class="containerClasses"
  >
    <!-- Modern gradient spinner -->
    <div class="relative" :class="sizeClasses">
      <div
        class="absolute inset-0 rounded-full animate-spin"
        :class="[sizeClasses, spinnerClasses]"
        style="
          background: conic-gradient(
            from 90deg,
            transparent,
            #3b82f6,
            transparent
          );
        "
      />
      <div
        class="absolute inset-1 rounded-full bg-white dark:bg-gray-900"
        :class="innerClasses"
      />
    </div>

    <!-- Progress dots -->
    <div v-if="showDots" class="ml-3 flex space-x-1">
      <div
        v-for="i in 3"
        :key="i"
        class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
        :style="{ animationDelay: `${(i - 1) * 0.15}s` }"
      />
    </div>

    <span
      v-if="text"
      class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "accent";
  text?: string;
  showDots?: boolean;
  fullScreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  variant: "primary",
  text: "",
  showDots: true,
  fullScreen: false,
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "h-4 w-4";
    case "lg":
      return "h-8 w-8";
    case "xl":
      return "h-12 w-12";
    default:
      return "h-6 w-6";
  }
});

const innerClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "inset-0.5";
    case "lg":
      return "inset-1.5";
    case "xl":
      return "inset-2";
    default:
      return "inset-1";
  }
});

const spinnerClasses = computed(() => {
  const base = "opacity-75";
  switch (props.variant) {
    case "secondary":
      return `${base} shadow-lg`;
    case "accent":
      return `${base} shadow-xl`;
    default:
      return `${base} shadow-md`;
  }
});

const containerClasses = computed(() => {
  return props.fullScreen
    ? "fixed inset-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
    : "p-2";
});
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
