// Presentation engine: fixed 1920×1080 stage, step-by-step bullets, keyboard/hash/swipe navigation,
// presenter notes, overview, table of contents, source drawer and the lazily loaded 3D layer.
import { renderSlide, slotOf, SLOTS } from './render.js';
import { createDrawer } from './drawer.js';
import { toHTML } from '../lib/markup.js';

const KEY_PARTS = ['intro', 'ch1a', 'ch2', 'ch3', 'tep', 'ccsep', 'lessons', 'concl', 'back'];
const store = {
  get(k, d) { try { const v = localStorage.getItem('ibrd.' + k); return v == null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('ibrd.' + k, v); } catch { /* private mode: keep in memory only */ } },
};
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function startDeck(deck) {
  window.__deckData = deck;
  const N = deck.slides.length;
  const params = new URLSearchParams(location.search);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = {
    n: 1, step: 0,
    stepMode: params.get('steps') || store.get('stepMode', 'step'),
    preset: params.get('preset') || store.get('preset', 'full'),
    three: params.get('3d') !== '0' && store.get('three', '1') === '1',
    autoLight: false,
  };
  const built = new Map(); // n -> {ground, giant, content, steps}

  // ----------------------------------------------------------------------------- DOM scaffold
  document.body.innerHTML = `
  <div id="viewport"><div id="stage" role="application" aria-roledescription="presentation">
    <div class="layer" id="l-ground"></div><div class="layer" id="l-giant"></div>
    <canvas id="gl" aria-hidden="true"></canvas><div class="layer" id="l-fallback"></div>
    <div class="layer" id="l-vignette"></div><div class="layer" id="l-content"></div>
    <div class="layer" id="l-ui">
      <div class="progress"><i></i></div><div class="counter" aria-live="polite"></div>
      <button class="chip light" type="button" title="3D was lightened automatically because frames were slow">Chế độ nhẹ · bật lại đầy đủ</button>
      <div class="chrome" role="toolbar" aria-label="Presenter controls">
        <button type="button" data-act="toc" title="Table of contents">☰ Contents</button>
        <button type="button" data-act="prev" title="Previous (←)">◀</button><button type="button" data-act="next" title="Next (→ / Space)">▶</button>
        <span class="seg"><button type="button" data-steps="step">Từng bước</button><button type="button" data-steps="all">Hiện hết</button></span>
        <span class="seg"><button type="button" data-preset="full">3D đầy đủ</button><button type="button" data-preset="light">3D nhẹ</button><button type="button" data-preset="static">Ảnh tĩnh</button></span>
        <button type="button" data-act="three" title="Toggle 3D (T)">3D on/off</button>
        <span class="spacer"></span>
        <button type="button" data-act="notes" title="Speaker notes (N)">Notes</button><button type="button" data-act="overview" title="Overview (G)">Overview</button>
        <button type="button" data-act="read" title="Reading mode">Read</button><button type="button" data-act="full" title="Fullscreen (F)">Fullscreen</button><button type="button" data-act="help" title="Keys (?)">?</button>
      </div>
      <div class="toc-menu" role="menu"></div>
      <div class="notes" role="region" aria-label="Speaker notes"></div>
      <div class="overview" role="dialog" aria-label="Overview"></div>
      <div class="help" role="dialog" aria-label="Keyboard shortcuts"><h3>Keys</h3><div class="cols">
        <kbd>→</kbd> <kbd>Space</kbd> next bullet / section<br><kbd>←</kbd> back<br><kbd>Home</kbd> <kbd>End</kbd> first / last<br><kbd>1</kbd>–<kbd>9</kbd> jump to a chapter<br><kbd>G</kbd> overview grid<br><kbd>N</kbd> speaker notes (verbatim paper)<br>
        <kbd>F</kbd> fullscreen<br><kbd>T</kbd> 3D on / off<br><kbd>S</kbd> step-by-step / show all<br><kbd>R</kbd> reading mode<br><kbd>Esc</kbd> close panel or source card<br>Click any red <b>[n]</b> to open its source.</div></div>
      <div class="scrim"></div>
    </div>
  </div></div>`;
  const $ = (q) => document.querySelector(q);
  const stage = $('#stage');
  const L = { ground: $('#l-ground'), giant: $('#l-giant'), content: $('#l-content'), fallback: $('#l-fallback') };
  const ui = { counter: $('.counter'), bar: $('.progress i'), notes: $('.notes'), overview: $('.overview'), toc: $('.toc-menu'), help: $('.help'), chip: $('.chip.light'), scrim: $('.scrim') };

  // ----------------------------------------------------------------------------- scale to fit (letterbox)
  let scale = 1;
  const fit = () => {
    scale = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `translate(${-960 * scale}px, ${-540 * scale}px) scale(${scale})`;
    three?.resize(scale);
  };
  addEventListener('resize', fit);

  // ----------------------------------------------------------------------------- windowed rendering (current ± 1)
  function build(n) {
    if (n < 1 || n > N) return null;
    if (built.has(n)) return built.get(n);
    const s = deck.slides[n - 1];
    const r = renderSlide(s, deck);
    const make = (html, parent) => { if (!html) return null; const t = document.createElement('template'); t.innerHTML = html.trim(); const el = t.content.firstElementChild; parent.appendChild(el); return el; };
    const nodes = { ground: make(r.ground, L.ground), giant: make(r.giant, L.giant), content: make(r.content, L.content), steps: r.steps, fb: null };
    const slot = slotOf(s);
    if (slot) {
      const S = SLOTS[slot];
      nodes.fb = make(`<div class="fb-wrap" data-n="${n}"><img alt="" decoding="async" src="/fallbacks/${s.hero3d}-${slot}.webp" style="left:${S.cx - S.w / 2}px;top:${S.cy - S.h / 2}px;width:${S.w}px;height:${S.h}px"></div>`, L.fallback);
      nodes.fb.querySelector('img').onerror = function () { this.remove(); };
    }
    fitGiant(nodes.giant);
    built.set(n, nodes);
    return nodes;
  }
  function fitGiant(wrap) {
    const g = wrap?.firstElementChild;
    if (!g) return;
    const max = { gallery: 900, cycle: 860, hero: 760, cover: 1300, chapter: 1080, thanks: 1700 }[g.dataset.fit] || 1500;
    let fs = parseFloat(g.style.fontSize);
    for (let i = 0; i < 12 && g.scrollWidth > max; i++) { fs *= Math.max(0.6, max / g.scrollWidth); g.style.fontSize = fs + 'px'; }
  }
  function prune() {
    for (const [n, nodes] of built) {
      if (Math.abs(n - state.n) <= 1) continue;
      for (const k of ['ground', 'giant', 'content', 'fb']) nodes[k]?.remove();
      built.delete(n);
    }
  }
  const stepsOf = (n) => (state.stepMode === 'all' ? 0 : build(n).steps);

  // ----------------------------------------------------------------------------- show section n at step k
  let three = null;
  function go(n, step = 0, dir = 1) {
    n = Math.max(1, Math.min(N, n));
    const prevN = state.n;
    const changed = n !== prevN || !built.get(n)?.content?.classList.contains('is-current');
    state.n = n;
    state.step = Math.max(0, Math.min(step, stepsOf(n)));
    const cur = build(n);
    if (changed) {
      for (const [m, nodes] of built) for (const k of ['ground', 'giant', 'content', 'fb']) {
        const el = nodes[k]; if (!el) continue;
        if (m === n) { el.classList.remove('enter-fwd', 'enter-back'); if (k === 'content' && m !== prevN) { el.classList.add(dir >= 0 ? 'enter-fwd' : 'enter-back'); el.getBoundingClientRect(); el.classList.remove('enter-fwd', 'enter-back'); } el.classList.add('is-current'); }
        else el.classList.remove('is-current');
      }
      build(n + 1); build(n - 1); prune();
      const s = deck.slides[n - 1];
      document.body.classList.toggle('on-night', s.ground === 'night');
      document.body.classList.toggle('on-wash', s.ground === 'wash');
      $('#l-vignette').classList.toggle('on', s.ground === 'night');
      ui.counter.textContent = `${n} / ${N}`;
      ui.bar.style.width = (100 * n) / N + '%';
      history.replaceState(null, '', `#/${n}`);
      renderNotes();
      updateFallback();
    }
    applyStep();
  }
  function applyStep() {
    const nodes = built.get(state.n);
    const c = nodes.content;
    const stepping = state.stepMode !== 'all' && nodes.steps > 0;
    c.classList.toggle('stepping', stepping);
    c.querySelectorAll('[data-step]').forEach((el) => {
      const k = Number(el.dataset.step);
      el.classList.toggle('shown', !stepping || k <= state.step);
      el.classList.toggle('hl', stepping && k === state.step);
    });
    const s = deck.slides[state.n - 1];
    let car = 0;
    if (s.carousel) {
      car = Math.max(0, Math.min(s.carousel.length - 1, (state.step || 1) - 1));
      c.querySelectorAll('[data-car]').forEach((b) => b.classList.toggle('on', Number(b.dataset.car) === car));
      const g = nodes.giant?.firstElementChild; if (g) { g.textContent = s.carousel[car]; }
    }
    if (three && state.three && state.preset !== 'static') three.show(s, { step: state.step, carousel: car, stepping });
  }
  const next = () => { if (state.step < stepsOf(state.n)) { state.step++; applyStep(); } else if (state.n < N) go(state.n + 1, 0, 1); };
  const prev = () => { if (state.step > 0) { state.step--; applyStep(); } else if (state.n > 1) go(state.n - 1, stepsOf(state.n - 1), -1); };

  // ----------------------------------------------------------------------------- notes, overview, toc
  function renderNotes() {
    const s = deck.slides[state.n - 1];
    const body = s.notes.length ? s.notes.map((nt) => `<h5>${esc(nt.label)}${nt.page ? ` <span class="pg">· PDF p. ${nt.page}</span>` : ''}</h5>${nt.paras.map((p) => `<p>${toHTML(p.text)}</p>`).join('')}`).join('')
      : '<p class="pg">No paper text attached to this section (title or navigation section).</p>';
    ui.notes.innerHTML = `<h5>Speaker notes · section ${s.n} — verbatim from the paper</h5>${body}`;
  }
  function renderOverview() {
    let html = '<h2>Overview · click a section</h2>';
    let part = null;
    for (const s of deck.slides) {
      if (s.part !== part) { if (part) html += '</div>'; part = s.part; html += `<div class="ov-part">${esc(deck.parts[part].label)}</div><div class="ov-grid">`; }
      html += `<button type="button" data-goto="${s.n}" class="${s.ground}${s.n === state.n ? ' cur' : ''}"><b>${s.n}</b><span>${esc((s.title || (s.tpl === 'cover' ? 'Cover' : s.tpl === 'thanks' ? 'Thank you' : s.quote ? 'Quote' : '')).replace(/\*\*/g, ''))}</span><em>${s.tpl}</em></button>`;
    }
    ui.overview.innerHTML = html + '</div>';
  }
  ui.toc.innerHTML = Object.entries(deck.parts).map(([k, p]) => `<button type="button" role="menuitem" data-goto="${deck.partStart[k]}"><b>${KEY_PARTS.indexOf(k) + 1 || ''}</b><span>${esc(p.label)}</span><em>${deck.partStart[k]}</em></button>`).join('');
  const panels = { notes: ui.notes, overview: ui.overview, toc: ui.toc, help: ui.help };
  const toggle = (name, on) => {
    const el = panels[name]; const v = on ?? !el.classList.contains('on');
    if (name === 'overview' && v) renderOverview();
    el.classList.toggle('on', v);
  };
  const closePanels = () => { let any = false; for (const k in panels) if (panels[k].classList.contains('on')) { panels[k].classList.remove('on'); any = true; } return any; };

  // ----------------------------------------------------------------------------- source drawer (#src-n, Back closes)
  const drawer = createDrawer(deck, $('#l-ui'), {
    onJump: (n) => { drawer.close(); go(n, 0); },
  });

  // ----------------------------------------------------------------------------- 3D (lazy) and static fallbacks
  const hasWebGL = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })();
  function updateFallback() {
    const useStatic = !hasWebGL || !state.three || state.preset === 'static';
    document.body.classList.toggle('static3d', useStatic);
    L.fallback.style.display = useStatic && state.three ? '' : 'none';
    for (const [m, nodes] of built) nodes.fb?.classList.toggle('is-current', m === state.n);
  }
  async function ensureThree() {
    if (three || !hasWebGL || !state.three || state.preset === 'static') return;
    const mod = await import('../three/engine.js');
    three = mod.createEngine($('#gl'), { preset: state.preset, reduced: reduced || params.has('capture'), capture: params.has('capture'), onDowngrade: () => { state.autoLight = true; ui.chip.classList.add('on'); setPreset('light', true); } });
    three.resize(scale);
    applyStep();
  }
  function setPreset(p, auto = false) {
    state.preset = p;
    if (!auto) { store.set('preset', p); state.autoLight = false; ui.chip.classList.remove('on'); }
    document.querySelectorAll('[data-preset]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.preset === p)));
    if (p === 'static') three?.hide(); else { three?.setPreset(p); ensureThree(); }
    updateFallback(); applyStep();
  }
  function setThree(on) {
    state.three = on; store.set('three', on ? '1' : '0');
    $('[data-act="three"]').setAttribute('aria-pressed', String(on));
    if (!on) three?.hide(); else ensureThree();
    updateFallback(); applyStep();
  }
  function setStepMode(m) {
    state.stepMode = m; store.set('stepMode', m);
    document.querySelectorAll('[data-steps]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.steps === m)));
    state.step = m === 'all' ? 0 : state.step; applyStep();
  }
  ui.chip.addEventListener('click', () => setPreset('full'));

  // ----------------------------------------------------------------------------- input
  const fullscreen = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.());
  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === 'Escape') { if (drawer.isOpen()) drawer.close(); else closePanels(); return; }
    if (drawer.isOpen() && !['ArrowRight', 'ArrowLeft', ' '].includes(k)) return;
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k) && !(k === 'Enter' && e.target.closest?.('button,a,[role=link]'))) { e.preventDefault(); if (drawer.isOpen()) drawer.close(); next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); if (drawer.isOpen()) drawer.close(); prev(); }
    else if (k === 'Home') go(1); else if (k === 'End') go(N);
    else if (k === 'f' || k === 'F') fullscreen();
    else if (k === 'g' || k === 'G') toggle('overview');
    else if (k === 'n' || k === 'N') toggle('notes');
    else if (k === 't' || k === 'T') setThree(!state.three);
    else if (k === 's' || k === 'S') setStepMode(state.stepMode === 'all' ? 'step' : 'all');
    else if (k === 'r' || k === 'R') location.hash = '#read';
    else if (k === '?') toggle('help');
    else if (/^[1-9]$/.test(k)) { const p = KEY_PARTS[Number(k) - 1]; if (deck.partStart[p]) go(deck.partStart[p], 0); }
  });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.cite, [data-src]');
    if (a && a.dataset.src) { e.preventDefault(); drawer.open(Number(a.dataset.src), true); return; }
    const g = e.target.closest('[data-goto]');
    if (g) { closePanels(); go(Number(g.dataset.goto), 0); return; }
    const card = e.target.closest('[data-go]');
    if (card) { go(deck.partStart[card.dataset.go], 0); return; }
    const car = e.target.closest('[data-car]');
    if (car) { state.step = Number(car.dataset.car) + 1; applyStep(); return; }
    const b = e.target.closest('[data-act],[data-steps],[data-preset]');
    if (b) {
      if (b.dataset.steps) setStepMode(b.dataset.steps);
      else if (b.dataset.preset) setPreset(b.dataset.preset);
      else ({ prev, next, notes: () => toggle('notes'), overview: () => toggle('overview'), toc: () => toggle('toc'), help: () => toggle('help'), full: fullscreen, three: () => setThree(!state.three), read: () => { location.hash = '#read'; } })[b.dataset.act]?.();
      return;
    }
    if (e.target === ui.scrim) drawer.close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('[data-go]')) go(deck.partStart[e.target.dataset.go], 0); });
  // swipe
  let tx = null, ty = null;
  addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', (e) => {
    if (tx == null) return; const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; tx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
  }, { passive: true });
  // cursor + chrome auto-hide after 3 s
  let idle;
  const wake = (e) => {
    document.body.classList.remove('hide-cursor'); document.body.classList.add('show-chrome');
    clearTimeout(idle); idle = setTimeout(() => { document.body.classList.add('hide-cursor'); document.body.classList.remove('show-chrome'); }, 3000);
    if (e && three) three.pointer((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
  };
  addEventListener('mousemove', wake);
  addEventListener('popstate', () => {
    const m = location.hash.match(/^#src-(\d+)$/);
    if (m) drawer.open(Number(m[1]), false);
    else { drawer.close(false); const k = location.hash.match(/^#\/(\d+)/); if (k && Number(k[1]) !== state.n) go(Number(k[1]), 0); }
  });

  // ----------------------------------------------------------------------------- boot
  fit();
  const h0 = location.hash;
  const m0 = h0.match(/^#\/(\d+)(?:\.(\d+))?/);
  go(m0 ? Number(m0[1]) : 1, m0 && m0[2] ? Number(m0[2]) : 0);
  setStepMode(state.stepMode); setPreset(state.preset); setThree(state.three);
  const src0 = h0.match(/^#src-(\d+)$/);
  if (src0) { history.replaceState(null, '', '#/1'); drawer.open(Number(src0[1]), true); }
  wake();
  window.__deck = { go, next, prev, state, N, setPreset, setThree, setStepMode, drawer, get three() { return three; } };
  return window.__deck;
}
