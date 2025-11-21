<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <div class="flex items-center justify-between">
          <div>
            <h3 v-if="title" class="card-title">{{ title }}</h3>
            <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
          </div>
          <div v-if="$slots.actions" class="card-actions">
            <slot name="actions" />
          </div>
        </div>
      </slot>
    </div>
    <div :class="bodyClasses">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  clickable?: boolean
}>(), {
  variant: 'default',
  padding: 'md',
  hover: false,
  clickable: false,
})

const cardClasses = computed(() => {
  const base = 'card rounded-xl overflow-hidden'

  const variants: Record<string, string> = {
    default: 'bg-surface border border-border shadow-sm',
    elevated: 'bg-surface shadow-lg',
    outlined: 'bg-transparent border-2 border-border',
    filled: 'bg-neutral-100 dark:bg-neutral-800',
  }

  const interactive = props.hover || props.clickable
    ? 'transition-all duration-200 hover:shadow-md hover:border-primary/50'
    : ''

  const cursor = props.clickable ? 'cursor-pointer' : ''

  return [base, variants[props.variant], interactive, cursor].filter(Boolean).join(' ')
})

const bodyClasses = computed(() => {
  const paddings: Record<string, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  return `card-body ${paddings[props.padding]}`
})
</script>

<style scoped>
.card-header {
  @apply px-6 py-4 border-b border-border;
}

.card-title {
  @apply text-lg font-semibold text-text-primary;
}

.card-subtitle {
  @apply mt-1 text-sm text-text-muted;
}

.card-actions {
  @apply flex items-center gap-2;
}

.card-footer {
  @apply px-6 py-4 border-t border-border bg-neutral-50 dark:bg-neutral-800/50;
}
</style>
