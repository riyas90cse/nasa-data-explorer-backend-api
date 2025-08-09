# Multi-stage Dockerfile
# @see https://docs.docker.com/develop/develop-images/multistage-build/

# 1) Builder stage: install deps (including dev), compile TypeScript
FROM node:20-alpine AS builder
WORKDIR /app

# Install OS deps required for builds (optional, keep minimal)
RUN apk add --no-cache libc6-compat

# Copy lockfiles/package and tsconfig first to leverage layer caching
COPY package*.json tsconfig.json ./

# Install all dependencies (prod + dev)
RUN npm ci

# Copy source
COPY src ./src

# Build TypeScript -> dist
RUN npm run build


# 1b) Development stage: run with ts-node/nodemon and live reload
FROM node:20-alpine AS dev
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json tsconfig.json ./

# Install all deps (dev included) for local development
RUN npm ci

# Copy source (will be overridden by bind mount in docker-compose dev profile)
COPY src ./src

EXPOSE 8000

# Default command for dev. You can override in compose.
CMD ["npm", "run", "dev"]


# 2) Runner stage: production-only runtime, non-root user
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only the files we need at runtime
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create a non-root user and use it
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs
USER nodeuser

# The app listens on 8000 (see src/index.ts)
EXPOSE 8000

# Healthcheck (optional, keeps container monitored by orchestrators)
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:8000/health || exit 1

# Start the server
CMD ["node", "dist/index.js"]