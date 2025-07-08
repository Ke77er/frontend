<template>
  <div class="input-wrapper">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>
    
    <div class="input-container">
      <div v-if="$slots.prefix || prefixIcon" class="input-prefix">
        <slot name="prefix">
          <i v-if="prefixIcon" :class="prefixIcon"></i>
        </slot>
      </div>
      
      <input
        :id="inputId"
        :class="inputClasses"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        v-bind="$attrs"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <div v-if="$slots.suffix || suffixIcon || loading" class="input-suffix">
        <div v-if="loading" class="loading-spinner"></div>
        <slot v-else name="suffix">
          <i v-if="suffixIcon" :class="suffixIcon"></i>
        </slot>
      </div>
    </div>
    
    <div v-if="error || hint" class="input-message">
      <span v-if="error" class="input-error">{{ error }}</span>
      <span v-else-if="hint" class="input-hint">{{ hint }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'filled', 'ghost'].includes(value)
  },
  prefixIcon: {
    type: String,
    default: null
  },
  suffixIcon: {
    type: String,
    default: null
  },
  error: {
    type: String,
    default: null
  },
  hint: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const isFocused = ref(false)
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => [
  'base-input',
  `base-input--${props.size}`,
  `base-input--${props.variant}`,
  {
    'base-input--focused': isFocused.value,
    'base-input--error': props.error,
    'base-input--disabled': props.disabled,
    'base-input--readonly': props.readonly,
    'base-input--has-prefix': props.$slots?.prefix || props.prefixIcon,
    'base-input--has-suffix': props.$slots?.suffix || props.suffixIcon || props.loading
  }
])

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.input-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.input-required {
  color: var(--color-danger);
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input {
  width: 100%;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--color-text);
  background: var(--color-input);
  transition: all var(--transition-normal);
  outline: none;
}

.base-input:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.base-input--error {
  border-color: var(--color-danger);
}

.base-input--error:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.base-input--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--color-muted);
}

.base-input--readonly {
  background: var(--color-muted);
  cursor: default;
}

/* Sizes */
.base-input--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
  min-height: 32px;
}

.base-input--md {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
  min-height: 40px;
}

.base-input--lg {
  padding: var(--spacing-4) var(--spacing-5);
  font-size: var(--font-size-lg);
  min-height: 48px;
}

/* Variants */
.base-input--filled {
  background: var(--color-muted);
  border: 2px solid transparent;
}

.base-input--filled:focus {
  background: var(--color-input);
  border-color: var(--color-primary);
}

.base-input--ghost {
  background: transparent;
  border: 2px solid transparent;
  border-bottom: 2px solid var(--color-border);
  border-radius: 0;
}

.base-input--ghost:focus {
  border-bottom-color: var(--color-primary);
}

/* Prefix/Suffix */
.base-input--has-prefix {
  padding-left: var(--spacing-10);
}

.base-input--has-suffix {
  padding-right: var(--spacing-10);
}

.input-prefix,
.input-suffix {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: var(--color-text-muted);
  pointer-events: none;
}

.input-prefix {
  left: var(--spacing-3);
}

.input-suffix {
  right: var(--spacing-3);
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.input-message {
  font-size: var(--font-size-sm);
}

.input-error {
  color: var(--color-danger);
}

.input-hint {
  color: var(--color-text-muted);
}
</style>