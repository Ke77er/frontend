<template>
  <div class="cash-flow-view">
    <!-- Resumo Compacto -->
    <div class="summary-section">
      <div class="summary-cards">
        <div class="summary-card success">
          <div class="card-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Realizado</div>
            <div class="card-value">
              <ValueDisplay :value="totals.realizado" type="currency" emphasis />
            </div>
          </div>
        </div>
        
        <div class="summary-card warning">
          <div class="card-icon">
            <i class="pi pi-clock"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Previsto</div>
            <div class="card-value">
              <ValueDisplay :value="totals.previsto" type="currency" emphasis />
            </div>
          </div>
        </div>
        
        <div class="summary-card" :class="totals.saldo >= 0 ? 'success' : 'danger'">
          <div class="card-icon">
            <i class="pi pi-wallet"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Saldo Total</div>
            <div class="card-value">
              <ValueDisplay :value="totals.saldo" type="currency" emphasis />
            </div>
          </div>
        </div>
      </div>
      
      <div class="period-info">
        <i class="pi pi-calendar"></i>
        <span>{{ formatDateRange(dataInicio, dataFim) }}</span>
      </div>
    </div>

    <!-- Histórico Visual -->
    <div class="history-section">
      <div class="history-header">
        <h3>Histórico do Período</h3>
        <div class="history-legend">
          <div class="legend-item">
            <div class="legend-color positive"></div>
            <span>Entradas</span>
          </div>
          <div class="legend-item">
            <div class="legend-color negative"></div>
            <span>Saídas</span>
          </div>
          <div class="legend-item">
            <div class="legend-color balance"></div>
            <span>Saldo Acumulado</span>
          </div>
        </div>
      </div>
      
      <div class="history-chart">
        <div class="chart-container">
          <div class="chart-grid">
            <div 
              v-for="(item, index) in historyData" 
              :key="index"
              class="chart-day"
              :style="{ left: `${(index / Math.max(historyData.length - 1, 1)) * 100}%` }"
            >
              <!-- Barras de entrada e saída -->
              <div class="chart-bars">
                <div 
                  v-if="item.entradas > 0"
                  class="chart-bar positive"
                  :style="{ height: `${Math.abs(item.entradas) / Math.max(maxValue, 1) * 100}px` }"
                  :title="`Entradas: ${formatCurrency(item.entradas)}`"
                ></div>
                <div 
                  v-if="item.saidas < 0"
                  class="chart-bar negative"
                  :style="{ height: `${Math.abs(item.saidas) / Math.max(maxValue, 1) * 100}px` }"
                  :title="`Saídas: ${formatCurrency(item.saidas)}`"
                ></div>
              </div>
              
              <!-- Ponto do saldo acumulado -->
              <div 
                class="balance-point"
                :style="{ 
                  bottom: `${120 + (item.saldoAcumulado / Math.max(maxBalance, 1) * 60)}px`,
                  backgroundColor: item.saldoAcumulado >= 0 ? '#10b981' : '#ef4444'
                }"
                :title="`Saldo: ${formatCurrency(item.saldoAcumulado)}`"
              ></div>
              
              <!-- Label do dia -->
              <div class="chart-label">{{ item.label }}</div>
            </div>
            
            <!-- Linha do saldo acumulado -->
            <svg class="balance-line" :viewBox="`0 0 ${historyData.length * 20} 200`">
              <polyline
                :points="balanceLinePoints"
                fill="none"
                stroke="#8b5cf6"
                stroke-width="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Fluxo Estilo Novo -->
    <div class="table-container">
      <div class="table-header">
        <h3 class="table-title">FLUXO DE CAIXA - {{ formatPeriodTitle(dataInicio, dataFim) }}</h3>
      </div>
      
      <div class="table-wrapper">
        <table class="cash-flow-table-new">
          <thead>
            <tr>
              <th class="category-header">Categoria</th>
              <th 
                v-for="periodo in periodos" 
                :key="periodo.key"
                :class="getPeriodHeaderClass(periodo)"
                class="period-header-cell"
              >
                <div class="period-header-content">
                  <div class="period-date">{{ periodo.shortLabel || periodo.label }}</div>
                  <div v-if="periodo.typeLabel" class="period-type">{{ periodo.typeLabel }}</div>
                </div>
              </th>
              <th class="total-header">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="linha in linhas" :key="linha.categoria" class="data-row">
              <td class="category-cell">
                <span 
                  class="category-name" 
                  :class="{ 
                    'saldo-inicial': linha.isSaldoInicial,
                    'total-saldo': linha.isTotalSaldo
                  }"
                >
                  {{ 
                    linha.isTotalSaldo ? `📊 ${linha.categoria}` :
                    linha.isSaldoInicial ? `💰 ${linha.categoria}` : 
                    linha.categoria 
                  }}
                </span>
              </td>
              <td 
                v-for="periodo in periodos" 
                :key="periodo.key"
                :class="getPeriodCellClass(periodo, linha[periodo.key])"
                class="value-cell"
                @click="linha.isSaldoInicial ? showSaldoDetails(linha, periodo) : showDetails(linha.categoria, periodo, linha[periodo.key])"
              >
                <ValueDisplay 
                  :value="linha[periodo.key] || 0" 
                  type="currency" 
                  :class="[
                    getValueClass(linha[periodo.key] || 0),
                    { 
                      'saldo-inicial-value': linha.isSaldoInicial,
                      'total-saldo': linha.isTotalSaldo
                    }
                  ]"
                  :title="linha.isSaldoInicial && !linha.isTotalSaldo ? getSaldoTooltip(linha, periodo) : ''"
                />
              </td>
              <td class="total-cell">
                <span v-if="linha.isSaldoInicial" class="saldo-inicial-total">-</span>
                <ValueDisplay 
                  v-else
                  :value="linha.total" 
                  type="currency" 
                  emphasis 
                  :class="getValueClass(linha.total)" 
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Dialog de Detalhes Melhorado -->
    <Dialog 
      v-model:visible="showDetailsDialog" 
      :header="detailsTitle"
      :modal="true"
      :style="{ width: '95vw', maxWidth: '1400px' }"
      class="details-dialog"
    >
      <div class="details-content">
        <div class="details-header">
          <div class="details-info">
            <div class="details-title">{{ selectedDetails.categoria }}</div>
            <div class="details-period">{{ selectedDetails.periodo }}</div>
          </div>
          <div class="details-summary">
            <div class="summary-item">
              <span class="summary-label">Total Geral:</span>
              <ValueDisplay :value="selectedDetails.total" type="currency" emphasis :class="getValueClass(selectedDetails.total)" />
            </div>
            <div class="summary-item">
              <span class="summary-label">Itens:</span>
              <span class="summary-count">{{ selectedDetails.items.length }}</span>
            </div>
          </div>
        </div>

        <div class="details-table-wrapper">
          <table class="details-table-new">
            <thead>
              <tr>
                <th>Título</th>
                <th>Documento</th>
                <th>Nota Fiscal</th>
                <th>Cliente / Fornecedor</th>
                <th>Projeto</th>
                <th>Emissão</th>
                <th>Vencimento</th>
                <th>Previsão</th>
                <th>Valor Bruto</th>
                <th>Total Aberto</th>
                <th>Total em Aberto</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in selectedDetails.items" :key="index">
                <td class="detail-titulo">{{ item.titulo }}</td>
                <td class="detail-documento">{{ item.documento }}</td>
                <td class="detail-nota">{{ item.notaFiscal || '-' }}</td>
                <td class="detail-pessoa">{{ item.pessoa }}</td>
                <td class="detail-projeto">{{ item.projeto || '-' }}</td>
                <td class="detail-date">
                  <DateDisplay :date="item.emissao" />
                </td>
                <td class="detail-date">
                  <DateDisplay :date="item.data" />
                </td>
                <td class="detail-date">
                  <DateDisplay :date="item.previsao" allowEmpty />
                </td>
                <td class="detail-value">
                  <ValueDisplay :value="item.valorBruto || item.valor" type="currency" :class="getValueClass(item.valorBruto || item.valor)" />
                </td>
                <td class="detail-value">
                  <ValueDisplay :value="item.totalAberto || 0" type="currency" :class="getValueClass(item.totalAberto || 0)" />
                </td>
                <td class="detail-value">
                  <ValueDisplay :value="item.totalEmAberto || item.totalAberto || 0" type="currency" :class="getValueClass(item.totalEmAberto || item.totalAberto || 0)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCashFlowData } from '../../composables/useCashFlowData'
import { useReadonlyParametros } from '../../composables/useParametros'
import { formatDateRange, formatPeriodTitle } from '../../utils/dateUtils'
import { formatCurrency, getValueClass } from '../../utils/formatUtils'
import ValueDisplay from '../common/ValueDisplay.vue'
import DateDisplay from '../common/DateDisplay.vue'

const loading = ref(false)
const showDetailsDialog = ref(false)
const selectedDetails = ref({
  categoria: '',
  periodo: '',
  total: 0,
  items: []
})

const { dataInicio, dataFim, empresaSelecionada } = useReadonlyParametros()
const { generateCashFlowData, getDetailsForPeriod, getHistoryData } = useCashFlowData()

const linhas = ref([])
const periodos = ref([])
const historyData = ref([])

const detailsTitle = computed(() => 
  `${selectedDetails.value.categoria} - ${selectedDetails.value.periodo}`
)

const totals = computed(() => {
  const realizado = linhas.value.reduce((sum, item) => {
    return sum + periodos.value
      .filter(p => p.type === 'realizado')
      .reduce((pSum, p) => pSum + (item[p.key] || 0), 0)
  }, 0)
  
  const previsto = linhas.value.reduce((sum, item) => {
    return sum + periodos.value
      .filter(p => p.type === 'previsto')
      .reduce((pSum, p) => pSum + (item[p.key] || 0), 0)
  }, 0)
  
  return {
    realizado,
    previsto,
    saldo: realizado + previsto
  }
})

// Dados para o histórico visual
const maxValue = computed(() => {
  if (historyData.value.length === 0) return 1000
  return Math.max(
    ...historyData.value.map(item => Math.max(Math.abs(item.entradas), Math.abs(item.saidas))),
    1000
  )
})

const maxBalance = computed(() => {
  if (historyData.value.length === 0) return 1000
  return Math.max(
    ...historyData.value.map(item => Math.abs(item.saldoAcumulado)),
    1000
  )
})

const balanceLinePoints = computed(() => {
  if (historyData.value.length === 0) return ''
  return historyData.value.map((item, index) => {
    const x = index * 20
    const y = 120 - (item.saldoAcumulado / maxBalance.value * 60)
    return `${x},${y}`
  }).join(' ')
})

const getPeriodHeaderClass = (periodo) => {
  const classes = ['period-header']
  if (periodo.type === 'realizado') classes.push('realizado-header')
  if (periodo.type === 'previsto') classes.push('previsto-header')
  if (periodo.isCurrentMonth || periodo.isCurrentDay) classes.push('current-period-header')
  return classes.join(' ')
}

const getPeriodCellClass = (periodo, valor) => {
  const classes = ['period-cell']
  if (periodo.type === 'realizado') classes.push('realizado-cell')
  if (periodo.type === 'previsto') classes.push('previsto-cell')
  if (periodo.isCurrentMonth || periodo.isCurrentDay) classes.push('current-period-cell')
  if (valor !== 0) classes.push('clickable-value')
  return classes.join(' ')
}

const showDetails = async (categoria, periodo, valor) => {
  // Não mostrar detalhes para saldo inicial
  if (categoria.includes('SALDO INICIAL') || linhas.value.find(l => l.categoria === categoria)?.isSaldoInicial) return
  
  if (valor === 0) return
  
  console.log('Clicou para ver detalhes:', { categoria, periodo: periodo.label, valor })
  
  const details = await getDetailsForPeriod(categoria, periodo)
  
  selectedDetails.value = {
    categoria,
    periodo: periodo.label,
    total: valor,
    items: details
  }
  
  showDetailsDialog.value = true
}

const showSaldoDetails = async (linha, periodo) => {
  if (linha.isTotalSaldo) return // Não mostrar detalhes para linha de total
  
  const conta = linha.categoria
  const valor = linha[periodo.key] || 0
  
  if (valor === 0) return
  
  console.log('Clicou para ver detalhes do saldo:', { conta, periodo: periodo.label, valor })
  
  // Buscar movimentações desta conta específica até este período
  const { getFilteredData } = useDataService()
  const { categoriasSelecionadas, contasSelecionadas } = useReadonlyParametros()
  
  const allData = getFilteredData([], [], null, null) // Todos os dados sem filtro de período
  
  // Filtrar movimentações desta conta até a data do período
  const movimentacoesConta = allData.filter(item => {
    const contaItem = item.conta_financeira_erp_descricao || 'Conta não informada'
    const dataItem = new Date(item.data_ymd)
    const dataPeriodo = new Date(periodo.date)
    
    return contaItem === conta && dataItem <= dataPeriodo
  })
  
  // Transformar em formato de detalhes
  const details = movimentacoesConta.map((item, index) => {
    const dataItem = new Date(item.data_ymd)
    const isRealizado = item.baixado === true || item.baixado === 1
    
    return {
      titulo: `${item.categoria_erp_descricao}`,
      documento: `DOC ${String(1000 + index).padStart(4, '0')}`,
      notaFiscal: '-',
      data: item.data_ymd,
      emissao: item.data_ymd,
      previsao: isRealizado ? null : item.data_ymd,
      pessoa: item.pessoa_erp_descricao,
      projeto: item.categoria_erp_descricao,
      valor: item.valor,
      valorBruto: item.valor,
      totalAberto: isRealizado ? 0 : item.valor,
      totalEmAberto: isRealizado ? 0 : item.valor,
      status: isRealizado ? 'Realizado' : 'Previsto',
      observacoes: item.observacoes || '',
      baixado: isRealizado
    }
  }).sort((a, b) => new Date(b.data) - new Date(a.data)) // Mais recentes primeiro
  
  selectedDetails.value = {
    categoria: `💰 ${conta} - Saldo Acumulado`,
    periodo: periodo.label,
    total: valor,
    items: details
  }
  
  showDetailsDialog.value = true
}

const getSaldoTooltip = (linha, periodo) => {
  const conta = linha.categoria
  const valor = linha[periodo.key] || 0
  const valorFormatado = formatCurrency(valor)
  
  return `${conta}\nSaldo acumulado até ${periodo.label}: ${valorFormatado}\n\nClique para ver detalhes das movimentações`
}
const updateData = async () => {
  if (!dataInicio.value || !dataFim.value) return
  
  loading.value = true
  try {
    console.log('Atualizando dados para empresa:', empresaSelecionada.value)
    
    const result = await generateCashFlowData(dataInicio.value, dataFim.value)
    linhas.value = result.linhas
    periodos.value = result.periodos

    // Gerar dados do histórico
    historyData.value = await getHistoryData(dataInicio.value, dataFim.value)
    
    console.log('Dados atualizados - Linhas:', linhas.value.length, 'Períodos:', periodos.value.length, 'Histórico:', historyData.value.length)
  } finally {
    loading.value = false
  }
}

// Watch para mudanças nos parâmetros, incluindo empresa
watch([dataInicio, dataFim, empresaSelecionada], updateData, { immediate: true })
</script>

<style scoped>
.cash-flow-view {
  padding: 1rem;
}

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

.summary-card.success {
  border-left-color: #28a745;
}

.summary-card.warning {
  border-left-color: #ffc107;
}

.summary-card.danger {
  border-left-color: #dc3545;
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

.summary-card.success .card-icon {
  background: #28a745;
}

.summary-card.warning .card-icon {
  background: #ffc107;
}

.summary-card.danger .card-icon {
  background: #dc3545;
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

.period-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
  font-size: 0.875rem;
  font-weight: 500;
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

/* Histórico Visual */
.history-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px rgba(26, 54, 93, 0.08);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.history-header h3 {
  margin: 0;
  color: var(--primary-color);
  font-size: 1.25rem;
}

.history-legend {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--neutral-600);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.legend-color.positive {
  background: #10b981;
}

.legend-color.negative {
  background: #ef4444;
}

.legend-color.balance {
  background: #8b5cf6;
}

.history-chart {
  height: 200px;
  position: relative;
  background: linear-gradient(135deg, #f8fafb 0%, #e8f0f2 100%);
  border-radius: 8px;
  padding: 1rem;
}

.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart-grid {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart-day {
  position: absolute;
  bottom: 0;
  width: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.chart-bars {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  margin-bottom: 20px;
}

.chart-bar {
  width: 8px;
  border-radius: 2px 2px 0 0;
  min-height: 2px;
  transition: all 0.3s ease;
}

.chart-bar:hover {
  transform: scaleY(1.1);
}

.chart-bar.positive {
  background: linear-gradient(to top, #10b981, #34d399);
}

.chart-bar.negative {
  background: linear-gradient(to top, #ef4444, #f87171);
}

.balance-point {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  position: absolute;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.balance-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.chart-label {
  font-size: 0.7rem;
  color: var(--neutral-500);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  margin-top: 0.5rem;
}

/* Nova Tabela de Fluxo */
.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #dee2e6;
}

.table-header {
  background: #4a90e2;
  color: white;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #357abd;
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

.cash-flow-table-new {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.cash-flow-table-new th,
.cash-flow-table-new td {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  text-align: center;
  vertical-align: middle;
}

.category-header {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  text-align: left;
  position: sticky;
  left: 0;
  z-index: 10;
  min-width: 200px;
}

.period-header-cell {
  background: #e9ecef;
  color: #495057;
  font-weight: 600;
  min-width: 80px;
}

.realizado-header {
  background: #d4edda !important;
  color: #155724 !important;
}

.previsto-header {
  background: #fff3cd !important;
  color: #856404 !important;
}

.current-period-header {
  background: #cce5ff !important;
  color: #004085 !important;
  font-weight: 700 !important;
}

.total-header {
  background: #e3f2fd;
  color: #1565c0;
  font-weight: 700;
  position: sticky;
  right: 0;
  z-index: 10;
  min-width: 100px;
}

.period-header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
}

.period-date {
  font-weight: 600;
  font-size: 0.7rem;
}

.period-type {
  font-size: 0.6rem;
  opacity: 0.8;
  font-weight: 400;
}

.data-row:nth-child(even) {
  background: #f8f9fa;
}

.data-row:hover {
  background: #e3f2fd;
}

.category-cell {
  background: #f8f9fa;
  text-align: left;
  font-weight: 500;
  color: #495057;
  position: sticky;
  left: 0;
  z-index: 5;
}

.category-name {
  font-size: 0.75rem;
}

.value-cell {
  cursor: default;
  transition: all 0.2s ease;
}

.clickable-value {
  cursor: pointer;
}

.clickable-value:hover {
  background: #007bff !important;
  color: white !important;
  transform: scale(1.05);
}

.realizado-cell {
  background: rgba(212, 237, 218, 0.3);
}

.previsto-cell {
  background: rgba(255, 243, 205, 0.3);
}

.current-period-cell {
  background: rgba(204, 229, 255, 0.3);
}

.total-cell {
  background: rgba(227, 242, 253, 0.8);
  font-weight: 700;
  position: sticky;
  right: 0;
  z-index: 5;
}

.positive-value {
  color: #28a745 !important;
  font-weight: 600;
}

.negative-value {
  color: #dc3545 !important;
  font-weight: 600;
}

.neutral-value {
  color: #6c757d !important;
}

/* Estilos para Saldo Inicial */
.saldo-inicial {
  font-weight: 700 !important;
  color: #2563eb !important;
  font-size: 0.8rem !important;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border-left: 3px solid #2563eb;
}

.saldo-inicial.total-saldo {
  background: linear-gradient(135deg, #1e40af, #3b82f6) !important;
  color: white !important;
  border-left: 4px solid #1e40af !important;
  font-weight: 800 !important;
  font-size: 0.85rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3);
}

.saldo-inicial-value {
  font-weight: 700 !important;
  color: #2563eb !important;
  background: rgba(37, 99, 235, 0.1) !important;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  border: 1px solid rgba(37, 99, 235, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.saldo-inicial-value:hover {
  background: rgba(37, 99, 235, 0.2) !important;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.saldo-inicial-value.total-saldo {
  background: rgba(30, 64, 175, 0.2) !important;
  color: #1e40af !important;
  border: 2px solid rgba(30, 64, 175, 0.4) !important;
  font-weight: 800 !important;
  box-shadow: 0 2px 6px rgba(30, 64, 175, 0.2);
  cursor: default;
}

.saldo-inicial-value.total-saldo:hover {
  transform: none;
  box-shadow: 0 2px 6px rgba(30, 64, 175, 0.2);
}
.saldo-inicial-total {
  color: #6c757d;
  font-style: italic;
}

/* Dialog de Detalhes */
.details-dialog :deep(.p-dialog-header) {
  background: #4a90e2;
  color: white;
  border-bottom: 1px solid #357abd;
  padding: 1rem;
}

.details-dialog :deep(.p-dialog-title) {
  font-size: 1rem;
  font-weight: 600;
}

.details-content {
  padding: 0;
}

.details-header {
  background: #f8f9fa;
  padding: 1.5rem;
  border-bottom: 2px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.details-info {
  flex: 1;
}

.details-title {
  font-weight: 600;
  color: #495057;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.details-period {
  font-size: 0.875rem;
  color: #6c757d;
  background: #e9ecef;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  display: inline-block;
}

.details-summary {
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
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
}

.summary-count {
  font-size: 1.25rem;
  font-weight: 700;
  color: #495057;
}

.details-table-wrapper {
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
}

.details-table-new {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.details-table-new th,
.details-table-new td {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  text-align: left;
  vertical-align: middle;
}

.details-table-new th {
  background: #e9ecef;
  color: #495057;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

.details-table-new tbody tr:nth-child(even) {
  background: #f8f9fa;
}

.details-table-new tbody tr:hover {
  background: #e3f2fd;
}

.detail-titulo,
.detail-documento,
.detail-nota,
.detail-pessoa,
.detail-projeto {
  font-size: 0.75rem;
  color: #495057;
}

.detail-date {
  text-align: center;
}

.detail-value {
  text-align: right;
  font-weight: 600;
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .history-legend {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .details-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .details-summary {
    align-self: stretch;
    justify-content: space-around;
  }
  
  .cash-flow-table-new th,
  .cash-flow-table-new td {
    padding: 0.25rem;
    font-size: 0.7rem;
  }
  
  .chart-label {
    font-size: 0.6rem;
  }
}
</style>