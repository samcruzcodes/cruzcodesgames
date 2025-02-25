#!/bin/sh

# Debugging the directory structure to check if the file exists
echo "Checking directory structure..."
ls -R /app/backend

# Start backend in the background
node /app/backend/dist/server.js &

# Start Nginx in the foreground
exec nginx -g "daemon off;"
