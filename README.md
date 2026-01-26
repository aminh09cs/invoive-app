# InvoiveApp


# Microservices System

### Architecture Diagram
```mermaid
graph TB
    Client[Client Applications]

    subgraph "API Gateway Layer"
        BFF[BFF Service<br/>Port: 3300]
    end

    subgraph "Microservices Layer"
        Invoice[Invoice Service<br/>Port: 3001]
        Product[Product Service<br/>Port: 3002]
        UserAccess[User Access Service<br/>Port: 3003]
        Authorizer[Authorizer Service<br/>Port: 3004]
        PDF[PDF Generator Service<br/>Port: 3005]
        Media[Media Service<br/>Port: 3006]
        Mail[Mail Service<br/>Port: 3007]
    end

    subgraph "Data Layer"
        Postgres[(PostgreSQL)]
        MongoDB[(MongoDB)]
        Redis[(Redis Cache)]
    end

    subgraph "Message Broker"
        Kafka[Apache Kafka]
    end

    subgraph "Observability Stack"
        Grafana[Grafana]
        Prometheus[Prometheus]
        Loki[Loki]
        Tempo[Tempo]
        Promtail[Promtail]
    end

    subgraph "Authentication"
        Keycloak[Keycloak]
    end

    Client --> BFF
    BFF --> Invoice
    BFF --> Product
    BFF --> UserAccess
    BFF --> Authorizer

    Invoice --> Kafka
    Product --> Kafka
    UserAccess --> Kafka

    Kafka --> PDF
    Kafka --> Media
    Kafka --> Mail

    Invoice --> Postgres
    Product --> Postgres
    UserAccess --> MongoDB

    BFF --> Redis
    Invoice --> Redis

    Invoice --> Prometheus
    Product --> Prometheus
    UserAccess --> Prometheus
    BFF --> Prometheus

    BFF --> Tempo
    Invoice --> Tempo

    Invoice --> Loki
    Product --> Loki

    Promtail -.-> Loki
    Prometheus --> Grafana
    Loki --> Grafana
    Tempo --> Grafana

    UserAccess --> Keycloak
    Authorizer --> Keycloak

    style BFF fill:#e1f5ff
    style Invoice fill:#fff3e0
    style Product fill:#fff3e0
    style UserAccess fill:#fff3e0
    style Authorizer fill:#fff3e0
    style PDF fill:#f3e5f5
    style Media fill:#f3e5f5
    style Mail fill:#f3e5f5
    style Kafka fill:#fce4ec
    style Grafana fill:#e8f5e9
```

### Sequence Diagram
```mermaid
sequenceDiagram
    autonumber
    participant Client as Web/Mobile Apps
    participant BFF as BFF Service (Port 3300)
    participant Auth as Keycloak / Authorizer (3004)
    participant Cache as Redis Cache
    participant Core as Core Services (3001-3003)
    participant Sub as Support (PDF/Media/Mail)
    participant DB as Databases (PG/Mongo)
    participant Kafka as Apache Kafka
    participant Obs as Observability (Loki/Tempo/Prom)

    Note over Client, Obs: System Request Flow & Logic

    Client->>+BFF: Send Request
    BFF->>+Obs: Initialize Trace (Tempo) & Metrics (Prom)
    
    BFF->>+Auth: Authenticate & Check Permissions
    Auth-->>-BFF: Return Authorization Status

    BFF->>+Cache: Query Cached Data
    Cache-->>-BFF: Return Data (if hit)

    BFF->>+Core: Dispatch to Service (Invoice/Prod/User)
    
    Core->>+DB: Execute CRUD Operations
    DB-->>-Core: Return Query Results
    
    alt Invoice Service Flow (Port 3001)
        Core->>+Sub: Request PDF Gen (3005) / Media (3006)
        Sub-->>-Core: Return File Metadata / Link
        Core->>Kafka: Publish "Send Mail" Event (3007)
    end

    Core->>+Kafka: Publish Business Event (Event-driven)
    Kafka-->>-Core: Acknowledge (Ack)

    Core-->>-BFF: Return Business Result
    BFF-->>-Client: Final API Response
```

    Note over Obs: Asynchronous Monitoring & Logging
    Core-)+Obs: Push Logs (Loki) & Traces (Tempo)
    Kafka-)+Obs: Export Telemetry Data
