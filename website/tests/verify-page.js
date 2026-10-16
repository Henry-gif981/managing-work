// Kiểm tra trang: mọi [data-v] hiển thị đúng số trong data.js (định dạng VN), không lỗi console,
// không tràn ngang, không còn "NaN"/"undefined". Chạy: NODE_PATH=$(npm root -g) node website/tests/verify-page.js
const path = require('path');
const { chromium } = require('playwright');
global.window = {};
require(path.join(__dirname, '../js/data.js'));
const D = window.DATA;
const get = p => p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), D);
// Bộ định dạng độc lập (BigInt cho số đồng)
function expected(p, d, s) {
  const v = get(p);
  if (d == null) d = p.startsWith('hp.') || /pct|tyLe|ratio/i.test(p) ? 1 : 3;
  if (s === 'dong') s = 'none';
  if (!s) s = p.startsWith('bq.') && Number.isInteger(v) && Math.abs(v) >= 1e6 ? 'ty' : 'none';
  let n;
  if (s === 'ty' || s === 'trieu') {
    const div = 10n ** BigInt((s === 'ty' ? 9 : 6) - d);
    const big = BigInt(Math.abs(v));
    n = big / div + ((big % div) * 2n >= div ? 1n : 0n);
  } else n = BigInt(Math.round(Math.abs(v) * 10 ** d));
  let str = n.toString().padStart(d + 1, '0');
  const ip = d ? str.slice(0, -d) : str, fp = d ? str.slice(-d) : '';
  return (v < 0 ? '−' : '') + ip.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (fp ? ',' + fp : '');
}
(async () => {
  const browser = await chromium.launch();
  let fail = 0;
  for (const vp of [{ w: 1440, h: 900, name: 'desktop' }, { w: 390, h: 844, name: 'mobile' }]) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    const errors = [];
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto('file://' + path.join(__dirname, '..', process.env.PAGE || 'index.html'), { waitUntil: 'load' });
    await page.evaluate(() => window.__finalize());
    const items = await page.$$eval('[data-v]', els => els.map(e => ({ p: e.getAttribute('data-v'), d: e.getAttribute('data-d'), s: e.getAttribute('data-s'), t: e.textContent })));
    let bad = 0;
    for (const it of items) {
      const exp = expected(it.p, it.d == null ? null : +it.d, it.s);
      if (it.t !== exp) { bad++; console.log(`  SAI ${it.p}: "${it.t}" ≠ "${exp}"`); }
    }
    const texts = await page.$$eval('[data-t]', els => els.map(e => ({ p: e.getAttribute('data-t'), t: e.textContent })));
    for (const it of texts) if (it.t !== String(get(it.p))) { bad++; console.log(`  SAI chữ ${it.p}`); }
    const body = await page.evaluate(() => document.body.innerText);
    if (/NaN|undefined|Infinity/.test(body)) { bad++; console.log('  Có NaN/undefined trên trang'); }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) { bad++; console.log(`  Tràn ngang ${overflow}px`); }
    const realErr = errors.filter(e => !/fonts\.g/.test(e));
    if (realErr.length) { bad++; console.log('  Lỗi console:', realErr); }
    console.log(`${vp.name}: ${items.length} số + ${texts.length} chữ kiểm tra, ${bad} lỗi${errors.length - realErr.length ? ' (bỏ qua lỗi tải font)' : ''}`);
    fail += bad;
    await page.screenshot({ path: path.join(process.argv[2] || '/tmp', `full-${vp.name}.png`), fullPage: true });
    await page.close();
  }
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
