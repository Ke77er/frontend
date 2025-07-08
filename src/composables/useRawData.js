import { useDataService } from './useDataService'
import { useReadonlyParametros } from './useParametros'
import { DataProcessor } from '../services/dataProcessor'

export function useRawData() {
  const { getFilteredData } = useDataService()
  const { categoriasSelecionadas, contasSelecionadas, dataInicio, dataFim } = useReadonlyParametros()
  const processor = new DataProcessor()
  
  const getRawData = () => {
    const filteredData = getFilteredData(
      categoriasSelecionadas.value, 
      contasSelecionadas.value,
      dataInicio.value,
      dataFim.value
    )
    
    return processor.processRawData(filteredData)
  }
  
  return {
    getRawData
  }
}