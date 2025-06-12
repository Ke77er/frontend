import { ref } from 'vue'
import fluxo from '../assets/fluxo.json'

export function useDataService() {
  const data = ref(fluxo)
  
  const getUniqueCategories = () => {
    const catSet = new Set()
    
    data.value.forEach((item) => {
      if (item.categoria_erp_id && item.categoria_erp_descricao) {
        catSet.add(`${item.categoria_erp_id} - ${item.categoria_erp_descricao}`)
      }
    })
    
    return Array.from(catSet).map((str) => ({
      label: str,
      value: str.split(' - ')[0] // ID da categoria
    })).sort((a, b) => a.label.localeCompare(b.label))
  }
  
  const getUniqueAccounts = () => {
    const contaSet = new Set()
    
    data.value.forEach((item) => {
      if (item.conta_financeira_erp_descricao) {
        contaSet.add(item.conta_financeira_erp_descricao)
      }
    })
    
    return Array.from(contaSet).map((str) => ({
      label: str,
      value: str
    })).sort((a, b) => a.label.localeCompare(b.label))
  }
  
  const getFilteredData = (categoriasSelecionadas, contasSelecionadas) => {
    return data.value.filter((item) => {
      if (
        categoriasSelecionadas.length > 0 &&
        !categoriasSelecionadas.includes(item.categoria_erp_id)
      ) {
        return false
      }
      
      if (
        contasSelecionadas.length > 0 &&
        !contasSelecionadas.includes(item.conta_financeira_erp_descricao)
      ) {
        return false
      }
      
      return true
    })
  }
  
  return {
    data,
    getUniqueCategories,
    getUniqueAccounts,
    getFilteredData
  }
}