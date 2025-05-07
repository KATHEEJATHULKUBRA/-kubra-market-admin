#!/bin/bash
# Exit on any error
set -e

# Install all dependencies including dev dependencies
echo "Installing dependencies..."
npm ci

# Explicitly install ALL build-related packages
npm install --no-save @vitejs/plugin-react autoprefixer postcss tailwindcss @tailwindcss/typography @tailwindcss/vite tailwindcss-animate vite @replit/vite-plugin-cartographer @replit/vite-plugin-runtime-error-modal

# Build the client and server
echo "Building application..."
npm run build

# Run migrations if needed
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running migrations..."
  npx drizzle-kit push
fi

echo "Build completed successfully!"