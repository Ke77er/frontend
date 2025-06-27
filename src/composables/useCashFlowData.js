import { useDataService } from './useDataService'
import { useReadonlyParametros } from './useParametros'
import { format, eachDayOfInterval, eachMonthOfInterval, isSameMonth, isSameDay, isBefore, isToday } from 'date-fns'
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
        const mesLabel = format(mes, 'MMM/yy', { locale: ptBR })
        
        if (isCurrentMonth) {
          // Mês atual: duas colunas (realizado e previsto)
          periodos.push({
            key: `${mesKey}-realizado`,
            label: `${mesLabel} Realizado`,
            shortLabel: mesLabel,
            typeLabel: 'Realizado',
            type: 'realizado',
            date: mes,
            isCurrentMonth: true
          })
          periodos.push({
            key: `${mesKey}-previsto`,
            label: `${mesLabel} Previsto`,
            shortLabel: mesLabel,
            typeLabel: 'Previsto',
            type: 'previsto',
            date: mes,
            isCurrentMonth: true
          })
        } else {
          // Outros meses: uma coluna
          const isPast = isBefore(mes, hoje)
          periodos.push({
            key: mesKey,
            label: mesLabel,
            shortLabel: mesLabel,
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
        const diaLabel = format(dia, 'dd/MM', { locale: ptBR })
        const isCurrentDay = isToday(dia)
        
        if (isCurrentDay) {
          // Dia atual: duas colunas (realizado e previsto)
          periodos.push({
            key: `${diaKey}-realizado`,
            label: `${diaLabel} Realizado`,
            shortLabel: diaLabel,
            typeLabel: 'Realizado',
            type: 'realizado',
            date: dia,
            isCurrentDay: true
          })
          periodos.push({
            key: `${diaKey}-previsto`,
            label: `${diaLabel} Previsto`,
            shortLabel: diaLabel,
            typeLabel: 'Previsto',
            type: 'previsto',
            date: dia,
            isCurrentDay: true
          })
        } else {
          // Outros dias: uma coluna
          const isPast = isBefore(dia, hoje)
          periodos.push({
            key: diaKey,
            label: diaLabel,
            shortLabel: diaLabel,
            type: isPast ? 'realizado' : 'previsto',
            date: dia,
            isCurrentDay: false
          })
        }
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
          if ((periodo.isCurrentMonth) && isSameMonth(dataItem, periodo.date)) {
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
          if ((periodo.isCurrentDay) && isSameDay(dataItem, periodo.date)) {
            // Dia atual: separar realizado e previsto
            const isRealizado = item.baixado === true
            if ((periodo.type === 'realizado' && isRealizado) || 
                (periodo.type === 'previsto' && !isRealizado)) {
              pertenceAoPeriodo = true
            }
          } else if (!periodo.isCurrentDay && isSameDay(dataItem, periodo.date)) {
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
    
    console.log('Buscando detalhes para:', { categoria, periodo: periodo.label, type: periodo.type })
    
    // Filtrar dados específicos para a categoria e período selecionados
    const detailsData = filteredData.filter(item => {
      const itemCategoria = `${item.categoria_erp_id} - ${item.categoria_erp_descricao}`
      if (itemCategoria !== categoria) return false
      
      const dataItem = new Date(item.data_ymd)
      
      // Verificar se o item pertence ao período específico
      if (periodo.isCurrentMonth || periodo.isCurrentDay) {
        // Período atual com separação realizado/previsto
        if (periodo.type === 'realizado') {
          const pertenceAoPeriodo = periodo.isCurrentMonth ? 
            isSameMonth(dataItem, periodo.date) : 
            isSameDay(dataItem, periodo.date)
          return pertenceAoPeriodo && item.baixado === true
        } else if (periodo.type === 'previsto') {
          const pertenceAoPeriodo = periodo.isCurrentMonth ? 
            isSameMonth(dataItem, periodo.date) : 
            isSameDay(dataItem, periodo.date)
          return pertenceAoPeriodo && item.baixado !== true
        }
      } else {
        // Outros períodos
        if (periodo.key.includes('-')) {
          // Período diário
          return isSameDay(dataItem, periodo.date)
        } else {
          // Período mensal
          return isSameMonth(dataItem, periodo.date)
        }
      }
      
      return false
    })
    
    console.log('Itens encontrados para detalhes:', detailsData.length)
    
    const resultado = detailsData
      .map((item, index) => {
        // Determinar se é realizado ou previsto baseado na data e status
        const dataItem = new Date(item.data_ymd)
        const hoje = new Date()
        const isRealizado = item.baixado === true
        const isPastDue = dataItem < hoje
        
        let status = 'Previsto'
        if (isRealizado) {
          status = 'Realizado'
        } else if (isPastDue) {
          status = 'Vencido'
        }
        
        return {
          titulo: `Serviços Prestados - ${item.categoria_erp_descricao}`,
          documento: `RPS ${String(2000 + index).padStart(4, '0')}`,
          data: item.data_ymd,
          emissao: item.data_ymd,
          previsao: isRealizado ? null : item.data_ymd,
          pessoa: item.pessoa_erp_descricao,
          valor: item.valor,
          valorBruto: item.valor,
          totalAberto: isRealizado ? 0 : item.valor,
          status: status,
          observacoes: item.observacoes || '',
          baixado: item.baixado
        }
      })
      .sort((a, b) => {
        // Ordenar por status (Realizado primeiro) e depois por data
        if (a.status !== b.status) {
          if (a.status === 'Realizado') return -1
          if (b.status === 'Realizado') return 1
        }
        return new Date(a.data) - new Date(b.data)
      })
    
    console.log('Resultado final dos detalhes:', resultado)
    
    return resultado
  }

  const getHistoryData = async (dataInicio, dataFim) => {
    const filteredData = getFilteredData(
      categoriasSelecionadas.value, 
      contasSelecionadas.value,
      dataInicio,
      dataFim
    )

    const dias = eachDayOfInterval({ start: dataInicio, end: dataFim })
    let saldoAcumulado = 0
    
    const historyData = dias.map(dia => {
      const diaFormatado = format(dia, 'yyyy-MM-dd')
      
      // Filtrar dados do dia
      const dadosDoDia = filteredData.filter(item => 
        format(new Date(item.data_ymd), 'yyyy-MM-dd') === diaFormatado
      )
      
      // Calcular entradas e saídas
      const entradas = dadosDoDia
        .filter(item => item.valor > 0)
        .reduce((sum, item) => sum + item.valor, 0)
      
      const saidas = dadosDoDia
        .filter(item => item.valor < 0)
        .reduce((sum, item) => sum + item.valor, 0)
      
      // Atualizar saldo acumulado
      saldoAcumulado += entradas + saidas
      
      return {
        date: dia,
        label: format(dia, 'dd', { locale: ptBR }),
        entradas,
        saidas,
        saldoAcumulado
      }
    })
    
    return historyData
  }
  
  return {
    generateCashFlowData,
    getDetailsForPeriod,
    getHistoryData
  }
}