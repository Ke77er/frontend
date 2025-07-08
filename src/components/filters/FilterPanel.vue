<template>
  <div class="filter-panel">
    <div class="filter-header" @click="toggleExpanded">
      <div class="filter-title">
        <i class="pi pi-filter"></i>
        <span>Filtros</span>
        <Badge :value="activeFiltersCount" v-if="activeFiltersCount > 0" />
      </div>
      <Button
        :icon="isExpanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
        class="p-button-text p-button-sm toggle-btn"
      />
    </div>
    
    <div class="filter-content" :class="{ 'expanded': isExpanded }">
      <div class="filter-grid">
        <div class="filter-group">
          <label class="filter-label">Empresa</label>
          <Dropdown
            v-model="empresaSelecionada"
            :options="empresas"
            option-label="label"
            option-value="value"
            placeholder="Selecionar..."
            class="filter-control"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label">Período</label>
          <div class="date-controls">
            <Calendar
              v-model="dataInicio"
              dateFormat="dd/mm/yy"
              showIcon
              placeholder="Início"
              class="date-input"
            />
            <Calendar
              v-model="dataFim"
              dateFormat="dd/mm/yy"
              showIcon
              placeholder="Fim"
              class="date-input"
            />
          </div>
          <div class="quick-filters">
            <Button
              v-for="filter in quickFilters"
              :key="filter.key"
              @click="setQuickFilter(filter.key)"
              :label="filter.label"
              class="p-button-outlined p-button-sm quick-btn"
              size="small"
            />
          </div>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">Categorias</label>
          <MultiSelect
            v-model="categoriasSelecionadas"
            :options="categorias"
            option-label="label"
            option-value="value"
            placeholder="Todas"
            class="filter-control"
            :maxSelectedLabels="1"
            selectedItemsLabel="{0} selecionadas"
          />
        </div>
        
        <div class="filter-group">
          <label class="filter-label">Contas</label>
          <MultiSelect
            v-model="contasSelecionadas"
            :options="contas"
            option-label="label"
            option-value="value"
            placeholder="Todas"
            class="filter-control"
            :maxSelectedLabels="1"
            selectedItemsLabel="{0} selecionadas"
          />
        </div>
        
        <div class="filter-actions">
          <Button
            @click="clearFilters"
            label="Limpar"
            icon="pi pi-times"
            class="p-button-outlined p-button-sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useParametros } from '../../composables/useParametros'
import { useDataService } from '../../composables/useDataService'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from 'date-fns'

const { 
  categoriasSelecionadas, 
  contasSelecionadas, 
  empresaSelecionada,
  dataInicio,
  dataFim
} = useParametros()

const { getUniqueCategories, getUniqueAccounts, getAvailableCompanies } = useDataService()

const isExpanded = ref(false)
const categorias = ref([])
const contas = ref([])
const empresas = ref([])

const quickFilters = [
  { key: 'hoje', label: 'Hoje' },
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mês' },
  { key: 'trimestre', label: 'Trimestre' }
]

const activeFiltersCount = computed(() => {
  let count = 0
  if (categoriasSelecionadas.value.length > 0) count++
  if (contasSelecionadas.value.length > 0) count++
  if (empresaSelecionada.value && empresaSelecionada.value !== 'empresa1') count++
  return count
})

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const setQuickFilter = (periodo) => {
  const hoje = new Date()
  
  switch (periodo) {
    case 'hoje':
      dataInicio.value = hoje
      dataFim.value = hoje
      break
    case 'semana':
      dataInicio.value = startOfWeek(hoje, { weekStartsOn: 1 })
      dataFim.value = endOfWeek(hoje, { weekStartsOn: 1 })
      break
    case 'mes':
      dataInicio.value = startOfMonth(hoje)
      dataFim.value = endOfMonth(hoje)
      break
    case 'trimestre':
      dataInicio.value = startOfQuarter(hoje)
      dataFim.value = endOfQuarter(hoje)
      break
  }
}

const clearFilters = () => {
  categoriasSelecionadas.value = []
  contasSelecionadas.value = []
  setQuickFilter('mes')
}

const updateOptions = () => {
  categorias.value = getUniqueCategories()
  contas.value = getUniqueAccounts()
}

watch(empresaSelecionada, updateOptions)

onMounted(() => {
  empresas.value = getAvailableCompanies()
  if (empresas.value.length > 0 && !empresaSelecionada.value) {
    empresaSelecionada.value = empresas.value[0].value
  }
  
  if (!dataInicio.value) {
    setQuickFilter('mes')
  }
  
  updateOptions()
})
</script>

<style scoped>
.filter-panel {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  margin-bottom: var(--spacing-6);
  border: 1px solid var(--color-border);
}

.filter-header {
  background: var(--color-muted);
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all var(--transition-normal);
}

.filter-header:hover {
  background: var(--color-accent);
}

.filter-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  font-size: var(--font-size-base);
}

.toggle-btn {
  color: var(--color-primary);
}

.filter-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--transition-normal);
}

.filter-content.expanded {
  max-height: 500px;
}

.filter-grid {
  padding: var(--spacing-6);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-6);
  align-items: start;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.filter-label {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  font-size: var(--font-size-sm);
}

.filter-control {
  min-width: 180px;
}

.date-controls {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.date-input {
  flex: 1;
  min-width: 120px;
}

.quick-filters {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
  margin-top: var(--spacing-2);
}

.quick-btn {
  font-size: var(--font-size-xs);
  padding: var(--spacing-1) var(--spacing-3);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.quick-btn:hover {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}

.filter-actions {
  display: flex;
  align-items: end;
  justify-content: center;
}

@media (max-width: 1024px) {
  .filter-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .date-controls {
    flex-direction: column;
  }
  
  .date-input {
    min-width: 100%;
  }
}
</style>