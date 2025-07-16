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
  background: linear-gradient(135deg, var(--wood-50) 0%, var(--wood-100) 50%, var(--wood-200) 100%);
  position: relative;
}

.app-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(45deg, rgba(93, 64, 55, 0.02) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(93, 64, 55, 0.02) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(93, 64, 55, 0.02) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(93, 64, 55, 0.02) 75%);
  background-size: 40px 40px;
  background-position: 0 0, 0 20px, 20px -20px, -20px 0px;
  pointer-events: none;
  z-index: -1;
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
  background: linear-gradient(135deg, var(--wood-700) 0%, var(--wood-800) 50%, var(--primary-dark) 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(93, 64, 55, 0.4);
  position: relative;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.1);
}

.welcome-content::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
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
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.welcome-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2);
  font-family: 'Georgia', 'Times New Roman', serif;
  letter-spacing: 1px;
}

.welcome-subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-style: italic;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
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
  background: linear-gradient(135deg, var(--wood-50), white);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(93, 64, 55, 0.15);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid var(--wood-200);
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.nav-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.nav-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 16px 48px rgba(93, 64, 55, 0.25);
  border-color: var(--wood-400);
}

.nav-card:hover::before {
  opacity: 1;
}

.nav-card-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: white;
  flex-shrink: 0;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.nav-card-icon i {
  color: white !important;
  opacity: 1 !important;
}

.cashflow-card .nav-card-icon {
  background: linear-gradient(135deg, #a1887f, #8d6e63);
  box-shadow: 0 6px 20px rgba(141, 110, 99, 0.4);
}

.overdue-card .nav-card-icon {
  background: linear-gradient(135deg, #d32f2f, #b71c1c);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
}

.rawdata-card .nav-card-icon {
  background: linear-gradient(135deg, #455a64, #263238);
  box-shadow: 0 6px 20px rgba(69, 90, 100, 0.4);
}

.nav-card:hover .nav-card-icon {
  transform: scale(1.1) rotate(5deg);
}

.nav-card-content {
  flex: 1;
}

.nav-card-content h3 {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--primary-color);
  margin: 0 0 0.5rem 0;
  font-family: 'Georgia', 'Times New Roman', serif;
  letter-spacing: 0.5px;
}

.nav-card-content p {
  color: var(--neutral-600);
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-style: italic;
}

.nav-card-features {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.feature-tag {
  background: linear-gradient(135deg, var(--wood-100), var(--wood-200));
  color: var(--neutral-700);
  padding: 0.2rem 0.6rem;
  border-radius: 16px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid var(--wood-300);
  transition: all 0.3s ease;
  font-family: 'Georgia', 'Times New Roman', serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-card:hover .feature-tag {
  background: linear-gradient(135deg, var(--wood-200), var(--wood-300));
  color: var(--primary-color);
  border-color: var(--wood-400);
  transform: scale(1.05);
}

.nav-card-arrow {
  font-size: 1.25rem;
  color: var(--wood-600);
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
  border-color: var(--wood-600);
  color: var(--wood-600);
  transition: all 0.3s ease;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.home-btn:hover {
  background: var(--wood-600);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(141, 110, 99, 0.3);
}

.current-view-title {
  font-size: 1.9rem;
  font-weight: 800;
  color: var(--primary-color);
  margin: 0;
  font-family: 'Georgia', 'Times New Roman', serif;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(93, 64, 55, 0.1);
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
    font-size: 1.75rem;
  }
  
  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .current-view-title {
    font-size: 1.6rem;
  }
}

@media (min-width: 1200px) {
  .navigation-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>