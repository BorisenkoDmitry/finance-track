#!/bin/sh
# Script to check frontend build locally before Docker

cd ../frontend

echo "=== Checking Node version ==="
node --version
npm --version

echo ""
echo "=== Installing dependencies ==="
npm ci --legacy-peer-deps || npm install --legacy-peer-deps

echo ""
echo "=== Running TypeScript check ==="
npx tsc --noEmit || echo "TypeScript check completed with warnings"

echo ""
echo "=== Running build ==="
npm run build

echo ""
echo "=== Build completed! ==="
