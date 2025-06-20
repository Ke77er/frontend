<template>
  <div class="app-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="container">
        <!-- Página Inicial -->
        <div v-if="currentView === 'home'" class="home-page">
          <div class="welcome-section">
            <h2 class="welcome-title">Sistema Financeiro</h2>
            <p class="welcome-subtitle">Escolha uma opção para começar</p>
          </div>
          
          <div class="navigation-cards">
            <div class="nav-card" @click="navigateTo('cashflow')">
              <div class="nav-card-icon">
                <i class="pi pi-chart-line"></i>
              </div>
              <div class="nav-card-content">
                <h3>Fluxo de Caixa</h3>
                <p>Entradas e saídas por período</p>
              </div>
              <div class="nav-card-arrow">
                <i class="pi pi-arrow-right"></i>
              </div>
            </div>
            
            <div class="nav-card" @click="navigateTo('overdue')">
              <div class="nav-card-icon">
                <i class="pi pi-exclamation-triangle"></i>
              </div>
              <div class="nav-card-content">
                <h3>Atrasados</h3>
                <p>Contas em atraso por categoria</p>
              </div>
              <div class="nav-card-arrow">
                <i class="pi pi-arrow-right"></i>
              </div>
            </div>
            
            <div class="nav-card" @click="navigateTo('rawdata')">
              <div class="nav-card-icon">
                <i class="pi pi-database"></i>
              </div>
              <div class="nav-card-content">
                <h3>Dados Brutos</h3>
                <p>Visualização completa dos registros</p>
              </div>
              <div class="nav-card-arrow">
                <i class="pi pi-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Conteúdo das Abas -->
        <div v-else class="content-view">
          <div class="view-header">
            <Button
              @click="goHome"
              icon="pi pi-home"
              label="Início"
              class="p-button-outlined p-button-sm home-btn"
            />
            <h2 class="current-view-title">{{ currentViewTitle }}</h2>
          </div>
          
          <FilterPanel />
          
          <div class="view-content">
            <CashFlowView v-if="currentView === 'cashflow'" />
            <OverdueView v-if="currentView === 'overdue'" />
            <RawDataView v-if="currentView === 'rawdata'" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import FilterPanel from './components/filters/FilterPanel.vue'
import CashFlowView from './components/views/CashFlowView.vue'
import OverdueView from './components/views/OverdueView.vue'
import RawDataView from './components/views/RawDataView.vue'

const currentView = ref('home')

const currentViewTitle = computed(() => {
  const titles = {
    'cashflow': 'Fluxo de Caixa',
    'overdue': 'Contas Atrasadas',
    'rawdata': 'Dados Brutos'
  }
  return titles[currentView.value] || ''
})

const navigateTo = (view) => {
  currentView.value = view
}

const goHome = () => {
  currentView.value = 'home'
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafb 0%, #e8f0f2 100%);
}

.main-content {
  padding: 1.5rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Página Inicial - Mais Compacta */
.home-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.welcome-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.5rem;
}

.welcome-subtitle {
  font-size: 1rem;
  color: #4a5568;
  margin: 0;
}

.navigation-cards {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

.nav-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(26, 54, 93, 0.08);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.nav-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(26, 54, 93, 0.15);
  border-color: #2b6cb0;
}

.nav-card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  background: linear-gradient(135deg, #2b6cb0, #1a365d);
  flex-shrink: 0;
}

.nav-card-content {
  flex: 1;
}

.nav-card-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a365d;
  margin: 0 0 0.25rem 0;
}

.nav-card-content p {
  color: #4a5568;
  margin: 0;
  font-size: 0.9rem;
}

.nav-card-arrow {
  font-size: 1.25rem;
  color: #2b6cb0;
  transition: transform 0.3s ease;
}

.nav-card:hover .nav-card-arrow {
  transform: translateX(6px);
}

/* Conteúdo das Views */
.content-view {
  animation: fadeIn 0.3s ease-out;
}

.view-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.home-btn {
  border-color: #2b6cb0;
  color: #2b6cb0;
}

.home-btn:hover {
  background: #2b6cb0;
  color: white;
}

.current-view-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a365d;
  margin: 0;
}

.view-content {
  margin-top: 1.5rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 1.75rem;
  }
  
  .nav-card {
    padding: 1.25rem;
    gap: 1.25rem;
  }
  
  .nav-card-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .nav-card-content h3 {
    font-size: 1.1rem;
  }
  
  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>