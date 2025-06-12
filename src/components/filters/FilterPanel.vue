<template>
  <div class="filter-panel">
    <div class="filter-header">
      <h3 class="filter-title">
        <i class="pi pi-filter"></i>
        Filtros
      </h3>
      <Button
        @click="toggleFilters"
        :icon="showFilters ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
        class="p-button-text p-button-sm mobile-toggle"
        aria-label="Toggle filters"
      />
    </div>
    
    <div class="filter-content" :class="{ 'filter-content--collapsed': !showFilters }">
      <div class="filter-group">
        <label class="filter-label">Categorias</label>
        <MultiSelect
          v-model="categoriasSelecionadas"
          :options="categorias"
          option-label="label"
          option-value="value"
          placeholder="Selecionar categorias..."
          class="filter-multiselect"
          :maxSelectedLabels="maxLabels"
          selectedItemsLabel="{0} categorias selecionadas"
        />
      </div>
      
      <div class="filter-group">
        <label class="filter-label">Contas Financeiras</label>
        <MultiSelect
          v-model="contasSelecionadas"
          :options="contas"
          option-label="label"
          option-value="value"
          placeholder="Selecionar contas..."
          class="filter-multiselect"
          :maxSelectedLabels="maxLabels"
          selectedItemsLabel="{0} contas selecionadas"
        />
      </div>
      
      <div class="filter-actions">
        <Button
          @click="clearFilters"
          label="Limpar"
          icon="pi pi-times"
          class="p-button-outlined p-button-secondary clear-button"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useParametros } from '../../composables/useParametros'
import { useDataService } from '../../composables/useDataService'

const { categoriasSelecionadas, contasSelecionadas } = useParametros()
const { getUniqueCategories, getUniqueAccounts } = useDataService()

const categorias = ref([])
const contas = ref([])
const showFilters = ref(true)

// Responsive max labels
const maxLabels = computed(() => {
  if (window.innerWidth < 480) return 1
  if (window.innerWidth < 768) return 2
  return 2
})

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const clearFilters = () => {
  categoriasSelecionadas.value = []
  contasSelecionadas.value = []
}

onMounted(() => {
  categorias.value = getUniqueCategories()
  contas.value = getUniqueAccounts()
  
  // Auto-collapse on mobile
  if (window.innerWidth < 768) {
    showFilters.value = false
  }
})
</script>

<style scoped>
.filter-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.filter-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mobile-toggle {
  display: none;
}

.filter-content {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1.5rem;
  align-items: end;
  transition: all 0.3s ease;
}

.filter-content--collapsed {
  display: none;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
}

.filter-multiselect {
  min-width: 250px;
}

.filter-multiselect :deep(.p-multiselect) {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.filter-multiselect :deep(.p-multiselect:hover) {
  border-color: #cbd5e1;
}

.filter-multiselect :deep(.p-multiselect.p-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-actions {
  display: flex;
  align-items: center;
}

.clear-button {
  white-space: nowrap;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .filter-header {
    padding: 1rem;
  }
  
  .filter-title {
    font-size: 1.1rem;
  }
  
  .mobile-toggle {
    display: flex;
  }
  
  .filter-content {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
  
  .filter-multiselect {
    min-width: 100%;
  }
  
  .filter-actions {
    justify-content: center;
  }
  
  .clear-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .filter-header {
    padding: 0.75rem;
  }
  
  .filter-title {
    font-size: 1rem;
    gap: 0.25rem;
  }
  
  .filter-title i {
    font-size: 0.9rem;
  }
  
  .filter-content {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .filter-label {
    font-size: 0.8rem;
  }
  
  .filter-multiselect :deep(.p-multiselect) {
    font-size: 0.9rem;
  }
}

/* Landscape mobile optimization */
@media (max-width: 768px) and (orientation: landscape) {
  .filter-content {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .filter-actions {
    grid-column: 1 / -1;
    justify-content: center;
  }
}
</style>