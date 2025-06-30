# Use Node.js 20.18.1 LTS - Build stage
FROM node:20.18.1-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci --no-audit --no-fund

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20.18.1-alpine AS runner

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --no-audit --no-fund --ignore-scripts

# Copy built application from builder stage
COPY --from=builder /app/.output /app/.output

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]