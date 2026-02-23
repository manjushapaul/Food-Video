#!/usr/bin/env bash
# Create a Strapi v5 app (must run in your terminal – interactive prompts required).
#
# Usage:
#   ./scripts/create-strapi.sh
#   # Or from project root: bash scripts/create-strapi.sh
#
# When prompted:
#   1. Choose "Skip" (don't log in to Strapi Cloud).
#   2. Answer "N" for anonymous A/B testing if asked.
#
# The app will be created in ../my-strapi (sibling to Food-Video).
# To create inside this project instead, change DIR to: ./my-strapi

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DIR="$(cd "$PROJECT_ROOT/.." && pwd)/my-strapi"

echo "Creating Strapi v5 app at: $DIR"
echo "When prompted: choose Skip, then N for A/B testing."
echo ""

cd "$PROJECT_ROOT/.."
npx create-strapi-app@latest my-strapi --quickstart

echo ""
echo "Done. Start Strapi with: cd $DIR && npm run develop"
echo "Then open http://localhost:1337/admin and create your admin user."
