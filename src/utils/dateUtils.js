import { format, differenceInDays, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, eachDayOfInterval, eachMonthOfInterval, isSameMonth, isSameDay, isBefore, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '-'
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, formatStr, { locale: ptBR })
  } catch {
    return date
  }
}

export const formatDateRange = (inicio, fim) => {
  if (!inicio || !fim) return ''
  return `${formatDate(inicio)} - ${formatDate(fim)}`
}

export const formatPeriodTitle = (inicio, fim) => {
  if (!inicio || !fim) return ''
  return format(inicio, 'MMMM/yyyy', { locale: ptBR }).toUpperCase()
}

export const getDaysOverdue = (vencimento) => {
  try {
    const vencDate = parseISO(vencimento)
    const today = new Date()
    return Math.max(0, differenceInDays(today, vencDate))
  } catch {
    return 0
  }
}

export const getQuickFilterDates = (periodo) => {
  const hoje = new Date()
  
  switch (periodo) {
    case 'hoje':
      return { inicio: hoje, fim: hoje }
    case 'semana':
      return { 
        inicio: startOfWeek(hoje, { weekStartsOn: 1 }), 
        fim: endOfWeek(hoje, { weekStartsOn: 1 }) 
      }
    case 'mes':
      return { 
        inicio: startOfMonth(hoje), 
        fim: endOfMonth(hoje) 
      }
    case 'trimestre':
      return { 
        inicio: startOfQuarter(hoje), 
        fim: endOfQuarter(hoje) 
      }
    default:
      return { inicio: startOfMonth(hoje), fim: endOfMonth(hoje) }
  }
}

export const generatePeriods = (dataInicio, dataFim) => {
  const hoje = new Date()
  const diffDays = Math.ceil((dataFim - dataInicio) / (1000 * 60 * 60 * 24))
  const usarMeses = diffDays > 62

  const periodos = []

  if (usarMeses) {
    const meses = eachMonthOfInterval({ start: dataInicio, end: dataFim })
    
    meses.forEach(mes => {
      const isCurrentMonth = isSameMonth(mes, hoje)
      const mesKey = format(mes, 'yyyy-MM')
      const mesLabel = format(mes, 'MMM/yy', { locale: ptBR })
      
      if (isCurrentMonth) {
        periodos.push(
          {
            key: `${mesKey}-realizado`,
            label: `${mesLabel} Realizado`,
            shortLabel: mesLabel,
            typeLabel: 'Realizado',
            type: 'realizado',
            date: mes,
            isCurrentMonth: true
          },
          {
            key: `${mesKey}-previsto`,
            label: `${mesLabel} Previsto`,
            shortLabel: mesLabel,
            typeLabel: 'Previsto',
            type: 'previsto',
            date: mes,
            isCurrentMonth: true
          }
        )
      } else {
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
        periodos.push(
          {
            key: `${diaKey}-realizado`,
            label: `${diaLabel} Realizado`,
            shortLabel: diaLabel,
            typeLabel: 'Realizado',
            type: 'realizado',
            date: dia,
            isCurrentDay: true
          },
          {
            key: `${diaKey}-previsto`,
            label: `${diaLabel} Previsto`,
            shortLabel: diaLabel,
            typeLabel: 'Previsto',
            type: 'previsto',
            date: dia,
            isCurrentDay: true
          }
        )
      } else {
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

  return periodos
}

export const generateHistoryData = (filteredData, dataInicio, dataFim) => {
  const dias = eachDayOfInterval({ start: dataInicio, end: dataFim })
  let saldoAcumulado = 0
  
  return dias.map(dia => {
    const diaFormatado = format(dia, 'yyyy-MM-dd')
    
    const dadosDoDia = filteredData.filter(item => 
      format(new Date(item.data_ymd), 'yyyy-MM-dd') === diaFormatado
    )
    
    const entradas = dadosDoDia
      .filter(item => item.valor > 0)
      .reduce((sum, item) => sum + item.valor, 0)
    
    const saidas = dadosDoDia
      .filter(item => item.valor < 0)
      .reduce((sum, item) => sum + item.valor, 0)
    
    saldoAcumulado += entradas + saidas
    
    return {
      date: dia,
      label: format(dia, 'dd', { locale: ptBR }),
      entradas,
      saidas,
      saldoAcumulado
    }
  })
}