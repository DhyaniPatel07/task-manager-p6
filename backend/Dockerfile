# ─── Practical 11: Backend Dockerfile ───
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install dependencies using package.json and package-lock.json
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 5000

# Use non-root node user for container security
USER node

# Start the Express server
CMD ["node", "server.js"]

