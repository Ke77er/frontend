import { ref, computed } from 'vue'
import { useReadonlyParametros } from './useParametros'

// Importar dados das empresas dinamicamente
const empresasData = {}

// Função para carregar dados dinamicamente
const loadCompanyData = async () => {
  try {
    // Carregar Malta Advocacia
    const maltaData = await import('../assets/Malta_Advocacia.json')
    empresasData['malta_advocacia'] = maltaData.default

    // Carregar Codex Empreendedorismo
    const codexData = await import('../assets/Codex_empreendedorismo.json')
    empresasData['codex_empreendedorismo'] = codexData.default

    // Carregar Fluxo (empresa original)
    const fluxoData = await import('../assets/fluxo.json')
    empresasData['fluxo'] = fluxoData.default

    console.log('Dados das empresas carregados:', Object.keys(empresasData))
  } catch (error) {
    console.error('Erro ao carregar dados das empresas:', error)
  }
}

// Carregar dados na inicialização
loadCompanyData()

export function useDataService() {
  const { empresaSelecionada } = useReadonlyParametros()
  
  const data = computed(() => {
    const empresa = empresaSelecionada.value || 'malta_advocacia'
    return empresasData[empresa] || []
  })
  
  const getAvailableCompanies = () => {
    return [
      { label: 'Malta Advocacia', value: 'malta_advocacia' },
      { label: 'Codex Empreendedorismo', value: 'codex_empreendedorismo' },
      { label: 'Fluxo (Original)', value: 'fluxo' }
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