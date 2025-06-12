<template>
  <div class="filter-panel">
    <div class="filter-header">
      <h3 class="filter-title">
        <i class="pi pi-filter"></i>
        Filtros
      </h3>
    </div>
    
    <div class="filter-content">
      <div class="filter-group">
        <label class="filter-label">Categorias</label>
        <MultiSelect
          v-model="categoriasSelecionadas"
          :options="categorias"
          option-label="label"
          option-value="value"
          placeholder="Selecionar categorias..."
          class="filter-multiselect"
          :maxSelectedLabels="2"
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
          :maxSelectedLabels="2"
          selectedItemsLabel="{0} contas selecionadas"
        />
      </div>
      
      <div class="filter-actions">
        <Button
          @click="clearFilters"
          label="Limpar Filtros"
          icon="pi pi-times"
          class="p-button-outlined p-button-secondary"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useParametros } from '../../composables/useParametros'
import { useDataService } from '../../composables/useDataService'

const { categoriasSelecionadas, contasSelecionadas } = useParametros()
const { getUniqueCategories, getUniqueAccounts } = useDataService()

const categorias = ref([])
const contas = ref([])

const clearFilters = () => {
  categoriasSelecionadas.value = []
  contasSelecionadas.value = []
}

onMounted(() => {
  categorias.value = getUniqueCategories()
  contas.value = getUniqueAccounts()
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

.filter-content {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1.5rem;
  align-items: end;
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

@media (max-width: 1024px) {
  .filter-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .filter-multiselect {
    min-width: 100%;
  }
  
  .filter-actions {
    justify-content: center;
  }
}
</style>