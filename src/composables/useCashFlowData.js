import { useDataService } from './useDataService'
import { useReadonlyParametros } from './useParametros'
import { format, eachDayOfInterval, eachMonthOfInterval, isSameMonth, isSameDay, isAfter, isBefore } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function useCashFlowData() {
  const { getFilteredData } = useDataService()
  const { categoriasSelecionadas, contasSelecionadas } = useReadonlyParametros()
  
  const generateCashFlowData = async (dataInicio, dataFim) => {
    // Simula loading para melhor UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const hoje = new Date()
    const filteredData = getFilteredData(
      categoriasSelecionadas.value, 
      contasSelecionadas.value,
      dataInicio,
      dataFim
    )
    
    // Determinar se usar dias ou meses baseado no intervalo
    const diffDays = Math.ceil((dataFim - dataInicio) / (1000 * 60 * 60 * 24))
    const usarMeses = diffDays > 62 // Mais de 2 meses, usar agrupamento mensal
    
    // Gerar períodos
    const periodos = []
    
    if (usarMeses) {
      const meses = eachMonthOfInterval({ start: dataInicio, end: dataFim })
      
      meses.forEach(mes => {
        const isCurrentMonth = isSameMonth(mes, hoje)
        const mesKey = format(mes, 'yyyy-MM')
        
        if (isCurrentMonth) {
          // Mês atual: duas colunas (realizado e previsto)
          periodos.push({
            key: `${mesKey}-realizado`,
            label: `${format(mes, 'dd/MM', { locale: ptBR })} Realizado`,
            type: 'realizado',
            date: mes,
            isCurrentMonth: true
          })
          periodos.push({
            key: `${mesKey}-previsto`,
            label: `${format(mes, 'dd/MM', { locale: ptBR })} Previsto`,
            type: 'previsto',
            date: mes,
            isCurrentMonth: true
          })
        } else {
          // Outros meses: uma coluna
          const isPast = isBefore(mes, hoje)
          periodos.push({
            key: mesKey,
            label: format(mes, 'dd/MM', { locale: ptBR }),
            type: isPast ? 'realizado' : 'previsto',
            date: mes,
            isCurrentMonth: false
          })
        }
      })
    } else {
      const dias = eachDayOfInterval({ start: dataInicio, end: dataFim })
      
      dias.forEach(dia => {
        const diaKey = format(dia, 'yyyy-MM-dd')
        const isPast = isBefore(dia, hoje) || isSameDay(dia, hoje)
        
        periodos.push({
          key: diaKey,
          label: format(dia, 'dd/MM', { locale: ptBR }),
          type: isPast ? 'realizado' : 'previsto',
          date: dia,
          isCurrentMonth: isSameMonth(dia, hoje)
        })
      })
    }
    
    // Agrupar dados por categoria
    const agrupado = new Map()
    
    filteredData.forEach((item) => {
      const dataItem = new Date(item.data_ymd)
      const chave = `${item.categoria_erp_id} - ${item.categoria_erp_descricao}`
      
      if (!agrupado.has(chave)) {
        const novaCategoria = { categoria: chave, total: 0 }
        periodos.forEach(periodo => {
          novaCategoria[periodo.key] = 0
        })
        agrupado.set(chave, novaCategoria)
      }
      
      const categoria = agrupado.get(chave)
      
      // Encontrar o período correspondente
      periodos.forEach(periodo => {
        let pertenceAoPeriodo = false
        
        if (usarMeses) {
          if (periodo.isCurrentMonth && isSameMonth(dataItem, periodo.date)) {
            // Mês atual: separar realizado e previsto
            const isRealizado = item.baixado === true
            if ((periodo.type === 'realizado' && isRealizado) || 
                (periodo.type === 'previsto' && !isRealizado)) {
              pertenceAoPeriodo = true
            }
          } else if (!periodo.isCurrentMonth && isSameMonth(dataItem, periodo.date)) {
            pertenceAoPeriodo = true
          }
        } else {
          if (isSameDay(dataItem, periodo.date)) {
            pertenceAoPeriodo = true
          }
        }
        
        if (pertenceAoPeriodo) {
          categoria[periodo.key] += item.valor
          categoria.total += item.valor
        }
      })
    })
    
    // Converter para array e ordenar
    const linhas = Array.from(agrupado.values()).sort((a, b) =>
      a.categoria.localeCompare(b.categoria)
    )
    
    return { linhas, periodos }
  }
  
  const getDetailsForPeriod = async (categoria, periodo) => {
    const filteredData = getFilteredData(
      categoriasSelecionadas.value, 
      contasSelecionadas.value
    )
    
    console.log('Buscando detalhes para:', { categoria, periodo: periodo.label })
    
    // Filtrar dados específicos para a categoria e período selecionados
    const detailsData = filteredData.filter(item => {
      const itemCategoria = `${item.categoria_erp_id} - ${item.categoria_erp_descricao}`
      if (itemCategoria !== categoria) return false
      
      const dataItem = new Date(item.data_ymd)
      
      // Verificar se o item pertence ao período específico
      if (periodo.type === 'realizado' && periodo.isCurrentMonth) {
        return isSameMonth(dataItem, periodo.date) && item.baixado === true
      } else if (periodo.type === 'previsto' && periodo.isCurrentMonth) {
        return isSameMonth(dataItem, periodo.date) && item.baixado !== true
      } else if (periodo.key.includes('-')) {
        return isSameDay(dataItem, periodo.date)
      } else {
        return isSameMonth(dataItem, periodo.date)
      }
    })
    
    console.log('Itens encontrados para detalhes:', detailsData.length)
    
    const resultado = detailsData
      .map((item, index) => ({
        titulo: `Serviços Prestados - Item ${index + 1}`,
        documento: `RPS ${2000 + index}`,
        data: item.data_ymd,
        emissao: item.data_ymd,
        previsao: item.baixado ? null : item.data_ymd,
        pessoa: item.pessoa_erp_descricao,
        valor: item.valor,
        valorBruto: item.valor,
        totalAberto: item.baixado ? 0 : item.valor,
        status: item.baixado ? 'Realizado' : 'Previsto',
        observacoes: item.observacoes || ''
      }))
      .sort((a, b) => new Date(a.data) - new Date(b.data))
    
    console.log('Resultado final dos detalhes:', resultado)
    
    return resultado
  }
  
  return {
    generateCashFlowData,
    getDetailsForPeriod
  }
}