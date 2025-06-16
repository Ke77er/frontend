<template>
  <div class="raw-data-view">
    <div class="view-header">
      <div class="view-info">
        <h3>Dados Brutos</h3>
        <p class="view-subtitle">Visualização completa dos registros financeiros</p>
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

    <div class="table-container">
      <div class="table-info">
        <div class="info-item">
          <i class="pi pi-database"></i>
          <span>{{ dadosFiltrados.length }} registros encontrados</span>
        </div>
        <div class="info-item">
          <i class="pi pi-calendar"></i>
          <span>{{ formatDateRange() }}</span>
        </div>
      </div>

      <DataTable
        :value="dadosFiltrados"
        class="raw-data-table"
        :paginator="true"
        :rows="20"
        :resizableColumns="true"
        filterDisplay="menu"
        showGridlines
        stripedRows
        :loading="loading"
        :globalFilterFields="['categoria', 'pessoa', 'conta']"
        :scrollable="true"
        scrollHeight="600px"
      >
        <Column field="data_vencimento" header="Vencimento" sortable filter style="min-width: 120px" :frozen="true">
          <template #body="{ data }">
            <DateDisplay :date="data.data_vencimento" />
          </template>
        </Column>
        
        <Column field="valor_total" header="Valor" sortable filter style="min-width: 140px" :frozen="true">
          <template #body="{ data }">
            <div class="value-cell">
              <ValueDisplay :value="data.valor_total" type="currency" emphasis />
            </div>
          </template>
        </Column>
        
        <Column field="categoria" header="Categoria" sortable filter style="min-width: 250px">
          <template #body="{ data }">
            <div class="category-cell">
              <div class="category-icon">
                <i class="pi pi-tag"></i>
              </div>
              <span class="category-name">{{ data.categoria }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="pessoa" header="Pessoa" sortable filter style="min-width: 200px">
          <template #body="{ data }">
            <div class="person-cell">
              <i class="pi pi-user"></i>
              <span>{{ data.pessoa }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="conta" header="Conta" sortable filter style="min-width: 180px">
          <template #body="{ data }">
            <div class="account-cell">
              <i class="pi pi-credit-card"></i>
              <span>{{ data.conta }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="data_baixa" header="Data Baixa" sortable filter style="min-width: 120px">
          <template #body="{ data }">
            <div class="status-cell">
              <DateDisplay :date="data.data_baixa" allowEmpty />
              <Tag 
                v-if="data.data_baixa" 
                value="Baixado" 
                severity="success" 
                class="status-tag"
              />
              <Tag 
                v-else 
                value="Em Aberto" 
                severity="warning" 
                class="status-tag"
              />
            </div>
          </template>
        </Column>
        
        <Column field="observacoes" header="Observações" style="min-width: 200px">
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
import { ref, computed } from 'vue'
import { useRawData } from '../../composables/useRawData'
import { useReadonlyParametros } from '../../composables/useParametros'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ValueDisplay from '../common/ValueDisplay.vue'
import DateDisplay from '../common/DateDisplay.vue'

const loading = ref(false)
const globalFilter = ref('')

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

const formatDateRange = () => {
  if (!dataInicio.value || !dataFim.value) return 'Período não definido'
  
  const inicio = format(dataInicio.value, 'dd/MM/yyyy', { locale: ptBR })
  const fim = format(dataFim.value, 'dd/MM/yyyy', { locale: ptBR })
  
  return `${inicio} - ${fim}`
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
  gap: 1.5rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(26, 54, 93, 0.08);
}

.view-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--primary-color);
}

.view-subtitle {
  margin: 0;
  color: var(--neutral-500);
  font-size: 1rem;
}

.view-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
}

.global-search {
  min-width: 300px;
  padding-right: 2.5rem;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--neutral-400);
}

.export-btn {
  border-color: var(--success-color);
  color: var(--success-color);
}

.export-btn:hover {
  background: var(--success-color);
  color: white;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(26, 54, 93, 0.08);
}

.table-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--neutral-50) 0%, var(--neutral-100) 100%);
  border-bottom: 1px solid var(--neutral-200);
  flex-wrap: wrap;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--primary-color);
}

.info-item i {
  color: var(--primary-light);
}

.raw-data-table :deep(.p-datatable-thead > tr > th) {
  background: var(--primary-color);
  color: white;
  font-weight: 600;
  border: none;
  padding: 1rem;
}

.raw-data-table :deep(.p-datatable-tbody > tr > td) {
  padding: 1rem;
  border-color: var(--neutral-200);
}

.raw-data-table :deep(.p-datatable-tbody > tr:hover) {
  background: var(--neutral-50);
}

.value-cell {
  text-align: right;
  font-weight: 600;
}

.category-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(135deg, var(--primary-light), var(--primary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
}

.category-name {
  font-weight: 500;
  color: var(--primary-color);
}

.person-cell,
.account-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--neutral-600);
}

.person-cell i,
.account-cell i {
  color: var(--primary-light);
}

.status-cell {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}

.status-tag {
  font-size: 0.75rem;
}

.observations {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  color: var(--neutral-600);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .view-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .global-search {
    min-width: 100%;
  }
  
  .table-info {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>