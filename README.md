# InvoiveApp


# Microservices System

Tài liệu này mô tả cấu trúc tổng thể của hệ thống, bao gồm các lớp dịch vụ, cơ sở dữ liệu và hệ thống giám sát.
This document is detailed overall system

## 📊 Sơ đồ Kiến trúc (System Architecture)

```mermaid
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
        Promtail[Promtail] --> Loki[Loki]
        Tempo[Tempo]
        Prom[Prometheus]
        Loki --> Grafana[Grafana]
        Tempo --> Grafana
        Prom --> Grafana
    end

    %% Flow Connections
    Client --> BFF
    BFF --> AuthS & UserS & ProdS & InvS
    BFF --> RD
    
    AuthS & UserS & ProdS & InvS --> Keycloak
    AuthS & UserS & ProdS & InvS --> PG & MG
    AuthS & UserS & ProdS & InvS --> Kafka
    
    InvS --> PDFS & MedS & MailS
    
    %% Monitoring connections
    BFF -.-> Tempo
    Kafka -.-> Tempo
