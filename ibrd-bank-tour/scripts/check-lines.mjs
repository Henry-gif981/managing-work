// npm run check-lines [-- --only=id,id] [-- --sizes=1920x1080,1366x768]
// Steps through EVERY beat of EVERY scene in 3D mode and checks that no leader line (sampled every 4 px)
// passes through a text rectangle (4 px padding) or the HUD. Writes docs/line-overlaps.md; exits 1 on any hit.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ensureSingleBuild, launch } from './browser.mjs';

const url = ensureSingleBuild(process.argv.includes('--build'));
const only = (process.argv.find((a) => a.startsWith('--only=')) ?? '').slice(7).split(',').filter(Boolean);
const sizes = ((process.argv.find((a) => a.startsWith('--sizes=')) ?? '').slice(8) || '1920x1080,1366x768').split(',').map((s) => s.split('x').map(Number));

const browser = await launch();
const hits = [];
let checkedLines = 0, checkedBeats = 0, pinBeats = [];
for (const [W, H] of sizes) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto(url + (process.argv.includes('--legacy') ? '?shot=1&legacylines=1' : '?shot=1') + '#ext-facade/1');
  await page.waitForFunction(() => window.__tour && window.__scenes, null, { timeout: 60000 });
  // Details mode: detail beats (out of the main flow) are reachable too, so every beat is checked
  await page.evaluate(() => window.__edit?.store.getState().setDetails(true));
  const scenes = await page.evaluate(() => window.__scenes);
  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    if (only.length && !only.includes(s.id)) continue;
    for (let b = 0; b < Math.max(1, s.beats); b++) {
      const seq = await page.evaluate(([i, b]) => { window.__tour.getState().goto(i, b, 'jump'); return window.__tour.getState().navSeq; }, [i, b]);
      await page.waitForFunction((q) => window.__tourSettled === q, seq, { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(250);
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))));
      const res = await page.evaluate(() => {
        const PAD = 4;
        const design = document.querySelector('.design');
        const m = design.getBoundingClientRect();
        const sc = m.width / 1920;
        const toClient = ([x, y]) => [m.left + x * sc, m.top + y * sc];
        const geos = window.__calloutGeo || [];
        const out = { lines: 0, pins: 0, hits: [] };
        const textRects = (exclude) => {
          const rects = [];
          const walker = document.createTreeWalker(design, NodeFilter.SHOW_TEXT);
          const range = document.createRange();
          for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            const p = n.parentElement;
            if (!p || !n.textContent.trim() || p.closest('svg.callouts')) continue;
            if (exclude && exclude.contains(p)) continue;
            range.selectNodeContents(n);
            for (const r of range.getClientRects()) if (r.width >= 1 && r.height >= 1) rects.push({ r, text: n.textContent.trim().slice(0, 40), kind: 'text' });
          }
          for (const el of document.querySelectorAll('.hud .tracker, .hud .floors, .hud .scene-info, .hud .counter')) rects.push({ r: el.getBoundingClientRect(), text: el.className, kind: 'HUD' });
          return rects;
        };
        for (const g of geos) {
          if (g.mode === 'pins') { out.pins++; continue; }
          if (g.mode !== 'line' || g.points.length < 2) continue;
          out.lines++;
          let src = document.querySelector(g.from);
          if (src && (src.classList.contains('k-card') || src.classList.contains('k-titlecard'))) src = src.querySelector(':scope > .card') || src;
          const rects = textRects(src);
          const pts = g.points.map(toClient);
          const pad = PAD * sc;
          const seen = new Set();
          for (let k = 0; k < pts.length - 1; k++) {
            const [ax, ay] = pts[k], [bx, by] = pts[k + 1];
            const L = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.ceil(L / 4));
            for (let j = 0; j <= n; j++) {
              const x = ax + ((bx - ax) * j) / n, y = ay + ((by - ay) * j) / n;
              for (const t of rects) {
                if (x >= t.r.left - pad && x <= t.r.right + pad && y >= t.r.top - pad && y <= t.r.bottom + pad) {
                  const key = t.text + t.kind;
                  if (!seen.has(key)) { seen.add(key); out.hits.push({ line: `${g.from} → ${g.to.split(':').pop()}`, text: t.text, kind: t.kind }); }
                }
              }
            }
          }
        }
        return out;
      });
      checkedBeats++;
      checkedLines += res.lines;
      if (res.pins) pinBeats.push(`${s.id} b${b + 1} (${W}x${H})`);
      for (const h of res.hits) hits.push({ size: `${W}x${H}`, scene: s.id, beat: b + 1, ...h });
      if (res.hits.length) console.log(`✗ ${W}x${H} ${s.id} b${b + 1}: ${res.hits.map((h) => `"${h.text}"`).join(', ')}`);
    }
  }
  await page.close();
}
await browser.close();
let md = `# Leader-line overlaps\n\nGenerated by \`npm run check-lines\`: every beat of every scene in 3D mode at ${sizes.map((s) => s.join('×')).join(' and ')}. Each line is sampled every 4 px and tested against the client rectangles of all text nodes (except inside the line's own source element) with 4 px padding, and against the HUD.\n\n`;
md += `Checked ${checkedBeats} beat views, ${checkedLines} drawn lines. Beats that use the numbered-pin fallback: ${pinBeats.length ? pinBeats.join(', ') : 'none'}.\n\n`;
md += hits.length ? `| Size | Scene | Beat | Line | Text hit |\n|---|---|---|---|---|\n` + hits.map((h) => `| ${h.size} | \`${h.scene}\` | ${h.beat} | ${h.line} | ${h.kind}: ${h.text.replace(/\|/g, '/')} |`).join('\n') + '\n' : `**Result: 0 overlaps.**\n`;
fs.writeFileSync(path.join(ROOT, 'docs', process.argv.includes('--legacy') ? 'line-overlaps-before.md' : 'line-overlaps.md'), md);
console.log(`\n${checkedBeats} beat views, ${checkedLines} lines, ${pinBeats.length} pin fallbacks, ${hits.length} overlap(s).`);
process.exit(hits.length ? 1 : 0);
