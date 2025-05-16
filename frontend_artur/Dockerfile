# Use lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy all frontend files
COPY . .

# Install a simple static server
RUN npm install -g http-server

# Expose frontend dev port
EXPOSE 6565

# Serve static files
CMD ["http-server", ".", "-p", "6565", "-s"]