# Use stable Node.js version (avoid "latest" to prevent breaking changes)
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Expose the default React port
EXPOSE 3000

# Start React app, forcing it to listen on all network interfaces
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
# Use stable Node.js version (avoid "latest" to prevent breaking changes)
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Expose the default React port
EXPOSE 3000

# Start React app, forcing it to listen on all network interfaces
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
