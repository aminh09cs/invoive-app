# InvoiveApp


# Microservices System

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

    Note over Obs: Asynchronous Monitoring & Logging
    Core-)+Obs: Push Logs (Loki) & Traces (Tempo)
    Kafka-)+Obs: Export Telemetry Data
