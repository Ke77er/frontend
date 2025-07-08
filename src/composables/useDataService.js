import { ref, computed } from 'vue'
import { useReadonlyParametros } from './useParametros'

// Dados das empresas de múltiplas fontes
const empresasData = {}
const dataLoadingStatus = ref({
  local: false,
  googleDrive: false,
  api: false
})

// URLs para Google Drive (substitua pelos IDs reais dos seus arquivos)
const googleDriveUrls = {
  'malta_advocacia': 'https://drive.google.com/uc?export=download&id=SEU_ID_MALTA',
  'codex_empreendedorismo': 'https://drive.google.com/uc?export=download&id=SEU_ID_CODEX',
  'fluxo': 'https://drive.google.com/uc?export=download&id=SEU_ID_FLUXO'
}

// URLs da API
const apiUrls = {
  'malta_advocacia': 'https://sua-api.com/api/malta-advocacia',
  'codex_empreendedorismo': 'https://sua-api.com/api/codex-empreendedorismo',
  'fluxo': 'https://sua-api.com/api/fluxo'
}

// Função para carregar dados locais
const loadLocalData = async () => {
  try {
    console.log('Carregando dados locais...')
    
    // Carregar Malta Advocacia
    try {
      const maltaData = await import('../assets/Malta_Advocacia.json')
      empresasData['malta_advocacia'] = maltaData.default
      console.log('Malta Advocacia carregado localmente:', maltaData.default.length, 'registros')
    } catch (error) {
      console.warn('Arquivo Malta_Advocacia.json não encontrado localmente')
    }

    // Carregar Codex Empreendedorismo
    try {
      const codexData = await import('../assets/Codex_empreendedorismo.json')
      empresasData['codex_empreendedorismo'] = codexData.default
      console.log('Codex Empreendedorismo carregado localmente:', codexData.default.length, 'registros')
    } catch (error) {
      console.warn('Arquivo Codex_empreendedorismo.json não encontrado localmente')
    }

    // Carregar Fluxo
    try {
      const fluxoData = await import('../assets/fluxo.json')
      empresasData['fluxo'] = fluxoData.default
      console.log('Fluxo carregado localmente:', fluxoData.default.length, 'registros')
    } catch (error) {
      console.warn('Arquivo fluxo.json não encontrado localmente')
    }

    dataLoadingStatus.value.local = true
    console.log('Dados locais carregados com sucesso')
  } catch (error) {
    console.error('Erro ao carregar dados locais:', error)
  }
}

// Função para carregar dados do Google Drive
const loadGoogleDriveData = async () => {
  try {
    console.log('Tentando carregar dados do Google Drive...')
    
    for (const [empresa, url] of Object.entries(googleDriveUrls)) {
      try {
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          if (!empresasData[empresa] && data && Array.isArray(data)) {
            empresasData[empresa] = data
            console.log(`${empresa} carregado do Google Drive:`, data.length, 'registros')
          }
        }
      } catch (error) {
        console.warn(`Erro ao carregar ${empresa} do Google Drive:`, error.message)
      }
    }

    dataLoadingStatus.value.googleDrive = true
    console.log('Tentativa de carregamento do Google Drive concluída')
  } catch (error) {
    console.error('Erro geral ao carregar dados do Google Drive:', error)
  }
}

// Função para carregar dados da API
const loadApiData = async () => {
  try {
    console.log('Tentando carregar dados da API...')
    
    for (const [empresa, url] of Object.entries(apiUrls)) {
      try {
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          if (!empresasData[empresa] && data && Array.isArray(data)) {
            empresasData[empresa] = data
            console.log(`${empresa} carregado da API:`, data.length, 'registros')
          }
        }
      } catch (error) {
        console.warn(`Erro ao carregar ${empresa} da API:`, error.message)
      }
    }

    dataLoadingStatus.value.api = true
    console.log('Tentativa de carregamento da API concluída')
  } catch (error) {
    console.error('Erro geral ao carregar dados da API:', error)
  }
}

// Carregar dados de todas as fontes na inicialização
const initializeData = async () => {
  console.log('Inicializando carregamento de dados de múltiplas fontes...')
  
  // Carregar em paralelo de todas as fontes
  await Promise.all([
    loadLocalData(),
    loadGoogleDriveData(),
    loadApiData()
  ])
  
  console.log('Status final do carregamento:', dataLoadingStatus.value)
  console.log('Empresas disponíveis:', Object.keys(empresasData))
}

// Inicializar dados
initializeData()

export function useDataService() {
  const { empresaSelecionada } = useReadonlyParametros()
  
  const data = computed(() => {
    const empresa = empresaSelecionada.value || 'malta_advocacia'
    const dados = empresasData[empresa] || []
    console.log(`Dados para empresa ${empresa}:`, dados.length, 'registros')
    return dados
  })
  
  const getAvailableCompanies = () => {
    const companies = []
    
    if (empresasData['malta_advocacia']) {
      companies.push({ label: 'Malta Advocacia', value: 'malta_advocacia' })
    }
    
    if (empresasData['codex_empreendedorismo']) {
      companies.push({ label: 'Codex Empreendedorismo', value: 'codex_empreendedorismo' })
    }
    
    if (empresasData['fluxo']) {
      companies.push({ label: 'Fluxo', value: 'fluxo' })
    }
    
    return companies
  }
  
  const getUniqueCategories = () => {
    const catSet = new Set()
    
    data.value.forEach((item) => {
      if (item.categoria_erp_id && item.categoria_erp_descricao) {
        catSet.add(`${item.categoria_erp_id} - ${item.categoria_erp_descricao}`)
      }
    })
    
    return Array.from(catSet).map((str) => ({
      label: str,
      value: str.split(' - ')[0] // ID da categoria
    })).sort((a, b) => a.label.localeCompare(b.label))
  }
  
  const getUniqueAccounts = () => {
    const contaSet = new Set()
    
    data.value.forEach((item) => {
      if (item.conta_financeira_erp_descricao) {
        contaSet.add(item.conta_financeira_erp_descricao)
      }
    })
    
    return Array.from(contaSet).map((str) => ({
      label: str,
      value: str
    })).sort((a, b) => a.label.localeCompare(b.label))
  }
  
  const getFilteredData = (categoriasSelecionadas, contasSelecionadas, dataInicio, dataFim) => {
    return data.value.filter((item) => {
      // Filtro por categoria
      if (
        categoriasSelecionadas.length > 0 &&
        !categoriasSelecionadas.includes(item.categoria_erp_id)
      ) {
        return false
      }
      
      // Filtro por conta
      if (
        contasSelecionadas.length > 0 &&
        !contasSelecionadas.includes(item.conta_financeira_erp_descricao)
      ) {
        return false
      }
      
      // Filtro por data
      if (dataInicio && dataFim) {
        const itemDate = new Date(item.data_ymd)
        const startDate = new Date(dataInicio)
        const endDate = new Date(dataFim)
        
        // Ajustar para incluir o dia inteiro
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
        
        if (itemDate < startDate || itemDate > endDate) {
          return false
        }
      }
      
      return true
    })
  }
  
  const getDataLoadingStatus = () => dataLoadingStatus.value
  
  return {
    data,
    getAvailableCompanies,
    getUniqueCategories,
    getUniqueAccounts,
    getFilteredData,
    getDataLoadingStatus
  }
}