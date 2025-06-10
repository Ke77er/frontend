<template>
  <div class="p-4 surface-card shadow-2 border-round mb-4">
    <div class="text-sm text-500 mb-2">📅 Última atualização: <strong>{{ ultimaAtualizacao }}</strong></div>

    <div class="flex flex-wrap gap-3">
      <MultiSelect v-model="categoriasSelecionadas" :options="categorias" option-label="label" option-value="value"
        placeholder="Filtrar Categorias" class="w-full md:w-30rem p-multiselect-sm" />
      <MultiSelect v-model="contasSelecionadas" :options="contas" option-label="label" option-value="value"
        placeholder="Filtrar Contas Financeiras" class="w-full md:w-30rem p-multiselect-sm" />
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import fluxo from '../assets/fluxo.json'
import { useParametros } from '../composables/useParametros'

const { categoriasSelecionadas, contasSelecionadas } = useParametros()

const ultimaAtualizacao = '2025-02-28 10:51'

const categorias = ref([])
const contas = ref([])

onMounted(() => {
  const catSet = new Set()
  const contaSet = new Set()

  fluxo.forEach((l) => {
    if (l.categoria_erp_id && l.categoria_erp_descricao) {
      catSet.add(`${l.categoria_erp_id} - ${l.categoria_erp_descricao}`)
    }
    if (l.conta_financeira_erp_descricao) {
      contaSet.add(l.conta_financeira_erp_descricao)
    }
  })

  categorias.value = Array.from(catSet).map((str) => ({
    label: str,
    value: str.split(' - ')[0] // ID da categoria
  }))

  contas.value = Array.from(contaSet).map((str) => ({
    label: str,
    value: str
  }))
})
</script>