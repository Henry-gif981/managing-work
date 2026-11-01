// Presentation engine: fixed 1920×1080 stage, step-by-step bullets, keyboard/hash/swipe navigation,
// presenter notes, overview, table of contents, source drawer and the lazily loaded 3D layer.
import { renderSlide, slotOf, SLOTS, fallbackSrc } from './render.js';
import { createDrawer } from './drawer.js';
import { toHTML } from '../lib/markup.js';

const store = {
  get(k, d) { try { const v = localStorage.getItem('ibrd.' + k); return v == null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('ibrd.' + k, v); } catch { /* private mode: keep in memory only */ } },
};
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function startDeck(deck) {
  window.__deckData = deck;
  const N = deck.slides.length; // original sections (IDs 1..N)
  // Structure (content/deck.config.yml → deck.structure): the main deck and the appendix are two sequences of
  // slide keys. Keys are the original numbers ("47") plus appendix-only slides ("appendix", "92-table").
  const ST = deck.structure;
  const all = [...deck.slides, ...(deck.extra || [])];
  const byKey = new Map(all.map((x) => [x.key, x]));
  const SEQ = { main: ST.mainKeys, appx: ST.appendixKeys };
  const setOf = (key) => (ST.mainKeys.includes(key) ? 'main' : 'appx');
  const slideOf = (key) => byKey.get(String(key));
  const keyOf = (t) => { const k = String(t); return byKey.has(k) ? k : ST.mainKeys[0]; };
  const numOrKey = (key) => (/^\d+$/.test(key) ? Number(key) : key);
  let mainReturn = { key: ST.mainKeys[0], step: 0 }; // where A / Detail → left the main deck (M returns here)
  const params = new URLSearchParams(location.search);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ?lite=1: no WebGL, no stroke-draw entrances, no paper/wash/grain textures (same layout and colours)
  const lite = params.get('lite') === '1';
  if (lite) document.body.classList.add('lite', 'no-draw');
  const state = {
    n: 1, key: ST.mainKeys[0], set: 'main', pos: 0, step: 0,
    stepMode: params.get('steps') || store.get('stepMode', 'step'),
    preset: lite ? 'static' : params.get('preset') || store.get('preset', 'full'),
    three: !lite && params.get('3d') !== '0' && store.get('three', '1') === '1',
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
        <button type="button" data-act="appendix" title="Appendix (A)">Appendix</button><button type="button" data-act="main" title="Back to the main deck (M)">Main</button>
        <button type="button" data-act="prev" title="Previous (←)">◀</button><button type="button" data-act="next" title="Next (→ / Space)">▶</button>
        <span class="seg"><button type="button" data-steps="step">Từng bước</button><button type="button" data-steps="all">Hiện hết</button></span>
        <span class="seg"><button type="button" data-preset="full">3D đầy đủ</button><button type="button" data-preset="light">3D nhẹ</button><button type="button" data-preset="static">Ảnh tĩnh</button></span>
        <button type="button" data-act="three" title="Toggle 3D (T)">3D on/off</button>
        <span class="spacer"></span>
        <button type="button" data-act="notes" title="Speaker notes (N)">Notes</button><button type="button" data-act="overview" title="Overview (G)">Overview</button>
        <button type="button" data-act="read" title="Reading mode">Read</button><button type="button" data-act="full" title="Fullscreen (F)">Fullscreen</button><button type="button" data-act="help" title="Keys (?)">?</button>
      </div>
      <div class="detail" aria-label="Detail in the appendix"></div>
      <button type="button" class="backmain" data-act="main" title="Back to the main deck (M)">← Back to main</button>
      <div class="clock" aria-hidden="true"><span class="t">00:00</span><span class="marks"></span></div>
      <div class="toc-menu" role="menu"></div>
      <div class="notes" role="region" aria-label="Speaker notes"></div>
      <div class="overview" role="dialog" aria-label="Overview"></div>
      <div class="help" role="dialog" aria-label="Keyboard shortcuts"><h3>Keys</h3><div class="cols">
        <kbd>→</kbd> <kbd>Space</kbd> next bullet / slide<br><kbd>←</kbd> back<br><kbd>Home</kbd> <kbd>End</kbd> first / last of the deck you are in<br>
        <kbd>1</kbd> Introduction · <kbd>2</kbd> Chapter 1 · <kbd>3</kbd> Chapter 2 · <kbd>4</kbd> Chapter 3 (TEP) · <kbd>5</kbd> CCSEP · <kbd>6</kbd> Recommendations · <kbd>7</kbd> Conclusion · <kbd>8</kbd> Appendix<br>
        <kbd>A</kbd> appendix (remembers your place) · <kbd>M</kbd> back to the main deck<br><kbd>G</kbd> overview grid<br><kbd>N</kbd> speaker notes (verbatim paper)<br>
        <kbd>F</kbd> fullscreen<br><kbd>T</kbd> 3D on / off<br><kbd>S</kbd> step-by-step / show all<br><kbd>R</kbd> reading mode<br>${ST.clock?.enabled || params.get('clock') === '1' ? '<kbd>C</kbd> presenter clock<br>' : ''}<kbd>Esc</kbd> close panel or source card<br>Click any red <b>[n]</b> to open its source.</div></div>
      <div class="scrim"></div>
    </div>
  </div></div>`;
  const $ = (q) => document.querySelector(q);
  const stage = $('#stage');
  const L = { ground: $('#l-ground'), giant: $('#l-giant'), content: $('#l-content'), fallback: $('#l-fallback') };
  const ui = { detail: $('.detail'), backmain: $('.backmain'), clock: $('.clock'), counter: $('.counter'), bar: $('.progress i'), notes: $('.notes'), overview: $('.overview'), toc: $('.toc-menu'), help: $('.help'), chip: $('.chip.light'), scrim: $('.scrim') };

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
    if (n == null) return null;
    n = String(n);
    if (built.has(n)) return built.get(n);
    const s = slideOf(n);
    if (!s) return null;
    const r = renderSlide(s, deck);
    const make = (html, parent) => { if (!html) return null; const t = document.createElement('template'); t.innerHTML = html.trim(); const el = t.content.firstElementChild; parent.appendChild(el); return el; };
    const nodes = { ground: make(r.ground, L.ground), giant: make(r.giant, L.giant), content: make(r.content, L.content), steps: r.steps, fb: null };
    const slot = slotOf(s);
    if (slot) {
      const S = SLOTS[slot];
      nodes.fb = make(`<div class="fb-wrap" data-n="${n}"><img alt="" decoding="async" src="${fallbackSrc(s.hero3d, slot)}" style="left:${S.cx - S.w / 2}px;top:${S.cy - S.h / 2}px;width:${S.w}px;height:${S.h}px"></div>`, L.fallback);
      nodes.fb.querySelector('img').onerror = function () { this.remove(); };
    }
    fitGiant(nodes.giant);
    built.set(n, nodes);
    return nodes;
  }
  function fitGiant(wrap) {
    const g = wrap?.firstElementChild;
    if (!g) return;
    const max = { gallery: 900, cycle: 860, hero: 760, cover: 980, chapter: 1080, thanks: 1700 }[g.dataset.fit] || 1500;
    let fs = parseFloat(g.style.fontSize);
    for (let i = 0; i < 12 && g.scrollWidth > max; i++) { fs *= Math.max(0.6, max / g.scrollWidth); g.style.fontSize = fs + 'px'; }
  }
  function prune() {
    const seq = SEQ[state.set];
    for (const [n, nodes] of built) {
      if (seq.includes(n) && Math.abs(seq.indexOf(n) - state.pos) <= 1) continue;
      for (const k of ['ground', 'giant', 'content', 'fb']) nodes[k]?.remove();
      built.delete(n);
    }
  }
  // appendix slides always show everything (they are for answering questions, not for pacing)
  const stepsOf = (n) => (state.stepMode === 'all' || setOf(String(n)) === 'appx' ? 0 : build(n).steps);

  // ----------------------------------------------------------------------------- show section n at step k
  let three = null;
  function go(target, step = 0, dir = 1) {
    const n = keyOf(target);
    const prevN = state.key;
    const changed = n !== prevN || !built.get(n)?.content?.classList.contains('is-current');
    state.key = n; state.n = numOrKey(n); state.set = setOf(n); state.pos = SEQ[state.set].indexOf(n);
    state.step = Math.max(0, Math.min(step, stepsOf(n)));
    const cur = build(n);
    if (changed) {
      for (const [m, nodes] of built) for (const k of ['ground', 'giant', 'content', 'fb']) {
        const el = nodes[k]; if (!el) continue;
        if (m === n) { el.classList.remove('enter-fwd', 'enter-back'); if (k === 'content' && m !== prevN) { el.classList.add(dir >= 0 ? 'enter-fwd' : 'enter-back'); el.getBoundingClientRect(); el.classList.remove('enter-fwd', 'enter-back'); } el.classList.add('is-current'); }
        else el.classList.remove('is-current');
      }
      const seq = SEQ[state.set];
      build(seq[state.pos + 1]); build(seq[state.pos - 1]); prune();
      const s = slideOf(n);
      document.body.classList.toggle('on-night', s.ground === 'night');
      document.body.classList.toggle('on-wash', s.ground === 'wash');
      $('#l-vignette').classList.toggle('on', s.ground === 'night');
      const k = state.pos + 1, M = seq.length;
      ui.counter.textContent = state.set === 'main' ? `${k} / ${M}` : `Appendix ${k} / ${M}`;
      ui.bar.style.width = (100 * k) / M + '%';
      document.body.classList.toggle('in-appendix', state.set === 'appx');
      history.replaceState(null, '', `#/${n}`);
      renderDetail(); clockTick();
      renderNotes();
      updateFallback();
    }
    applyStep();
  }
  function applyStep() {
    const nodes = built.get(state.key);
    const c = nodes.content;
    const stepping = state.stepMode !== 'all' && nodes.steps > 0;
    c.classList.toggle('stepping', stepping);
    c.querySelectorAll('[data-step]').forEach((el) => {
      const k = Number(el.dataset.step);
      el.classList.toggle('shown', !stepping || k <= state.step);
      el.classList.toggle('hl', stepping && k === state.step);
    });
    const s = slideOf(state.key);
    let car = 0;
    if (s.carousel) {
      car = Math.max(0, Math.min(s.carousel.length - 1, (state.step || 1) - 1));
      c.querySelectorAll('[data-car]').forEach((b) => b.classList.toggle('on', Number(b.dataset.car) === car));
      const g = nodes.giant?.firstElementChild; if (g) { g.textContent = s.carousel[car]; }
    }
    if (three && state.three && state.preset !== 'static') three.show(s, { step: state.step, carousel: car, stepping });
  }
  // → / ← move inside the deck being shown; the main deck stops at its last slide (no fall into the appendix)
  const next = () => { const seq = SEQ[state.set]; if (state.step < stepsOf(state.key)) { state.step++; applyStep(); } else if (state.pos < seq.length - 1) go(seq[state.pos + 1], 0, 1); };
  const prev = () => { const seq = SEQ[state.set]; if (state.step > 0) { state.step--; applyStep(); } else if (state.pos > 0) { const p = seq[state.pos - 1]; go(p, stepsOf(p), -1); } };
  const toAppendix = () => { if (state.set === 'main') mainReturn = { key: state.key, step: state.step }; go('appendix'); };
  const toMain = () => { if (state.set === 'appx') go(mainReturn.key, mainReturn.step); };
  const label = (key) => { const x = slideOf(key); return x ? (x.title || (x.tpl === 'thanks' ? 'Thank you' : x.tpl === 'cover' ? 'Cover' : x.quote ? 'Quote' : '')).replace(/\*\*/g, '') : key; };
  // "Detail →" links (deck.config.yml details): shown with the toolbar / on hover; remember the way back
  function renderDetail() {
    const t = state.set === 'main' ? ST.details[state.key] : null;
    ui.detail.innerHTML = t ? t.map((k) => `<button type="button" data-detail="${k}">Detail → ${esc(k === '92-table' ? 'table' : k)} · ${esc(label(k))}</button>`).join('') : '';
    ui.detail.classList.toggle('has', !!t);
    const r = mainReturn;
    ui.backmain.textContent = `← Back to main · ${ST.mainKeys.indexOf(r.key) + 1} / ${ST.mainKeys.length}`;
  }
  // optional presenter clock (deck.config.yml clock.enabled, key C)
  const CLK = { ...(ST.clock || {}), enabled: !!ST.clock?.enabled || params.get('clock') === '1' }; // ?clock=1 for a rehearsal without editing the config
  const secs = (t) => { const [m, ss] = String(t).split(':').map(Number); return m * 60 + ss; };
  let clockStart = null, clockTimer = null;
  const marks = (CLK.marks || []).map((m) => ({ ...m, slide: String(m.slide), done: false }));
  ui.clock.querySelector('.marks').innerHTML = marks.map((m, i) => `<i data-m="${i}" title="${esc(m.at)}"></i>`).join('');
  function toggleClock() {
    if (!CLK.enabled) return;
    if (clockStart == null) { clockStart = Date.now(); marks.forEach((m) => { m.done = false; }); ui.clock.querySelectorAll('i').forEach((i) => { i.className = ''; }); ui.clock.classList.add('on');
      clockTimer = setInterval(() => { const e = Math.floor((Date.now() - clockStart) / 1000); ui.clock.querySelector('.t').textContent = `${String(Math.floor(e / 60)).padStart(2, '0')}:${String(e % 60).padStart(2, '0')}`; }, 500); }
    else { clearInterval(clockTimer); clockStart = null; ui.clock.classList.remove('on'); }
  }
  // a mark is reached when the presenter leaves its slide forward (the last one on arrival)
  function clockTick() {
    if (clockStart == null || state.set !== 'main') return;
    const e = (Date.now() - clockStart) / 1000;
    marks.forEach((m, i) => {
      if (m.done) return;
      const at = ST.mainKeys.indexOf(m.slide), last = at === ST.mainKeys.length - 1;
      if ((last && state.pos >= at) || (!last && state.pos > at)) {
        m.done = true; const d = e - secs(m.at);
        ui.clock.querySelector(`[data-m="${i}"]`).className = Math.abs(d) <= (CLK.tolerance ?? 30) ? 'ok' : d < 0 ? 'early' : 'late';
      }
    });
  }

  // ----------------------------------------------------------------------------- notes, overview, toc
  function renderNotes() {
    const s = slideOf(state.key);
    const body = s.notes.length ? s.notes.map((nt) => `<h5>${esc(nt.label)}${nt.page ? ` <span class="pg">· PDF p. ${nt.page}</span>` : ''}</h5>${nt.paras.map((p) => `<p>${toHTML(p.text)}</p>`).join('')}`).join('')
      : '<p class="pg">No paper text attached to this section (title or navigation section).</p>';
    ui.notes.innerHTML = `<h5>Speaker notes · section ${s.n ?? s.key} — verbatim from the paper</h5>${body}`;
  }
  // Overview (G) and Contents (☰): the main deck by part, then the appendix by group (collapsed)
  const tile = (key) => { const x = slideOf(key); return `<button type="button" data-goto="${key}" class="${x.ground}${key === state.key ? ' cur' : ''}"><b>${esc(key)}</b><span>${esc(label(key))}</span><em>${x.tpl}</em></button>`; };
  function renderOverview() {
    let html = '<h2>Overview · main deck</h2>';
    ST.main.forEach((p, i) => { html += `<div class="ov-part">${i + 1} · ${esc(p.label)}</div><div class="ov-grid">${p.keys.map(tile).join('')}</div>`; });
    html += `<details class="ov-appx"${state.set === 'appx' ? ' open' : ''}><summary>Appendix · ${ST.appendixKeys.length} slides</summary><div class="ov-grid">${tile('appendix')}</div>`;
    for (const g of ST.groups) html += `<div class="ov-part">${esc(g.label)}</div><div class="ov-grid">${g.keys.map(tile).join('')}</div>`;
    ui.overview.innerHTML = html + '</details>';
  }
  ui.toc.innerHTML = ST.main.map((p, i) => `<button type="button" role="menuitem" data-goto="${p.keys[0]}"><b>${i + 1}</b><span>${esc(p.label)}</span><em>${ST.mainKeys.indexOf(p.keys[0]) + 1}</em></button>`).join('')
    + `<details class="toc-appx"><summary><b>8</b> Appendix</summary><button type="button" role="menuitem" data-goto="appendix"><b></b><span>Appendix · overview</span><em></em></button>${ST.groups.map((g) => `<button type="button" role="menuitem" data-goto="${g.keys[0]}"><b></b><span>${esc(g.label)}</span><em>${g.keys.length}</em></button>`).join('')}</details>`;
  const panels = { notes: ui.notes, overview: ui.overview, toc: ui.toc, help: ui.help };
  const toggle = (name, on) => {
    const el = panels[name]; const v = on ?? !el.classList.contains('on');
    if (name === 'overview' && v) renderOverview();
    el.classList.toggle('on', v);
  };
  const closePanels = () => { let any = false; for (const k in panels) if (panels[k].classList.contains('on')) { panels[k].classList.remove('on'); any = true; } return any; };

  // ----------------------------------------------------------------------------- source drawer (#src-n, Back closes)
  const drawer = createDrawer(deck, $('#l-ui'), {
    onJump: (n) => { drawer.close(); if (setOf(String(n)) === 'appx' && state.set === 'main') mainReturn = { key: state.key, step: state.step }; go(n, 0); },
  });

  // ----------------------------------------------------------------------------- 3D (lazy) and static fallbacks
  const hasWebGL = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })();
  function updateFallback() {
    const useStatic = !hasWebGL || !state.three || state.preset === 'static';
    document.body.classList.toggle('static3d', useStatic);
    L.fallback.style.display = useStatic && state.three ? '' : 'none';
    for (const [m, nodes] of built) nodes.fb?.classList.toggle("is-current", m === state.key);
  }
  async function ensureThree() {
    if (three || !hasWebGL || !state.three || state.preset === 'static') return;
    const mod = await import('../three/engine.js');
    three = mod.createEngine($('#gl'), { preset: state.preset, reduced: reduced || params.has('capture'), capture: params.has('capture'), onDowngrade: () => { state.autoLight = true; showChip(); setPreset('light', true); } });
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
  // the auto-light notice is for the presenter: small, bottom-left, fades after 4 s, never shown in fullscreen
  let chipTimer;
  function showChip() { ui.chip.classList.add('on'); ui.chip.classList.remove('faded'); clearTimeout(chipTimer); chipTimer = setTimeout(() => ui.chip.classList.add('faded'), 4000); }

  // ----------------------------------------------------------------------------- input
  const fullscreen = () => { const p = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); p?.catch?.(() => { /* fullscreen refused (embedded frame): keep presenting */ }); };
  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === 'Escape') { if (drawer.isOpen()) drawer.close(); else closePanels(); return; }
    if (drawer.isOpen() && !['ArrowRight', 'ArrowLeft', ' '].includes(k)) return;
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k) && !(k === 'Enter' && e.target.closest?.('button,a,[role=link]'))) { e.preventDefault(); if (drawer.isOpen()) drawer.close(); next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); if (drawer.isOpen()) drawer.close(); prev(); }
    else if (k === 'Home') go(SEQ[state.set][0]); else if (k === 'End') go(SEQ[state.set][SEQ[state.set].length - 1]);
    else if (k === 'a' || k === 'A') toAppendix();
    else if (k === 'm' || k === 'M') toMain();
    else if (k === 'c' || k === 'C') toggleClock();
    else if (k === 'f' || k === 'F') fullscreen();
    else if (k === 'g' || k === 'G') toggle('overview');
    else if (k === 'n' || k === 'N') toggle('notes');
    else if (k === 't' || k === 'T') setThree(!state.three);
    else if (k === 's' || k === 'S') setStepMode(state.stepMode === 'all' ? 'step' : 'all');
    else if (k === 'r' || k === 'R') location.hash = '#read';
    else if (k === '?') toggle('help');
    else if (/^[1-9]$/.test(k)) { const i = Number(k) - 1; if (i < ST.main.length) go(ST.main[i].keys[0], 0); else if (i === ST.main.length) toAppendix(); }
  });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.cite, [data-src]');
    if (a && a.dataset.src) { e.preventDefault(); drawer.open(Number(a.dataset.src), true); return; }
    const dt = e.target.closest('[data-detail]');
    if (dt) { mainReturn = { key: state.key, step: state.step }; go(dt.dataset.detail, 0); return; }
    const g = e.target.closest('[data-goto]');
    if (g) { closePanels(); if (state.set === 'main' && setOf(g.dataset.goto) === 'appx') mainReturn = { key: state.key, step: state.step }; go(g.dataset.goto, 0); return; }
    const card = e.target.closest('[data-go]');
    if (card) { go(deck.partStart[card.dataset.go], 0); return; }
    const car = e.target.closest('[data-car]');
    if (car) { state.step = Number(car.dataset.car) + 1; applyStep(); return; }
    const b = e.target.closest('[data-act],[data-steps],[data-preset]');
    if (b) {
      if (b.dataset.steps) setStepMode(b.dataset.steps);
      else if (b.dataset.preset) setPreset(b.dataset.preset);
      else ({ prev, next, notes: () => toggle('notes'), overview: () => toggle('overview'), toc: () => toggle('toc'), help: () => toggle('help'), full: fullscreen, three: () => setThree(!state.three), appendix: toAppendix, main: toMain, read: () => { location.hash = '#read'; } })[b.dataset.act]?.();
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
    else { drawer.close(false); const k = location.hash.match(/^#\/([\w-]+?)(?:\.(\d+))?$/); if (k && (k[1] !== state.key || k[2])) go(k[1], k[2] ? Number(k[2]) : 0); }
  });

  // ----------------------------------------------------------------------------- boot
  fit();
  const h0 = location.hash;
  const m0 = h0.match(/^#\/([\w-]+?)(?:\.(\d+))?$/);
  go(m0 ? m0[1] : ST.mainKeys[0], m0 && m0[2] ? Number(m0[2]) : 0);
  setStepMode(state.stepMode); setPreset(state.preset); setThree(state.three);
  const src0 = h0.match(/^#src-(\d+)$/);
  if (src0) { history.replaceState(null, '', `#/${ST.mainKeys[0]}`); drawer.open(Number(src0[1]), true); }
  wake();
  window.__deck = { go, next, prev, state, N, setPreset, setThree, setStepMode, drawer, structure: ST, slide: () => slideOf(state.key), toAppendix, toMain, get three() { return three; } };
  return window.__deck;
}
