// Configurações e constantes da aplicação
export const APP_CONFIG = {
  name: 'Codex Finance',
  subtitle: 'Sistema de Gestão Financeira',
  version: '1.0.0'
}

export const DATA_SOURCES = {
  googleDrive: {
    'malta_advocacia': 'https://drive.google.com/uc?export=download&id=SEU_ID_MALTA',
    'codex_empreendedorismo': 'https://drive.google.com/uc?export=download&id=SEU_ID_CODEX',
    'fluxo': 'https://drive.google.com/uc?export=download&id=SEU_ID_FLUXO'
  },
  api: {
    'malta_advocacia': 'https://sua-api.com/api/malta-advocacia',
    'codex_empreendedorismo': 'https://sua-api.com/api/codex-empreendedorismo',
    'fluxo': 'https://sua-api.com/api/fluxo'
  }
}

export const COMPANIES = {
  'malta_advocacia': { label: 'Malta Advocacia', value: 'malta_advocacia' },
  'codex_empreendedorismo': { label: 'Codex Empreendedorismo', value: 'codex_empreendedorismo' },
  'fluxo': { label: 'Fluxo', value: 'fluxo' }
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