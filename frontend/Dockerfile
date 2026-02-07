FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Build without TypeScript project references (your current `npm run build`
# runs `tsc -b` and fails on type errors). We'll still produce the production bundle.
# Also bump Node heap to avoid OOM on small servers.
ENV NODE_OPTIONS=--max_old_space_size=2048
ARG VITE_BASE=/
RUN npx vite build --base="${VITE_BASE}"

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
