import { useDataService } from './useDataService'
import { useReadonlyParametros } from './useParametros'

export function useRawData() {
  const { getFilteredData } = useDataService()
  const { categoriasSelecionadas, contasSelecionadas, dataInicio, dataFim } = useReadonlyParametros()
  
  const getRawData = () => {
    const filteredData = getFilteredData(
      categoriasSelecionadas.value, 
      contasSelecionadas.value,
      dataInicio.value,
      dataFim.value
    )
    
    return filteredData.map((item) => ({
      data_vencimento: item.data_ymd,
      data_baixa: item.baixado ? item.data_ymd : null,
      valor_total: item.valor,
      categoria: `${item.categoria_erp_id} - ${item.categoria_erp_descricao}`,
      conta: item.conta_financeira_erp_descricao,
      pessoa: item.pessoa_erp_descricao,
      observacoes: item.observacoes || ''
    }))
  }
  
  return {
    getRawData
  }
}