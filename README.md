# AI Chatbot SaaS

Monorepo scaffold for a modular TypeScript SaaS application.

## Applications

- `backend`: Express HTTP API. Feature modules follow Clean Architecture boundaries: domain rules and ports, application use cases, infrastructure adapters, and HTTP presentation.
- `frontend`: React, Vite, and TypeScript client, organized by product feature.

## Shared packages and infrastructure

- `packages/contracts`: stable API contracts shared across applications; do not expose persistence models.
- `prisma`: PostgreSQL schema, migrations, and seed entry point.
- `tests`: cross-application end-to-end, contract, and performance test suites.
- `infra`: container, deployment, and monitoring configuration.
- `.github/workflows`: CI/CD workflows.

## Dependency rules

Keep domain code independent of Express, Prisma, and provider SDKs. Application use cases depend on domain interfaces. Infrastructure implements those interfaces. HTTP controllers validate/translate requests and invoke use cases; they must not contain business or database logic. AI provider adapters belong under `backend/src/modules/chatbot/infrastructure/providers`.

## Initial setup

This commit is a structure scaffold only. Add workspace manifests, application entry points, dependency wiring, configuration validation, and CI workflows as implementation begins. Copy required variables from `.env.example` into a local, untracked environment file; never commit secrets.
