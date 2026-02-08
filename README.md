# rs-tandem

Nx monorepo with Angular frontend, NestJS backend, and shared TypeScript library.

### Tech Stack
- Angular (frontend)
- NestJS (backend)
- TypeScript
- SCSS
- Nx (monorepo tooling)
- Playwright (e2e testing)
- Jest (unit testing)
- ESLint + Prettier
- GitHub Actions

### Project Structure
```
apps/
  frontend/          # Angular app
  backend/           # NestJS API
libs/
  shared/            # Shared types & utilities (@rs-tandem/shared)
```

### Development
```bash
# Serve frontend
npx nx serve frontend

# Serve backend
npx nx serve backend

# Build all
npx nx run-many -t build

# Run tests
npx nx run-many -t test

# Run e2e tests
npx nx e2e frontend-e2e
```
