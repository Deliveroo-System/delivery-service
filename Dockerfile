# Use a slim, secure Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Only copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy the rest of the source code
COPY . .

# Copy .env file into the image
COPY .env .env

# Set environment variables
ENV NODE_ENV=production

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
