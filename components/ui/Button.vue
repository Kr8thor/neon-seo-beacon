<template>
  <component
    :is="component"
    :to="to"
    :href="href"
    :type="isButton ? type : undefined"
    :disabled="disabled || loading"
    :class="buttonClasses"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn-spinner">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <span v-if="icon && iconPosition === 'left'" class="btn-icon btn-icon-left">
      <slot name="icon">
        <component :is="icon" class="h-4 w-4" />
      </slot>
    </span>
    <span class="btn-content">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="icon && iconPosition === 'right'" class="btn-icon btn-icon-right">
      <slot name="icon">
        <component :is="icon" class="h-4 w-4" />
      </slot>
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NuxtLink } from '#components'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  icon?: any
  iconPosition?: 'left' | 'right'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  to?: string
  href?: string
}>(), {
  variant: 'primary',
  size: 'md',
  iconPosition: 'left',
  loading: false,
  disabled: false,
  fullWidth: false,
  type: 'button',
})

const component = computed(() => {
  if (props.to) return NuxtLink
  if (props.href) return 'a'
  return 'button'
})

const isButton = computed(() => !props.to && !props.href)

const buttonClasses = computed(() => {
  const base = 'btn inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900'

  const variants: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-sm',
    secondary: 'bg-surface text-text-primary border border-border hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:ring-primary',
    outline: 'bg-transparent text-primary border border-primary hover:bg-primary/10 focus:ring-primary',
    ghost: 'bg-transparent text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-text-primary focus:ring-primary',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
  }

  const sizes: Record<string, string> = {
    xs: 'px-2 py-1 text-xs rounded',
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-5 py-2.5 text-base rounded-lg',
    xl: 'px-6 py-3 text-base rounded-xl',
  }

  const disabled = props.disabled || props.loading
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer'

  const width = props.fullWidth ? 'w-full' : ''

  return [base, variants[props.variant], sizes[props.size], disabled, width].filter(Boolean).join(' ')
})
</script>

<style scoped>
.btn-spinner {
  @apply mr-2;
}

.btn-icon-left {
  @apply mr-2 -ml-0.5;
}

.btn-icon-right {
  @apply ml-2 -mr-0.5;
}
</style>
