<template>
  <div class="p-4 surface-card shadow-2 border-round">
    <div class="text-xl font-medium mb-3 text-900">📑 Dados Brutos</div>

    <DataTable :value="dadosFiltrados"
      class="p-datatable-sm p-datatable-striped p-datatable-gridlines p-datatable-hoverable-rows shadow-2 surface-card border-round"
      :paginator="true" :rows="10" :resizableColumns="true" filterDisplay="menu" showGridlines>
      <Column field="data_vencimento" header="Vencimento" sortable filter />
      <Column field="data_baixa" header="Baixa" sortable filter />
      <Column field="valor_total" header="Valor Total" sortable filter />
      <Column field="categoria" header="Categoria" sortable filter />
      <Column field="conta" header="Conta" sortable filter />
      <Column field="pessoa" header="Pessoa" sortable filter />
      <Column field="observacoes" header="Obs" />
    </DataTable>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import fluxo from '../assets/fluxo.json'
import { useReadonlyParametros } from '../composables/useParametros'

const { categoriasSelecionadas, contasSelecionadas } = useReadonlyParametros()

const dadosFiltrados = computed(() => {
  return fluxo
    .filter((l) => {
      if (
        categoriasSelecionadas.value.length > 0 &&
        !categoriasSelecionadas.value.includes(l.categoria_erp_id)
      ) return false

      if (
        contasSelecionadas.value.length > 0 &&
        !contasSelecionadas.value.includes(l.conta_financeira_erp_descricao)
      ) return false

      return true
    })
    .map((l) => ({
      data_vencimento: l.data_ymd,
      data_baixa: l.data_ymd,
      valor_total: l.valor,
      categoria: `${l.categoria_erp_id} - ${l.categoria_erp_descricao}`,
      conta: l.conta_financeira_erp_descricao,
      pessoa: l.pessoa_erp_descricao,
      observacoes: l.observacoes || ''
    }))
})
</script>
