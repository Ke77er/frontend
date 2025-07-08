import { useDataService } from './useDataService'
import { useReadonlyParametros } from './useParametros'
import { DataProcessor } from '../services/dataProcessor'

export function useOverdueData() {
  const { getFilteredData } = useDataService()
  const { categoriasSelecionadas, contasSelecionadas, dataInicio, dataFim } = useReadonlyParametros()
  const processor = new DataProcessor()
  
  const getOverdueData = (tipo) => {
    const filteredData = getFilteredData(
      categoriasSelecionadas.value, 
      contasSelecionadas.value,
      dataInicio.value,
      dataFim.value
    )
    
    return processor.processOverdueData(filteredData, tipo)
  }
  
  return {
    getOverdueData
  }
}