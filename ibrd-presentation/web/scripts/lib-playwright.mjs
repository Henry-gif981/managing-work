// Resolve Playwright from the project, NODE_PATH or the global npm folder (the cloud image pre-installs it globally).
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import path from 'node:path';
export async function loadPlaywright() {
  const req = createRequire(import.meta.url);
  try { return req('playwright'); } catch { /* not local */ }
  const g = execSync('npm root -g').toString().trim();
  return createRequire(path.join(g, 'noop.js'))('playwright');
}
