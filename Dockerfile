# Multi-stage build to create a production bundle for the Directorybuilder app
FROM node:20-bookworm-slim AS base

# Install core dependencies used by both stages
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base AS builder

# Install dependencies first to leverage Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the project and build the client + server bundles
COPY . .
RUN npm run build

# Production image
FROM base AS runner
ENV NODE_ENV=production

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the compiled application
COPY --from=builder /app/dist ./dist

# Port expected by the app (overridable via PORT env)
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/index.js"]
