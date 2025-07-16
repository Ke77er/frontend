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
          <div class="date-slider-container">
            <div class="date-range-info">
              <div class="date-display">
                <span class="date-label">De:</span>
                <span class="date-value">{{ formatDate(dataInicio) }}</span>
              </div>
              <div class="period-stats">
                <div class="stat-item">
                  <i class="pi pi-calendar"></i>
                  <span>{{ periodStats?.days || 0 }} dias</span>
                </div>
                <div class="stat-item">
                  <i class="pi pi-clock"></i>
                  <span>{{ periodStats?.months || 0 }} meses</span>
                </div>
              </div>
              <div class="date-display">
                <span class="date-label">Até:</span>
                <span class="date-value">{{ formatDate(dataFim) }}</span>
              </div>
            </div>
            
            <div class="slider-container">
              <div class="slider-track">
                <div 
                  class="slider-range" 
                  :style="sliderRangeStyle"
                ></div>
                <div 
                  class="slider-thumb start-thumb"
                  :style="{ left: startThumbPosition }"
                  @mousedown="startDrag('start', $event)"
                  @touchstart="startDrag('start', $event)"
                >
                  <div class="thumb-tooltip">{{ formatDate(dataInicio) }}</div>
                </div>
                <div 
                  class="slider-thumb end-thumb"
                  :style="{ left: endThumbPosition }"
                  @mousedown="startDrag('end', $event)"
                  @touchstart="startDrag('end', $event)"
                >
                  <div class="thumb-tooltip">{{ formatDate(dataFim) }}</div>
                </div>
              </div>
              
              <div class="slider-labels">
                <span class="slider-label-start">{{ formatDate(minDate, 'MMM/yy') }}</span>
                <span class="slider-label-end">{{ formatDate(maxDate, 'MMM/yy') }}</span>
              </div>
            </div>
            
            <div class="slider-actions">
              <Button
                @click="resetToCurrentMonth"
                label="Mês Atual"
                icon="pi pi-refresh"
                class="p-button-outlined p-button-sm reset-btn"
              />
            </div>
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
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useParametros } from '../../composables/useParametros'
import { useDataService } from '../../composables/useDataService'
import { formatDate } from '../../utils/dateUtils'
import { startOfMonth, endOfMonth, differenceInDays, differenceInMonths, addDays } from 'date-fns'

const { 
  categoriasSelecionadas, 
  contasSelecionadas, 
  empresaSelecionada,
  dataInicio,
  dataFim
} = useParametros()

const { getUniqueCategories, getUniqueAccounts, getAvailableCompanies, data } = useDataService()

const isExpanded = ref(false)
const categorias = ref([])
const contas = ref([])
const empresas = ref([])
const minDate = ref(new Date())
const maxDate = ref(new Date())

// Estado do slider
const isDragging = ref(false)
const dragType = ref('')
const dragStartX = ref(0)
const sliderWidth = ref(0)

const activeFiltersCount = computed(() => {
  let count = 0
  if (categoriasSelecionadas.value.length > 0) count++
  if (contasSelecionadas.value.length > 0) count++
  if (empresaSelecionada.value && empresaSelecionada.value !== 'empresa1') count++
  return count
})

// Estatísticas do período selecionado
const periodStats = computed(() => {
  if (!dataInicio.value || !dataFim.value) {
    return { days: 0, months: 0 }
  }
  
  const days = differenceInDays(dataFim.value, dataInicio.value) + 1
  const months = Math.round(differenceInMonths(dataFim.value, dataInicio.value) * 10) / 10
  
  return {
    days,
    months: months || 0.1
  }
})

// Posições dos thumbs do slider
const startThumbPosition = computed(() => {
  if (!minDate.value || !maxDate.value || !dataInicio.value) return '0%'
  
  const totalDays = differenceInDays(maxDate.value, minDate.value)
  const startDays = differenceInDays(dataInicio.value, minDate.value)
  
  return `${(startDays / totalDays) * 100}%`
})

const endThumbPosition = computed(() => {
  if (!minDate.value || !maxDate.value || !dataFim.value) return '100%'
  
  const totalDays = differenceInDays(maxDate.value, minDate.value)
  const endDays = differenceInDays(dataFim.value, minDate.value)
  
  return `${(endDays / totalDays) * 100}%`
})

const sliderRangeStyle = computed(() => {
  return {
    left: startThumbPosition.value,
    width: `calc(${endThumbPosition.value} - ${startThumbPosition.value})`
  }
})

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const setQuickFilter = (periodo) => {
  const { inicio, fim } = getQuickFilterDates(periodo)
  dataInicio.value = inicio
  dataFim.value = fim
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
  background: linear-gradient(135deg, var(--wood-50), white);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(93, 64, 55, 0.12);
  overflow: hidden;
  margin-bottom: 1.5rem;
  border: 2px solid var(--wood-200);
}

.filter-header {
  background: linear-gradient(135deg, var(--wood-100) 0%, var(--wood-200) 100%);
  padding: 1rem 1.5rem;
  border-bottom: 2px solid var(--wood-300);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
}

.filter-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.filter-header:hover {
  background: linear-gradient(135deg, var(--wood-200) 0%, var(--wood-300) 100%);
}

.filter-header:hover::before {
  opacity: 1;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: #5d4037;
  font-size: 1.1rem;
  font-family: 'Georgia', 'Times New Roman', serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-title i {
  color: #5d4037 !important;
  opacity: 1 !important;
}

.toggle-btn {
  color: #a1887f !important;
}

.toggle-btn i {
  color: #a1887f !important;
  opacity: 1 !important;
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
  color: var(--primary-color);
  font-size: 0.875rem;
  font-family: 'Georgia', 'Times New Roman', serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  border-color: var(--wood-500);
  color: var(--wood-600);
  font-family: 'Georgia', 'Times New Roman', serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quick-btn:hover {
  background: var(--wood-500);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(141, 110, 99, 0.3);
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
  
  .date-range-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .period-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .slider-container {
    margin: 1.5rem 0;
  }
  
  .slider-thumb {
    width: 28px;
    height: 28px;
    top: -10px;
  }
  
  .thumb-tooltip {
    top: -40px;
    font-size: 0.65rem;
  }
}
</style>