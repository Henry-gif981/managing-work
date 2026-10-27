// Reading mode: continuous scroll of every section with all bullets visible and the verbatim paper text
// ("full" layer) under each one. No WebGL is loaded here.
import '../styles/read.css';
import { toHTML } from '../lib/markup.js';
import { createDrawer } from './drawer.js';
import { chartSVG } from '../art/charts.js';
import { art } from '../art/index.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const h = toHTML;

function body(s, d) {
  const out = [];
  if (s.tpl === 'cover') {
    const m = d.meta;
    out.push(`<p class="eyebrow">${esc(m.university)} · ${esc(m.course)}</p><h1>${esc(m.title)}</h1><p>${esc(m.group)}: ${m.members.map(esc).join(', ')}<br>Class: ${esc(m.class)}<br><span class="ph">${esc(m.lecturer)}</span><br>${esc(m.place)}</p>`);
    return out.join('');
  }
  if (s.lead) out.push(`<p class="lead">${h(s.lead)}</p>`);
  if (s.quote) out.push(`<blockquote>“${h(s.quote)}”<cite>${esc(s.by || '')}</cite></blockquote>`);
  if (s.nums) out.push(`<div class="nums">${s.nums.map((n) => `<div><b>${h(n.v)}</b><span>${h(n.l)}</span></div>`).join('')}</div>`);
  if (s.bullets) out.push(`<ul>${s.bullets.map((b) => `<li>${h(typeof b === 'string' ? b : b.t)}</li>`).join('')}</ul>`);
  if (s.items && s.tpl !== 'grid') out.push(`<ul class="tl">${s.items.map((it) => `<li>${it.d ? `<b>${h(it.d)}</b> ` : ''}${it.h ? `<b>${h(it.h)}:</b> ${h(it.b)}` : h(it.t)}</li>`).join('')}</ul>`);
  if (s.tpl === 'grid') out.push(`<ol>${s.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`);
  if (s.cards) out.push(`<div class="cards">${s.cards.map((c) => `<div><b>${h(c.h)}</b><p>${h(c.b)}</p></div>`).join('')}</div>`);
  if (s.steps) out.push(`<ol>${s.steps.map((c) => `<li><b>${h(c.h)}:</b> ${h(c.b)}</li>`).join('')}</ol>`);
  if (s.left) out.push(`<div class="cards two">${[s.left, s.right].map((c) => `<div><b>${h(c.h)}</b><ul>${c.items.map((i) => `<li>${h(i)}</li>`).join('')}</ul></div>`).join('')}</div>`);
  if (s.tableData) {
    const t = s.tableData;
    out.push(`<figure class="tbl"><figcaption>${h(t.caption)}</figcaption><div class="scroll"><table><thead><tr>${t.header.map((c) => `<th>${h(c)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr>${r.map((c) => `<td>${h(String(c))}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="src">${h(t.source)}</p>${t.note ? `<p class="src">${h(t.note)}</p>` : ''}</figure>`);
  }
  if (s.chartData) out.push(s.chartData.map((c) => `<figure class="chart"><figcaption>${h(c.caption)}</figcaption>${chartSVG(c, 1)}<p class="src">${h(c.source)}</p></figure>`).join(''));
  if (s.foot) out.push(`<p class="foot">${h(s.foot)}</p>`);
  if (s.tpl === 'refs') {
    const [a, b] = s.refRange; const li = [];
    for (let n = a; n <= b; n++) { const r = d.references[n]; li.push(`<li id="ref-${n}"><a class="cite" href="#src-${n}" data-src="${n}">[${n}]</a> ${esc(r.text)} ${r.url ? `<a class="url" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.url)}</a>` : ''}</li>`); }
    out.push(`<ul class="refs">${li.join('')}</ul>`);
  }
  if (s.tpl === 'index') {
    const li = [];
    for (let n = 1; n <= 58; n++) li.push(`<a class="cite" href="#src-${n}" data-src="${n}">${n}</a>${d.cites[n].citedFor.length ? '' : '<small> (not cited in the body text)</small>'}`);
    out.push(`<p class="idx">${li.join(' ')}</p>`);
  }
  return out.join('');
}

export function startReading(deck) {
  document.body.className = 'reading';
  const parts = [];
  let part = null;
  for (const s of deck.slides) {
    if (s.part !== part) { part = s.part; parts.push(`<h2 class="part" id="part-${part}">${esc(deck.parts[part].label)}</h2>`); }
    const full = s.notes.length ? `<details open><summary>Full text from the paper (verbatim)</summary>${s.notes.map((nt) => `<h4>${esc(nt.label)}${nt.page ? ` · PDF p. ${nt.page}` : ''}</h4>${nt.paras.map((p) => `<p>${h(p.text).replace(/\n/g, '<br>')}</p>`).join('')}`).join('')}</details>` : '';
    const title = s.title || (s.tpl === 'thanks' ? 'Thank you' : '');
    parts.push(`<article id="s${s.n}" class="sec ${s.ground}"><div class="meta"><a href="#/${s.n}" data-present="${s.n}">${s.n} / ${deck.slides.length}</a>${s.ref ? ` · ${esc(s.ref)}` : ''}</div>
      ${title && s.tpl !== 'cover' ? `<h3>${h(title)}</h3>` : ''}${s.art ? `<div class="ra" aria-hidden="true">${art(s.art)}</div>` : ''}${body(s, deck)}${full}</article>`);
  }
  document.body.innerHTML = `<header class="rhead"><a href="#/1" data-present="1">◀ Back to presentation</a><span>${esc(deck.meta.title)} — reading mode</span></header>
    <main class="read">${parts.join('')}</main><div class="scrim"></div>`;
  const host = document.body;
  const drawer = createDrawer(deck, host, { onJump: (n) => { drawer.close(); document.getElementById('s' + n)?.scrollIntoView({ behavior: 'smooth' }); } });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.cite');
    if (a) { e.preventDefault(); drawer.open(Number(a.dataset.src), true); return; }
    const p = e.target.closest('[data-present]');
    if (p) { e.preventDefault(); location.hash = `#/${p.dataset.present}`; location.reload(); }
    if (e.target.classList.contains('scrim')) drawer.close();
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') drawer.close(); });
  addEventListener('popstate', () => { if (!location.hash.startsWith('#src-')) drawer.close(false); });
}
