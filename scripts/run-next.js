#!/usr/bin/env node
/**
 * Run Next.js CLI with the project directory set to this repo root.
 * Fixes "Invalid project directory provided, no such directory" when
 * cwd or NEXT_PRIVATE_DEV_DIR is wrong.
 */
const path = require('path');
const { spawnSync } = require('child_process');

const projectDir = path.resolve(__dirname, '..');
const args = process.argv.slice(2); // e.g. ['dev'] or ['build', '--turbo', ...]
const nextBin = require.resolve('next/dist/bin/next');
// Insert project dir as first positional (after command) so next always uses this repo
const nextArgs = args.length ? [args[0], projectDir, ...args.slice(1)] : [projectDir];

const result = spawnSync(
  process.execPath,
  [nextBin, ...nextArgs],
  {
    stdio: 'inherit',
    cwd: projectDir,
    env: { ...process.env, NEXT_PRIVATE_DEV_DIR: projectDir },
  }
);
process.exit(result.status ?? 1);
