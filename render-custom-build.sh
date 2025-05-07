#!/bin/bash
# Exit on any error
set -e

# Install all dependencies
echo "Installing dependencies..."
npm ci

# Explicitly install all potentially problematic dev dependencies
npm install --no-save @vitejs/plugin-react @replit/vite-plugin-cartographer @replit/vite-plugin-runtime-error-modal vite

# Build the client side manually
echo "Building client..."
cd client
npx vite build
cd ..

# Build the server side
echo "Building server..."
npx esbuild server/index.ts --bundle --platform=node --outfile=dist/index.js --external:express --external:vite

# Copy necessary files
echo "Copying files..."
mkdir -p dist/client
cp -r client/dist/* dist/client/

# Run migrations if needed
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running migrations..."
  npx drizzle-kit push
fi

echo "Build completed successfully!"