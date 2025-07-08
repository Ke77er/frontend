<template>
  <div :class="skeletonClasses" :style="skeletonStyles">
    <div class="skeleton-shimmer"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: '20px'
  },
  variant: {
    type: String,
    default: 'rectangular',
    validator: (value) => ['rectangular', 'circular', 'text'].includes(value)
  },
  animation: {
    type: String,
    default: 'pulse',
    validator: (value) => ['pulse', 'wave', 'none'].includes(value)
  }
})

const skeletonClasses = computed(() => [
  'skeleton-loader',
  `skeleton-loader--${props.variant}`,
  `skeleton-loader--${props.animation}`
])

const skeletonStyles = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}))
</script>

<style scoped>
.skeleton-loader {
  position: relative;
  background: var(--color-muted);
  overflow: hidden;
}

.skeleton-loader--rectangular {
  border-radius: var(--radius-md);
}

.skeleton-loader--circular {
  border-radius: 50%;
}

.skeleton-loader--text {
  border-radius: var(--radius-sm);
  height: 1em;
}

.skeleton-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.skeleton-loader--pulse .skeleton-shimmer {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeleton-loader--wave .skeleton-shimmer {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: wave 1.5s linear infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>