#!/usr/bin/env bash
# Build script for deploying Kubra Market Admin to Render

# Exit on error
set -e 

# Output commands for debugging
set -x

# Install all dependencies (including dev dependencies for the build process)
echo "Installing all dependencies..."
npm install

# Build the frontend and backend
echo "Building the application..."
npm run build

# Run database migrations if RUN_MIGRATIONS is set to true
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running database migrations..."
  npx drizzle-kit push
fi

echo "Build completed successfully!"