import { DATA_SOURCES } from '../config/constants'

class DataLoader {
  constructor() {
    this.empresasData = {}
    this.loadingStatus = {
      local: false,
      googleDrive: false,
      api: false
    }
  }

  async loadLocalData() {
    try {
      console.log('Carregando dados locais...')
      
      const loadFile = async (empresa, filename) => {
        try {
          const data = await import(`../assets/${filename}.json`)
          this.empresasData[empresa] = data.default
          console.log(`${empresa} carregado localmente:`, data.default.length, 'registros')
        } catch (error) {
          console.warn(`Arquivo ${filename}.json não encontrado localmente`)
        }
      }

      await Promise.all([
        loadFile('malta_advocacia', 'Malta_Advocacia'),
        loadFile('codex_empreendedorismo', 'Codex_empreendedorismo'),
        loadFile('fluxo', 'fluxo')
      ])

      this.loadingStatus.local = true
      console.log('Dados locais carregados com sucesso')
    } catch (error) {
      console.error('Erro ao carregar dados locais:', error)
    }
  }

  async loadGoogleDriveData() {
    try {
      console.log('Tentando carregar dados do Google Drive...')
      
      const loadPromises = Object.entries(DATA_SOURCES.googleDrive).map(async ([empresa, url]) => {
        try {
          const response = await fetch(url)
          if (response.ok) {
            const data = await response.json()
            if (!this.empresasData[empresa] && data && Array.isArray(data)) {
              this.empresasData[empresa] = data
              console.log(`${empresa} carregado do Google Drive:`, data.length, 'registros')
            }
          }
        } catch (error) {
          console.warn(`Erro ao carregar ${empresa} do Google Drive:`, error.message)
        }
      })

      await Promise.all(loadPromises)
      this.loadingStatus.googleDrive = true
      console.log('Tentativa de carregamento do Google Drive concluída')
    } catch (error) {
      console.error('Erro geral ao carregar dados do Google Drive:', error)
    }
  }

  async loadApiData() {
    try {
      console.log('Tentando carregar dados da API...')
      
      const loadPromises = Object.entries(DATA_SOURCES.api).map(async ([empresa, url]) => {
        try {
          const response = await fetch(url)
          if (response.ok) {
            const data = await response.json()
            if (!this.empresasData[empresa] && data && Array.isArray(data)) {
              this.empresasData[empresa] = data
              console.log(`${empresa} carregado da API:`, data.length, 'registros')
            }
          }
        } catch (error) {
          console.warn(`Erro ao carregar ${empresa} da API:`, error.message)
        }
      })

      await Promise.all(loadPromises)
      this.loadingStatus.api = true
      console.log('Tentativa de carregamento da API concluída')
    } catch (error) {
      console.error('Erro geral ao carregar dados da API:', error)
    }
  }

  async initialize() {
    console.log('Inicializando carregamento de dados de múltiplas fontes...')
    
    await Promise.all([
      this.loadLocalData(),
      this.loadGoogleDriveData(),
      this.loadApiData()
    ])
    
    console.log('Status final do carregamento:', this.loadingStatus)
    console.log('Empresas disponíveis:', Object.keys(this.empresasData))
  }

  getData(empresa) {
    return this.empresasData[empresa] || []
  }

  getAvailableCompanies() {
    return Object.keys(this.empresasData).map(key => ({
      label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: key
    }))
  }

  getLoadingStatus() {
    return this.loadingStatus
  }
}

export const dataLoader = new DataLoader()