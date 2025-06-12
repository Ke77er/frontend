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

    <div class="table-container">
      <DataTable
        :value="dadosFiltrados"
        class="overdue-table"
        :paginator="true"
        :rows="isMobile ? 8 : 10"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
        :loading="loading"
        :scrollable="true"
        scrollHeight="flex"
      >
        <Column field="categoria" header="Categoria" :style="columnStyles.categoria">
          <template #body="{ data }">
            <div class="category-cell">
              <span class="category-name">{{ data.categoria }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="pessoa" header="Pessoa" :style="columnStyles.pessoa">
          <template #body="{ data }">
            <div class="person-cell">
              <i class="pi pi-user"></i>
              <span>{{ data.pessoa }}</span>
            </div>
          </template>
        </Column>
        
        <Column field="vencimento" header="Vencimento" :style="columnStyles.data">
          <template #body="{ data }">
            <DateDisplay :date="data.vencimento" showDaysOverdue />
          </template>
        </Column>
        
        <Column field="valor" header="Valor" :style="columnStyles.valor">
          <template #body="{ data }">
            <ValueDisplay :value="data.valor" type="currency" emphasis />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useOverdueData } from '../../composables/useOverdueData'
import SummaryCard from '../common/SummaryCard.vue'
import ValueDisplay from '../common/ValueDisplay.vue'
import DateDisplay from '../common/DateDisplay.vue'

const tipo = ref('Receber')
const loading = ref(false)
const windowWidth = ref(window.innerWidth)

const tipoOptions = [
  { label: 'A Receber', value: 'Receber' },
  { label: 'A Pagar', value: 'Pagar' }
]

const { getOverdueData } = useOverdueData()

const isMobile = computed(() => windowWidth.value < 768)

const columnStyles = computed(() => {
  if (windowWidth.value < 480) {
    return {
      categoria: 'min-width: 150px',
      pessoa: 'min-width: 120px',
      data: 'min-width: 100px',
      valor: 'min-width: 100px'
    }
  } else if (windowWidth.value < 768) {
    return {
      categoria: 'min-width: 180px',
      pessoa: 'min-width: 150px',
      data: 'min-width: 120px',
      valor: 'min-width: 120px'
    }
  } else {
    return {
      categoria: 'min-width: 250px',
      pessoa: 'min-width: 200px',
      data: 'min-width: 120px',
      valor: 'min-width: 120px'
    }
  }
})

const dadosFiltrados = computed(() => {
  return getOverdueData(tipo.value)
})

const totalValue = computed(() => {
  return dadosFiltrados.value.reduce((sum, item) => sum + Math.abs(item.valor), 0)
})

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

.overdue-table {
  border-radius: 12px;
  overflow: hidden;
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
  word-break: break-word;
}

.person-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .overdue-view {
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
  
  .type-dropdown {
    min-width: 100%;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .overdue-table :deep(.p-datatable-thead > tr > th),
  .overdue-table :deep(.p-datatable-tbody > tr > td) {
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
  .overdue-view {
    padding: 0.75rem;
  }
  
  .view-title h3 {
    font-size: 1.1rem;
  }
  
  .summary-cards {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .overdue-table :deep(.p-datatable-thead > tr > th),
  .overdue-table :deep(.p-datatable-tbody > tr > td) {
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
}

/* Landscape mobile optimization */
@media (max-width: 768px) and (orientation: landscape) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .view-header {
    flex-direction: row;
    justify-content: space-between;
  }
  
  .type-dropdown {
    min-width: 150px;
  }
}
</style>