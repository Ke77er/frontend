import { useDataService } from './useDataService'
import { useReadonlyParametros } from './useParametros'

export function useCashFlowData() {
  const { getFilteredData } = useDataService()
  const { categoriasSelecionadas, contasSelecionadas } = useReadonlyParametros()
  
  const generateCashFlowData = async (modoMensal, inicio) => {
    // Simula loading para melhor UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const dataInicio = new Date(inicio)
    const filteredData = getFilteredData(categoriasSelecionadas.value, contasSelecionadas.value)
    const agrupado = new Map()
    
    filteredData.forEach((item) => {
      const dataLancamento = new Date(item.data_ymd)
      
      // Filtra por período
      const diffDays = Math.floor((dataLancamento - dataInicio) / (1000 * 60 * 60 * 24))
      const diffMonths =
        dataLancamento.getFullYear() * 12 +
        dataLancamento.getMonth() -
        (dataInicio.getFullYear() * 12 + dataInicio.getMonth())
      
      if ((modoMensal && (diffMonths < 0 || diffMonths > 0)) ||
        (!modoMensal && (diffDays < 0 || diffDays > 0))) {
        return
      }
      
      // Chave: Categoria
      const chave = `${item.categoria_erp_id} - ${item.categoria_erp_descricao}`
      
      if (!agrupado.has(chave)) {
        agrupado.set(chave, { descricao: chave, realizado: 0, previsto: 0 })
      }
      
      const destino = agrupado.get(chave)
      
      if (item.baixado === true) {
        destino.realizado += item.valor
      } else {
        destino.previsto += item.valor
      }
    })
    
    // Converte para array e ordena
    return Array.from(agrupado.values()).sort((a, b) =>
      a.descricao.localeCompare(b.descricao)
    )
  }
  
  return {
    generateCashFlowData
  }
}