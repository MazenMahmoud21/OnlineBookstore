# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install when package-lock.json is not present)
# `npm ci` requires a lockfile; many projects don't commit one. Using
# `npm install --omit=dev` avoids failing the image build in that case.
RUN npm install --omit=dev --no-audit --no-fund

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
