<template>
  <div class="p-4 surface-ground min-h-screen">
    <div class="text-2xl font-semibold mb-4 text-primary">💼 Codex Finance - Fluxo de Caixa</div>

    <Parametros />

    <div class="card">
      <TabView>
        <TabPanel header="Fluxo de Caixa">
          <FluxoCaixa />
        </TabPanel>
        <TabPanel header="Atrasados">
          <Atrasados />
        </TabPanel>
        <TabPanel header="Dados Brutos">
          <DadosBrutos />
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup>
import FluxoCaixa from './components/FluxoCaixa.vue'
import Atrasados from './components/Atrasados.vue'
import DadosBrutos from './components/DadosBrutos.vue'
import Parametros from './components/Parametros.vue'
</script>

<style>
body {
  font-family: 'Segoe UI', sans-serif;
}
</style>
