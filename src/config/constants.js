// Configurações e constantes da aplicação
export const APP_CONFIG = {
  name: 'Codex Finance',
  subtitle: 'Sistema de Gestão Financeira',
  version: '1.0.0'
}

export const DATA_SOURCES = {
  googleDrive: {
    'malta_advocacia': 'https://drive.google.com/uc?export=download&id=SEU_ID_MALTA'
  },
  api: {
    'malta_advocacia': 'https://sua-api.com/api/malta-advocacia'
  }
}

export const COMPANIES = {
  'malta_advocacia': { label: 'Malta Advocacia', value: 'malta_advocacia' }
}

export const PAGINATION_OPTIONS = [10, 20, 50, 100]

export const QUICK_FILTERS = [
  { key: 'hoje', label: 'Hoje' },
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mês' },
  { key: 'trimestre', label: 'Trimestre' }
]

export const OVERDUE_TYPES = [
  { label: 'A Receber', value: 'Receber' },
  { label: 'A Pagar', value: 'Pagar' }
]