<template>
  <div class="app-container animate-fade-in">
    <AppHeader />
    
    <main class="main-content">
      <div class="container">
        <!-- Página Inicial Compacta -->
        <div v-if="currentView === 'home'" class="home-page">
          <div class="welcome-section">
            <BaseCard variant="elevated" class="welcome-card">
              <div class="welcome-icon">
                <i class="pi pi-chart-bar"></i>
              </div>
              <h2 class="welcome-title">Sistema Financeiro</h2>
              <p class="welcome-subtitle">Escolha uma opção para começar</p>
            </BaseCard>
          </div>
          
          <div class="navigation-grid">
            <BaseCard 
              class="nav-card cashflow-card animate-scale-in" 
              hover
              @click="navigateTo('cashflow')"
            >
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
            </BaseCard>
            
            <BaseCard 
              class="nav-card overdue-card animate-scale-in" 
              hover
              @click="navigateTo('overdue')"
              style="animation-delay: 0.1s"
            >
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
            </BaseCard>
            
            <BaseCard 
              class="nav-card rawdata-card animate-scale-in" 
              hover
              @click="navigateTo('rawdata')"
              style="animation-delay: 0.2s"
            >
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
            </BaseCard>
          </div>
        </div>
        
        <!-- Conteúdo das Abas -->
        <div v-else class="content-view animate-slide-in">
          <div class="view-header">
            <BaseButton
              @click="goHome"
              icon="pi pi-home"
              variant="outline"
              size="sm"
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
import BaseCard from './components/ui/BaseCard.vue'
import BaseButton from './components/ui/BaseButton.vue'
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
  background: var(--gradient-background);
  transition: background var(--transition-normal);
}

.main-content {
  padding: var(--spacing-6) 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

/* Página Inicial Compacta */
.home-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-8) 0;
}

.welcome-section {
  text-align: center;
  margin-bottom: var(--spacing-8);
}

.welcome-card {
  background: var(--gradient-primary);
  color: var(--color-primary-foreground);
  padding: var(--spacing-8);
  position: relative;
  overflow: hidden;
  border: none;
}

.welcome-card::before {
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
  margin: 0 auto var(--spacing-4);
  font-size: var(--font-size-2xl);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.welcome-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-2);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.welcome-subtitle {
  font-size: var(--font-size-base);
  margin: 0;
  opacity: 0.9;
  font-weight: var(--font-weight-normal);
}

/* Grid de Navegação Compacta */
.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
  max-width: 1000px;
  margin: 0 auto;
}

.nav-card {
  padding: var(--spacing-6);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.nav-card-icon {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  color: var(--color-primary-foreground);
  flex-shrink: 0;
  transition: all var(--transition-normal);
}

.cashflow-card .nav-card-icon {
  background: var(--gradient-primary);
  box-shadow: var(--shadow-md);
}

.overdue-card .nav-card-icon {
  background: var(--gradient-danger);
  box-shadow: var(--shadow-md);
}

.rawdata-card .nav-card-icon {
  background: var(--gradient-success);
  box-shadow: var(--shadow-md);
}

.nav-card:hover .nav-card-icon {
  transform: scale(1.1) rotate(3deg);
}

.nav-card-content {
  flex: 1;
}

.nav-card-content h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-2) 0;
}

.nav-card-content p {
  color: var(--color-text-muted);
  margin: 0 0 var(--spacing-3) 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

.nav-card-features {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.feature-tag {
  background: var(--color-muted);
  color: var(--color-text-muted);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border: 1px solid var(--color-border);
  transition: all var(--transition-normal);
}

.nav-card:hover .feature-tag {
  background: var(--color-accent);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.nav-card-arrow {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  transition: all var(--transition-normal);
  flex-shrink: 0;
}

.nav-card:hover .nav-card-arrow {
  transform: translateX(var(--spacing-2)) scale(1.2);
  color: var(--color-primary-hover);
}

/* Conteúdo das Views */
.view-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.current-view-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0;
}

.view-content {
  margin-top: var(--spacing-6);
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
    gap: var(--spacing-4);
  }
  
  .nav-card {
    padding: var(--spacing-5);
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-4);
  }
  
  .nav-card-content {
    order: 2;
  }
  
  .nav-card-arrow {
    order: 3;
    transform: rotate(90deg);
  }
  
  .nav-card:hover .nav-card-arrow {
    transform: rotate(90deg) translateY(-var(--spacing-2)) scale(1.2);
  }
  
  .welcome-title {
    font-size: var(--font-size-2xl);
  }
  
  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .current-view-title {
    font-size: var(--font-size-xl);
  }
}

@media (min-width: 1200px) {
  .navigation-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>