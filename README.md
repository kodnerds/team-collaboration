# Team Collaboration

A mini project management application inspired by Trello and Linear. Built with React, Express, TypeScript, and PostgreSQL.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Backend**: Express.js, TypeORM, PostgreSQL
- **Monorepo**: Turborepo with npm workspaces
- **Code Quality**: ESLint, Prettier, Husky

## Prerequisites

- Node.js v22.16.0 or higher
- npm 10.9.2 or higher
- Docker (for running the API with PostgreSQL)

## Quick Start

1. **Clone and install:**
```bash
git clone <repository-url>
cd team-collaboration
npm install
```

2. **Set up environment variables:**
```bash
cp apps/api/.env.example apps/api/.env
# Update values in apps/api/.env as needed
```

3. **Start development servers:**
```bash
npm run dev
```

This starts both the web app and API with PostgreSQL via Docker.

## Development

### Run All Apps
```bash
npm run dev      # Start all apps in development mode
npm run build    # Build all apps for production
npm run test     # Run all tests
```

### Run Individual Apps

**Frontend (Web):**
```bash
cd apps/web
npm run dev      # Starts on http://localhost:5173
```

**Backend (API with Docker):**
```bash
cd apps/api
npm run dev      # Starts API and PostgreSQL
```

## Available Commands

### Root Level

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps for production |
| `npm run lint` | Run ESLint on all workspaces |
| `npm run lint:fix` | Fix auto-fixable linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run test` | Run tests across all workspaces |

### API Commands

Run from `apps/api`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with Docker Compose (includes PostgreSQL) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |
| `npm run docker:build` | Build Docker images |
| `npm run docker:stop` | Stop Docker containers |
| `npm run typeorm` | Run TypeORM CLI commands |
| `npm test` | Run Jest tests |

### Web Commands

Run from `apps/web`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Deployment

This project supports continuous deployment to [Render](https://render.com) via GitHub Actions.

See [docs/RENDER_DEPLOYMENT.md](./docs/RENDER_DEPLOYMENT.md) for complete setup instructions.

### Quick Deploy

1. Render Dashboard → **New** → **Blueprint** → connect repo (auto-creates all services)
2. Get Deploy Hooks from each service (Settings → Deploy Hook)
3. Add to GitHub Secrets: `RENDER_API_DEPLOY_HOOK`, `RENDER_WEB_DEPLOY_HOOK`
4. Push to `main` → deploys automatically after CI passes

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on:
- Development workflow
- Code quality standards
- Commit message format
- Testing requirements
- Git hooks and tooling
