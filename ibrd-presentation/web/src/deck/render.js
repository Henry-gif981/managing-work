// Templates: each section renders to three nodes — ground (patterns), giant word, content — so the single
// WebGL canvas can sit between the giant word and the text (DESIGN-3D.md §1, feature 1).
import { toHTML, plain } from '../lib/markup.js';
import { art, pattern, ornament } from '../art/index.js';
import { chartSVG } from '../art/charts.js';

const h = toHTML;
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Which templates show the part's 3D hero object, and where (stage px; used by the 3D engine and fallbacks).
export const SLOTS = {
  center: { cx: 960, cy: 500, h: 600 },
  left: { cx: 540, cy: 560, h: 620 },
  carousel: { cx: 540, cy: 520, h: 520 },
  ring: { cx: 520, cy: 600, h: 560 },
};
export const slotOf = (s) => (s.obj && SLOTS[s.obj] ? s.obj : null);

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

// Ground layer: texture + engraved patterns + a few red dots. Deterministic per section.
function ground(s) {
  const g = s.ground;
  const seed = s.n * 7919;
  const rnd = (i) => { const x = Math.sin(seed + i * 12.9898) * 43758.5453; return x - Math.floor(x); };
  let inner = '';
  if (g === 'paper') {
    inner += pattern('rosette', { x: 1500 + rnd(1) * 200, y: 760 + rnd(2) * 200, r: 360, op: 0.075 });
    if (['table', 'hero', 'stats'].includes(s.tpl)) inner += pattern('ledger', { op: 0.07 });
    inner += pattern('graticule', { op: 0.05 });
  } else if (g === 'wash') {
    inner += pattern('graticule', { op: 0.1, color: '#FFF8EA' });
    inner += pattern('rosette', { x: 220 + rnd(3) * 120, y: 880, r: 300, op: 0.1, color: '#FFF8EA' });
  } else {
    inner += pattern('graticule', { op: 0.05, color: '#9FB4D3' });
    inner += '<div class="grain"></div>';
  }
  if (g !== 'night' && !['table', 'refs', 'index', 'credits'].includes(s.tpl)) {
    // brick dots live only in the side margins, never on content
    const spots = [[30, 0.3 + rnd(5) * 0.3], [1872, 0.42 + rnd(6) * 0.3], [1866, 0.16 + rnd(7) * 0.08]];
    inner += spots.map(([x, y], i) => `<i class="dot ${['', 's', 'l'][i % 3]}" style="left:${x | 0}px;top:${(y * 1080) | 0}px"></i>`).join('');
  }
  return `<div class="ground ${g}" data-n="${s.n}">${inner}</div>`;
}

// Giant word layer
function giant(s) {
  const word = s.tpl === 'thanks' ? 'THANK YOU' : s.giant;
  if (!word) return '';
  const pos = {
    cover: 'left:50%;top:300px;transform:translateX(-50%);font-size:450px',
    chapter: 'left:50%;top:300px;transform:translateX(-50%);font-size:440px',
    thanks: 'left:50%;top:330px;transform:translateX(-50%);font-size:300px',
    gallery: 'left:540px;top:330px;transform:translateX(-50%);font-size:400px',
    cycle: 'left:520px;top:350px;transform:translateX(-50%);font-size:360px',
    hero: 'left:1520px;top:330px;transform:translateX(-50%);font-size:330px',
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
    <div class="lect" title="Placeholder — to be filled in by the group">${esc(m.lecturer)}</div>
    <div class="place">${esc(m.place)}</div></div>`;
};
T.chapter = (s, d) => {
  const items = d.slides.filter((x) => x.part === s.part && x.ref && x.n > s.n).map((x) => x.ref.split(' · ')[0]);
  const uniq = [...new Set(items)].slice(0, 8);
  return `${runner(s, d)}
  ${s.roman && s.roman !== 'Intro' ? `<div class="roman-big">${esc(s.roman)}</div>` : ''}
  <div class="chap"><h1 class="title">${h(s.title)}</h1><div class="chap-rule"></div>${s.sub ? `<p class="lead">${h(s.sub)}</p>` : ''}</div>
  ${uniq.length ? `<div class="toc"><b>In this part</b>${uniq.map(esc).join(' · ')}</div>` : ''}`;
};
T.hero = (s, d) => {
  const b = bulletsHTML(s.bullets);
  return `${runner(s, d)}${head(s)}<div class="body">${b.html}</div>${artBox(s.art)}`;
};
T.cards = (s, d) => {
  let k = 1;
  const cards = s.cards.map((c) => `<div class="cert" data-step="${k++}"><div class="h">${h(c.h)}</div><div class="b">${h(c.b)}</div></div>`).join('');
  const q = s.quote ? `<div class="qline">“${h(s.quote)}”</div>` : '';
  const foot = s.foot ? `<div class="foot" data-step="${k++}">${h(s.foot)}</div>` : '';
  return `${runner(s, d)}${head(s, 'wide')}${q}<div class="cardrow c${s.cols || 3}" ${q ? 'style="top:400px"' : ''}>${cards}</div>${foot}${artBox(s.art)}`;
};
T.agenda = (s, d) => {
  const cards = s.items.map((c, i) => `<div class="cert" role="link" tabindex="0" data-go="${c.go}"><div class="k">${['Intro', 'I', 'II', 'III', 'End'][i]}</div><div class="h">${h(c.h)}</div><div class="b">${h(c.b)}</div></div>`).join('');
  return `${runner(s, d)}${head(s, 'wide')}<div class="cardrow c5" style="top:300px">${cards}</div>${artBox(s.art)}`;
};
T.grid = (s, d) => {
  const cards = s.items.map((t) => { const [a, b] = t.split(/:\s(.+)/); return `<div class="cert"><div class="h">${esc(a)}</div><div class="b">${esc(b)}</div></div>`; }).join('');
  return `${runner(s, d)}${head(s, 'wide')}<div class="cardrow">${cards}</div>`;
};
T.compare = (s, d) => {
  let k = 1;
  const col = (c, side) => `<div class="col ${side}"><div class="ribbon">${h(c.h)}</div><ul class="bullets">${c.items.map((it) => `<li data-step="${k++}">${h(it)}</li>`).join('')}</ul></div>`;
  const L = col(s.left, 'l');
  const R = col(s.right, 'r');
  const foot = s.foot ? `<div class="foot" data-step="${k++}">${h(s.foot)}</div>` : '';
  return `${runner(s, d)}${head(s, 'wide')}<div class="cmp">${L}<div class="mid">${ornament('rosette-small')}</div>${R}</div>${foot}${artBox(s.art)}`;
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
  <div class="tframe"><div class="cap">${h(t.caption)}</div>
    <table class="tbl ${dense ? 'dense' : ''} ${big ? 'xl' : ''}"><thead>${headRow}</thead><tbody>${body}</tbody></table>
    <div class="src">${h(t.source)}</div>${note}</div>
  <div class="art" aria-hidden="true" style="right:70px;top:96px;width:150px;height:150px">${ornament('seal-small')}</div>`;
};
T.timeline = (s, d) => {
  let k = 1;
  const st = s.items.map((it) => `<div class="stn" data-step="${k++}"><div class="d">${h(it.d)}</div><div class="pin"></div><div class="t">${h(it.t)}</div></div>`).join('');
  const foot = s.foot ? `<div class="foot" data-step="${k++}">${h(s.foot)}</div>` : '';
  return `${runner(s, d)}${head(s, 'wide')}<div class="rail n${s.items.length}" style="grid-template-columns:repeat(${s.items.length},1fr)">${st}</div>${foot}${artBox(s.art)}`;
};
T.stats = (s, d) => {
  let k = 1;
  const stamps = s.nums.map((n) => {
    const len = plain(n.v).length;
    return `<div class="stamp" data-step="${k++}"><div class="stamp-in"><div class="v ${len > 12 ? 'xlong' : len > 7 ? 'long' : ''}">${h(n.v)}</div><div class="l">${h(n.l)}</div></div></div>`;
  }).join('');
  const b = bulletsHTML(s.bullets, k);
  return `${runner(s, d)}${head(s, 'wide')}<div class="stamps" style="grid-template-columns:repeat(${s.nums.length},1fr)">${stamps}</div><div class="body">${b.html}</div>${artBox(s.art)}`;
};
T.process = (s, d) => {
  let k = 1;
  const st = s.steps.map((x, i) => `<div class="stn" data-k="${i + 1}" data-step="${k++}"><div class="card"><div class="h">${h(x.h)}</div><div class="b">${h(x.b)}</div></div></div>`).join('');
  const b = bulletsHTML(s.bullets, k);
  return `${runner(s, d)}${head(s, 'wide')}<div class="line n${s.steps.length}" style="grid-template-columns:repeat(${s.steps.length},1fr)">${st}</div>${s.bullets ? `<div class="body">${b.html}</div>` : ''}${artBox(s.art)}`;
};
T.chart = (s, d) => {
  const boxes = s.chartData.map((c) => `<div class="chartbox"><div class="cap">${h(c.caption)}</div>${chartSVG(c, s.chartData.length)}<div class="src">${h(c.source)}</div></div>`).join('');
  const b = bulletsHTML(s.bullets);
  return `${runner(s, d)}${head(s, 'wide')}<div class="charts">${boxes}</div><div class="body">${b.html}</div>`;
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
  const long = plain(s.quote).length > 120;
  const b = s.bullets ? bulletsHTML(s.bullets) : null;
  return `${runner(s, d)}<div class="qbox"><div class="qmark">“</div><blockquote class="${long ? 'long' : ''}">${h(s.quote)}</blockquote><div class="qrule"></div><div class="by">${esc(s.by)}</div></div>
  ${b ? `<div class="body">${b.html}</div>` : ''}${artBox(s.art)}`;
};
T.refs = (s, d) => {
  const [a, b] = s.refRange;
  const items = [];
  for (let n = a; n <= b; n++) {
    const r = d.references[n];
    items.push(`<div class="ref" id="ref-${n}"><span class="rn"><a class="cite" href="#src-${n}" data-src="${n}">[${n}]</a></span>${esc(r.text)}${r.url ? ` <span class="url"><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.url)}</a></span>` : ''}</div>`);
  }
  return `${runner(s, d)}<div class="head wide" style="top:100px"><h1 class="title">${esc(s.title)}</h1></div><div class="refcols">${items.join('')}</div>`;
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
  return `${runner(s, d)}${head(s, 'wide')}<div class="idx">${cells.join('')}</div><div class="idx-note">Dashed tiles: not cited in the body text ([5], [6]). Every tile opens the source card.</div>`;
};
T.credits = (s, d) => `${runner(s, d)}${head(s, 'wide')}<div class="credits">
  <h3>Content</h3><p>All text, figures, tables and citations: Group 6, <em>IBRD and its Development Project Financing Activities in Vietnam</em> (NEU, Hanoi, 2026). Bullets condense the paper; full verbatim text is in the presenter notes (N) and reading mode.</p>
  <h3>Typefaces (SIL Open Font License 1.1)</h3><p>Cormorant and Cormorant SC (Christian Thalmann), Be Vietnam Pro (Lâm Bảo, Tony Le, ViệtAnh Nguyễn), IBM Plex Mono and IBM Plex Sans symbol subset (IBM). Self-hosted from the @fontsource and @ibm npm packages.</p>
  <h3>Graphics</h3><p>All engravings, patterns, stamps, seals, charts and 3D objects were drawn for this deck in code (SVG and Three.js procedural geometry). No logo of the World Bank, IBRD or NEU is used. Paper, watercolour and grain textures are generated from procedural noise.</p>
  <h3>Map data</h3><p>Vietnam silhouette (decorative only): Natural Earth 1:50m admin-0 countries, public domain, via the <span class="code">world-atlas</span> npm package (ISC).</p>
  <h3>Software</h3><p>Three.js (MIT), Vite (MIT), js-yaml (MIT). 3D environment lighting: Three.js RoomEnvironment (procedural, no HDRI file).</p>
  <h3>Style references</h3><p>Two images supplied by the group were studied for style only; nothing from them is reproduced.</p></div>
  <div class="art draw" aria-hidden="true" style="right:80px;top:220px;width:300px;height:300px">${art('seal')}</div>`;
T.thanks = (s, d) => `<div class="tk-sub">${esc(d.meta.group)} · ${esc(d.meta.class)}</div><div class="tk-sub2">${esc(d.meta.university)} · ${esc(d.meta.place)}</div>`;

// step count = highest data-step in the content
export function renderSlide(s, deck) {
  const fn = T[s.tpl];
  if (!fn) throw new Error('unknown template ' + s.tpl);
  const hasLead = s.lead && ['cards', 'table', 'process'].includes(s.tpl);
  const content = `<section class="slide tpl-${s.tpl} ${s.ground}${hasLead ? ' has-lead' : ''}" data-n="${s.n}" aria-label="${esc(plain(s.title || s.tpl))}">${fn(s, deck)}</section>`;
  const steps = Math.max(0, ...[...content.matchAll(/data-step="(\d+)"/g)].map((m) => Number(m[1])));
  return { ground: ground(s), giant: giant(s), content, steps };
}
