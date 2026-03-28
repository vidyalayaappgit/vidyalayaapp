# Development stage
FROM node:18-alpine AS development

# Install dependencies for bcrypt (needs build tools)
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

# Copy package files first (for caching)
COPY package*.json ./
# Remove yarn.lock if using npm (your project uses npm)
# COPY yarn.lock ./  # Comment out or delete this line

# Install dependencies
RUN npm ci --only=development

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install bcrypt build deps (even in prod for native modules)
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production deps (smaller image)
RUN npm ci --only=production && npm cache clean --force

# Copy built app from dev stage
COPY --from=development /usr/src/app/dist ./dist

# Copy necessary non-code files
COPY .env.example ./
# Note: .env is gitignored - mount as volume in docker-compose

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start app
CMD ["node", "dist/main"]
