FROM node:18-alpine

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy all source files
COPY . .

# Verify file structure (debugging)
RUN ls -la && ls -la routes/

EXPOSE 5066

# Start the server using your server.js
CMD ["node", "server.js"]