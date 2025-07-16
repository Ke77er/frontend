import { formatCurrency } from '../utils/formatUtils'
import { generatePeriods, generateHistoryData } from '../utils/dateUtils'
import { isSameMonth, isSameDay } from 'date-fns'

export class DataProcessor {
  constructor(dataService) {
    this.dataService = dataService
  }

  processCategories(data) {
    const catSet = new Set()
    
    data.forEach((item) => {
      if (item.categoria_erp_id && item.categoria_erp_descricao) {
        catSet.add(`${item.categoria_erp_id} - ${item.categoria_erp_descricao}`)
      }
    })
    
    return Array.from(catSet).map((str) => ({
      label: str,
      value: str.split(' - ')[0]
    })).sort((a, b) => a.label.localeCompare(b.label))
  }

  processAccounts(data) {
    const contaSet = new Set()
    
    data.forEach((item) => {
      if (item.conta_financeira_erp_descricao) {
        contaSet.add(item.conta_financeira_erp_descricao)
      }
    })
    
    return Array.from(contaSet).map((str) => ({
      label: str,
      value: str
    })).sort((a, b) => a.label.localeCompare(b.label))
  }

  filterData(data, categorias, contas, dataInicio, dataFim) {
    return data.filter((item) => {
      if (categorias.length > 0 && !categorias.includes(item.categoria_erp_id)) {
        return false
      }
      
      if (contas.length > 0 && !contas.includes(item.conta_financeira_erp_descricao)) {
        return false
      }
      
      if (dataInicio && dataFim) {
        const itemDate = new Date(item.data_ymd)
        const startDate = new Date(dataInicio)
        const endDate = new Date(dataFim)
        
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
        
        if (itemDate < startDate || itemDate > endDate) {
          return false
        }
      }
      
      return true
    })
  }

  generateCashFlowData(filteredData, dataInicio, dataFim) {
    const periodos = generatePeriods(dataInicio, dataFim)
    
    // Calcular saldo inicial (dados anteriores ao período)
    const saldoInicial = this.calculateSaldoInicial(filteredData, dataInicio, periodos)
    
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
      
      periodos.forEach(periodo => {
        if (this.itemBelongsToPeriod(item, dataItem, periodo)) {
          categoria[periodo.key] += item.valor
          categoria.total += item.valor
        }
      })
    })
    
    const linhas = Array.from(agrupado.values()).sort((a, b) =>
      a.categoria.localeCompare(b.categoria)
    )
    
    // Adicionar saldo inicial no início das linhas
    const linhasComSaldo = [...saldoInicial, ...linhas]
    
    return { linhas: linhasComSaldo, periodos }
  }

  calculateSaldoInicial(filteredData, dataInicio, periodos) {
    // Dados anteriores ao período selecionado
    const dadosAnteriores = filteredData.filter(item => {
      const dataItem = new Date(item.data_ymd)
      return dataItem < new Date(dataInicio)
    })
    
    // Descobrir TODAS as contas que existem nos dados (incluindo do período atual)
    const todasAsContas = new Set()
    
    // Adicionar contas dos dados anteriores
    dadosAnteriores.forEach(item => {
      const conta = item.conta_financeira_erp_descricao || 'Conta não informada'
      todasAsContas.add(conta)
    })
    
    // Adicionar contas dos dados do período atual (para garantir que apareçam mesmo sem saldo inicial)
    filteredData.forEach(item => {
      const conta = item.conta_financeira_erp_descricao || 'Conta não informada'
      todasAsContas.add(conta)
    })
    
    // Agrupar por conta financeira
    const contasMap = new Map()
    
    // Inicializar TODAS as contas encontradas com saldo zero
    todasAsContas.forEach(conta => {
      if (!contasMap.has(conta)) {
        contasMap.set(conta, {
          categoria: conta,
          total: 0,
          isSaldoInicial: true,
          saldoAcumuladoInicial: 0
        })
      }
    })
    
    // Calcular saldo inicial por conta
    dadosAnteriores.forEach(item => {
      const conta = item.conta_financeira_erp_descricao || 'Conta não informada'
      if (contasMap.has(conta)) {
        contasMap.get(conta).saldoAcumuladoInicial += item.valor
      }
    })
    
    // Para cada conta, calcular o saldo acumulado por período
    const linhasSaldoInicial = []
    const totaisPorPeriodo = {}
    
    contasMap.forEach((contaData, conta) => {
      const linhaConta = { ...contaData }
      let saldoAcumulado = contaData.saldoAcumuladoInicial
      
      periodos.forEach(periodo => {
        // Adicionar movimentações do período atual para esta conta específica
        const movimentacoesPeriodo = filteredData.filter(item => {
          const dataItem = new Date(item.data_ymd)
          const contaItem = item.conta_financeira_erp_descricao || 'Conta não informada'
          return contaItem === conta && this.itemBelongsToPeriod(item, dataItem, periodo)
        })
        
        const valorPeriodo = movimentacoesPeriodo.reduce((sum, item) => sum + item.valor, 0)
        saldoAcumulado += valorPeriodo
        
        linhaConta[periodo.key] = saldoAcumulado
        
        // Acumular para o total geral
        if (!totaisPorPeriodo[periodo.key]) {
          totaisPorPeriodo[periodo.key] = 0
        }
        totaisPorPeriodo[periodo.key] += saldoAcumulado
      })
      
      linhasSaldoInicial.push(linhaConta)
    })
    
    // Criar linha de TOTAL
    const linhaTotalSaldo = {
      categoria: 'TOTAL SALDO INICIAL',
      total: 0,
      isSaldoInicial: true,
      isTotalSaldo: true
    }
    
    periodos.forEach(periodo => {
      linhaTotalSaldo[periodo.key] = totaisPorPeriodo[periodo.key] || 0
    })
    
    // Ordenar por nome da conta
    const linhasOrdenadas = linhasSaldoInicial.sort((a, b) => a.categoria.localeCompare(b.categoria))
    
    // Adicionar linha de total no final
    linhasOrdenadas.push(linhaTotalSaldo)
    
    return linhasOrdenadas
  }

  itemBelongsToPeriod(item, dataItem, periodo) {
    const usarMeses = !periodo.key.includes('-') || periodo.key.match(/^\d{4}-\d{2}$/)
    
    if ((periodo.isCurrentMonth || periodo.isCurrentDay)) {
      const pertenceAoPeriodo = usarMeses ? 
        isSameMonth(dataItem, periodo.date) : 
        isSameDay(dataItem, periodo.date)
      
      const isRealizado = item.baixado === true || item.baixado === 1
      
      if ((periodo.type === 'realizado' && isRealizado) || 
          (periodo.type === 'previsto' && !isRealizado)) {
        return pertenceAoPeriodo
      }
    } else {
      const isMonthlyPeriod = /^\d{4}-\d{2}$/.test(periodo.key)
      const isDailyPeriod = /^\d{4}-\d{2}-\d{2}$/.test(periodo.key)
      
      if (isDailyPeriod) {
        return isSameDay(dataItem, periodo.date)
      } else if (isMonthlyPeriod) {
        const pertenceAoPeriodo = isSameMonth(dataItem, periodo.date)
        
        if (periodo.type === 'previsto') {
          const isRealizado = item.baixado === true || item.baixado === 1
          return pertenceAoPeriodo && !isRealizado
        } else if (periodo.type === 'realizado') {
          const isRealizado = item.baixado === true || item.baixado === 1
          return pertenceAoPeriodo && isRealizado
        } else {
          return pertenceAoPeriodo
        }
      }
    }
    
    return false
  }

  getDetailsForPeriod(filteredData, categoria, periodo) {
    const detailsData = filteredData.filter(item => {
      const itemCategoria = `${item.categoria_erp_id} - ${item.categoria_erp_descricao}`
      if (itemCategoria !== categoria) return false
      
      const dataItem = new Date(item.data_ymd)
      return this.itemBelongsToPeriod(item, dataItem, periodo)
    })
    
    return detailsData.map((item, index) => {
      const dataItem = new Date(item.data_ymd)
      const hoje = new Date()
      const isRealizado = item.baixado === true || item.baixado === 1
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
        notaFiscal: `NF ${String(20250000 + index).padStart(8, '0')}`,
        data: item.data_ymd,
        emissao: item.data_ymd,
        previsao: isRealizado ? null : item.data_ymd,
        pessoa: item.pessoa_erp_descricao,
        projeto: item.categoria_erp_descricao,
        valor: item.valor,
        valorBruto: item.valor,
        totalAberto: isRealizado ? 0 : item.valor,
        totalEmAberto: isRealizado ? 0 : item.valor,
        status: status,
        observacoes: item.observacoes || '',
        baixado: isRealizado
      }
    }).sort((a, b) => {
      if (a.status !== b.status) {
        if (a.status === 'Realizado') return -1
        if (b.status === 'Realizado') return 1
      }
      return new Date(a.data) - new Date(b.data)
    })
  }

  processOverdueData(filteredData, tipo) {
    const hoje = new Date()
    
    return filteredData
      .filter((item) => {
        const venc = new Date(item.data_ymd)
        
        if (venc >= hoje) return false
        if (item.baixado === true) return false
        
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

  processRawData(filteredData) {
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

  generateHistoryData(filteredData, dataInicio, dataFim) {
    return generateHistoryData(filteredData, dataInicio, dataFim)
  }

  getSaldoDetails(filteredData, conta, periodo) {
    // Remover prefixos de emoji e "SALDO INICIAL" para obter o nome da conta
    const contaLimpa = conta.replace(/^💰\s*/, '').replace(/^TOTAL\s*/, '')
    
    // Se for TOTAL SALDO INICIAL, retornar movimentações de todas as contas
    if (conta.includes('TOTAL SALDO INICIAL')) {
      return filteredData
        .filter(item => {
          const dataItem = new Date(item.data_ymd)
          return this.itemBelongsToPeriod(item, dataItem, periodo)
        })
        .map(item => ({
          data: item.data_ymd,
          categoria: `${item.categoria_erp_id} - ${item.categoria_erp_descricao}`,
          pessoa: item.pessoa_erp_descricao,
          valor: item.valor,
          baixado: item.baixado === true || item.baixado === 1
        }))
        .sort((a, b) => new Date(b.data) - new Date(a.data))
    }
    
    // Para contas específicas, filtrar por conta financeira
    return filteredData
      .filter(item => {
        const contaItem = item.conta_financeira_erp_descricao || 'Conta não informada'
        const dataItem = new Date(item.data_ymd)
        
        return contaItem === contaLimpa && this.itemBelongsToPeriod(item, dataItem, periodo)
      })
      .map(item => ({
        data: item.data_ymd,
        categoria: `${item.categoria_erp_id} - ${item.categoria_erp_descricao}`,
        pessoa: item.pessoa_erp_descricao,
        valor: item.valor,
        baixado: item.baixado === true || item.baixado === 1
      }))
      .sort((a, b) => new Date(b.data) - new Date(a.data))
  }
}