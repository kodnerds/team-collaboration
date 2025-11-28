# Contributing Guide

## Development Workflow

1. Create a feature branch from `create-project`
2. Make your changes
3. Run linting and formatting
4. Run tests
5. Commit with conventional commit messages
6. Push and create a pull request

## Available Commands

### Root Level Commands

Run these from the project root to execute across all workspaces:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps for production |
| `npm run lint` | Run ESLint on all workspaces |
| `npm run lint:fix` | Fix auto-fixable linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run test` | Run tests across all workspaces |

### API-Specific Commands

Run from `apps/api` directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with Docker Compose (includes PostgreSQL) |
| `npm run dev:local` | Start API locally with nodemon (requires local DB) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the compiled production build |
| `npm run docker:build` | Build Docker images |
| `npm run docker:stop` | Stop and remove Docker containers |
| `npm test` | Run Jest tests |

### Web-Specific Commands

Run from `apps/web` directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Code Quality

### Linting

This project uses ESLint for code quality. All code must pass linting with zero warnings:

```bash
npm run lint
```

To automatically fix issues:

```bash
npm run lint:fix
```

### Formatting

Code is formatted with Prettier. Check formatting:

```bash
npm run format:check
```

Auto-format all files:

```bash
npm run format
```

### Git Hooks

Git hooks are managed by Husky:

- **Commit-msg**: Validates commit messages follow conventional commits

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(api): add user authentication endpoint
fix(web): resolve login form validation issue
docs: update setup instructions
```

## Testing

Run all tests:

```bash
npm test
```

Run tests for specific workspace:

```bash
cd apps/api
npm test
```

## Project Structure

```
team-collaboration/
├── apps/
│   ├── api/          # Express.js backend
│   └── web/          # React frontend
├── packages/
│   ├── eslint-config/       # Shared ESLint configuration
│   └── typescript-config/   # Shared TypeScript configuration
└── turbo.json        # Turborepo pipeline configuration
```

## Monorepo Management

This project uses Turborepo for managing the monorepo. Tasks are executed in parallel where possible and cache results for faster builds.

### Adding a New Workspace

1. Create new directory in `apps/` or `packages/`
2. Add `package.json` with appropriate scripts
3. Update workspace references if needed
4. Run `npm install` from root

## Docker Development

The API uses Docker Compose for local development:

```bash
cd apps/api
npm run dev  # Starts PostgreSQL and API
```

To rebuild containers:

```bash
npm run docker:build
```

To stop containers:

```bash
npm run docker:stop
```

## Getting Help

- Check existing issues and PRs
- Review project documentation
- Ask questions in pull request discussions
