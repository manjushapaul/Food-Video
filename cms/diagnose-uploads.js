#!/usr/bin/env node
/**
 * Strapi v5 upload diagnostic – run from cms folder: node diagnose-uploads.js
 * Checks: permissions, DB, uploads folder, .tmp, .cache.
 */
const fs = require('fs');
const path = require('path');

const cmsRoot = path.resolve(__dirname);
const dirs = ['public/uploads', '.tmp', '.cache'];
const dbFile = 'database.sqlite';

function statSafe(p) {
  try {
    return fs.statSync(p);
  } catch (e) {
    return null;
  }
}

function modeStr(mode) {
  if (mode == null) return 'N/A';
  return (mode & 0o777).toString(8);
}

function checkWritable(dirPath) {
  try {
    const testFile = path.join(dirPath, '.write-test-' + Date.now());
    fs.writeFileSync(testFile, '');
    fs.unlinkSync(testFile);
    return true;
  } catch {
    return false;
  }
}

console.log('Strapi upload diagnostic (run from cms folder)\n');
console.log('CMS root:', cmsRoot);
console.log('');

// 1. Folders
console.log('--- Folders ---');
for (const d of dirs) {
  const full = path.join(cmsRoot, d);
  const st = statSafe(full);
  if (!st) {
    console.log(`  ${d}: MISSING`);
    continue;
  }
  const mode = st.isDirectory() ? modeStr(st.mode) : 'not a dir';
  const writable = st.isDirectory() ? checkWritable(full) : false;
  console.log(`  ${d}: exists, mode=${mode}, writable=${writable}`);
}
console.log('');

// 2. Database
console.log('--- Database ---');
const dbPath = path.join(cmsRoot, dbFile);
const dbStat = statSafe(dbPath);
if (!dbStat) {
  console.log(`  ${dbFile}: not found (OK if fresh install)`);
} else {
  const readable = (dbStat.mode & 0o444) !== 0;
  console.log(`  ${dbFile}: exists, size=${dbStat.size}, readable=${readable}`);
}
console.log('');

// 3. package.json (Strapi project)
const pkgPath = path.join(cmsRoot, 'package.json');
const hasPkg = statSafe(pkgPath);
console.log('--- Project ---');
console.log('  package.json:', hasPkg ? 'found' : 'MISSING');
if (hasPkg) {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    console.log('  name:', pkg.name);
    console.log('  strapi:', pkg.dependencies?.['@strapi/strapi'] || 'not found');
  } catch (e) {
    console.log('  (could not read package.json)');
  }
}
console.log('');

// 4. Recommendations
console.log('--- Recommendations ---');
const uploadsPath = path.join(cmsRoot, 'public/uploads');
const uploadsStat = statSafe(uploadsPath);
if (!uploadsStat || !uploadsStat.isDirectory()) {
  console.log('  Create uploads: mkdir -p public/uploads');
}
if (uploadsStat && !checkWritable(uploadsPath)) {
  console.log('  Fix uploads permissions: chmod -R 755 public/uploads (or 777 for local dev)');
}
if (!statSafe(path.join(cmsRoot, '.tmp'))) {
  console.log('  .tmp will be created on first run.');
}
console.log('  If uploads still fail: run fix-local.sh, then restart Strapi.');
console.log('');
