<template>
  <div class="raw-data-view">
    <div class="view-header">
      <div class="view-title">
        <h3>Dados Brutos</h3>
        <p class="view-subtitle">Visualização completa dos dados financeiros</p>
      </div>
      
      <div class="view-controls">
        <Button
          @click="exportData"
          :label="isMobile ? 'Exportar' : 'Exportar Dados'"
          icon="pi pi-download"
          class="p-button-outlined export-button"
          size="small"
        />
      </div>
    </div>

    <div class="table-container">
      <DataTable
        :value="dadosFiltrados"
        class="raw-data-table"
        :paginator="true"
        :rows="isMobile ? 8 : 15"
        :resizableColumns="!isMobile"
        filterDisplay="menu"
        showGridlines
        stripedRows
        :loading="loading"
        :globalFilterFields="['categoria', 'pessoa', 'conta']"
        :scrollable="true"
        scrollHeight="flex"
      >
        <template #header>
          <div class="table-header">
            <span class="table-title">
              <i class="pi pi-database"></i>
              <span class="title-text">
                <span class="desktop-only">Registros Financeiros</span>
                <span class="mobile-only">Registros</span>
                ({{ dadosFiltrados.length }})
              </span>
            </span>
            <InputText
              v-model="globalFilter"
              :placeholder="isMobile ? 'Buscar...' : 'Buscar em todos os campos...'"
              class="global-search"
            />
          </div>
        </template>
        
        <Column field="data_vencimento" header="Vencimento" sortable filter :style="columnStyles.data">
          <template #body="{ data }">
            <DateDisplay :date="data.data_vencimento" />
          </template>
        </Column>
        
        <Column field="data_baixa" header="Baixa" sortable filter :style="columnStyles.data" :class="{ 'desktop-only-column': isMobile }">
          <template #body="{ data }">
            <DateDisplay :date="data.data_baixa" allowEmpty />
          </template>
        </Column>
        
        <Column field="valor_total" header="Valor" sortable filter :style="columnStyles.valor">
          <template #body="{ data }">
            <ValueDisplay :value="data.valor_total" type="currency" />
          </template>
        </Column>
        
        <Column field="categoria" header="Categoria" sortable filter :style="columnStyles.categoria">
          <template #body="{ data }">
            <div class="category-cell">
              <span class="category-name">{{ data.categoria }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="conta" header="Conta" sortable filter :style="columnStyles.conta" :class="{ 'desktop-only-column': isMobile }">
          <template #body="{ data }">
            <span class="conta-text">{{ data.conta }}</span>
          </template>
        </Column>
        
        <Column field="pessoa" header="Pessoa" sortable filter :style="columnStyles.pessoa">
          <template #body="{ data }">
            <div class="person-cell">
              <i class="pi pi-user"></i>
              <span>{{ data.pessoa }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="observacoes" header="Obs" :style="columnStyles.observacoes" :class="{ 'desktop-only-column': isMobile }">
          <template #body="{ data }">
            <span class="observations" :title="data.observacoes">
              {{ data.observacoes || '-' }}
            </span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRawData } from '../../composables/useRawData'
import ValueDisplay from '../common/ValueDisplay.vue'
import DateDisplay from '../common/DateDisplay.vue'

const loading = ref(false)
const globalFilter = ref('')
const windowWidth = ref(window.innerWidth)

const { getRawData } = useRawData()

const isMobile = computed(() => windowWidth.value < 768)

const columnStyles = computed(() => {
  if (windowWidth.value < 480) {
    return {
      data: 'min-width: 90px',
      valor: 'min-width: 100px',
      categoria: 'min-width: 150px',
      conta: 'min-width: 120px',
      pessoa: 'min-width: 120px',
      observacoes: 'min-width: 100px'
    }
  } else if (windowWidth.value < 768) {
    return {
      data: 'min-width: 110px',
      valor: 'min-width: 120px',
      categoria: 'min-width: 180px',
      conta: 'min-width: 140px',
      pessoa: 'min-width: 150px',
      observacoes: 'min-width: 120px'
    }
  } else {
    return {
      data: 'min-width: 120px',
      valor: 'min-width: 120px',
      categoria: 'min-width: 200px',
      conta: 'min-width: 150px',
      pessoa: 'min-width: 200px',
      observacoes: 'min-width: 200px'
    }
  }
})

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

const exportData = () => {
  // Implementar exportação de dados
  console.log('Exportando dados...', dadosFiltrados.value)
}

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.raw-data-view {
  padding: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-title h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.view-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.export-button {
  white-space: nowrap;
}

.table-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: white;
}

.raw-data-table {
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  flex-wrap: wrap;
  gap: 1rem;
}

.table-title {
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-text {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.global-search {
  min-width: 200px;
  flex: 1;
  max-width: 300px;
}

.global-search :deep(.p-inputtext) {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  width: 100%;
}

.raw-data-table :deep(.p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  border: none;
  padding: 1rem;
}

.raw-data-table :deep(.p-datatable-tbody > tr > td) {
  padding: 1rem;
  border-color: #f1f5f9;
}

.category-cell {
  display: flex;
  align-items: center;
}

.category-name {
  font-weight: 500;
  color: #334155;
  word-break: break-word;
}

.person-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
}

.conta-text {
  word-break: break-word;
  color: #64748b;
}

.observations {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  color: #64748b;
  font-size: 0.9rem;
}

.desktop-only-column {
  display: none;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .raw-data-view {
    padding: 1rem;
  }
  
  .view-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .view-title h3 {
    font-size: 1.25rem;
    text-align: center;
  }
  
  .view-subtitle {
    text-align: center;
    font-size: 0.8rem;
  }
  
  .export-button {
    width: 100%;
    justify-content: center;
  }
  
  .table-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    padding: 0.75rem;
  }
  
  .table-title {
    justify-content: center;
    font-size: 0.9rem;
  }
  
  .global-search {
    min-width: 100%;
    max-width: none;
  }
  
  .raw-data-table :deep(.p-datatable-thead > tr > th),
  .raw-data-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .person-cell {
    gap: 0.25rem;
  }
  
  .person-cell i {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .raw-data-view {
    padding: 0.75rem;
  }
  
  .view-title h3 {
    font-size: 1.1rem;
  }
  
  .view-subtitle {
    font-size: 0.75rem;
  }
  
  .table-header {
    padding: 0.5rem;
  }
  
  .table-title {
    font-size: 0.8rem;
    gap: 0.25rem;
  }
  
  .raw-data-table :deep(.p-datatable-thead > tr > th),
  .raw-data-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.5rem 0.25rem;
    font-size: 0.8rem;
  }
  
  .category-name {
    font-size: 0.8rem;
    line-height: 1.2;
  }
  
  .person-cell {
    font-size: 0.8rem;
  }
  
  .observations {
    max-width: 100px;
    font-size: 0.75rem;
  }
}

/* Show desktop columns on larger screens */
@media (min-width: 769px) {
  .desktop-only-column {
    display: table-cell !important;
  }
}

/* Landscape mobile optimization */
@media (max-width: 768px) and (orientation: landscape) {
  .view-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .export-button {
    width: auto;
  }
  
  .table-header {
    flex-direction: row;
    justify-content: space-between;
  }
  
  .global-search {
    min-width: 200px;
    max-width: 300px;
  }
}
</style>