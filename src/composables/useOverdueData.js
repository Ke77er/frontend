import { computed } from 'vue'
import { useDataService } from './useDataService'
import { useReadonlyParametros } from './useParametros'

export function useOverdueData() {
  const { getFilteredData } = useDataService()
  const { categoriasSelecionadas, contasSelecionadas } = useReadonlyParametros()
  
  const getOverdueData = (tipo) => {
    const hoje = new Date()
    const filteredData = getFilteredData(categoriasSelecionadas.value, contasSelecionadas.value)
    
    return filteredData
      .filter((item) => {
        const venc = new Date(item.data_ymd)
        
        // Só vencidos
        if (venc >= hoje) return false
        
        // Só não baixados (ainda em aberto)
        if (item.baixado === true) return false
        
        // Filtro por tipo: Receber (valores positivos), Pagar (valores negativos)
        if (tipo === 'Receber' && item.valor <= 0) return false
        if (tipo === 'Pagar' && item.valor >= 0) return false
        
        return true
      })
      .map((item) => ({
        categoria: `${item.categoria_erp_id} - ${item.categoria_erp_descricao}`,
        pessoa: item.pessoa_erp_descricao,
        vencimento: item.data_ymd,
        valor: item.valor
      }))
      .sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento))
  }
  
  return {
    getOverdueData
  }
}