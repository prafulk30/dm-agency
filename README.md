# AstraDigital — DM Agency (dm-agency)

Starter Vite + React + Tailwind marketing site.

## Local dev (VS Code)
1. Open folder: `C:\DevOps Projects\dm-agency`
2. Install deps: `npm install`
3. Dev server: `npm run dev` → open http://localhost:5173

## Build
`npm run build` → produces `dist/`

## Docker (used in CI)
Build locally: `docker build -t astra-digital:latest .`
Run: `docker run -p 8080:80 astra-digital:latest`

## Branching (GitFlow)
- `main` — production
- `develop` — staging / integration
- feature branches from `develop`

Secrets & CI: placeholders used. See Jenkinsfile and docs for CI details.

CI/CD auto trigger test

Auto trigger verification test

Webhook Added