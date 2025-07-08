import { ref, computed } from 'vue'
import { useReadonlyParametros } from './useParametros'
import { dataLoader } from '../services/dataLoader'
import { DataProcessor } from '../services/dataProcessor'
import { COMPANIES } from '../config/constants'

// Inicializar dados
dataLoader.initialize()

export function useDataService() {
  const { empresaSelecionada } = useReadonlyParametros()
  const processor = new DataProcessor()
  
  const data = computed(() => {
    const empresa = empresaSelecionada.value || 'malta_advocacia'
    const dados = dataLoader.getData(empresa)
    console.log(`Dados para empresa ${empresa}:`, dados.length, 'registros')
    return dados
  })
  
  const getAvailableCompanies = () => {
    const availableKeys = Object.keys(dataLoader.empresasData)
    return availableKeys
      .filter(key => COMPANIES[key])
      .map(key => COMPANIES[key])
  }
  
  const getUniqueCategories = () => {
    return processor.processCategories(data.value)
  }
  
  const getUniqueAccounts = () => {
    return processor.processAccounts(data.value)
  }
  
  const getFilteredData = (categoriasSelecionadas, contasSelecionadas, dataInicio, dataFim) => {
    return processor.filterData(data.value, categoriasSelecionadas, contasSelecionadas, dataInicio, dataFim)
  }
  
  const getDataLoadingStatus = () => dataLoader.getLoadingStatus()
  
  return {
    data,
    getAvailableCompanies,
    getUniqueCategories,
    getUniqueAccounts,
    getFilteredData,
    getDataLoadingStatus
  }
}