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

        <div class="filter-group period-group">
          <label class="filter-label">Período</label>
          <div class="period-slider-container">
            <div class="period-info">
              <div class="period-dates">
                <span class="period-date">{{ formatDate(dataInicio) }}</span>
                <span class="period-separator">até</span>
                <span class="period-date">{{ formatDate(dataFim) }}</span>
              </div>
              <div class="period-duration">
                <i class="pi pi-calendar"></i>
                <span>{{ periodDuration }}</span>
              </div>
            </div>
            
            <div class="slider-container">
              <div class="slider-track" ref="sliderTrack">
                <div class="slider-range" :style="rangeStyle"></div>
                <div 
                  class="slider-thumb slider-thumb-start" 
                  :style="{ left: startThumbPosition }"
                  @mousedown="startDrag('start', $event)"
                  @touchstart="startDrag('start', $event)"
                >
                  <div class="thumb-tooltip">{{ formatDate(dataInicio) }}</div>
                </div>
                <div 
                  class="slider-thumb slider-thumb-end" 
                  :style="{ left: endThumbPosition }"
                  @mousedown="startDrag('end', $event)"
                  @touchstart="startDrag('end', $event)"
                >
                  <div class="thumb-tooltip">{{ formatDate(dataFim) }}</div>
                </div>
              </div>
              
              <div class="slider-labels">
                <span class="slider-label-start">{{ formatDate(minDate) }}</span>
                <span class="slider-label-end">{{ formatDate(maxDate) }}</span>
              </div>
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
          <Button
            @click="resetToCurrentMonth"
            label="Mês Atual"
            icon="pi pi-refresh"
            class="p-button-outlined p-button-sm current-month-btn"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
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
const sliderTrack = ref(null)
const isDragging = ref(false)
const dragType = ref('')

const activeFiltersCount = computed(() => {
  let count = 0
  if (categoriasSelecionadas.value.length > 0) count++
  if (contasSelecionadas.value.length > 0) count++
  if (empresaSelecionada.value && empresaSelecionada.value !== 'empresa1') count++
  return count
})

const periodDuration = computed(() => {
  if (!dataInicio.value || !dataFim.value) return ''
  
  const days = differenceInDays(dataFim.value, dataInicio.value) + 1
  const months = differenceInMonths(dataFim.value, dataInicio.value)
  
  if (days === 1) {
    return '1 dia'
  } else if (days <= 31 && months === 0) {
    return `${days} dias`
  } else if (months === 1 && days <= 31) {
    return '1 mês'
  } else if (months > 0) {
    const remainingDays = days - (months * 30)
    if (remainingDays <= 0) {
      return `${months} ${months === 1 ? 'mês' : 'meses'}`
    } else {
      return `${months} ${months === 1 ? 'mês' : 'meses'} e ${remainingDays} dias`
    }
  } else {
    return `${days} dias`
  }
})

const totalDays = computed(() => {
  return differenceInDays(maxDate.value, minDate.value)
})

const startThumbPosition = computed(() => {
  if (!dataInicio.value || totalDays.value === 0) return '0%'
  const days = differenceInDays(dataInicio.value, minDate.value)
  const percentage = (days / totalDays.value) * 100
  return `${Math.max(0, Math.min(100, percentage))}%`
})

const endThumbPosition = computed(() => {
  if (!dataFim.value || totalDays.value === 0) return '100%'
  const days = differenceInDays(dataFim.value, minDate.value)
  const percentage = (days / totalDays.value) * 100
  return `${Math.max(0, Math.min(100, percentage))}%`
})

const rangeStyle = computed(() => {
  return {
    left: startThumbPosition.value,
    width: `calc(${endThumbPosition.value} - ${startThumbPosition.value})`
  }
})

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const clearFilters = () => {
  categoriasSelecionadas.value = []
  contasSelecionadas.value = []
  resetToCurrentMonth()
}

const resetToCurrentMonth = () => {
  const now = new Date()
  dataInicio.value = startOfMonth(now)
  dataFim.value = endOfMonth(now)
}

const updateOptions = () => {
  categorias.value = getUniqueCategories()
  contas.value = getUniqueAccounts()
}

const detectDateRange = () => {
  const dados = data.value
  if (!dados || dados.length === 0) {
    const now = new Date()
    minDate.value = startOfMonth(now)
    maxDate.value = endOfMonth(now)
    return
  }
  
  const dates = dados
    .map(item => new Date(item.data_ymd))
    .filter(date => !isNaN(date.getTime()))
    .sort((a, b) => a - b)
  
  if (dates.length > 0) {
    minDate.value = dates[0]
    maxDate.value = dates[dates.length - 1]
  } else {
    const now = new Date()
    minDate.value = startOfMonth(now)
    maxDate.value = endOfMonth(now)
  }
  
  console.log('Range de datas detectado:', {
    min: formatDate(minDate.value),
    max: formatDate(maxDate.value),
    total: dados.length
  })
}

const startDrag = (type, event) => {
  event.preventDefault()
  isDragging.value = true
  dragType.value = type
  
  const handleMouseMove = (e) => {
    if (!isDragging.value || !sliderTrack.value) return
    
    const rect = sliderTrack.value.getBoundingClientRect()
    const clientX = e.clientX || (e.touches && e.touches[0].clientX)
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    
    const newDays = Math.round((percentage / 100) * totalDays.value)
    const newDate = addDays(minDate.value, newDays)
    
    if (type === 'start') {
      if (newDate <= dataFim.value) {
        dataInicio.value = newDate
      }
    } else {
      if (newDate >= dataInicio.value) {
        dataFim.value = newDate
      }
    }
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
    dragType.value = ''
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('touchmove', handleMouseMove)
    document.removeEventListener('touchend', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('touchmove', handleMouseMove)
  document.addEventListener('touchend', handleMouseUp)
}

watch(empresaSelecionada, () => {
  updateOptions()
  detectDateRange()
})

watch(data, detectDateRange)

onMounted(async () => {
  empresas.value = getAvailableCompanies()
  if (empresas.value.length > 0 && !empresaSelecionada.value) {
    empresaSelecionada.value = empresas.value[0].value
  }
  
  await nextTick()
  detectDateRange()
  
  if (!dataInicio.value || !dataFim.value) {
    resetToCurrentMonth()
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

.period-group {
  grid-column: span 2;
  min-width: 400px;
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

.period-slider-container {
  background: linear-gradient(135deg, var(--wood-100), var(--wood-200));
  border: 2px solid var(--wood-300);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: inset 0 2px 4px rgba(93, 64, 55, 0.1);
}

.period-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.period-dates {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.period-date {
  background: linear-gradient(135deg, var(--wood-600), var(--wood-700));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(93, 64, 55, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.period-separator {
  color: var(--wood-700);
  font-weight: 600;
  font-style: italic;
}

.period-duration {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6));
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: var(--wood-800);
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid var(--wood-300);
  font-family: 'Georgia', 'Times New Roman', serif;
}

.period-duration i {
  color: var(--wood-600) !important;
  opacity: 1 !important;
}

.slider-container {
  position: relative;
  margin: 1rem 0;
}

.slider-track {
  position: relative;
  height: 8px;
  background: linear-gradient(135deg, var(--wood-300), var(--wood-400));
  border-radius: 4px;
  margin: 1rem 0;
  border: 1px solid var(--wood-500);
  box-shadow: inset 0 1px 3px rgba(93, 64, 55, 0.3);
}

.slider-range {
  position: absolute;
  top: 0;
  height: 100%;
  background: linear-gradient(135deg, var(--wood-600), var(--wood-700));
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(93, 64, 55, 0.3);
}

.slider-thumb {
  position: absolute;
  top: -8px;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, var(--wood-700), var(--wood-800));
  border: 3px solid white;
  border-radius: 50%;
  cursor: grab;
  transform: translateX(-50%);
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(93, 64, 55, 0.4);
}

.slider-thumb:hover {
  transform: translateX(-50%) scale(1.2);
  box-shadow: 0 4px 16px rgba(93, 64, 55, 0.6);
}

.slider-thumb:active {
  cursor: grabbing;
  transform: translateX(-50%) scale(1.1);
}

.thumb-tooltip {
  position: absolute;
  bottom: 35px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, var(--wood-800), var(--wood-900));
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-family: 'Georgia', 'Times New Roman', serif;
}

.thumb-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--wood-800);
}

.slider-thumb:hover .thumb-tooltip {
  opacity: 1;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--wood-600);
  font-weight: 500;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.filter-actions {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.current-month-btn {
  border-color: var(--wood-600);
  color: var(--wood-600);
  font-family: 'Georgia', 'Times New Roman', serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.current-month-btn:hover {
  background: var(--wood-600);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(141, 110, 99, 0.3);
}

@media (max-width: 1024px) {
  .filter-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .period-group {
    grid-column: span 1;
    min-width: auto;
  }
  
  .period-info {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .period-dates {
    justify-content: center;
  }
  
  .filter-actions {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .period-slider-container {
    padding: 1rem;
  }
  
  .period-dates {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .period-separator {
    display: none;
  }
  
  .slider-thumb {
    width: 28px;
    height: 28px;
    top: -10px;
  }
  
  .thumb-tooltip {
    font-size: 0.7rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>