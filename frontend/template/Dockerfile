# ─── Practical 11: Frontend Multi-Stage Dockerfile ───

# Stage 1: Build React/Vite application
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies using package-lock.json
COPY package*.json ./
RUN npm ci

# Copy frontend source code
COPY . .

# Build production distribution bundle
RUN npm run build

# Stage 2: Production web server using lightweight Nginx
FROM nginx:alpine

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration supporting React Router SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

