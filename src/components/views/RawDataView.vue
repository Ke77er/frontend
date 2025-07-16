<template>
  <div class="raw-data-view">
    <!-- Resumo Compacto -->
    <div class="summary-section">
      <div class="summary-cards">
        <div class="summary-card info">
          <div class="card-icon">
            <i class="pi pi-database"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Total de Registros</div>
            <div class="card-value">
              <span class="numeric-value">{{ dadosFiltrados.length }}</span>
            </div>
          </div>
        </div>
        
        <div class="summary-card success">
          <div class="card-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Baixados</div>
            <div class="card-value">
              <span class="numeric-value">{{ baixadosCount }}</span>
            </div>
          </div>
        </div>
        
        <div class="summary-card warning">
          <div class="card-icon">
            <i class="pi pi-clock"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Em Aberto</div>
            <div class="card-value">
              <span class="numeric-value">{{ abertoCount }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="view-controls">
        <div class="search-container">
          <InputText
            v-model="globalFilter"
            placeholder="Buscar em todos os campos..."
            class="global-search"
          />
          <i class="pi pi-search search-icon"></i>
        </div>
        <Button
          @click="exportData"
          label="Exportar CSV"
          icon="pi pi-download"
          class="p-button-outlined export-btn"
        />
      </div>
    </div>

    <!-- Tabela de Dados Brutos Estilo Novo -->
    <div class="table-container">
      <div class="table-header">
        <h3 class="table-title">DADOS BRUTOS - {{ formatDateRange() }}</h3>
      </div>
      
      <div class="table-wrapper">
        <table class="raw-data-table-new">
          <thead>
            <tr>
              <th class="expand-header"></th>
              <th class="date-header">Data</th>
              <th class="count-header">Qtd</th>
              <th class="value-header">Valor</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(group, groupIndex) in paginatedGroupedData" :key="group.date">
              <tr 
                class="group-row"
                @click="toggleGroup(group.date)"
              >
                <td class="expand-cell">
                  <Button
                    :icon="expandedGroups.has(group.date) ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
                    class="p-button-text p-button-sm expand-btn"
                  />
                </td>
                <td class="date-cell">
                  <div class="date-content">
                    <div class="date-icon">
                      <i class="pi pi-calendar"></i>
                    </div>
                    <DateDisplay :date="group.date" />
                  </div>
                </td>
                <td class="count-cell">
                  <div class="count-badge">
                    {{ group.items.length }}
                  </div>
                </td>
                <td class="value-cell">
                  <ValueDisplay :value="group.total" type="currency" emphasis />
                </td>
              </tr>
              
              <!-- Linhas expandidas -->
              <template v-if="expandedGroups.has(group.date)">
                <tr class="expanded-header">
                  <td></td>
                  <td class="sub-header">Vencimento</td>
                  <td class="sub-header">Categoria</td>
                  <td class="sub-header">Pessoa</td>
                  <td class="sub-header">Conta</td>
                  <td class="sub-header">Status</td>
                  <td class="sub-header">Data Baixa</td>
                  <td class="sub-header">Valor</td>
                  <td class="sub-header">Observações</td>
                </tr>
                <tr 
                  v-for="(item, itemIndex) in group.items" 
                  :key="`${group.date}-${itemIndex}`"
                  class="expanded-row"
                >
                  <td></td>
                  <td class="date-cell">
                    <DateDisplay :date="item.data_vencimento" />
                  </td>
                  <td class="category-cell">
                    <div class="category-content">
                      <div class="category-icon">
                        <i class="pi pi-tag"></i>
                      </div>
                      <span class="category-name">{{ item.categoria }}</span>
                    </div>
                  </td>
                  <td class="person-cell">
                    <div class="person-content">
                      <i class="pi pi-user"></i>
                      <span>{{ item.pessoa }}</span>
                    </div>
                  </td>
                  <td class="account-cell">
                    <div class="account-content">
                      <i class="pi pi-credit-card"></i>
                      <span>{{ item.conta }}</span>
                    </div>
                  </td>
                  <td class="status-cell">
                    <div class="status-content">
                      <Tag 
                        :value="item.data_baixa ? 'Baixado' : 'Em Aberto'" 
                        :severity="item.data_baixa ? 'success' : 'warning'" 
                        class="status-tag"
                      />
                    </div>
                  </td>
                  <td class="date-cell">
                    <DateDisplay :date="item.data_baixa" allowEmpty />
                  </td>
                  <td class="value-cell">
                    <ValueDisplay :value="item.valor_total" type="currency" emphasis />
                  </td>
                  <td class="obs-cell">
                    <span class="observations" :title="item.observacoes">
                      {{ item.observacoes || '-' }}
                    </span>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
      
      <!-- Paginação Customizada -->
      <div class="pagination-container">
        <div class="pagination-info">
          <span>Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ groupedData.length }} grupos ({{ totalItems }} registros)</span>
        </div>
        <div class="pagination-controls">
          <Button
            @click="previousPage"
            icon="pi pi-chevron-left"
            class="p-button-outlined p-button-sm"
            :disabled="currentPage === 1"
          />
          <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
          <Button
            @click="nextPage"
            icon="pi pi-chevron-right"
            class="p-button-outlined p-button-sm"
            :disabled="currentPage === totalPages"
          />
        </div>
        <div class="rows-per-page">
          <label>Itens por página:</label>
          <Dropdown
            v-model="rowsPerPage"
            :options="rowsOptions"
            class="rows-dropdown"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRawData } from '../../composables/useRawData'
import { useReadonlyParametros } from '../../composables/useParametros'
import { formatDate } from '../../utils/dateUtils'
import { exportToCSV } from '../../utils/formatUtils'
import { PAGINATION_OPTIONS } from '../../config/constants'
import ValueDisplay from '../common/ValueDisplay.vue'
import DateDisplay from '../common/DateDisplay.vue'

const globalFilter = ref('')
const currentPage = ref(1)
const rowsPerPage = ref(20)
const expandedGroups = ref(new Set())

const rowsOptions = PAGINATION_OPTIONS

const { dataInicio, dataFim } = useReadonlyParametros()
const { getRawData } = useRawData()

const dadosFiltrados = computed(() => {
  const data = getRawData()
  
  if (!globalFilter.value) return data
  
  const searchTerm = globalFilter.value.toLowerCase()
  return data.filter(item => 
    Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchTerm)
    )
  )
})

const groupedData = computed(() => {
  const groups = new Map()
  
  dadosFiltrados.value.forEach(item => {
    const date = item.data_vencimento
    if (!groups.has(date)) {
      groups.set(date, {
        date,
        items: [],
        total: 0
      })
    }
    
    const group = groups.get(date)
    group.items.push(item)
    group.total += item.valor_total
  })
  
  return Array.from(groups.values())
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalItems = computed(() => {
  return dadosFiltrados.value.length
})

const baixadosCount = computed(() => {
  return dadosFiltrados.value.filter(item => item.data_baixa).length
})

const abertoCount = computed(() => {
  return dadosFiltrados.value.filter(item => !item.data_baixa).length
})

const totalPages = computed(() => {
  return Math.ceil(groupedData.value.length / rowsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * rowsPerPage.value
})

const endIndex = computed(() => {
  return Math.min(startIndex.value + rowsPerPage.value, groupedData.value.length)
})

const paginatedGroupedData = computed(() => {
  return groupedData.value.slice(startIndex.value, endIndex.value)
})

const toggleGroup = (date) => {
  if (expandedGroups.value.has(date)) {
    expandedGroups.value.delete(date)
  } else {
    expandedGroups.value.add(date)
  }
}

const formatDateRange = () => {
  if (!dataInicio.value || !dataFim.value) return 'Período não definido'
  
  const inicio = formatDate(dataInicio.value)
  const fim = formatDate(dataFim.value)
  
  return `${inicio} - ${fim}`
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const exportData = () => {
  const headers = [
    'Data Vencimento',
    'Data Baixa', 
    'Valor',
    'Categoria',
    'Conta',
    'Pessoa',
    'Observações'
  ]
  
  const filename = `dados-financeiros-${formatDate(new Date(), 'yyyy-MM-dd')}.csv`
  
  const success = exportToCSV(dadosFiltrados.value, filename, headers)
  
  if (success) {
    console.log('Dados exportados com sucesso!')
  } else {
    console.error('Erro ao exportar dados')
  }
}

// Reset page when filter changes
const resetPage = () => {
  currentPage.value = 1
  expandedGroups.value.clear()
}

// Watch for filter changes
import { watch } from 'vue'
watch([globalFilter, rowsPerPage], resetPage)
</script>

<style scoped>
.raw-data-view {
  padding: 1rem;
}

/* Resumo Compacto */
.summary-section {
  margin-bottom: 1.5rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-left: 4px solid;
}

.summary-card.info {
  border-left-color: #17a2b8;
}

.summary-card.success {
  border-left-color: #28a745;
}

.summary-card.warning {
  border-left-color: #ffc107;
}

.card-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
}

.summary-card.info .card-icon {
  background: #17a2b8;
}

.summary-card.success .card-icon {
  background: #28a745;
}

.summary-card.warning .card-icon {
  background: #ffc107;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.card-value {
  font-size: 1rem;
  font-weight: 700;
}

.numeric-value {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.view-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.global-search {
  width: 100%;
  padding-right: 2.5rem;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.export-btn {
  border-color: #28a745;
  color: #28a745;
}

.export-btn:hover {
  background: #28a745;
  color: white;
}

/* Nova Tabela de Dados Brutos */
.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #dee2e6;
}

.table-header {
  background: #17a2b8;
  color: white;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #138496;
}

.table-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-wrapper {
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
}

.raw-data-table-new {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.raw-data-table-new th,
.raw-data-table-new td {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  vertical-align: middle;
}

.raw-data-table-new th {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.expand-header {
  width: 50px;
  text-align: center;
}

.count-header {
  width: 80px;
  text-align: center;
}

.date-header {
  min-width: 120px;
}

.value-header {
  min-width: 140px;
}

.category-header {
  text-align: left;
  min-width: 250px;
}

.person-header {
  text-align: left;
  min-width: 200px;
}

.account-header {
  text-align: left;
  min-width: 180px;
}

.status-header {
  min-width: 100px;
}

.obs-header {
  text-align: left;
  min-width: 200px;
}

.group-row {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid #17a2b8;
}

.group-row:hover {
  background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(23, 162, 184, 0.2);
}

.expand-cell {
  text-align: center;
  width: 50px;
}

.expand-btn {
  color: #17a2b8 !important;
  transition: all 0.3s ease;
}

.expand-btn:hover {
  color: #138496 !important;
  transform: scale(1.1);
}

.date-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.date-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(135deg, #17a2b8, #20c997);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
}

.count-cell {
  text-align: center;
}

.count-badge {
  background: linear-gradient(135deg, #6c757d, #495057);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8rem;
  display: inline-block;
  min-width: 30px;
}

.expanded-header {
  background: #e9ecef;
  font-weight: 600;
  color: #495057;
}

.sub-header {
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 2px solid #17a2b8;
  text-align: center;
}

.expanded-row {
  background: #f8f9fa;
  border-left: 3px solid #20c997;
}

.expanded-row:nth-child(even) {
  background: #f8f9fa;
}

.expanded-row:hover {
  background: #e3f2fd;
}

.date-cell {
  text-align: center;
}

.value-cell {
  text-align: right;
  font-weight: 600;
}

.category-cell {
  text-align: left;
}

.category-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: linear-gradient(135deg, #17a2b8, #20c997);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
}

.category-name {
  font-weight: 500;
  color: #495057;
}

.person-cell,
.account-cell {
  text-align: left;
}

.person-content,
.account-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
}

.person-content i,
.account-content i {
  color: #6c757d;
}

.status-cell {
  text-align: center;
}

.status-content {
  display: flex;
  justify-content: center;
}

.status-tag {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
}

.obs-cell {
  text-align: left;
}

.observations {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  color: #6c757d;
  font-size: 0.75rem;
}

/* Paginação Customizada */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6c757d;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-info {
  font-size: 0.875rem;
  color: #495057;
  font-weight: 500;
}

.rows-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #495057;
}

.rows-dropdown {
  min-width: 80px;
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .view-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-container {
    max-width: 100%;
  }
  
  .pagination-container {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .pagination-controls {
    justify-content: center;
  }
  
  .raw-data-table-new th,
  .raw-data-table-new td {
    padding: 0.5rem;
    font-size: 0.7rem;
  }
}
</style>