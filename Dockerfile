# Root Dockerfile — builds the BACKEND service.
# Deploy the frontend as a separate Render Static Site or Web Service
# pointing its Root Directory to ./frontend

# ─── Build Stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./
# Install ALL deps (including devDeps — tsc lives here)
RUN npm ci

COPY backend/ .
RUN npm run build

# ─── Production Stage ─────────────────────────────────────────────────────────
FROM node:20-alpine AS production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY backend/package*.json ./
# Install only production deps in the final image
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

USER appuser

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/server.js"]
