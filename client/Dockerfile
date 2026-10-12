# ==========================================
# Multi-Stage Dockerfile for AI ChatBot Client
# ==========================================

# ── Stage 1: Build Stage ──────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy configuration and source files
COPY . .

# Build-time environment variables for Vite
ARG VITE_BACKEND_URI=http://localhost:5500
ARG VITE_APP_NAME="AI ChatBot"

ENV VITE_BACKEND_URI=${VITE_BACKEND_URI}
ENV VITE_APP_NAME=${VITE_APP_NAME}

# Compile and optimize production bundle
RUN npm run build

# ── Stage 2: Production Nginx Server ──────
FROM nginx:alpine AS runner

# Remove default boilerplate files
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled SPA static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA routing and caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard HTTP port
EXPOSE 80

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
