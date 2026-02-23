#!/bin/bash
# Fix Strapi v5 Media Upload "Internal Server Error" (Hero / any content type).
# Clears .tmp, optionally SQLite DB, fixes uploads folder permissions, then starts Strapi.
#
# Usage (from project root):
#   ./scripts/fix-uploads.sh
#   # If Strapi is in cms/ (default). Keeps DB; only clears .tmp + fixes uploads.
#
#   CMS_DIR=../my-strapi ./scripts/fix-uploads.sh
#   # If Strapi is in a sibling folder (e.g. my-strapi)
#
#   CLEAR_DB=1 ./scripts/fix-uploads.sh
#   # Also remove database.sqlite (resets all content and admin users)
#
set -e
CMS_DIR="${CMS_DIR:-cms}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
if [ ! -d "$CMS_DIR" ]; then
  echo "Strapi folder not found: $CMS_DIR (from $ROOT)"
  echo "Set CMS_DIR if Strapi is elsewhere, e.g. CMS_DIR=../my-strapi $0"
  exit 1
fi
cd "$CMS_DIR"
echo "Using Strapi at: $(pwd)"
rm -rf .tmp
if [ -n "${CLEAR_DB}" ]; then
  [ -f database.sqlite ] && rm -f database.sqlite && echo "Removed database.sqlite (full reset)."
fi
mkdir -p public/uploads
chmod -R 777 public/uploads
echo "Cleaned .tmp, set public/uploads permissions. Starting Strapi..."
exec npm run develop
