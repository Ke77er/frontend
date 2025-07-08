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
            class="p-button-outlined p-button-secondary p-button-sm"
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
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(26, 54, 93, 0.08);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.filter-header {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--neutral-200);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.filter-header:hover {
  background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: var(--primary-color);
  font-size: 1rem;
}

.toggle-btn {
  color: var(--primary-light);
}

.filter-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.filter-content.expanded {
  max-height: 500px;
}

.filter-grid {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: var(--neutral-600);
  font-size: 0.875rem;
}

.filter-control {
  min-width: 180px;
}

.date-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.date-input {
  flex: 1;
  min-width: 120px;
}

.quick-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.quick-btn {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-color: var(--primary-light);
  color: var(--primary-light);
}

.quick-btn:hover {
  background: var(--primary-light);
  color: white;
}

.filter-actions {
  display: flex;
  align-items: end;
  justify-content: center;
}

@media (max-width: 1024px) {
  .filter-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .date-controls {
    flex-direction: column;
  }
  
  .date-input {
    min-width: 100%;
  }
}
</style>