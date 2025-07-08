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
              <th class="date-header">Vencimento</th>
              <th class="value-header">Valor</th>
              <th class="category-header">Categoria</th>
              <th class="person-header">Pessoa</th>
              <th class="account-header">Conta</th>
              <th class="status-header">Status</th>
              <th class="date-header">Data Baixa</th>
              <th class="obs-header">Observações</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in paginatedData" 
              :key="index"
              class="data-row"
            >
              <td class="date-cell">
                <DateDisplay :date="item.data_vencimento" />
              </td>
              <td class="value-cell">
                <ValueDisplay :value="item.valor_total" type="currency" emphasis />
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
              <td class="obs-cell">
                <span class="observations" :title="item.observacoes">
                  {{ item.observacoes || '-' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Paginação Customizada -->
      <div class="pagination-container">
        <div class="pagination-info">
          <span>Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ dadosFiltrados.length }} registros</span>
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
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ValueDisplay from '../common/ValueDisplay.vue'
import DateDisplay from '../common/DateDisplay.vue'

const globalFilter = ref('')
const currentPage = ref(1)
const rowsPerPage = ref(20)

const rowsOptions = [10, 20, 50, 100]

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

const baixadosCount = computed(() => {
  return dadosFiltrados.value.filter(item => item.data_baixa).length
})

const abertoCount = computed(() => {
  return dadosFiltrados.value.filter(item => !item.data_baixa).length
})

const totalPages = computed(() => {
  return Math.ceil(dadosFiltrados.value.length / rowsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * rowsPerPage.value
})

const endIndex = computed(() => {
  return Math.min(startIndex.value + rowsPerPage.value, dadosFiltrados.value.length)
})

const paginatedData = computed(() => {
  return dadosFiltrados.value.slice(startIndex.value, endIndex.value)
})

const formatDateRange = () => {
  if (!dataInicio.value || !dataFim.value) return 'Período não definido'
  
  const inicio = format(dataInicio.value, 'dd/MM/yyyy', { locale: ptBR })
  const fim = format(dataFim.value, 'dd/MM/yyyy', { locale: ptBR })
  
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
  try {
    const headers = [
      'Data Vencimento',
      'Data Baixa', 
      'Valor',
      'Categoria',
      'Conta',
      'Pessoa',
      'Observações'
    ]
    
    const csvContent = [
      headers.join(','),
      ...dadosFiltrados.value.map(item => [
        item.data_vencimento,
        item.data_baixa || '',
        item.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        `"${item.categoria}"`,
        `"${item.conta}"`,
        `"${item.pessoa}"`,
        `"${item.observacoes || ''}"`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `dados-financeiros-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log('Dados exportados com sucesso!')
  } catch (error) {
    console.error('Erro ao exportar dados:', error)
  }
}

// Reset page when filter changes
const resetPage = () => {
  currentPage.value = 1
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

.data-row:nth-child(even) {
  background: #f8f9fa;
}

.data-row:hover {
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