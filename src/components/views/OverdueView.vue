<template>
  <div class="overdue-view">
    <div class="view-header">
      <div class="view-title">
        <h3>Atrasados - {{ tipo }}</h3>
      </div>
      
      <div class="view-controls">
        <Dropdown
          v-model="tipo"
          :options="tipoOptions"
          option-label="label"
          option-value="value"
          class="type-dropdown"
        />
      </div>
    </div>

    <div class="summary-cards">
      <SummaryCard
        :title="`Total ${tipo}`"
        :value="totalValue"
        icon="pi pi-exclamation-triangle"
        color="danger"
      />
      <SummaryCard
        title="Quantidade"
        :value="dadosFiltrados.length"
        icon="pi pi-list"
        color="info"
        :format="false"
      />
    </div>

    <DataTable
      :value="dadosFiltrados"
      class="overdue-table"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
      stripedRows
      showGridlines
      :loading="loading"
    >
      <Column field="categoria" header="Categoria" style="min-width: 250px">
        <template #body="{ data }">
          <div class="category-cell">
            <span class="category-name">{{ data.categoria }}</span>
          </div>
        </template>
      </Column>
      
      <Column field="pessoa" header="Pessoa" style="min-width: 200px">
        <template #body="{ data }">
          <div class="person-cell">
            <i class="pi pi-user"></i>
            <span>{{ data.pessoa }}</span>
          </div>
        </template>
      </Column>
      
      <Column field="vencimento" header="Vencimento" style="min-width: 120px">
        <template #body="{ data }">
          <DateDisplay :date="data.vencimento" showDaysOverdue />
        </template>
      </Column>
      
      <Column field="valor" header="Valor" style="min-width: 120px">
        <template #body="{ data }">
          <ValueDisplay :value="data.valor" type="currency" emphasis />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOverdueData } from '../../composables/useOverdueData'
import SummaryCard from '../common/SummaryCard.vue'
import ValueDisplay from '../common/ValueDisplay.vue'
import DateDisplay from '../common/DateDisplay.vue'

const tipo = ref('Receber')
const loading = ref(false)

const tipoOptions = [
  { label: 'A Receber', value: 'Receber' },
  { label: 'A Pagar', value: 'Pagar' }
]

const { getOverdueData } = useOverdueData()

const dadosFiltrados = computed(() => {
  return getOverdueData(tipo.value)
})

const totalValue = computed(() => {
  return dadosFiltrados.value.reduce((sum, item) => sum + Math.abs(item.valor), 0)
})
</script>

<style scoped>
.overdue-view {
  padding: 2rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-title h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.type-dropdown {
  min-width: 150px;
}

.type-dropdown :deep(.p-dropdown) {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.overdue-table {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.overdue-table :deep(.p-datatable-thead > tr > th) {
  background: #fef2f2;
  color: #991b1b;
  font-weight: 600;
  border: none;
  padding: 1rem;
}

.overdue-table :deep(.p-datatable-tbody > tr > td) {
  padding: 1rem;
  border-color: #fee2e2;
}

.overdue-table :deep(.p-datatable-tbody > tr:hover) {
  background: #fef7f7;
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

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>