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
}

.custom-tabview :deep(.p-tabview-nav-link:hover) {
  color: #3b82f6;
}

.custom-tabview :deep(.p-highlight .p-tabview-nav-link) {
  color: #3b82f6;
  border-color: #3b82f6;
}
</style>