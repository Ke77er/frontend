# 🏗️ Arquitetura do Sistema - Codex Finance

## Diagrama de Arquitetura Geral

```mermaid
graph TB
    %% Camada de Apresentação
    subgraph "🎨 Presentation Layer"
        UI[User Interface]
        APP[App.vue]
        HEADER[AppHeader.vue]
        FILTER[FilterPanel.vue]
        
        subgraph "📊 Views"
            CASH[CashFlowView.vue]
            OVER[OverdueView.vue]
            RAW[RawDataView.vue]
        end
        
        subgraph "🧩 Common Components"
            VALUE[ValueDisplay.vue]
            DATE[DateDisplay.vue]
            SUMMARY[SummaryCard.vue]
        end
    end

    %% Camada de Lógica
    subgraph "⚡ Logic Layer (Composables)"
        PARAMS[useParametros.js]
        DATA_SERVICE[useDataService.js]
        CASH_DATA[useCashFlowData.js]
        OVER_DATA[useOverdueData.js]
        RAW_DATA[useRawData.js]
    end

    %% Camada de Serviços
    subgraph "🔧 Service Layer"
        LOADER[DataLoader.js]
        PROCESSOR[DataProcessor.js]
    end

    %% Camada de Utilitários
    subgraph "🛠️ Utils Layer"
        DATE_UTILS[DateUtils.js]
        FORMAT_UTILS[FormatUtils.js]
    end

    %% Camada de Dados
    subgraph "💾 Data Layer"
        LOCAL[Local JSON Files]
        GDRIVE[Google Drive]
        API[REST API]
    end

    %% Configurações
    subgraph "⚙️ Configuration"
        CONSTANTS[constants.js]
        CONFIG[App Config]
    end

    %% Conexões
    UI --> APP
    APP --> HEADER
    APP --> FILTER
    APP --> CASH
    APP --> OVER
    APP --> RAW

    CASH --> VALUE
    CASH --> DATE
    CASH --> SUMMARY
    OVER --> VALUE
    OVER --> DATE
    RAW --> VALUE
    RAW --> DATE

    FILTER --> PARAMS
    FILTER --> DATA_SERVICE
    CASH --> CASH_DATA
    OVER --> OVER_DATA
    RAW --> RAW_DATA

    DATA_SERVICE --> LOADER
    DATA_SERVICE --> PROCESSOR
    CASH_DATA --> PROCESSOR
    OVER_DATA --> PROCESSOR
    RAW_DATA --> PROCESSOR

    PROCESSOR --> DATE_UTILS
    PROCESSOR --> FORMAT_UTILS
    CASH --> DATE_UTILS
    CASH --> FORMAT_UTILS
    OVER --> DATE_UTILS
    RAW --> DATE_UTILS
    RAW --> FORMAT_UTILS

    LOADER --> LOCAL
    LOADER --> GDRIVE
    LOADER --> API

    LOADER --> CONSTANTS
    DATA_SERVICE --> CONSTANTS
    FILTER --> CONSTANTS
```

## Fluxo de Dados

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Composable
    participant Service
    participant DataLoader
    participant DataSource

    User->>UI: Seleciona filtros
    UI->>Composable: useParametros.update()
    Composable->>Service: getFilteredData()
    Service->>DataLoader: getData(empresa)
    DataLoader->>DataSource: fetch data
    DataSource-->>DataLoader: raw data
    DataLoader-->>Service: processed data
    Service->>Service: DataProcessor.filter()
    Service-->>Composable: filtered data
    Composable->>Composable: process for view
    Composable-->>UI: reactive data
    UI-->>User: updated interface
```

## Padrões Arquiteturais Utilizados

### 1. **Composition API Pattern**
- Uso de composables para lógica reutilizável
- Separação clara entre lógica e apresentação
- Reatividade granular

### 2. **Service Layer Pattern**
- DataLoader: Responsável pelo carregamento de dados
- DataProcessor: Responsável pelo processamento de dados
- Separação de responsabilidades

### 3. **Repository Pattern**
- DataLoader atua como repository
- Abstração das fontes de dados
- Fallback automático entre fontes

### 4. **Observer Pattern**
- Sistema reativo do Vue 3
- Watchers para mudanças de filtros
- Computed properties para dados derivados

### 5. **Strategy Pattern**
- Diferentes estratégias de carregamento de dados
- Processamento específico por tipo de view
- Formatação condicional

## Princípios SOLID Aplicados

### Single Responsibility Principle (SRP)
- Cada composable tem uma responsabilidade específica
- Componentes focados em uma funcionalidade
- Utils especializados

### Open/Closed Principle (OCP)
- Extensível para novas fontes de dados
- Novos tipos de filtros podem ser adicionados
- Componentes podem ser estendidos

### Liskov Substitution Principle (LSP)
- Componentes comuns podem ser substituídos
- Diferentes implementações de formatação
- Fontes de dados intercambiáveis

### Interface Segregation Principle (ISP)
- Composables específicos para cada necessidade
- Props opcionais em componentes
- APIs focadas

### Dependency Inversion Principle (DIP)
- Dependência de abstrações (composables)
- Injeção de dependências via props
- Configuração externa

## Vantagens da Arquitetura

### 🔄 **Modularidade**
- Componentes independentes e reutilizáveis
- Fácil manutenção e teste
- Desenvolvimento paralelo

### 📈 **Escalabilidade**
- Fácil adição de novas views
- Extensão de funcionalidades
- Suporte a múltiplas empresas

### 🛡️ **Robustez**
- Fallback automático de dados
- Tratamento de erros
- Validação de dados

### ⚡ **Performance**
- Lazy loading de dados
- Computed properties com cache
- Processamento otimizado

### 🧪 **Testabilidade**
- Lógica separada da apresentação
- Mocks fáceis de implementar
- Testes unitários isolados

## Fluxo de Desenvolvimento

### Adicionando Nova Funcionalidade

1. **Definir Requisitos**
   - Identificar necessidade
   - Definir interface

2. **Criar Composable**
   - Implementar lógica reativa
   - Definir API pública

3. **Implementar Processamento**
   - Adicionar métodos ao DataProcessor
   - Implementar transformações

4. **Criar Componente**
   - Implementar UI
   - Conectar com composable

5. **Integrar ao Sistema**
   - Adicionar rota/navegação
   - Atualizar configurações

### Manutenção e Debug

1. **Logs Estruturados**
   - Console logs em desenvolvimento
   - Rastreamento de fluxo de dados

2. **Vue DevTools**
   - Inspeção de estado reativo
   - Timeline de eventos

3. **Monitoramento**
   - Status de carregamento
   - Métricas de performance

## Considerações de Segurança

### 🔒 **Sanitização de Dados**
- Validação de entrada
- Escape de HTML
- Prevenção de XSS

### 🛡️ **Controle de Acesso**
- Validação de fontes de dados
- Headers de segurança
- CSP (Content Security Policy)

### 🔐 **Privacidade**
- Dados processados localmente
- Não persistência desnecessária
- Logs sem dados sensíveis