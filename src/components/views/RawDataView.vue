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
          label="Exportar"
          icon="pi pi-download"
          class="p-button-outlined"
          size="small"
        />
      </div>
    </div>

    <DataTable
      :value="dadosFiltrados"
      class="raw-data-table"
      :paginator="true"
      :rows="15"
      :resizableColumns="true"
      filterDisplay="menu"
      showGridlines
      stripedRows
      :loading="loading"
      :globalFilterFields="['categoria', 'pessoa', 'conta']"
    >
      <template #header>
        <div class="table-header">
          <span class="table-title">
            <i class="pi pi-database"></i>
            Registros Financeiros ({{ dadosFiltrados.length }} itens)
          </span>
          <InputText
            v-model="globalFilter"
            placeholder="Buscar em todos os campos..."
            class="global-search"
          />
        </div>
      </template>
      
      <Column field="data_vencimento" header="Vencimento" sortable filter style="min-width: 120px">
        <template #body="{ data }">
          <DateDisplay :date="data.data_vencimento" />
        </template>
      </Column>
      
      <Column field="data_baixa" header="Baixa" sortable filter style="min-width: 120px">
        <template #body="{ data }">
          <DateDisplay :date="data.data_baixa" allowEmpty />
        </template>
      </Column>
      
      <Column field="valor_total" header="Valor" sortable filter style="min-width: 120px">
        <template #body="{ data }">
          <ValueDisplay :value="data.valor_total" type="currency" />
        </template>
      </Column>
      
      <Column field="categoria" header="Categoria" sortable filter style="min-width: 200px">
        <template #body="{ data }">
          <div class="category-cell">
            <span class="category-name">{{ data.categoria }}</span>
          </div>
        </template>
      </Column>
      
      <Column field="conta" header="Conta" sortable filter style="min-width: 150px" />
      
      <Column field="pessoa" header="Pessoa" sortable filter style="min-width: 200px">
        <template #body="{ data }">
          <div class="person-cell">
            <i class="pi pi-user"></i>
            <span>{{ data.pessoa }}</span>
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRawData } from '../../composables/useRawData'
import ValueDisplay from '../common/ValueDisplay.vue'
import DateDisplay from '../common/DateDisplay.vue'

const loading = ref(false)
const globalFilter = ref('')

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

const exportData = () => {
  // Implementar exportação de dados
  console.log('Exportando dados...', dadosFiltrados.value)
}
</script>

<style scoped>
.raw-data-view {
  padding: 2rem;
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

.raw-data-table {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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

.global-search {
  min-width: 250px;
}

.global-search :deep(.p-inputtext) {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
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
}

.person-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .table-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .global-search {
    min-width: 100%;
  }
}
</style>