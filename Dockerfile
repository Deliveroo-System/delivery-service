<<<<<<< HEAD
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

# (Optional) Verify the file structure (for debugging only, you can remove this in final version)
# RUN ls -la && ls -la routes/


ENV NODE_ENV=production
ENV PORT=5066

# Expose the app port
EXPOSE 5066

# Start the app
CMD ["node", "server.js"]
=======
# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "backend/server.js"]
>>>>>>> del-new-1
