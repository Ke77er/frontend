<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <div class="brand">
          <div class="brand-icon">
            <i class="pi pi-briefcase"></i>
          </div>
          <div class="brand-text">
            <h1 class="brand-title">{{ name }}</h1>
            <p class="brand-subtitle">{{ subtitle }}</p>
          </div>
        </div>
        
        <div class="header-info">
          <div class="last-update">
            <i class="pi pi-clock"></i>
            <span>Última atualização: {{ lastUpdate }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { APP_CONFIG } from '../../config/constants'

const lastUpdate = ref('2025-02-28 10:51')
const { name, subtitle } = APP_CONFIG
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, var(--wood-800) 0%, var(--wood-900) 50%, var(--primary-dark) 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 6px 24px rgba(93, 64, 55, 0.3);
  position: relative;
}

.app-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%);
  background-size: 30px 30px;
  background-position: 0 0, 0 15px, 15px -15px, -15px 0px;
  pointer-events: none;
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
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--wood-400), var(--wood-500));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: var(--primary-dark);
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  position: relative;
}

.brand-icon::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
  border-radius: 12px;
  pointer-events: none;
}

.brand-title {
  font-size: 2.8rem;
  font-weight: 800;
  margin: 0;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2);
  color: white;
  font-family: 'Georgia', 'Times New Roman', serif;
  letter-spacing: 1px;
}

.brand-subtitle {
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Georgia', 'Times New Roman', serif;
  font-style: italic;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.header-info {
  display: flex;
  align-items: center;
}

.last-update {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  padding: 0.75rem 1rem;
  border-radius: 12px;
  backdrop-filter: blur(15px);
  font-size: 0.9rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  font-family: 'Georgia', 'Times New Roman', serif;
  font-weight: 500;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .header-content {
    text-align: center;
    justify-content: center;
  }
  
  .brand-title {
    font-size: 2.2rem;
  }
  
  .brand-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
}
</style>