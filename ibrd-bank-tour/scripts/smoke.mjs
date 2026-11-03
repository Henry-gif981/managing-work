// npm run test:smoke — opens the single-file build from file:// (normal mode), walks with the keyboard,
// toggles panels/modes, and fails on any console error.
import { ensureSingleBuild, launch } from './browser.mjs';

const url = ensureSingleBuild(process.argv.includes('--build'));
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(url);
await page.waitForFunction(() => window.__tour, null, { timeout: 30000 });
const state = () => page.evaluate(() => { const s = window.__tour.getState(); return `${s.index}/${s.beat} ${location.hash}`; });
console.log('start', await state());
await page.keyboard.press('ArrowRight'); // ext-facade -> ext-door (auto-advances)
await page.waitForFunction(() => window.__tour.getState().index === 2, null, { timeout: 20000 });
console.log('after door', await state());
for (const k of ['Space', 'PageDown', 'ArrowLeft', 'r', 'Escape', 'n', 'n', 'g', 'Escape', 'c', 'c', 'd', 'd', 'l', 'l', 'End', 'Home']) {
  await page.keyboard.press(k);
  await page.waitForTimeout(250);
}
console.log('after keys', await state());
await page.evaluate(() => { location.hash = '#f3-tep-outputs/2'; });
await page.waitForTimeout(1500);
console.log('hash jump', await state());
await page.reload();
await page.waitForFunction(() => window.__tour, null, { timeout: 30000 });
console.log('after reload', await state());
await browser.close();
if (errors.length) {
  console.error('console errors:\n' + errors.join('\n'));
  process.exit(1);
}
console.log('smoke OK: no console errors');
