<template>
  <div class="overdue-view">
    <!-- Resumo Compacto -->
    <div class="summary-section">
      <div class="summary-cards">
        <div class="summary-card danger">
          <div class="card-icon">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Total {{ tipo }}</div>
            <div class="card-value">
              <ValueDisplay :value="totalValue" type="currency" emphasis />
            </div>
          </div>
        </div>
        
        <div class="summary-card warning">
          <div class="card-icon">
            <i class="pi pi-list"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Categorias</div>
            <div class="card-value">
              <span class="numeric-value">{{ groupedData.length }}</span>
            </div>
          </div>
        </div>
        
        <div class="summary-card info">
          <div class="card-icon">
            <i class="pi pi-file"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Total de Itens</div>
            <div class="card-value">
              <span class="numeric-value">{{ totalItems }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="view-controls">
        <div class="control-group">
          <label class="control-label">Tipo:</label>
          <Dropdown
            v-model="tipo"
            :options="tipoOptions"
            option-label="label"
            option-value="value"
            class="type-dropdown"
          />
        </div>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="overdue-content">
      <div v-if="groupedData.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="pi pi-check-circle"></i>
        </div>
        <h3>Nenhum item atrasado</h3>
        <p>Não há {{ tipo.toLowerCase() }} em atraso no período selecionado.</p>
      </div>
      
      <!-- Tabela de Atrasados Estilo Novo -->
      <div v-else class="table-container">
        <div class="table-header">
          <h3 class="table-title">CONTAS ATRASADAS - {{ tipo.toUpperCase() }}</h3>
        </div>
        
        <div class="table-wrapper">
          <table class="overdue-table-new">
            <thead>
              <tr>
                <th class="category-header">Categoria</th>
                <th class="person-header">Pessoa</th>
                <th class="date-header">Vencimento</th>
                <th class="days-header">Dias Atraso</th>
                <th class="value-header">Valor</th>
                <th class="total-header">Total por Categoria</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="group in groupedData" :key="group.categoria">
                <tr 
                  v-for="(item, index) in group.items" 
                  :key="`${group.categoria}-${index}`"
                  class="data-row"
                  :class="{ 'first-in-group': index === 0 }"
                >
                  <td class="category-cell" :class="{ 'category-group-cell': index === 0 }">
                    <div v-if="index === 0" class="category-content">
                      <div class="category-icon">
                        <i class="pi pi-exclamation-triangle"></i>
                      </div>
                      <div class="category-info">
                        <span class="category-name">{{ group.categoria }}</span>
                        <span class="category-count">{{ group.items.length }} {{ group.items.length === 1 ? 'item' : 'itens' }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="person-cell">
                    <div class="person-content">
                      <i class="pi pi-user"></i>
                      <span>{{ item.pessoa }}</span>
                    </div>
                  </td>
                  <td class="date-cell">
                    <DateDisplay :date="item.vencimento" />
                  </td>
                  <td class="days-cell">
                    <div class="days-overdue">
                      <span class="days-number">{{ getDaysOverdue(item.vencimento) }}</span>
                      <span class="days-label">dias</span>
                    </div>
                  </td>
                  <td class="value-cell">
                    <ValueDisplay :value="Math.abs(item.valor)" type="currency" emphasis />
                  </td>
                  <td class="total-cell" :class="{ 'total-group-cell': index === 0 }">
                    <div v-if="index === 0" class="total-content">
                      <ValueDisplay :value="group.total" type="currency" emphasis class="total-value" />
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOverdueData } from '../../composables/useOverdueData'
import { differenceInDays, parseISO } from 'date-fns'
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

const totalItems = computed(() => {
  return dadosFiltrados.value.length
})

const getDaysOverdue = (vencimento) => {
  try {
    const vencDate = parseISO(vencimento)
    const today = new Date()
    return Math.max(0, differenceInDays(today, vencDate))
  } catch {
    return 0
  }
}
</script>

<style scoped>
.overdue-view {
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

.summary-card.danger {
  border-left-color: #dc3545;
}

.summary-card.warning {
  border-left-color: #ffc107;
}

.summary-card.info {
  border-left-color: #17a2b8;
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

.summary-card.danger .card-icon {
  background: #dc3545;
}

.summary-card.warning .card-icon {
  background: #ffc107;
}

.summary-card.info .card-icon {
  background: #17a2b8;
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
  justify-content: flex-end;
  align-items: center;
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
}

.type-dropdown {
  min-width: 150px;
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
  background: linear-gradient(135deg, #28a745, #20c997);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: white;
}

.empty-state h3 {
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6c757d;
  margin: 0;
}

/* Nova Tabela de Atrasados */
.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #dee2e6;
}

.table-header {
  background: #dc3545;
  color: white;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #c82333;
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
  max-height: 600px;
  overflow-y: auto;
}

.overdue-table-new {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.overdue-table-new th,
.overdue-table-new td {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  vertical-align: middle;
}

.overdue-table-new th {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.category-header {
  text-align: left;
  min-width: 250px;
}

.person-header {
  min-width: 200px;
}

.date-header {
  min-width: 120px;
}

.days-header {
  min-width: 100px;
}

.value-header {
  min-width: 120px;
}

.total-header {
  background: #fee2e2 !important;
  color: #dc2626 !important;
  font-weight: 700 !important;
  min-width: 140px;
}

.data-row:nth-child(even) {
  background: #f8f9fa;
}

.data-row:hover {
  background: #fef2f2;
}

.first-in-group {
  border-top: 2px solid #dc3545;
}

.category-cell {
  text-align: left;
  vertical-align: top;
}

.category-group-cell {
  background: #fef2f2;
  border-left: 4px solid #dc3545;
}

.category-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(135deg, #dc2626, #ef4444);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
}

.category-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category-name {
  font-weight: 600;
  color: #dc2626;
  font-size: 0.8rem;
}

.category-count {
  font-size: 0.7rem;
  color: #6c757d;
}

.person-cell {
  text-align: left;
}

.person-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
}

.person-content i {
  color: #6c757d;
}

.date-cell {
  text-align: center;
}

.days-cell {
  text-align: center;
}

.days-overdue {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
}

.days-number {
  font-weight: 700;
  color: #dc2626;
  font-size: 0.9rem;
}

.days-label {
  font-size: 0.65rem;
  color: #6c757d;
}

.value-cell {
  text-align: right;
  font-weight: 600;
}

.total-cell {
  text-align: right;
  vertical-align: top;
}

.total-group-cell {
  background: #fee2e2;
  border-left: 4px solid #dc3545;
}

.total-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.total-value {
  color: #dc2626 !important;
  font-weight: 700 !important;
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .view-controls {
    justify-content: center;
  }
  
  .overdue-table-new th,
  .overdue-table-new td {
    padding: 0.5rem;
    font-size: 0.7rem;
  }
  
  .category-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>