#!/bin/bash
# Strapi v5 Hero single type – fix Media upload "Internal Server Error" (local quickstart).
# Run from project root (parent of cms).
set -e
cd "$(dirname "$0")/cms" || { echo "cms/ not found. Run from project root."; exit 1; }
rm -rf .tmp database.sqlite
mkdir -p public/uploads
chmod -R 777 public/uploads .cache .tmp 2>/dev/null || true
mkdir -p .tmp .cache
chmod -R 777 public/uploads .cache .tmp
echo "Cleaned .tmp and DB, set permissions. Starting Strapi..."
exec npm run develop
