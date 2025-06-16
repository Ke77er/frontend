<template>
  <div class="overdue-view">
    <div class="view-header">
      <div class="view-controls">
        <Dropdown
          v-model="tipo"
          :options="tipoOptions"
          option-label="label"
          option-value="value"
          class="type-dropdown"
        />
      </div>
      
      <div class="summary-info">
        <div class="summary-item">
          <span class="summary-label">Total {{ tipo }}</span>
          <ValueDisplay :value="totalValue" type="currency" emphasis class="summary-value" />
        </div>
        <div class="summary-item">
          <span class="summary-label">Quantidade</span>
          <span class="summary-value">{{ groupedData.length }} categorias</span>
        </div>
      </div>
    </div>

    <div class="overdue-content">
      <div v-if="groupedData.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="pi pi-check-circle"></i>
        </div>
        <h3>Nenhum item atrasado</h3>
        <p>Não há {{ tipo.toLowerCase() }} em atraso no período selecionado.</p>
      </div>
      
      <div v-else class="category-groups">
        <Panel 
          v-for="group in groupedData" 
          :key="group.categoria"
          :header="group.categoria"
          :toggleable="true"
          class="category-panel"
        >
          <template #header>
            <div class="panel-header-content">
              <div class="category-info">
                <div class="category-icon">
                  <i class="pi pi-exclamation-triangle"></i>
                </div>
                <div class="category-details">
                  <span class="category-name">{{ group.categoria }}</span>
                  <span class="category-summary">
                    {{ group.items.length }} {{ group.items.length === 1 ? 'item' : 'itens' }} • 
                    <ValueDisplay :value="group.total" type="currency" />
                  </span>
                </div>
              </div>
              <div class="category-total">
                <ValueDisplay :value="group.total" type="currency" emphasis />
              </div>
            </div>
          </template>
          
          <DataTable
            :value="group.items"
            class="overdue-table"
            stripedRows
            responsiveLayout="scroll"
          >
            <Column field="pessoa" header="Pessoa" style="min-width: 200px">
              <template #body="{ data }">
                <div class="person-cell">
                  <i class="pi pi-user"></i>
                  <span>{{ data.pessoa }}</span>
                </div>
              </template>
            </Column>
            
            <Column field="vencimento" header="Vencimento" style="min-width: 140px">
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
        </Panel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOverdueData } from '../../composables/useOverdueData'
import ValueDisplay from '../common/ValueDisplay.vue'
import DateDisplay from '../common/DateDisplay.vue'

const tipo = ref('Receber')

const tipoOptions = [
  { label: 'A Receber', value: 'Receber' },
  { label: 'A Pagar', value: 'Pagar' }
]

const { getOverdueData } = useOverdueData()

const dadosFiltrados = computed(() => {
  return getOverdueData(tipo.value)
})

const groupedData = computed(() => {
  const groups = new Map()
  
  dadosFiltrados.value.forEach(item => {
    if (!groups.has(item.categoria)) {
      groups.set(item.categoria, {
        categoria: item.categoria,
        items: [],
        total: 0
      })
    }
    
    const group = groups.get(item.categoria)
    group.items.push(item)
    group.total += Math.abs(item.valor)
  })
  
  return Array.from(groups.values())
    .sort((a, b) => b.total - a.total) // Ordenar por valor total decrescente
})

const totalValue = computed(() => {
  return dadosFiltrados.value.reduce((sum, item) => sum + Math.abs(item.valor), 0)
})
</script>

<style scoped>
.overdue-view {
  padding: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(26, 54, 93, 0.08);
}

.type-dropdown {
  min-width: 150px;
}

.summary-info {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.8rem;
  color: var(--neutral-500);
  font-weight: 500;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
}

.overdue-content {
  min-height: 400px;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(26, 54, 93, 0.08);
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--success-color), var(--success-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: white;
}

.empty-state h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--neutral-500);
  margin: 0;
}

.category-groups {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-panel {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(26, 54, 93, 0.08);
}

.category-panel :deep(.p-panel-header) {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-color: var(--danger-color);
  padding: 1.5rem;
}

.category-panel :deep(.p-panel-content) {
  border-color: var(--neutral-200);
  padding: 0;
}

.panel-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--danger-color), var(--danger-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.category-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category-name {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.category-summary {
  font-size: 0.875rem;
  color: var(--neutral-600);
}

.category-total {
  text-align: right;
}

.overdue-table {
  border: none;
}

.overdue-table :deep(.p-datatable-thead > tr > th) {
  background: var(--neutral-50);
  color: var(--primary-color);
  font-weight: 600;
  border: none;
  padding: 1rem;
  border-bottom: 2px solid var(--danger-color);
}

.overdue-table :deep(.p-datatable-tbody > tr > td) {
  padding: 1rem;
  border-color: var(--neutral-200);
}

.overdue-table :deep(.p-datatable-tbody > tr:hover) {
  background: #fef7f7;
}

.person-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--neutral-600);
}

.person-cell i {
  color: var(--primary-light);
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .summary-info {
    justify-content: space-around;
  }
  
  .panel-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .category-total {
    text-align: left;
    align-self: flex-start;
  }
}
</style>