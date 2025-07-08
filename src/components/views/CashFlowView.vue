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

    <!-- Rest of the template content -->
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCashFlowData } from '../../composables/useCashFlowData'
import { useReadonlyParametros } from '../../composables/useParametros'
import { format, eachDayOfInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ValueDisplay from '../common/ValueDisplay.vue'
import DateDisplay from '../common/DateDisplay.vue'

// Rest of the script content
</script>

<style scoped>
/* All the styles remain the same */
</style>