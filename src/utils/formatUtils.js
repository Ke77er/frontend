export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const formatNumber = (value) => {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export const formatPercentage = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2
  }).format(value / 100)
}

export const getValueClass = (value) => {
  if (value > 0) return 'positive-value'
  if (value < 0) return 'negative-value'
  return 'neutral-value'
}

export const exportToCSV = (data, filename, headers) => {
  try {
    const csvContent = [
      headers.join(','),
      ...data.map(item => headers.map(header => {
        const value = item[header.toLowerCase().replace(/\s+/g, '_')]
        if (typeof value === 'number') {
          return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        }
        return `"${value || ''}"`
      }).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return true
  } catch (error) {
    console.error('Erro ao exportar dados:', error)
    return false
  }
}