// Print / PDF mode (?print): every section on its own 1920×1080 page, every bullet shown, the 3D hero
// replaced by its pre-rendered transparent still (public/fallbacks/, made by scripts/render-fallbacks.mjs).
import { renderSlide, slotOf, SLOTS } from './render.js';

export async function startPrint(deck) {
  const style = document.createElement('style');
  style.textContent = `@page { size: 1920px 1080px; margin: 0; }
    html, body { overflow: visible !important; height: auto !important; background: #fff; }
    .page { position: relative; width: 1920px; height: 1080px; overflow: hidden; page-break-after: always; break-after: page; }
    .page .slide, .page .ground, .page .giant-wrap, .page .fb-wrap { opacity: 1 !important; visibility: visible !important; transition: none !important; transform: none !important; }
    .page .layer { position: absolute; inset: 0; } .page .vig { position: absolute; inset: 0; background: radial-gradient(ellipse 75% 80% at 50% 45%, transparent 55%, rgba(2,5,11,.62) 100%); }
    .page .draw .stroke { animation: none !important; stroke-dashoffset: 0 !important; }
    .page .giant.metal { background: none !important; -webkit-background-clip: border-box !important; background-clip: border-box !important; color: #BAC5D3 !important; } /* Chrome prints clip-text gradients with a hairline box */
    .page .pnum { position: absolute; right: 34px; bottom: 18px; font-family: var(--f-display); font-size: 24px; color: #6b7a88; z-index: 9; }`;
  document.head.appendChild(style);
  document.body.className = 'printing';
  const only = new URLSearchParams(location.search).get('only');
  const list = only ? deck.slides.filter((s) => String(s.n) === only) : deck.slides;
  const pages = list.map((s) => {
    const r = renderSlide(s, deck);
    const slot = slotOf(s);
    let fb = '';
    if (slot) { const S = SLOTS[slot]; fb = `<div class="fb-wrap"><img alt="" src="/fallbacks/${s.hero3d}-${slot}.webp" style="position:absolute;left:${S.cx - S.w / 2}px;top:${S.cy - S.h / 2}px;width:${S.w}px;height:${S.h}px;object-fit:contain" onerror="this.remove()"></div>`; }
    return `<div class="page">${r.ground}<div class="layer">${r.giant}</div>${fb}${s.ground === 'night' ? '<div class="vig"></div>' : ''}<div class="layer">${r.content}</div><div class="pnum">${s.n} / ${deck.slides.length}</div></div>`;
  });
  document.body.innerHTML = pages.join('');
  document.querySelectorAll('.page').forEach((p) => p.querySelectorAll('.giant').forEach((g) => {
    const max = { gallery: 900, cycle: 860, hero: 760, cover: 1300, chapter: 1080 }[g.dataset.fit] || 1500;
    let fs = parseFloat(g.style.fontSize);
    for (let i = 0; i < 12 && g.scrollWidth > max; i++) { fs *= Math.max(0.6, max / g.scrollWidth); g.style.fontSize = fs + 'px'; }
  }));
  await Promise.all([...document.images].map((im) => (im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; }))));
  window.__printReady = true;
}
