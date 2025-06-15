<template>
  <div class="filter-panel">
    <div class="filter-header">
      <h3 class="filter-title">
        <i class="pi pi-filter"></i>
        Filtros e Configurações
      </h3>
    </div>
    
    <div class="filter-content">
      <div class="filter-group">
        <label class="filter-label">Empresa</label>
        <Dropdown
          v-model="empresaSelecionada"
          :options="empresas"
          option-label="label"
          option-value="value"
          placeholder="Selecionar empresa..."
          class="filter-dropdown"
        />
      </div>

      <div class="filter-group">
        <label class="filter-label">Período</label>
        <div class="date-range-container">
          <Calendar
            v-model="dataInicio"
            dateFormat="dd/mm/yy"
            showIcon
            placeholder="Data inicial"
            class="date-input"
          />
          <span class="date-separator">até</span>
          <Calendar
            v-model="dataFim"
            dateFormat="dd/mm/yy"
            showIcon
            placeholder="Data final"
            class="date-input"
          />
        </div>
        <div class="quick-filters">
          <Button
            @click="setQuickFilter('hoje')"
            label="Hoje"
            class="p-button-outlined p-button-sm quick-btn"
          />
          <Button
            @click="setQuickFilter('semana')"
            label="Esta Semana"
            class="p-button-outlined p-button-sm quick-btn"
          />
          <Button
            @click="setQuickFilter('mes')"
            label="Este Mês"
            class="p-button-outlined p-button-sm quick-btn"
          />
          <Button
            @click="setQuickFilter('trimestre')"
            label="Trimestre"
            class="p-button-outlined p-button-sm quick-btn"
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
import { ref, onMounted, watch } from 'vue'
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

const categorias = ref([])
const contas = ref([])
const empresas = ref([])

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
  dataInicio.value = startOfMonth(new Date())
  dataFim.value = endOfMonth(new Date())
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
  
  // Define período padrão como mês atual
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  color: #475569;
  font-size: 0.9rem;
}

.date-range-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.date-input {
  flex: 1;
  min-width: 120px;
}

.date-separator {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.quick-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.quick-btn {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
}

.filter-dropdown,
.filter-multiselect {
  min-width: 200px;
}

.filter-dropdown :deep(.p-dropdown),
.filter-multiselect :deep(.p-multiselect) {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.filter-dropdown :deep(.p-dropdown:hover),
.filter-multiselect :deep(.p-multiselect:hover) {
  border-color: #cbd5e1;
}

.filter-dropdown :deep(.p-dropdown.p-focus),
.filter-multiselect :deep(.p-multiselect.p-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-actions {
  display: flex;
  align-items: end;
  justify-content: center;
}

@media (max-width: 1024px) {
  .filter-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .date-range-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .date-input {
    min-width: 100%;
  }
  
  .filter-actions {
    justify-content: center;
  }
}
</style>