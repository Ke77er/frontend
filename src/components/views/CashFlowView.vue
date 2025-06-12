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

    <div class="table-container">
      <DataTable
        :value="linhas"
        class="cash-flow-table"
        :paginator="true"
        :rows="isMobile ? 10 : 15"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
        :loading="loading"
        :scrollable="true"
        scrollHeight="flex"
      >
        <Column field="descricao" header="Categoria" :style="columnStyles.categoria">
          <template #body="{ data }">
            <div class="category-cell">
              <span class="category-name">{{ data.descricao }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="realizado" header="Realizado" :style="columnStyles.valor">
          <template #body="{ data }">
            <ValueDisplay :value="data.realizado" type="currency" />
          </template>
        </Column>
        
        <Column field="previsto" header="Previsto" :style="columnStyles.valor">
          <template #body="{ data }">
            <ValueDisplay :value="data.previsto" type="currency" />
          </template>
        </Column>
        
        <Column field="total" header="Total" :style="columnStyles.valor">
          <template #body="{ data }">
            <ValueDisplay :value="data.realizado + data.previsto" type="currency" emphasis />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useCashFlowData } from '../../composables/useCashFlowData'
import SummaryCard from '../common/SummaryCard.vue'
import ValueDisplay from '../common/ValueDisplay.vue'

const modoMensal = ref(false)
const inicio = ref(new Date())
const loading = ref(false)
const windowWidth = ref(window.innerWidth)

const { generateCashFlowData } = useCashFlowData()

const modeLabel = computed(() => modoMensal.value ? 'Mensal' : 'Diário')
const isMobile = computed(() => windowWidth.value < 768)

const columnStyles = computed(() => ({
  categoria: isMobile.value ? 'min-width: 200px' : 'min-width: 300px',
  valor: isMobile.value ? 'min-width: 100px' : 'min-width: 150px'
}))

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

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

watch([modoMensal, inicio], updateData, { immediate: true })
</script>

<style scoped>
.cash-flow-view {
  padding: 1.5rem;
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
  flex-wrap: wrap;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.table-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: white;
}

.cash-flow-table {
  border-radius: 12px;
  overflow: hidden;
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
  word-break: break-word;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .cash-flow-view {
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
  
  .view-controls {
    justify-content: center;
    gap: 0.75rem;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .cash-flow-table :deep(.p-datatable-thead > tr > th),
  .cash-flow-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .cash-flow-table :deep(.p-paginator) {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .cash-flow-view {
    padding: 0.75rem;
  }
  
  .view-title h3 {
    font-size: 1.1rem;
  }
  
  .view-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .mode-toggle,
  .date-picker {
    width: 100%;
  }
  
  .mode-toggle :deep(.p-togglebutton),
  .date-picker :deep(.p-calendar .p-inputtext) {
    width: 100%;
    text-align: center;
  }
  
  .summary-cards {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .cash-flow-table :deep(.p-datatable-thead > tr > th),
  .cash-flow-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.5rem 0.25rem;
    font-size: 0.8rem;
  }
  
  .category-name {
    font-size: 0.8rem;
    line-height: 1.2;
  }
}

/* Landscape mobile optimization */
@media (max-width: 768px) and (orientation: landscape) {
  .summary-cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .view-controls {
    flex-direction: row;
    justify-content: center;
  }
}
</style>