# Build stage
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Clone QCNS repository
RUN apk add --no-cache git && \
    git clone https://github.com/qu-learn/QCNS public/QCNS

# Build the application
RUN pnpm build

# Production stage
FROM nginx:alpine

# Install envsubst (part of gettext package)
RUN apk add --no-cache gettext

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy QCNS files from builder
COPY --from=builder /app/public/QCNS /usr/share/nginx/html/QCNS

# Copy nginx configuration template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Expose port 3000
EXPOSE 3000
