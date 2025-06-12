<template>
  <div class="app-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="container">
        <FilterPanel />
        
        <div class="content-tabs">
          <TabView class="custom-tabview">
            <TabPanel header="📊 Fluxo de Caixa">
              <CashFlowView />
            </TabPanel>
            <TabPanel header="⏱️ Atrasados">
              <OverdueView />
            </TabPanel>
            <TabPanel header="📑 Dados Brutos">
              <RawDataView />
            </TabPanel>
          </TabView>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import FilterPanel from './components/filters/FilterPanel.vue'
import CashFlowView from './components/views/CashFlowView.vue'
import OverdueView from './components/views/OverdueView.vue'
import RawDataView from './components/views/RawDataView.vue'
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.main-content {
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.content-tabs {
  margin-top: 2rem;
}

.custom-tabview :deep(.p-tabview-nav) {
  background: white;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  overflow-y: hidden;
}

.custom-tabview :deep(.p-tabview-panels) {
  background: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: none;
}

.custom-tabview :deep(.p-tabview-nav-link) {
  font-weight: 600;
  color: #64748b;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.custom-tabview :deep(.p-tabview-nav-link:hover) {
  color: #3b82f6;
}

.custom-tabview :deep(.p-highlight .p-tabview-nav-link) {
  color: #3b82f6;
  border-color: #3b82f6;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .main-content {
    padding: 1.5rem 0;
  }
  
  .container {
    padding: 0 0.75rem;
  }
  
  .content-tabs {
    margin-top: 1.5rem;
  }
  
  .custom-tabview :deep(.p-tabview-nav) {
    border-radius: 8px 8px 0 0;
  }
  
  .custom-tabview :deep(.p-tabview-panels) {
    border-radius: 0 0 8px 8px;
  }
  
  .custom-tabview :deep(.p-tabview-nav-link) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 1rem 0;
  }
  
  .container {
    padding: 0 0.5rem;
  }
  
  .content-tabs {
    margin-top: 1rem;
  }
  
  .custom-tabview :deep(.p-tabview-nav-link) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
  
  /* Make tab text more compact on very small screens */
  .custom-tabview :deep(.p-tabview-nav-link) {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}

/* Ensure tabs scroll horizontally on small screens */
@media (max-width: 600px) {
  .custom-tabview :deep(.p-tabview-nav) {
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
  }
  
  .custom-tabview :deep(.p-tabview-nav li) {
    flex-shrink: 0;
  }
}
</style>