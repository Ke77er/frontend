<template>
  <div class="p-4 surface-card shadow-2 border-round mb-5">
    <div class="text-xl font-medium mb-3 text-900">
      📊 Fluxo de Caixa - {{ modoMensal ? 'Mensal' : 'Diário' }}
    </div>

    <div class="flex gap-3 mb-4 flex-wrap align-items-end">
      <ToggleButton v-model="modoMensal" onLabel="Mensal" offLabel="Diário" class="p-button-sm" />
      <Calendar v-model="inicio" view="month" dateFormat="mm/yy" showIcon class="p-inputtext-sm" />
    </div>

    <DataTable :value="linhas" class="p-datatable-sm p-datatable-striped p-datatable-gridlines" :paginator="true"
      :rows="15" responsiveLayout="scroll">
      <Column field="descricao" header="Descrição" style="min-width: 250px" />
      <Column v-for="col in colunas" :key="col.field" :field="col.field" :header="col.header"
        style="min-width: 120px; text-align: right" body-class="text-right" />
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import fluxo from '../assets/fluxo.json'
import { useReadonlyParametros } from '../composables/useParametros'

const modoMensal = ref(false)
const inicio = ref(new Date())

const colunas = ref([])
const linhas = ref([])

const { categoriasSelecionadas, contasSelecionadas } = useReadonlyParametros()

watch([modoMensal, inicio, categoriasSelecionadas, contasSelecionadas], gerarLinhas, {
  immediate: true
})

function gerarColunas() {
  colunas.value = [
    { field: 'realizado', header: 'Realizado' },
    { field: 'previsto', header: 'Previsto*' }
  ]
}

function gerarLinhas() {
  gerarColunas()

  const dataInicio = new Date(inicio.value)
  const agrupado = new Map()

  fluxo.forEach((item) => {
    const dataLancamento = new Date(item.data_ymd)

    // Filtros
    if (
      (categoriasSelecionadas.value.length > 0 &&
        !categoriasSelecionadas.value.includes(item.categoria_erp_id)) ||
      (contasSelecionadas.value.length > 0 &&
        !contasSelecionadas.value.includes(item.conta_financeira_erp_descricao))
    ) {
      return
    }

    // Filtra por período
    const diffDays = Math.floor((dataLancamento - dataInicio) / (1000 * 60 * 60 * 24))
    const diffMonths =
      dataLancamento.getFullYear() * 12 +
      dataLancamento.getMonth() -
      (dataInicio.getFullYear() * 12 + dataInicio.getMonth())

    if ((modoMensal.value && (diffMonths < 0 || diffMonths > 0)) ||
      (!modoMensal.value && (diffDays < 0 || diffDays > 0))) {
      return
    }

    // Chave: Categoria
    const chave = `${item.categoria_erp_id} - ${item.categoria_erp_descricao}`

    if (!agrupado.has(chave)) {
      agrupado.set(chave, { descricao: chave, realizado: 0, previsto: 0 })
    }

    const destino = agrupado.get(chave)

    if (item.baixado === true) {
      destino.realizado += item.valor
    } else {
      destino.previsto += item.valor
    }
  })

  // Converte para array e ordena
  linhas.value = Array.from(agrupado.values()).sort((a, b) =>
    a.descricao.localeCompare(b.descricao)
  )
}
</script>

<style scoped>
.surface-card {
  background: #ffffff;
}
</style>
