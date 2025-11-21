<template>
  <div class="form-field" :class="{ 'form-field-error': error }">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="form-input-wrapper">
      <span v-if="$slots.prefix || prefixIcon" class="form-input-prefix">
        <slot name="prefix">
          <component v-if="prefixIcon" :is="prefixIcon" class="h-5 w-5 text-text-muted" />
        </slot>
      </span>
      <input
        v-if="!multiline"
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      <textarea
        v-else
        :id="inputId"
        ref="inputRef"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :rows="rows"
        :class="inputClasses"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      <span v-if="$slots.suffix || suffixIcon" class="form-input-suffix">
        <slot name="suffix">
          <component v-if="suffixIcon" :is="suffixIcon" class="h-5 w-5 text-text-muted" />
        </slot>
      </span>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>
    <p v-else-if="hint" class="form-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: string
  error?: string
  hint?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autocomplete?: string
  size?: 'sm' | 'md' | 'lg'
  multiline?: boolean
  rows?: number
  prefixIcon?: any
  suffixIcon?: any
}>(), {
  type: 'text',
  size: 'md',
  multiline: false,
  rows: 3,
})

defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement | HTMLTextAreaElement>()
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  const base = 'form-input w-full bg-surface text-text-primary placeholder-text-muted border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-4 py-3 text-base rounded-lg',
  }

  const states = props.error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-border'

  const disabled = props.disabled
    ? 'bg-neutral-100 dark:bg-neutral-800 cursor-not-allowed opacity-60'
    : ''

  const hasPrefix = props.prefixIcon ? 'pl-10' : ''
  const hasSuffix = props.suffixIcon ? 'pr-10' : ''

  return [base, sizes[props.size], states, disabled, hasPrefix, hasSuffix].filter(Boolean).join(' ')
})

// Expose input ref for parent access
defineExpose({ inputRef })
</script>

<style scoped>
.form-field {
  @apply w-full;
}

.form-label {
  @apply block text-sm font-medium text-text-secondary mb-1.5;
}

.form-input-wrapper {
  @apply relative;
}

.form-input-prefix {
  @apply absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none;
}

.form-input-suffix {
  @apply absolute inset-y-0 right-0 flex items-center pr-3;
}

.form-error {
  @apply mt-1.5 text-sm text-red-600 dark:text-red-400;
}

.form-hint {
  @apply mt-1.5 text-sm text-text-muted;
}
</style>
