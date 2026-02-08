FROM node:20-alpine AS build

# Set working directory
WORKDIR /app/frontend

# Copy package files for dependency installation
COPY frontend/package.json ./
COPY frontend/package-lock.json* ./

# Install dependencies
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy all source files
COPY frontend/ ./

# Run TypeScript check first to see errors
RUN npx tsc --noEmit || true

# Build the application
RUN npm run build

FROM nginx:1.27-alpine

COPY deploy/nginx/nginx.conf /etc/nginx/nginx.conf
COPY deploy/nginx/site.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/frontend/dist /usr/share/nginx/html

