<template>
  <div class="cash-flow-view">
    <div class="view-header">
      <div class="view-title">
        <h3>Fluxo de Caixa - {{ modeLabel }}</h3>
      </div>
      
      <div class="view-controls">
        <ToggleButton
          v-model="modoMensal"
          onLabel="Mensal"
          offLabel="Diário"
          onIcon="pi pi-calendar"
          offIcon="pi pi-clock"
          class="mode-toggle"
        />
        <Calendar
          v-model="inicio"
          view="month"
          dateFormat="mm/yy"
          showIcon
          class="date-picker"
          placeholder="Selecionar período"
        />
      </div>
    </div>

    <div class="summary-cards">
      <SummaryCard
        title="Total Realizado"
        :value="totals.realizado"
        icon="pi pi-check-circle"
        color="success"
      />
      <SummaryCard
        title="Total Previsto"
        :value="totals.previsto"
        icon="pi pi-clock"
        color="warning"
      />
      <SummaryCard
        title="Saldo Total"
        :value="totals.saldo"
        icon="pi pi-wallet"
        :color="totals.saldo >= 0 ? 'success' : 'danger'"
      />
    </div>

    <DataTable
      :value="linhas"
      class="cash-flow-table"
      :paginator="true"
      :rows="15"
      responsiveLayout="scroll"
      stripedRows
      showGridlines
      :loading="loading"
    >
      <Column field="descricao" header="Categoria" style="min-width: 300px">
        <template #body="{ data }">
          <div class="category-cell">
            <span class="category-name">{{ data.descricao }}</span>
          </div>
        </template>
      </Column>
      
      <Column field="realizado" header="Realizado" style="min-width: 150px">
        <template #body="{ data }">
          <ValueDisplay :value="data.realizado" type="currency" />
        </template>
      </Column>
      
      <Column field="previsto" header="Previsto" style="min-width: 150px">
        <template #body="{ data }">
          <ValueDisplay :value="data.previsto" type="currency" />
        </template>
      </Column>
      
      <Column field="total" header="Total" style="min-width: 150px">
        <template #body="{ data }">
          <ValueDisplay :value="data.realizado + data.previsto" type="currency" emphasis />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCashFlowData } from '../../composables/useCashFlowData'
import SummaryCard from '../common/SummaryCard.vue'
import ValueDisplay from '../common/ValueDisplay.vue'

const modoMensal = ref(false)
const inicio = ref(new Date())
const loading = ref(false)

const { generateCashFlowData } = useCashFlowData()

const modeLabel = computed(() => modoMensal.value ? 'Mensal' : 'Diário')

const linhas = ref([])

const totals = computed(() => {
  const realizado = linhas.value.reduce((sum, item) => sum + item.realizado, 0)
  const previsto = linhas.value.reduce((sum, item) => sum + item.previsto, 0)
  
  return {
    realizado,
    previsto,
    saldo: realizado + previsto
  }
})

const updateData = async () => {
  loading.value = true
  try {
    linhas.value = await generateCashFlowData(modoMensal.value, inicio.value)
  } finally {
    loading.value = false
  }
}

watch([modoMensal, inicio], updateData, { immediate: true })
</script>

<style scoped>
.cash-flow-view {
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

.view-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.mode-toggle :deep(.p-togglebutton) {
  border-radius: 8px;
  font-weight: 500;
}

.date-picker :deep(.p-calendar) {
  border-radius: 8px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.cash-flow-table {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.cash-flow-table :deep(.p-datatable-header) {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: none;
  padding: 1.5rem;
}

.cash-flow-table :deep(.p-datatable-thead > tr > th) {
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
  border: none;
  padding: 1rem;
}

.cash-flow-table :deep(.p-datatable-tbody > tr > td) {
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

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .view-controls {
    justify-content: center;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>