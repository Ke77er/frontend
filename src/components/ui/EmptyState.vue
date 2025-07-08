<template>
  <div class="empty-state">
    <div class="empty-state-icon">
      <slot name="icon">
        <i :class="icon || 'pi pi-inbox'"></i>
      </slot>
    </div>
    
    <div class="empty-state-content">
      <h3 class="empty-state-title">
        <slot name="title">{{ title || 'Nenhum item encontrado' }}</slot>
      </h3>
      
      <p v-if="description || $slots.description" class="empty-state-description">
        <slot name="description">{{ description }}</slot>
      </p>
      
      <div v-if="$slots.actions" class="empty-state-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-12) var(--spacing-6);
  min-height: 300px;
}

.empty-state-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-6);
  font-size: 2rem;
  color: var(--color-text-muted);
}

.empty-state-content {
  max-width: 400px;
}

.empty-state-title {
  margin: 0 0 var(--spacing-3) 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.empty-state-description {
  margin: 0 0 var(--spacing-6) 0;
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  line-height: 1.6;
}

.empty-state-actions {
  display: flex;
  gap: var(--spacing-3);
  justify-content: center;
  flex-wrap: wrap;
}
</style>