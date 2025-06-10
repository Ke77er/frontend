import { ref, readonly } from 'vue'

// Estado global reativo
const categoriasSelecionadas = ref([])
const contasSelecionadas = ref([])

// Para leitura e escrita (usado em Parametros.vue)
export function useParametros() {
  return {
    categoriasSelecionadas,
    contasSelecionadas
  }
}

// Para leitura segura (usado nos outros componentes)
export function useReadonlyParametros() {
  return {
    categoriasSelecionadas: readonly(categoriasSelecionadas),
    contasSelecionadas: readonly(contasSelecionadas)
  }
}
