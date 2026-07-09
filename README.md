# AURA – AI Unified Real-time Assistant | FIFA World Cup 2026

A unified, GenAI-powered platform designed to optimize stadium operations, enhance fan engagement, coordinate staff deployments, and manage transport/sustainability metrics in real-time during the FIFA World Cup 2026.

## 🚀 Repository Structure

```
smart-stadium-genai/
│
├── frontend/
│   ├── fan-app/                # React Native mobile app for stadium fans
│   ├── staff-dashboard/        # React Web panel for stadium admin & security
│   └── web-portal/             # Vanilla JS + CSS modular portal (AURA core demo)
│
├── backend/
│   ├── api-gateway/            # API routing, rate limiting, and CORS
│   ├── auth-service/           # User/Staff authentication & RBAC
│   ├── user-service/           # Fan profiles, ticket linking, settings
│   ├── navigation-service/     # Pathfinding algorithm inside stadium
│   ├── alert-service/          # Incident logging, safety broadcast system
│   ├── ticket-service/         # Ticketing integration & seating maps
│   └── analytics-service/      # Real-time event aggregator (KPIs)
│
├── ai-services/
│   ├── genai-chat/             # LLM Chat service with RAG pipeline
│   │   ├── rag_pipeline/       # Document retrieval & vector DB loaders
│   │   ├── prompt_templates/   # System instructions for stadium agents
│   │   └── embeddings/         # Vector embedding gen scripts
│   │
│   ├── crowd-detection/        # Computer vision zone density models
│   │   ├── models/             # Pretrained YOLO/OpenCV models
│   │   └── inference/          # Real-time RTSP camera inference feeds
│   │
│   ├── transport-optimizer/    # Bus/Metro dispatch & rideshare staging AI
│   ├── sustainability-ai/      # HVAC & smart grid optimization model
│   └── accessibility-ai/       # Routing and translation services for accessibility
│
├── data/
│   ├── datasets/               # Mock logs, historical fan flow trends
│   ├── pipelines/              # Spark/Flink data cleaning & streaming pipelines
│   └── schemas/                # Kafka event and database schemas
│
├── infra/
│   ├── docker/                 # Container files for local dev
│   ├── kubernetes/             # K8s manifests for staging/production
│   ├── terraform/              # IaC scripts for GCP/AWS hosting
│   └── monitoring/             # Prometheus, Grafana, and ELK logs
│
├── ci-cd/
│   ├── github-actions/         # Workflows for build, lint, and test
│   └── pipelines/              # CD release deployment pipelines
│
├── docs/
│   ├── architecture.md         # Detailed system design & event loop
│   ├── api-spec.yaml           # OpenAPI / Swagger Specification
│   └── deployment.md           # Instructions for cloud staging deployment
│
└── README.md                   # This root documentation
```

---

## 🎨 Frontend Web Portal (AURA Core Demo)

The web portal under `frontend/web-portal/` is a high-fidelity, interactive, single-page dashboard designed using **vanilla modern web technologies (ES6 modules and native CSS variables)** for maximum speed, simplicity, and flexibility.

### Key Views & Modules:
1. **Command Center** (`DashboardView.js`): General stadium KPIs, live fan flow canvas, automatic AI matches summaries.
2. **AI Fan Assistant** (`ChatView.js`): Conversational assistant utilizing speech recognition, multi-language selector (20+ languages), and pattern matching.
3. **Stadium Navigator** (`NavigatorView.js`): Interactive SVG map representing crowd heatmaps, gates, and POI filters (restrooms, food, accessibility, medical).
4. **Ops Copilot** (`OperationsView.js`): Security control feed, incident logger, AI predictive deployments, broadcast control.
5. **Transport Intelligence** (`TransportView.js`): Parking occupancy tracker, public transit schedules, carbon footprint comparison.
6. **Sustainability** (`SustainabilityView.js`): Active load solar/grid area graphs, waste recycling gauge, and smart HVAC/lighting recommendation feed.

### Core Features:
- Centralized reactive state store (`js/state.js`).
- Event Bus (`js/eventBus.js`) for loose coupling and messaging between views.
- Modular router (`js/router.js`) managing lazy initialization and cleanup of intervals/event listeners to prevent memory leaks.
- Canvas chart library with built-in HiDPI scaling, resize listeners, and browser-compatible drawing polyfills.

### How to Run:
Simply open `frontend/web-portal/index.html` in any modern web browser. No bundlers or package installs required.

---

## ⚙️ Backend Services & AI Architecture

- **AI Chat Pipeline**: The GenAI chat utilizes retrieval-augmented generation (RAG) over a vector database containing stadium layouts, transit routes, match specs, and accessibility information.
- **Crowd Density Tracking**: Integrates with RTSP cameras using Computer Vision models (under `ai-services/crowd-detection`) to feed real-time gate throughput and zone density metrics into the gateway.
- **Optimization Engines**: Smart grid AI computes real-time optimal temperatures and dims lights in low-occupancy zones, directly affecting energy metrics in the sustainability portal.
