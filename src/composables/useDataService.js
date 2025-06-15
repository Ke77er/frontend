import { ref, computed } from 'vue'
import { useReadonlyParametros } from './useParametros'

// Importar dados das empresas
import fluxoEmpresa1 from '../assets/fluxo.json'
// Adicione mais imports conforme necessário
// import fluxoEmpresa2 from '../assets/empresa2.json'
// import fluxoEmpresa3 from '../assets/empresa3.json'

const empresasData = {
  'empresa1': fluxoEmpresa1,
  // 'empresa2': fluxoEmpresa2,
  // 'empresa3': fluxoEmpresa3,
}

export function useDataService() {
  const { empresaSelecionada } = useReadonlyParametros()
  
  const data = computed(() => {
    const empresa = empresaSelecionada.value || 'empresa1'
    return empresasData[empresa] || []
  })
  
  const getAvailableCompanies = () => {
    return [
      { label: 'Empresa 1', value: 'empresa1' },
      // { label: 'Empresa 2', value: 'empresa2' },
      // { label: 'Empresa 3', value: 'empresa3' },
    ]
  }
  
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
  
  const getFilteredData = (categoriasSelecionadas, contasSelecionadas, dataInicio, dataFim) => {
    return data.value.filter((item) => {
      // Filtro por categoria
      if (
        categoriasSelecionadas.length > 0 &&
        !categoriasSelecionadas.includes(item.categoria_erp_id)
      ) {
        return false
      }
      
      // Filtro por conta
      if (
        contasSelecionadas.length > 0 &&
        !contasSelecionadas.includes(item.conta_financeira_erp_descricao)
      ) {
        return false
      }
      
      // Filtro por data
      if (dataInicio && dataFim) {
        const itemDate = new Date(item.data_ymd)
        const startDate = new Date(dataInicio)
        const endDate = new Date(dataFim)
        
        // Ajustar para incluir o dia inteiro
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
        
        if (itemDate < startDate || itemDate > endDate) {
          return false
        }
      }
      
      return true
    })
  }
  
  return {
    data,
    getAvailableCompanies,
    getUniqueCategories,
    getUniqueAccounts,
    getFilteredData
  }
}