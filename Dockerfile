# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the AdonisJS app (compiles TS + Vite frontend)
RUN node ace build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/build ./
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

EXPOSE 3333

CMD ["node", "bin/server.js"]