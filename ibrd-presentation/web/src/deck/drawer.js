// Source card drawer. Opening pushes "#src-n" so the browser Back button closes it; the section and its
// bullet step underneath are untouched. Content comes only from the paper (no excerpts: see CITATIONS.md).
import { toHTML } from '../lib/markup.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function createDrawer(deck, host, { onJump }) {
  const el = document.createElement('div');
  el.className = 'drawer';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'false');
  el.setAttribute('aria-label', 'Source card');
  host.appendChild(el);
  const scrim = host.querySelector('.scrim');
  let openN = null;
  let pushed = false;

  function card(n) {
    const r = deck.references[n];
    const c = deck.cites[n];
    const cited = c.citedFor.length
      ? `<ul class="cf">${c.citedFor.map((e) => `<li>${toHTML(e.text)}<br><span class="where">Paper ${esc(e.sid || '')}${e.page ? ` · PDF p. ${e.page}` : ''}</span>${e.slide ? ` <a class="jump" data-jump="${e.slide}">→ section ${e.slide}</a>` : ''}</li>`).join('')}</ul>`
      : '<p class="muted"><b>Not cited in the body text.</b> The paper lists this source among its references but no sentence cites it.</p>';
    const loc = c.locators.length ? c.locators.map(esc).join(' · ') : 'Locator not given in the paper';
    const inferred = c.inferred.length
      ? `<div class="badge">Mapping inferred – to be confirmed</div><p class="muted">The paper cites this source in author–year form (${c.inferred.map(esc).join('; ')}), which does not map uniquely onto the numbered list. See CITATIONS.md and ISSUES.md §6.</p>` : '';
    const where = c.sections.length ? c.sections.map(esc).join('<br>') : '—';
    const shown = c.slides.length ? c.slides.map((s) => `<a class="jump" data-jump="${s}">${s}</a>`).join(', ') : '—';
    return `
      <div class="dhead"><div class="dnum">${n}</div>
        <div class="dref">${esc(r.text)}${r.url ? `<br><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.url)}</a>` : '<br><span class="muted">No URL is given in the paper.</span>'}</div>
        <button class="back" type="button" data-close>↩ Back</button></div>
      <div class="dbody">
        ${inferred}
        <section><h3>Cited for</h3>${cited}</section>
        <section><h3>Locator in source</h3><p class="muted">${loc}</p></section>
        <section><h3>Paper section</h3><p class="muted">${where}</p></section>
        <section><h3>Shown on sections</h3><p class="muted">${shown}</p></section>
        <p class="notret">Source text not retrieved – shown: citation details from the paper only.</p>
      </div>`;
  }

  el.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) { e.stopPropagation(); close(); }
    const j = e.target.closest('[data-jump]');
    if (j) { e.preventDefault(); e.stopPropagation(); onJump(Number(j.dataset.jump)); }
    const a = e.target.closest('a.cite');
    if (a) { e.preventDefault(); e.stopPropagation(); open(Number(a.dataset.src), false); }
  });

  function open(n, push = true) {
    if (!deck.references[n]) return;
    el.innerHTML = card(n);
    el.classList.add('on');
    scrim.classList.add('on');
    if (push && openN == null) { history.pushState({ src: n }, '', `#src-${n}`); pushed = true; }
    else history.replaceState(history.state, '', `#src-${n}`);
    openN = n;
    el.querySelector('[data-close]').focus({ preventScroll: true });
  }
  function close(viaHistory = true) {
    if (openN == null) return;
    el.classList.remove('on');
    scrim.classList.remove('on');
    openN = null;
    if (viaHistory && pushed) { pushed = false; history.back(); return; }
    pushed = false;
    const n = window.__deck?.state.n || 1;
    if (location.hash.startsWith('#src-')) history.replaceState(null, '', `#/${n}`);
  }
  return { open, close, isOpen: () => openN != null };
}
