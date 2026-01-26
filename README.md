# InvoiveApp

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/nest?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

graph TB
    subgraph Client_Applications [Client Applications]
        Client[Web/Mobile Apps]
    end

    subgraph API_Gateway_Layer [API Gateway Layer]
        BFF[BFF Service <br/> Port: 3300]
    end

    subgraph Authentication [Authentication]
        Keycloak[Keycloak]
    end

    subgraph Microservices_Layer [Microservices Layer]
        direction LR
        AuthS[Authorizer Service <br/> Port: 3004]
        UserS[User Access Service <br/> Port: 3003]
        ProdS[Product Service <br/> Port: 3002]
        InvS[Invoice Service <br/> Port: 3001]
        
        PDFS[PDF Generator <br/> Port: 3005]
        MedS[Media Service <br/> Port: 3006]
        MailS[Mail Service <br/> Port: 3007]
    end

    subgraph Data_Layer [Data Layer]
        PG[(PostgreSQL)]
        MG[(MongoDB)]
        RD[(Redis Cache)]
    end

    subgraph Message_Broker [Message Broker]
        Kafka{Apache Kafka}
    end

    subgraph Observability_Stack [Observability Stack]
        Tempo[Tempo]
        Loki[Loki]
        Prom[Prometheus]
        Grafana[Grafana]
    end

    %% Flow
    Client --> BFF
    BFF --> Microservices_Layer
    BFF --> RD
    
    Microservices_Layer --> Keycloak
    Microservices_Layer --> Data_Layer
    Microservices_Layer --> Kafka
    
    %% Observability Flow
    Microservices_Layer -.-> Tempo & Loki & Prom
    Tempo & Loki & Prom --> Grafana
