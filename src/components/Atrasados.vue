<template>
  <div class="p-4 surface-card shadow-2 border-round">
    <div class="text-xl font-medium mb-3 text-900">⏱️ Atrasados - {{ tipo }}</div>

    <div class="flex gap-2 mb-4">
      <Dropdown
        v-model="tipo"
        :options="['Receber', 'Pagar']"
        placeholder="Selecionar tipo"
        class="p-dropdown-sm"
      />
    </div>

    <DataTable
      :value="dadosFiltrados"
      class="p-datatable-sm p-datatable-striped p-datatable-gridlines p-datatable-hoverable-rows shadow-2 surface-card border-round"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
    >
      <Column field="categoria" header="Categoria" />
      <Column field="pessoa" header="Pessoa" />
      <Column field="vencimento" header="Vencimento" />
      <Column field="valor" header="Valor" />
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import fluxo from '../assets/fluxo.json'
import { useReadonlyParametros } from '../composables/useParametros'

const tipo = ref('Receber') // ou "Pagar"
const { categoriasSelecionadas, contasSelecionadas } = useReadonlyParametros()

const dadosFiltrados = computed(() => {
  const hoje = new Date()

  return fluxo
    .filter((l) => {
      const venc = new Date(l.data_ymd)

      // Só vencidos
      if (venc >= hoje) return false

      // Só não baixados (ainda em aberto)
      if (l.baixado === true) return false

      // Filtro por tipo: Receber (valores positivos), Pagar (valores negativos)
      if (tipo.value === 'Receber' && l.valor <= 0) return false
      if (tipo.value === 'Pagar' && l.valor >= 0) return false

      // Filtros globais
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
      categoria: `${l.categoria_erp_id} - ${l.categoria_erp_descricao}`,
      pessoa: l.pessoa_erp_descricao,
      vencimento: l.data_ymd,
      valor: l.valor
    }))
})
</script>
