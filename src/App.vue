<template>
  <div class="app-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="container">
        <!-- Página Inicial -->
        <div v-if="currentView === 'home'" class="home-page">
          <div class="welcome-section">
            <div class="welcome-content">
              <div class="welcome-icon">
                <i class="pi pi-chart-bar"></i>
              </div>
              <h2 class="welcome-title">Sistema Financeiro</h2>
              <p class="welcome-subtitle">Escolha uma opção para começar</p>
            </div>
          </div>
          
          <div class="navigation-cards">
            <div class="nav-card cashflow-card" @click="navigateTo('cashflow')">
              <div class="nav-card-background"></div>
              <div class="nav-card-content">
                <div class="nav-card-icon">
                  <i class="pi pi-chart-line"></i>
                </div>
                <div class="nav-card-info">
                  <h3>Fluxo de Caixa</h3>
                  <p>Entradas e saídas por período</p>
                  <div class="nav-card-features">
                    <span class="feature-tag">Histórico Visual</span>
                    <span class="feature-tag">Detalhamento</span>
                  </div>
                </div>
              </div>
              <div class="nav-card-arrow">
                <i class="pi pi-arrow-right"></i>
              </div>
            </div>
            
            <div class="nav-card overdue-card" @click="navigateTo('overdue')">
              <div class="nav-card-background"></div>
              <div class="nav-card-content">
                <div class="nav-card-icon">
                  <i class="pi pi-exclamation-triangle"></i>
                </div>
                <div class="nav-card-info">
                  <h3>Atrasados</h3>
                  <p>Contas em atraso por categoria</p>
                  <div class="nav-card-features">
                    <span class="feature-tag">Por Categoria</span>
                    <span class="feature-tag">Alertas</span>
                  </div>
                </div>
              </div>
              <div class="nav-card-arrow">
                <i class="pi pi-arrow-right"></i>
              </div>
            </div>
            
            <div class="nav-card rawdata-card" @click="navigateTo('rawdata')">
              <div class="nav-card-background"></div>
              <div class="nav-card-content">
                <div class="nav-card-icon">
                  <i class="pi pi-database"></i>
                </div>
                <div class="nav-card-info">
                  <h3>Dados Brutos</h3>
                  <p>Visualização completa dos registros</p>
                  <div class="nav-card-features">
                    <span class="feature-tag">Exportação</span>
                    <span class="feature-tag">Filtros</span>
                  </div>
                </div>
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
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 50%, #ddeeff 100%);
}

.main-content {
  padding: 1.5rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Página Inicial Redesenhada */
.home-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.welcome-content {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(30, 64, 175, 0.3);
  position: relative;
  overflow: hidden;
}

.welcome-content::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

.welcome-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.welcome-subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 300;
}

.navigation-cards {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
}

.nav-card {
  background: white;
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 8px 32px rgba(30, 64, 175, 0.12);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  min-height: 140px;
}

.nav-card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.cashflow-card .nav-card-background {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
}

.overdue-card .nav-card-background {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
}

.rawdata-card .nav-card-background {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}

.nav-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(30, 64, 175, 0.25);
  border-color: rgba(59, 130, 246, 0.3);
}

.nav-card:hover .nav-card-background {
  opacity: 0.05;
}

.nav-card-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.nav-card-icon {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
  flex-shrink: 0;
  position: relative;
  transition: all 0.4s ease;
}

.cashflow-card .nav-card-icon {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  box-shadow: 0 8px 24px rgba(30, 64, 175, 0.4);
}

.overdue-card .nav-card-icon {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
}

.rawdata-card .nav-card-icon {
  background: linear-gradient(135deg, #059669, #10b981);
  box-shadow: 0 8px 24px rgba(5, 150, 105, 0.4);
}

.nav-card:hover .nav-card-icon {
  transform: scale(1.1) rotate(5deg);
}

.nav-card-info {
  flex: 1;
}

.nav-card-info h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  transition: color 0.3s ease;
}

.nav-card-info p {
  color: #64748b;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.nav-card-features {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.feature-tag {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.nav-card:hover .feature-tag {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e40af;
  border-color: #3b82f6;
}

.nav-card-arrow {
  font-size: 1.5rem;
  color: #3b82f6;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1rem;
}

.nav-card:hover .nav-card-arrow {
  transform: translateX(8px) scale(1.2);
  color: #1e40af;
}

/* Conteúdo das Views */
.content-view {
  animation: fadeIn 0.4s ease-out;
}

.view-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.home-btn {
  border-color: #3b82f6;
  color: #3b82f6;
  transition: all 0.3s ease;
}

.home-btn:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

.current-view-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e40af;
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

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 2rem;
  }
  
  .nav-card-content {
    padding: 1.5rem;
    gap: 1.25rem;
  }
  
  .nav-card-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .nav-card-info h3 {
    font-size: 1.2rem;
  }
  
  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .current-view-title {
    font-size: 1.5rem;
  }
}
</style>