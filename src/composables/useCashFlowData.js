import { useDataService } from './useDataService'
import { useReadonlyParametros } from './useParametros'
import { DataProcessor } from '../services/dataProcessor'

export function useCashFlowData() {
  const { getFilteredData } = useDataService()
  const { categoriasSelecionadas, contasSelecionadas } = useReadonlyParametros()
  const processor = new DataProcessor()
  
  const generateCashFlowData = async (dataInicio, dataFim) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const filteredData = getFilteredData(
      categoriasSelecionadas.value, 
      contasSelecionadas.value,
      dataInicio,
      dataFim
    )
    
    console.log('Dados filtrados para fluxo de caixa:', filteredData.length, 'itens')
    
    const result = processor.generateCashFlowData(filteredData, dataInicio, dataFim)
    
    console.log('Períodos gerados:', result.periodos.length)
    console.log('Categorias processadas:', result.linhas.length)
    
    return result
  }
  
  const getDetailsForPeriod = async (categoria, periodo) => {
    const filteredData = getFilteredData(
      categoriasSelecionadas.value, 
      contasSelecionadas.value
    )
    
    console.log('Buscando detalhes para:', { categoria, periodo: periodo.label, type: periodo.type })
    
    const resultado = processor.getDetailsForPeriod(filteredData, categoria, periodo)
    
    console.log('Resultado final dos detalhes:', resultado.length, 'itens processados')
    
    return resultado
  }

  const getHistoryData = async (dataInicio, dataFim) => {
    const filteredData = getFilteredData(
      categoriasSelecionadas.value, 
      contasSelecionadas.value,
      dataInicio,
      dataFim
    )

    console.log('Dados para histórico:', filteredData.length, 'itens')

    const historyData = processor.generateHistoryData(filteredData, dataInicio, dataFim)
    
    console.log('Histórico gerado:', historyData.length, 'dias')
    
    return historyData
  }
  
  const getSaldoDetails = async (conta, periodo) => {
    const filteredData = getFilteredData(
      categoriasSelecionadas.value, 
      contasSelecionadas.value
    )
    
    console.log('Buscando detalhes do saldo para:', { conta, periodo: periodo.label })
    
    const resultado = processor.getSaldoDetails(filteredData, conta, periodo)
    
    console.log('Resultado dos detalhes do saldo:', resultado.length, 'movimentações')
    
    return resultado
  }
  
  return {
    generateCashFlowData,
    getDetailsForPeriod,
    getHistoryData,
    getSaldoDetails
  }
}