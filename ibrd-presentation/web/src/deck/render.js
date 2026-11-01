// Templates: each section renders to three nodes — ground (patterns), giant word, content — so the single
// WebGL canvas can sit between the giant word and the text (DESIGN-3D.md §1, feature 1).
import { toHTML, plain } from '../lib/markup.js';
import { art, pattern, ornament } from '../art/index.js';
import { chartSVG } from '../art/charts.js';
import { DESIGN, isPlaceholder } from './design-config.js';

const h = toHTML;
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Which templates show the part's 3D hero object, and where (stage px; used by the 3D engine and fallbacks).
// cx, cy: centre on the stage; h, w: the box the object must fit in (both dimensions).
export const SLOTS = {
  center: { cx: 960, cy: 445, h: 540, w: 600 },
  cover: { cx: 1560, cy: 370, h: 440, w: 520 },
  chapter: { cx: 1190, cy: 470, h: 560, w: 700 },
  left: { cx: 540, cy: 560, h: 600, w: 780 },
  carousel: { cx: 540, cy: 500, h: 500, w: 840 },
  ring: { cx: 520, cy: 580, h: 520, w: 840 },
};
// Still image of a 3D hero. The standalone single-file build inlines them as data URIs in window.__IBRD_INLINE.
export const fallbackSrc = (kind, slot) => {
  const key = `fallbacks/${kind}-${slot}.webp`;
  return (globalThis.__IBRD_INLINE && globalThis.__IBRD_INLINE[key]) || `${import.meta.env.BASE_URL}${key}`;
};
export const slotOf = (s) => {
  if (!s.obj || !SLOTS[s.obj]) return null;
  if (s.obj === 'center' && s.tpl === 'chapter') return 'chapter';
  if (s.obj === 'center' && s.tpl === 'cover') return 'cover';
  return s.obj;
};

function runner(s, deck) {
  const roman = s.roman ? `<span class="roman">${esc(s.roman === 'Intro' ? '' : s.roman)}</span>` : '';
  return `<div class="runner">${roman}<span>${esc(s.partLabel)}</span>${s.ref ? `<span class="ref">${esc(s.ref)}</span>` : ''}</div>`;
}
function bulletsHTML(list, step0 = 1) {
  let k = step0;
  const items = (list || []).map((b) => {
    const t = typeof b === 'string' ? b : b.t;
    const sub = typeof b === 'string' ? '' : (b.sub || []).length ? `<ul>${b.sub.map((x) => `<li>${h(x)}</li>`).join('')}</ul>` : '';
    return `<li data-step="${k++}">${h(t)}${sub}</li>`;
  }).join('');
  return { html: `<ul class="bullets">${items}</ul>`, next: k };
}
const head = (s, cls = '') => `<div class="head ${cls}"><h1 class="title">${h(s.title || '')}</h1>${s.lead ? `<p class="lead">${h(s.lead)}</p>` : ''}</div>`;
const artBox = (key, cls = '') => (key ? `<div class="art draw ${cls}" aria-hidden="true">${art(key)}</div>` : '');

// Ground layer: texture + engraved patterns. Deterministic per section. (The decorative brick dots were removed:
// they had no function and read as stains.)
function ground(s) {
  const g = s.ground;
  const seed = s.n * 7919;
  const rnd = (i) => { const x = Math.sin(seed + i * 12.9898) * 43758.5453; return x - Math.floor(x); };
  let inner = '';
  if (g === 'paper') {
    inner += pattern('rosette', { x: 1500 + rnd(1) * 200, y: 760 + rnd(2) * 200, r: 360, op: 0.05 });
    if (['table', 'hero', 'stats'].includes(s.tpl)) inner += pattern('ledger', { op: 0.07 });
    inner += pattern('graticule', { op: 0.05 });
  } else if (g === 'wash') {
    inner += pattern('graticule', { op: 0.1, color: '#FFF8EA' });
    inner += pattern('rosette', { x: 220 + rnd(3) * 120, y: 880, r: 300, op: 0.1, color: '#FFF8EA' });
  } else {
    inner += pattern('graticule', { op: 0.05, color: '#9FB4D3' });
    inner += '<div class="grain"></div>';
  }
  return `<div class="ground ${g}" data-n="${s.n}">${inner}</div>`;
}

// Giant word layer
function giant(s) {
  const word = s.tpl === 'thanks' ? 'THANK YOU' : s.giant;
  if (!word) return '';
  const pos = {
    cover: 'left:84px;top:190px;font-size:400px',
    chapter: 'left:1190px;top:310px;transform:translateX(-50%);font-size:420px',
    thanks: 'left:50%;top:330px;transform:translateX(-50%);font-size:300px',
    gallery: 'left:540px;top:330px;transform:translateX(-50%);font-size:400px',
    cycle: 'left:520px;top:350px;transform:translateX(-50%);font-size:360px',
  }[s.tpl];
  if (!pos) return '';
  const cls = s.ground === 'night' ? 'metal' : 'faint' + (s.ground === 'wash' ? ' on-wash' : '');
  const w = s.tpl === 'gallery' && s.carousel ? s.carousel[0] : word;
  return `<div class="giant-wrap" data-n="${s.n}"><div class="giant ${cls}" data-fit="${s.tpl}" style="${pos}">${esc(w)}</div></div>`;
}

// ---------------------------------------------------------------------------------- templates
const T = {};
T.cover = (s, d) => {
  const m = d.meta;
  return `
  <div class="univ">${esc(m.university)}</div>
  <div class="course">${esc(m.course)}</div>
  <h1 class="ctitle">${esc(m.title)}</h1><div class="crule"></div>
  <div class="cgroup"><div class="g">${esc(m.group)}</div>
    <div class="m">${m.members.map(esc).join('<br>')}</div>
    <div class="c">Class: ${esc(m.class)}</div>
    <div class="lect${DESIGN.showPlaceholderWarning && isPlaceholder(m.lecturer) ? ' warn' : ''}">${esc(m.lecturer)}</div>
    <div class="place">${esc(m.place)}</div></div>`;
};
T.chapter = (s, d) => {
  const items = d.slides.filter((x) => x.part === s.part && x.ref && x.n > s.n).map((x) => x.ref.split(' · ')[0]);
  const uniq = [...new Set(items)].slice(0, 8);
  return `${runner(s, d)}
  ${s.roman && s.roman !== 'Intro' ? `<div class="roman-big">${esc(s.roman)}</div>` : ''}
  <div class="chap"><h1 class="title">${h(s.title)}</h1><div class="chap-rule"></div>${s.sub ? `<p class="lead">${h(s.sub)}</p>` : ''}</div>
  ${uniq.length ? `<div class="toc"><b>In this part</b>${uniq.map((u) => `<span class="tag">${esc(u)}</span>`).join('<i class="sep"> · </i>')}</div>` : ''}`;
};
T.hero = (s, d) => {
  const b = bulletsHTML(s.bullets);
  const chars = (s.bullets || []).reduce((a, x) => a + plain(typeof x === 'string' ? x : x.t).length, 0);
  return `${runner(s, d)}${head(s)}<div class="zone"><div class="body${chars > 440 ? ' dense' : ''}">${b.html}</div>${artBox(s.art, 'frame')}</div>`;
};
T.cards = (s, d) => {
  let k = 1;
  const cards = s.cards.map((c) => `<div class="cert" data-step="${k++}"><div class="h">${h(c.h)}</div><div class="b">${h(c.b)}</div></div>`).join('');
  const q = s.quote ? `<div class="qline">“${h(s.quote)}”</div>` : '';
  const foot = s.foot ? `<div class="foot" data-step="${k++}">${h(s.foot)}</div>` : '';
  const extra = s.extra ? `<div class="foot extra" data-step="${k++}">${s.extra.map((x) => `<p>${h(x)}</p>`).join('')}</div>` : '';
  return `${runner(s, d)}${head(s, 'wide')}<div class="zone">${q}<div class="cardrow c${s.cols || 3}">${cards}</div></div>${foot}${extra}${artBox(s.art)}`;
};
T.agenda = (s, d) => {
  const cards = s.items.map((c, i) => `<div class="cert" role="link" tabindex="0" data-go="${c.go}"><div class="k">${['Intro', 'I', 'II', 'III', 'End'][i]}</div><div class="h">${h(c.h)}</div><div class="b">${h(c.b)}</div></div>`).join('');
  return `${runner(s, d)}${head(s, 'wide')}<div class="zone"><div class="cardrow c5">${cards}</div></div>${artBox(s.art)}`;
};
T.grid = (s, d) => {
  const cards = s.items.map((t) => { const [a, b] = t.split(/:\s(.+)/); return `<div class="cert"><div class="h">${esc(a)}</div><div class="b">${esc(b)}</div></div>`; }).join('');
  return `${runner(s, d)}${head(s, 'wide')}<div class="zone"><div class="cardrow">${cards}</div></div>`;
};
T.compare = (s, d) => {
  let k = 1;
  const col = (c, side) => `<div class="col ${side}"><div class="ribbon">${h(c.h)}</div><ul class="bullets">${c.items.map((it) => `<li data-step="${k++}">${h(it)}</li>`).join('')}</ul></div>`;
  const L = col(s.left, 'l');
  const R = col(s.right, 'r');
  const foot = s.foot ? `<div class="foot" data-step="${k++}">${h(s.foot)}</div>` : '';
  return `${runner(s, d)}${head(s, 'wide')}<div class="zone"><div class="cmp">${L}<div class="mid">${ornament('rosette-small')}</div>${R}</div></div>${foot}${artBox(s.art)}`;
};
T.table = (s, d) => {
  const t = s.tableData;
  const numeric = (v) => /^[~≈\-–]?[\d.,%/ ]+(%|km|MW)?$/.test(String(v).trim()) && /\d/.test(v);
  const rows = s.rows ? t.rows.slice(...s.rows) : t.rows;
  const short = t.short || {};
  const cols = t.header.length;
  const cellLen = Math.max(...rows.flat().map((c) => plain(String(c)).split(/\s+/).length));
  const dense = rows.length > 6 || (cols >= 4 && cellLen > 10);
  const big = rows.length <= 4 && cols <= 3 && cellLen <= 10;
  let k = 1;
  const body = rows.map((r, ri) => {
    const step = s.highlight ? ` data-step="${k++}"` : '';
    return `<tr${step}>${r.map((c, ci) => {
      const key = `${ri + (s.rows ? s.rows[0] : 0)},${ci}`;
      const shown = short[key] ? short[key] : c;
      return `<td class="${numeric(c) ? 'n' : ''}">${h(String(shown))}</td>`;
    }).join('')}</tr>`;
  }).join('');
  const headRow = `<tr>${t.header.map((c, ci) => `<th class="${rows.every((r) => numeric(r[ci])) ? 'n' : ''}">${h(c)}</th>`).join('')}</tr>`;
  const note = s.show_note && t.note ? `<div class="tnote">${h(t.note)}</div>` : '';
  return `${runner(s, d)}${head(s, 'wide')}
  <div class="zone"><div class="tframe"><div class="cap">${h(t.caption)}</div>
    <table class="tbl ${dense ? 'dense' : ''} ${big ? 'xl' : ''}"><thead>${headRow}</thead><tbody>${body}</tbody></table>
    <div class="src">${h(t.source)}</div>${note}</div></div>
  <div class="art" aria-hidden="true">${ornament('seal-small')}</div>`;
};
T.timeline = (s, d) => {
  let k = 1;
  const st = s.items.map((it) => `<div class="stn" data-step="${k++}"><div class="d">${h(it.d)}</div><div class="pin"></div><div class="t">${h(it.t)}</div></div>`).join('');
  const foot = s.foot ? `<div class="foot" data-step="${k++}">${h(s.foot)}</div>` : '';
  return `${runner(s, d)}${head(s, 'wide')}<div class="zone"><div class="rail n${s.items.length}" style="grid-template-columns:repeat(${s.items.length},1fr)">${st}</div></div>${foot}${artBox(s.art)}`;
};
T.stats = (s, d) => {
  let k = 1;
  const stamps = s.nums.map((n) => {
    const len = plain(n.v).length;
    return `<div class="stamp" data-step="${k++}"><div class="stamp-in"><div class="v ${len > 12 ? 'xlong' : len > 7 ? 'long' : ''}">${h(n.v)}</div><div class="l">${h(n.l)}</div></div></div>`;
  }).join('');
  const b = bulletsHTML(s.bullets, k);
  return `${runner(s, d)}${head(s, 'wide')}<div class="zone"><div class="main"><div class="stamps n${s.nums.length}" style="grid-template-columns:repeat(${s.nums.length},1fr)">${stamps}</div><div class="body">${b.html}</div></div>${artBox(s.art, 'frame')}</div>`;
};
T.process = (s, d) => {
  let k = 1;
  const st = s.steps.map((x, i) => `<div class="stn" data-k="${i + 1}" data-step="${k++}"><div class="card"><div class="h">${h(x.h)}</div><div class="b">${h(x.b)}</div></div></div>`).join('');
  const b = bulletsHTML(s.bullets, k);
  return `${runner(s, d)}${head(s, 'wide')}<div class="zone"><div class="line n${s.steps.length}" style="grid-template-columns:repeat(${s.steps.length},1fr)">${st}</div>${s.bullets ? `<div class="body">${b.html}</div>` : ''}</div>${artBox(s.art)}`;
};
T.chart = (s, d) => {
  const b = bulletsHTML(s.bullets);
  let k = b.next; // figures are reveal steps after the bullets (deck.config.yml groups decide what shows together)
  const boxes = s.chartData.map((c) => `<div class="chartbox" data-step="${k++}"><div class="cap">${h(c.caption)}</div>${chartSVG(c, s.chartData.length)}<div class="src">${h(c.source)}</div></div>`).join('');
  const solo = !(s.bullets || []).length;
  return `${runner(s, d)}${head(s, 'wide')}<div class="zone${solo ? ' solo' : ''}"><div class="charts n${s.chartData.length}">${boxes}</div>${solo ? '' : `<div class="body">${b.html}</div>`}</div>`;
};
T.gallery = (s, d) => {
  let k = 1;
  const nums = s.nums ? `<div class="mini-stamps">${s.nums.map((n) => `<div class="mini-stamp" data-step="${k++}"><div class="v">${h(n.v)}</div><div class="l">${h(n.l)}</div></div>`).join('')}</div>` : '';
  const b = bulletsHTML(s.bullets, k);
  const car = s.carousel ? `<div class="carousel-names">${s.carousel.map((c, i) => `<button data-car="${i}" class="${i === 0 ? 'on' : ''}">${esc(c)}</button>`).join('')}</div>` : '';
  return `${runner(s, d)}<div class="side"><h1 class="title">${h(s.title)}</h1>${s.lead ? `<p class="lead">${h(s.lead)}</p>` : ''}${nums}${b.html}</div>${car}`;
};
T.cycle = (s, d) => {
  let k = 1;
  const li = s.steps.map((x, i) => `<li data-step="${k++}"><span class="k">${i + 1}</span><span class="h">${h(x.h)}</span><span class="b">${h(x.b)}</span></li>`).join('');
  return `${runner(s, d)}<div class="side"><h1 class="title">${h(s.title)}</h1><p class="lead">${h(s.lead)}</p><ol class="stages">${li}</ol></div>`;
};
T.quote = (s, d) => {
  const len = plain(s.quote).length;
  const long = len > 150 ? 'xlong' : len > 100 ? 'long' : '';
  const b = s.bullets ? bulletsHTML(s.bullets) : null;
  return `${runner(s, d)}<div class="zone"><div class="qbox"><div class="qmark">“</div><blockquote class="${long}">${h(s.quote)}</blockquote><div class="qrule"></div><div class="by">${esc(s.by)}</div></div>
  ${b ? `<div class="body">${b.html}</div>` : ''}</div>${artBox(s.art)}`;
};
T.refs = (s, d) => {
  const [a, b] = s.refRange;
  const items = [];
  for (let n = a; n <= b; n++) {
    const r = d.references[n];
    items.push(`<div class="ref" id="ref-${n}"><span class="rn"><a class="cite" href="#src-${n}" data-src="${n}">[${n}]</a></span>${esc(r.text)}${r.url ? ` <span class="url"><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.url)}</a></span>` : ''}</div>`);
  }
  return `${runner(s, d)}<div class="head wide"><h1 class="title">${esc(s.title)}</h1></div><div class="zone"><div class="refcols">${items.join('')}</div></div>`;
};
T.index = (s, d) => {
  const cells = [];
  for (let n = 1; n <= 58; n++) {
    const r = d.references[n];
    const c = d.cites[n];
    const author = r.text.split(/[.(]/)[0].replace('International Bank for Reconstruction and Development', 'IBRD').replace('Independent Evaluation Group', 'IEG').replace('World Bank Group Archives', 'WBG Archives').replace('World Bank Accountability Mechanism', 'WB Accountability').replace('Government of Vietnam', 'Gov. of Vietnam').replace('Asian Development Bank', 'ADB').trim();
    const yr = (r.text.match(/\((\d{4}|n\.d\.)/) || [])[1] || '';
    cells.push(`<a href="#src-${n}" data-src="${n}" class="${c.citedFor.length ? '' : 'nc'}">${n}<small>${esc(author.slice(0, 18))} ${esc(yr)}</small></a>`);
  }
  return `${runner(s, d)}${head(s, 'wide')}<div class="zone"><div class="idx">${cells.join('')}</div><div class="idx-note">Dashed tiles: sources 5 and 6 are not cited in the body text. Every tile opens the source card.</div></div>`;
};
T.credits = (s, d) => `${runner(s, d)}${head(s, 'wide')}<div class="zone"><div class="credits">
  <h3>Content</h3><p>All text, figures, tables and citations: Group 6, <em>IBRD and its Development Project Financing Activities in Vietnam</em> (NEU, Hanoi, 2026). Bullets condense the paper; full verbatim text is in the presenter notes (N) and reading mode.</p>
  <h3>Typefaces (SIL Open Font License 1.1)</h3><p>Cormorant and Cormorant SC (Christian Thalmann), Be Vietnam Pro (Lâm Bảo, Tony Le, ViệtAnh Nguyễn), IBM Plex Mono and IBM Plex Sans symbol subset (IBM). Self-hosted from the @fontsource and @ibm npm packages.</p>
  <h3>Graphics</h3><p>All engravings, patterns, stamps, seals, charts and 3D objects were drawn for this deck in code (SVG and Three.js procedural geometry). No logo of the World Bank, IBRD or NEU is used. Paper, watercolour and grain textures are generated from procedural noise.</p>
  <h3>Map data</h3><p>Vietnam silhouette (decorative only): Natural Earth 1:50m admin-0 countries, public domain, via the <span class="code">world-atlas</span> npm package (ISC).</p>
  <h3>Software</h3><p>Three.js (MIT), Vite (MIT), js-yaml (MIT). 3D environment lighting: Three.js RoomEnvironment (procedural, no HDRI file).</p>
  <h3>Style references</h3><p>Two images supplied by the group were studied for style only; nothing from them is reproduced.</p></div></div>
  <div class="art draw seal" aria-hidden="true">${art('seal')}</div>`;
T.appendix = (s, d) => {
  const st = d.structure;
  const label = (k) => { const x = d.slides.find((y) => y.key === k) || d.extra.find((y) => y.key === k); return x ? x.label || x.n : k; };
  const cards = st.groups.map((g) => `<button type="button" class="ag" data-goto="${g.keys[0]}"><span class="h">${esc(g.label)}</span><span class="c">${g.keys.length} slides · ${esc(String(label(g.keys[0])))}–${esc(String(label(g.keys[g.keys.length - 1])))}</span></button>`).join('');
  return `<div class="runner"><span>Appendix</span></div><div class="head wide"><h1 class="title">Appendix</h1></div><div class="zone"><div class="agrid">${cards}</div></div>`;
};
T.thanks = (s, d) => `<div class="tk-sub">${esc(d.meta.group)} · ${esc(d.meta.class)}</div><div class="tk-sub2">${esc(d.meta.university)} · ${esc(d.meta.place)}</div>`;

// Reveal steps of a main-deck slide, from deck.config.yml: `clicks` presses after the title; `groups` lists the
// template's original step numbers shown together on each press. Without `groups`: compare = one column per
// press, stats/gallery with stamps = stamps then bullets, otherwise consecutive runs (later runs take the extra).
const range = (a, b) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);
function stepGroups(s, S, plan) {
  const c = plan.clicks;
  if (c <= 0 || S === 0) return [];
  if (plan.groups) return plan.groups;
  if (c === 1) return [range(1, S)];
  if (c === 2 && s.tpl === 'compare') { const L = s.left.items.length; return [range(1, L), range(L + 1, S)]; }
  if (c === 2 && s.nums && ['stats', 'gallery'].includes(s.tpl)) { const k = s.nums.length; return [range(1, k), range(k + 1, S)]; }
  const base = Math.floor(S / c), extra = S % c, out = [];
  let a = 1;
  for (let i = 0; i < c; i++) { const n = base + (i >= c - extra ? 1 : 0); out.push(range(a, a + n - 1)); a += n; }
  return out;
}
function regroup(s, content, S, plan) {
  const groups = stepGroups(s, S, plan);
  const map = {};
  groups.forEach((g, i) => g.forEach((k) => { map[k] = i + 1; }));
  const last = Math.max(1, groups.length);
  return { content: content.replace(/data-step="(\d+)"/g, (m, k) => `data-step="${map[k] || last}"`), steps: groups.length };
}
export { stepGroups };

// Content templates lay out as a grid: head / zone (content, centred vertically) / takeaway band (flow.css)
const FLOW = new Set(['appendix', 'hero', 'cards', 'agenda', 'grid', 'compare', 'table', 'timeline', 'stats', 'process', 'chart', 'quote', 'refs', 'index', 'credits']);
// step count = highest data-step in the content
export function renderSlide(s, deck) {
  const fn = T[s.tpl];
  if (!fn) throw new Error('unknown template ' + s.tpl);
  const hasLead = s.lead && ['cards', 'table', 'process'].includes(s.tpl);
  const note = s.note ? `<div class="snote">${h(s.note)}</div>` : '';
  let content = `<section class="slide tpl-${s.tpl} ${s.ground}${FLOW.has(s.tpl) ? ' flow' : ''}${hasLead ? ' has-lead' : ''}" data-n="${s.n ?? s.key}" aria-label="${esc(plain(s.title || s.tpl))}">${fn(s, deck)}${note}</section>`;
  let steps = Math.max(0, ...[...content.matchAll(/data-step="(\d+)"/g)].map((m) => Number(m[1])));
  if (s.stepPlan) ({ content, steps } = regroup(s, content, steps, s.stepPlan));
  return { ground: ground(s), giant: giant(s), content, steps };
}
