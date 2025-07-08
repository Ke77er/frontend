# 🔄 Diagrama de Fluxo de Dados - Codex Finance

## Fluxo Principal de Dados

```mermaid
graph TD
    %% Fontes de Dados
    subgraph "💾 Data Sources"
        LOCAL[📁 Local JSON Files<br/>Malta_Advocacia.json<br/>Codex_empreendedorismo.json<br/>fluxo.json]
        GDRIVE[☁️ Google Drive<br/>Backup Files]
        API[🌐 REST API<br/>External Services]
    end
    
    %% Carregamento de Dados
    subgraph "📥 Data Loading Layer"
        LOADER[🔄 DataLoader<br/>- loadLocalData()<br/>- loadGoogleDriveData()<br/>- loadApiData()<br/>- initialize()]
    end
    
    %% Processamento de Dados
    subgraph "⚙️ Data Processing Layer"
        PROCESSOR[🔧 DataProcessor<br/>- filterData()<br/>- processCategories()<br/>- processAccounts()<br/>- generateCashFlowData()]
    end
    
    %% Camada de Serviços
    subgraph "🔧 Service Layer"
        DATA_SERVICE[📊 useDataService<br/>- getFilteredData()<br/>- getUniqueCategories()<br/>- getUniqueAccounts()]
        CASH_SERVICE[💰 useCashFlowData<br/>- generateCashFlowData()<br/>- getDetailsForPeriod()]
        OVERDUE_SERVICE[⚠️ useOverdueData<br/>- getOverdueData()]
        RAW_SERVICE[📋 useRawData<br/>- getRawData()]
    end
    
    %% Estado Global
    subgraph "🎛️ Global State"
        PARAMS[⚙️ useParametros<br/>- empresaSelecionada<br/>- dataInicio/dataFim<br/>- categoriasSelecionadas<br/>- contasSelecionadas]
    end
    
    %% Componentes de UI
    subgraph "🎨 UI Components"
        FILTER[🔍 FilterPanel<br/>Controls & Filters]
        CASH_VIEW[📈 CashFlowView<br/>Flow Analysis]
        OVERDUE_VIEW[⏰ OverdueView<br/>Late Payments]
        RAW_VIEW[📄 RawDataView<br/>Data Table]
    end
    
    %% Fluxo de Dados
    LOCAL --> LOADER
    GDRIVE --> LOADER
    API --> LOADER
    
    LOADER --> DATA_SERVICE
    DATA_SERVICE --> PROCESSOR
    
    PROCESSOR --> CASH_SERVICE
    PROCESSOR --> OVERDUE_SERVICE
    PROCESSOR --> RAW_SERVICE
    
    PARAMS --> DATA_SERVICE
    PARAMS --> CASH_SERVICE
    PARAMS --> OVERDUE_SERVICE
    PARAMS --> RAW_SERVICE
    
    FILTER --> PARAMS
    
    CASH_SERVICE --> CASH_VIEW
    OVERDUE_SERVICE --> OVERDUE_VIEW
    RAW_SERVICE --> RAW_VIEW
    
    %% Feedback Loop
    CASH_VIEW -.->|User Interactions| PARAMS
    OVERDUE_VIEW -.->|Filter Changes| PARAMS
    RAW_VIEW -.->|Search & Pagination| PARAMS
```

## Fluxo Detalhado por Funcionalidade

### 💰 Fluxo de Caixa

```mermaid
sequenceDiagram
    participant User
    participant CashFlowView
    participant useCashFlowData
    participant DataProcessor
    participant useDataService
    participant DataLoader
    participant DataSource

    User->>CashFlowView: Seleciona período
    CashFlowView->>useCashFlowData: generateCashFlowData(inicio, fim)
    useCashFlowData->>useDataService: getFilteredData()
    useDataService->>DataLoader: getData(empresa)
    DataLoader->>DataSource: fetch data
    DataSource-->>DataLoader: raw JSON data
    DataLoader-->>useDataService: empresa data
    useDataService->>DataProcessor: filterData(filters)
    DataProcessor-->>useDataService: filtered data
    useDataService-->>useCashFlowData: filtered data
    useCashFlowData->>DataProcessor: generateCashFlowData()
    DataProcessor->>DataProcessor: generatePeriods()
    DataProcessor->>DataProcessor: groupByCategory()
    DataProcessor-->>useCashFlowData: {linhas, periodos}
    useCashFlowData-->>CashFlowView: cash flow data
    CashFlowView-->>User: Updated table & chart
```

### ⚠️ Contas Atrasadas

```mermaid
sequenceDiagram
    participant User
    participant OverdueView
    participant useOverdueData
    participant DataProcessor
    participant useDataService

    User->>OverdueView: Seleciona tipo (Receber/Pagar)
    OverdueView->>useOverdueData: getOverdueData(tipo)
    useOverdueData->>useDataService: getFilteredData()
    useDataService-->>useOverdueData: filtered data
    useOverdueData->>DataProcessor: processOverdueData(data, tipo)
    DataProcessor->>DataProcessor: filterByDueDate()
    DataProcessor->>DataProcessor: filterByStatus()
    DataProcessor->>DataProcessor: filterByType()
    DataProcessor-->>useOverdueData: overdue items
    useOverdueData-->>OverdueView: grouped overdue data
    OverdueView-->>User: Overdue table
```

### 📋 Dados Brutos

```mermaid
sequenceDiagram
    participant User
    participant RawDataView
    participant useRawData
    participant DataProcessor
    participant useDataService

    User->>RawDataView: Aplica filtros/busca
    RawDataView->>useRawData: getRawData()
    useRawData->>useDataService: getFilteredData()
    useDataService-->>useRawData: filtered data
    useRawData->>DataProcessor: processRawData(data)
    DataProcessor->>DataProcessor: mapToTableFormat()
    DataProcessor-->>useRawData: table data
    useRawData-->>RawDataView: paginated data
    RawDataView-->>User: Data table with pagination
```

## Transformação de Dados

### 📊 Pipeline de Processamento

```mermaid
graph LR
    subgraph "Raw Data Structure"
        A["{<br/>data_ymd: '2025-01-15',<br/>valor: 1500.00,<br/>categoria_erp_id: '001',<br/>categoria_erp_descricao: 'Receitas',<br/>pessoa_erp_descricao: 'Cliente ABC',<br/>baixado: false<br/>}"]
    end
    
    subgraph "Processing Steps"
        B[🔍 Filter by Date Range]
        C[🏢 Filter by Company]
        D[📂 Filter by Category]
        E[💳 Filter by Account]
        F[⚙️ Transform Structure]
    end
    
    subgraph "Output Formats"
        G[📈 Cash Flow Format<br/>{categoria, periodo1, periodo2, total}]
        H[⚠️ Overdue Format<br/>{categoria, pessoa, vencimento, valor}]
        I[📋 Raw Format<br/>{data_vencimento, valor_total, categoria}]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    F --> H
    F --> I
```

### 🔄 Estado Reativo

```mermaid
graph TD
    subgraph "Reactive State Flow"
        A[User Input] --> B[Component Event]
        B --> C[Composable Method]
        C --> D[State Update]
        D --> E[Computed Recalculation]
        E --> F[Watcher Trigger]
        F --> G[Service Call]
        G --> H[Data Processing]
        H --> I[State Update]
        I --> J[UI Re-render]
    end
    
    subgraph "Example: Filter Change"
        A1[User selects date] --> B1[Calendar change event]
        B1 --> C1[setQuickFilter()]
        C1 --> D1[dataInicio.value = newDate]
        D1 --> E1[filteredData computed]
        E1 --> F1[watch dataInicio]
        F1 --> G1[updateData()]
        G1 --> H1[generateCashFlowData()]
        H1 --> I1[linhas.value = newData]
        I1 --> J1[Table updates]
    end
```

## Gerenciamento de Estado

### 🎛️ Estado Global (useParametros)

```mermaid
graph TD
    subgraph "Global State Management"
        A[useParametros.js]
        
        subgraph "Reactive Refs"
            B[empresaSelecionada]
            C[dataInicio]
            D[dataFim]
            E[categoriasSelecionadas]
            F[contasSelecionadas]
        end
        
        subgraph "Read-Write Access"
            G[FilterPanel.vue]
        end
        
        subgraph "Read-Only Access"
            H[CashFlowView.vue]
            I[OverdueView.vue]
            J[RawDataView.vue]
        end
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    
    G --> B
    G --> C
    G --> D
    G --> E
    G --> F
    
    B --> H
    C --> H
    D --> H
    E --> H
    F --> H
    
    B --> I
    C --> I
    D --> I
    E --> I
    F --> I
    
    B --> J
    C --> J
    D --> J
    E --> J
    F --> J
```

### 📊 Cache e Performance

```mermaid
graph TD
    subgraph "Caching Strategy"
        A[Data Request] --> B{Cache Hit?}
        B -->|Yes| C[Return Cached Data]
        B -->|No| D[Process Data]
        D --> E[Store in Cache]
        E --> F[Return Data]
        
        subgraph "Cache Types"
            G[Computed Properties<br/>Automatic Vue Cache]
            H[DataLoader Cache<br/>empresasData object]
            I[Processed Data Cache<br/>Filtered results]
        end
    end
    
    subgraph "Performance Optimizations"
        J[Lazy Loading<br/>Load data on demand]
        K[Debounced Filters<br/>Reduce API calls]
        L[Virtual Scrolling<br/>Large datasets]
        M[Memoization<br/>Expensive calculations]
    end
```

## Tratamento de Erros

### 🛡️ Error Handling Flow

```mermaid
graph TD
    subgraph "Error Handling Strategy"
        A[Data Request] --> B{Success?}
        B -->|Yes| C[Process Data]
        B -->|No| D[Log Error]
        D --> E[Try Fallback Source]
        E --> F{Fallback Success?}
        F -->|Yes| C
        F -->|No| G[Show Error State]
        
        subgraph "Error Types"
            H[Network Errors<br/>API/Drive failures]
            I[Data Format Errors<br/>Invalid JSON structure]
            J[Processing Errors<br/>Calculation failures]
        end
        
        subgraph "Recovery Strategies"
            K[Multiple Data Sources<br/>Local → Drive → API]
            L[Graceful Degradation<br/>Show partial data]
            M[User Feedback<br/>Error messages]
        end
    end
```

## Vantagens do Fluxo de Dados

### ✅ **Previsibilidade**
- Fluxo unidirecional de dados
- Estado centralizado
- Transformações consistentes

### ✅ **Reatividade**
- Atualizações automáticas
- Computed properties eficientes
- Watchers para side effects

### ✅ **Robustez**
- Múltiplas fontes de dados
- Fallback automático
- Tratamento de erros

### ✅ **Performance**
- Cache inteligente
- Lazy loading
- Processamento otimizado

### ✅ **Manutenibilidade**
- Separação clara de responsabilidades
- Código reutilizável
- Fácil debugging