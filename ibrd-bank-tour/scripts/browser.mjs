// Shared Playwright launcher: uses the pre-installed Chromium, software GL is fine.
import { createRequire } from 'node:module';
// Resolve playwright from the project, or from the globally installed copy (NODE_PATH).
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export const SINGLE = path.join(ROOT, 'dist-single', 'index.html');

export function ensureSingleBuild(force = process.argv.includes('--build')) {
  if (force || !fs.existsSync(SINGLE)) {
    console.log('building single-file bundle…');
    execSync('npm run build:single', { cwd: ROOT, stdio: 'inherit' });
  }
  return pathToFileURL(SINGLE).href;
}

export async function launch() {
  return chromium.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'],
  });
}
