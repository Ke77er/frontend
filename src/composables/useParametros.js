import { ref, readonly } from 'vue'
import { startOfMonth, endOfMonth } from 'date-fns'

// Estado global reativo
const categoriasSelecionadas = ref([])
const contasSelecionadas = ref([])
const empresaSelecionada = ref('')
const dataInicio = ref(startOfMonth(new Date()))
const dataFim = ref(endOfMonth(new Date()))

// Para leitura e escrita (usado em FilterPanel.vue)
export function useParametros() {
  return {
    categoriasSelecionadas,
    contasSelecionadas,
    empresaSelecionada,
    dataInicio,
    dataFim
  }
}

// Para leitura segura (usado nos outros componentes)
export function useReadonlyParametros() {
  return {
    categoriasSelecionadas: readonly(categoriasSelecionadas),
    contasSelecionadas: readonly(contasSelecionadas),
    empresaSelecionada: readonly(empresaSelecionada),
    dataInicio: readonly(dataInicio),
    dataFim: readonly(dataFim)
  }
}