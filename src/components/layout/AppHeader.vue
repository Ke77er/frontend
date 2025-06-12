<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <div class="brand">
          <div class="brand-icon">💼</div>
          <div class="brand-text">
            <h1 class="brand-title">Codex Finance</h1>
            <p class="brand-subtitle">Sistema de Fluxo de Caixa</p>
          </div>
        </div>
        
        <div class="header-info">
          <div class="last-update">
            <i class="pi pi-clock text-sm"></i>
            <span>Última atualização: {{ lastUpdate }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const lastUpdate = ref('2025-02-28 10:51')
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-icon {
  font-size: 3rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.brand-subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 300;
}

.header-info {
  display: flex;
  align-items: center;
}

.last-update {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header-content {
    text-align: center;
    justify-content: center;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .brand-icon {
    font-size: 2.5rem;
  }
}
</style>