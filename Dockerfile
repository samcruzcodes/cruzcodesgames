# Use the official Node.js image as a base for the build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy the application files into the container
COPY . .

# Install dependencies using pnpm
RUN pnpm install

# Build your frontend (adjust this if your build command is different)
RUN pnpm run build

# Use an Nginx server to serve the built app
FROM nginx:stable-alpine

# Install Node.js in the Nginx stage
RUN apk add --no-cache nodejs npm

# Copy the build files from the builder stage to Nginx public directory
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy the start script into the image
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose the necessary ports
EXPOSE 80 443

# Run the start script
CMD ["/start.sh"]
