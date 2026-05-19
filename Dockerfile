# Root Dockerfile — builds the BACKEND service.
# Deploy the frontend as a separate Render Static Site or Web Service
# pointing its Root Directory to ./frontend

# ─── Build Stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .
RUN npm run build

# ─── Production Stage ─────────────────────────────────────────────────────────
FROM node:20-alpine AS production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY backend/package*.json ./

USER appuser

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/server.js"]
