# ---- Build stage ----
FROM node:22-alpine AS builder

WORKDIR /app

# Copy manifests for all workspaces so npm can resolve the monorepo graph
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/

RUN HUSKY=0 npm ci

# Copy source
COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend

RUN npm run build -w @rs-tandem/backend

# ---- Production stage ----
FROM node:22-alpine AS production

WORKDIR /app

# Reproduce workspace structure so npm links @rs-tandem/shared correctly
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/

RUN npm ci --omit=dev --ignore-scripts

# Compiled backend
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

# SQL migration files (read at runtime by node-pg-migrate)
COPY packages/backend/src/migrations ./packages/backend/src/migrations

# Shared TS source (needed for workspace symlink resolution; types are erased at runtime)
COPY packages/shared/src ./packages/shared/src

ENV NODE_ENV=production

EXPOSE 3000

# Run migrations then start the server
CMD sh -c "npm run migrate:up -w @rs-tandem/backend && exec node packages/backend/dist/backend/src/main.js"
