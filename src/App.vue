<template>
  <div class="app-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="container">
        <!-- Página Inicial Compacta -->
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
          
          <div class="navigation-grid">
            <div class="nav-card cashflow-card" @click="navigateTo('cashflow')">
              <div class="nav-card-icon">
                <i class="pi pi-chart-line"></i>
              </div>
              <div class="nav-card-content">
                <h3>Fluxo de Caixa</h3>
                <p>Entradas e saídas por período</p>
                <div class="nav-card-features">
                  <span class="feature-tag">Histórico Visual</span>
                  <span class="feature-tag">Detalhamento</span>
                </div>
              </div>
              <div class="nav-card-arrow">
                <i class="pi pi-arrow-right"></i>
              </div>
            </div>
            
            <div class="nav-card overdue-card" @click="navigateTo('overdue')">
              <div class="nav-card-icon">
                <i class="pi pi-exclamation-triangle"></i>
              </div>
              <div class="nav-card-content">
                <h3>Atrasados</h3>
                <p>Contas em atraso por categoria</p>
                <div class="nav-card-features">
                  <span class="feature-tag">Por Categoria</span>
                  <span class="feature-tag">Alertas</span>
                </div>
              </div>
              <div class="nav-card-arrow">
                <i class="pi pi-arrow-right"></i>
              </div>
            </div>
            
            <div class="nav-card rawdata-card" @click="navigateTo('rawdata')">
              <div class="nav-card-icon">
                <i class="pi pi-database"></i>
              </div>
              <div class="nav-card-content">
                <h3>Dados Brutos</h3>
                <p>Visualização completa dos registros</p>
                <div class="nav-card-features">
                  <span class="feature-tag">Exportação</span>
                  <span class="feature-tag">Filtros</span>
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
  background: linear-gradient(135deg, var(--background-light) 0%, var(--neutral-100) 50%, var(--neutral-200) 100%);
}

.main-content {
  padding: 1.5rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Página Inicial Compacta */
.home-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;
}

.welcome-section {
  text-align: center;
  margin-bottom: 2rem;
}

.welcome-content {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 50%, var(--secondary-color) 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(139, 115, 85, 0.3);
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
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.welcome-title {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.welcome-subtitle {
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 300;
  font-family: var(--font-primary);
}

/* Grid de Navegação Compacta */
.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.nav-card {
  background: var(--background-card);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 6px 24px rgba(139, 115, 85, 0.12);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.nav-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 40px rgba(139, 115, 85, 0.2);
  border-color: rgba(139, 115, 85, 0.3);
}

.nav-card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.cashflow-card .nav-card-icon {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  box-shadow: 0 6px 20px rgba(139, 115, 85, 0.4);
}

.overdue-card .nav-card-icon {
  background: linear-gradient(135deg, var(--danger-color), var(--danger-light));
  box-shadow: 0 6px 20px rgba(184, 133, 107, 0.4);
}

.rawdata-card .nav-card-icon {
  background: linear-gradient(135deg, var(--info-color), var(--info-light));
  box-shadow: 0 6px 20px rgba(139, 154, 139, 0.4);
}

.nav-card:hover .nav-card-icon {
  transform: scale(1.1) rotate(5deg);
}

.nav-card-content {
  flex: 1;
}

.nav-card-content h3 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--neutral-700);
  margin: 0 0 0.5rem 0;
}

.nav-card-content p {
  color: var(--neutral-500);
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.nav-card-features {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.feature-tag {
  background: linear-gradient(135deg, var(--accent-color), var(--neutral-200));
  color: var(--neutral-600);
  padding: 0.2rem 0.6rem;
  border-radius: 16px;
  font-size: 0.7rem;
  font-weight: 500;
  border: 1px solid var(--neutral-200);
  transition: all 0.3s ease;
}

.nav-card:hover .feature-tag {
  background: linear-gradient(135deg, var(--secondary-light), var(--secondary-color));
  color: var(--primary-color);
  border-color: var(--primary-light);
}

.nav-card-arrow {
  font-size: 1.25rem;
  color: var(--primary-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.nav-card:hover .nav-card-arrow {
  transform: translateX(6px) scale(1.2);
  color: var(--primary-color);
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
  border-color: var(--primary-light);
  color: var(--primary-light);
  transition: all 0.3s ease;
}

.home-btn:hover {
  background: var(--primary-light);
  color: white;
  transform: translateY(-2px);
}

.current-view-title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color);
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
  .navigation-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .nav-card {
    padding: 1.25rem;
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .nav-card-content {
    order: 2;
  }
  
  .nav-card-arrow {
    order: 3;
    transform: rotate(90deg);
  }
  
  .nav-card:hover .nav-card-arrow {
    transform: rotate(90deg) translateY(-6px) scale(1.2);
  }
  
  .welcome-title {
    font-size: 1.9rem;
  }
  
  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .current-view-title {
    font-size: 1.5rem;
  }
}

@media (min-width: 1200px) {
  .navigation-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>