# 📊 Codex Finance - Sistema de Gestão Financeira

Sistema web moderno para visualização e análise de fluxo de caixa, desenvolvido com Vue 3 e PrimeVue.

## 🚀 Visão Geral

O Codex Finance é uma aplicação frontend para análise financeira que oferece visualizações interativas de fluxo de caixa, controle de contas em atraso e acesso aos dados brutos. O sistema suporta múltiplas empresas e fontes de dados.

### ✨ Principais Funcionalidades

- **📈 Fluxo de Caixa**: Visualização temporal com separação entre valores realizados e previstos
- **⚠️ Contas Atrasadas**: Monitoramento de valores vencidos por categoria
- **📋 Dados Brutos**: Acesso completo aos registros com filtros e exportação
- **🏢 Multi-empresa**: Suporte a múltiplas empresas com troca dinâmica
- **📱 Responsivo**: Interface adaptável para desktop e mobile
- **🔍 Filtros Avançados**: Filtros por período, categoria, conta e empresa

## 🛠️ Tecnologias Utilizadas

- **Vue 3** - Framework JavaScript reativo
- **PrimeVue** - Biblioteca de componentes UI
- **Vite** - Build tool e dev server
- **Date-fns** - Manipulação de datas
- **PrimeFlex** - Sistema de grid CSS
- **PrimeIcons** - Ícones

## 📁 Estrutura do Projeto

```
src/
├── assets/                 # Arquivos JSON de dados
│   ├── Malta_Advocacia.json
│   ├── Codex_empreendedorismo.json
│   └── fluxo.json
├── components/             # Componentes Vue
│   ├── common/            # Componentes reutilizáveis
│   │   ├── DateDisplay.vue
│   │   ├── SummaryCard.vue
│   │   └── ValueDisplay.vue
│   ├── filters/           # Componentes de filtro
│   │   └── FilterPanel.vue
│   ├── layout/            # Layout da aplicação
│   │   └── AppHeader.vue
│   └── views/             # Páginas principais
│       ├── CashFlowView.vue
│       ├── OverdueView.vue
│       └── RawDataView.vue
├── composables/           # Lógica reativa
│   ├── useCashFlowData.js
│   ├── useDataService.js
│   ├── useOverdueData.js
│   ├── useParametros.js
│   └── useRawData.js
├── config/                # Configurações
│   └── constants.js
├── services/              # Serviços de dados
│   ├── dataLoader.js
│   └── dataProcessor.js
├── utils/                 # Utilitários
│   ├── dateUtils.js
│   └── formatUtils.js
├── App.vue               # Componente raiz
├── main.js               # Ponto de entrada
└── style.css             # Estilos globais
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd codex-finance-frontend

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 📊 Funcionalidades Detalhadas

### 1. Fluxo de Caixa
- **Visualização Temporal**: Dados organizados por dia ou mês
- **Realizado vs Previsto**: Separação clara entre valores confirmados e previstos
- **Histórico Visual**: Gráfico de barras com linha de saldo acumulado
- **Detalhamento**: Clique em qualquer valor para ver os registros detalhados
- **Períodos Dinâmicos**: Adaptação automática entre visualização diária e mensal

### 2. Contas Atrasadas
- **Filtro por Tipo**: A Receber ou A Pagar
- **Agrupamento**: Organização por categoria com totais
- **Dias de Atraso**: Cálculo automático dos dias em atraso
- **Ordenação**: Por valor total decrescente

### 3. Dados Brutos
- **Busca Global**: Pesquisa em todos os campos
- **Paginação**: Controle de itens por página
- **Exportação CSV**: Download dos dados filtrados
- **Status Visual**: Tags coloridas para status dos registros

### 4. Sistema de Filtros
- **Período**: Seleção de data início/fim com filtros rápidos
- **Empresa**: Troca entre diferentes empresas
- **Categoria**: Seleção múltipla de categorias
- **Conta**: Filtro por contas financeiras
- **Persistência**: Filtros mantidos entre navegação

## 🔧 Configuração e Personalização

### Configurações Principais (`src/config/constants.js`)

```javascript
export const APP_CONFIG = {
  name: 'Codex Finance',
  subtitle: 'Sistema de Gestão Financeira',
  version: '1.0.0'
}

export const DATA_SOURCES = {
  googleDrive: {
    'empresa': 'URL_DO_GOOGLE_DRIVE'
  },
  api: {
    'empresa': 'URL_DA_API'
  }
}
```

### Adicionando Nova Empresa

1. **Adicione os dados** em `src/assets/NomeEmpresa.json`
2. **Configure em constants.js**:
```javascript
export const COMPANIES = {
  'nova_empresa': { label: 'Nova Empresa', value: 'nova_empresa' }
}
```
3. **Atualize o dataLoader** em `src/services/dataLoader.js`

### Personalizando Cores e Tema

Edite as variáveis CSS em `src/style.css`:
```css
:root {
  --primary-color: #1a365d;
  --success-color: #38a169;
  --warning-color: #d69e2e;
  --danger-color: #e53e3e;
}
```

## 🔄 Fontes de Dados

O sistema suporta múltiplas fontes de dados com fallback automático:

1. **Arquivos Locais** (prioridade alta)
2. **Google Drive** (fallback)
3. **API REST** (fallback)

### Formato dos Dados

```javascript
{
  "data_ymd": "2025-01-15",
  "valor": 1500.00,
  "categoria_erp_id": "001",
  "categoria_erp_descricao": "Receitas",
  "pessoa_erp_descricao": "Cliente ABC",
  "conta_financeira_erp_descricao": "Conta Corrente",
  "baixado": false,
  "observacoes": "Observações opcionais"
}
```

## 🛠️ Manutenção e Desenvolvimento

### Estrutura Modular

O código foi estruturado seguindo princípios de modularidade:

- **Separação de Responsabilidades**: Cada arquivo tem uma função específica
- **Reutilização**: Componentes e utilitários reutilizáveis
- **Manutenibilidade**: Código organizado e documentado

### Adicionando Nova Funcionalidade

1. **Crie o composable** em `src/composables/`
2. **Adicione processamento** em `src/services/dataProcessor.js`
3. **Crie o componente** em `src/components/views/`
4. **Registre no App.vue**

### Debugging

- **Console Logs**: Logs detalhados em desenvolvimento
- **Vue DevTools**: Suporte completo para debugging
- **Network Tab**: Monitoramento de carregamento de dados

### Performance

- **Lazy Loading**: Carregamento sob demanda
- **Computed Properties**: Cache automático de cálculos
- **Virtual Scrolling**: Para grandes volumes de dados

## 📝 Padrões de Código

### Nomenclatura
- **Componentes**: PascalCase (`CashFlowView.vue`)
- **Composables**: camelCase com prefixo `use` (`useCashFlowData.js`)
- **Utilitários**: camelCase (`formatUtils.js`)
- **Constantes**: UPPER_SNAKE_CASE (`APP_CONFIG`)

### Estrutura de Componentes
```vue
<template>
  <!-- Template limpo e semântico -->
</template>

<script setup>
// Imports
// Composables
// Reactive data
// Computed properties
// Methods
// Watchers
</script>

<style scoped>
/* Estilos específicos do componente */
</style>
```

## 🐛 Solução de Problemas

### Problemas Comuns

**1. Dados não carregam**
- Verifique se os arquivos JSON estão em `src/assets/`
- Confirme a estrutura dos dados
- Verifique o console para erros

**2. Filtros não funcionam**
- Limpe os filtros e tente novamente
- Verifique se há dados no período selecionado
- Confirme se a empresa está selecionada

**3. Exportação falha**
- Verifique se há dados para exportar
- Confirme permissões do navegador para download

### Logs de Debug

Ative logs detalhados no console:
```javascript
// Em desenvolvimento, todos os logs são exibidos
console.log('Debug info:', data)
```

## 🔒 Segurança

- **Sanitização**: Dados são sanitizados antes da exibição
- **CSP**: Content Security Policy configurado
- **XSS Protection**: Proteção contra scripts maliciosos

## 📈 Performance

### Otimizações Implementadas
- **Code Splitting**: Carregamento sob demanda
- **Tree Shaking**: Remoção de código não utilizado
- **Minificação**: Código otimizado para produção
- **Caching**: Cache inteligente de dados processados

### Métricas Recomendadas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Variáveis de Ambiente
Crie `.env` para configurações específicas:
```env
VITE_API_BASE_URL=https://api.exemplo.com
VITE_GOOGLE_DRIVE_API_KEY=sua_chave_aqui
```

## 📞 Suporte

Para suporte técnico ou dúvidas:
- **Email**: suporte@codex.com
- **Documentação**: [Link para docs]
- **Issues**: [Link para GitHub Issues]

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

---

**Versão**: 1.0.0  
**Última Atualização**: Janeiro 2025  
**Desenvolvido por**: Equipe Codex