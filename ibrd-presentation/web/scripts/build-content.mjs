#!/usr/bin/env node
// Build src/data/deck.json — the single data file every view reads (stage, notes, reading mode, print).
// Inputs: content/deck.yaml (slide plan), content/tables.yaml, content/charts.yaml (verbatim tables and figure data),
//         content/content-ibrd.md (verbatim paper text extracted from the PDF).
// Fails loudly if a "notes" reference, table or chart does not exist.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { tokenize, citedNumbers, plain, N_SOURCES } from '../src/lib/markup.js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const deck = yaml.load(rd('content/deck.yaml'));
const { tables } = yaml.load(rd('content/tables.yaml'));
const { charts } = yaml.load(rd('content/charts.yaml'));
const md = rd('content/content-ibrd.md');
const errors = [];

// ------------------------------------------------------------------ paper sections and paragraphs
// Author–year forms that occur in running text (tables/figures carry their own {{ay:}} markup).
const AY_IN_TEXT = [[/\(World Bank, n\.d\.-c\)/g, '({{ay:World Bank, n.d.-c|25|inferred}})']];
const sections = {}; // id -> {id, title, page, paras:[{n,page,text}], blocks:[...]}
const order = [];
for (const chunk of md.split(/\n## \[/).slice(1)) {
  const id = chunk.slice(0, chunk.indexOf(']'));
  const title = chunk.slice(chunk.indexOf(']') + 2, chunk.indexOf('\n')).trim();
  const page = Number((chunk.match(/<!-- page:(\d+) -->/) || [])[1] || 0);
  const paras = [];
  const re = /<!-- p:(\d+) page:(\d+) -->\n([^\n]+)/g;
  let m;
  while ((m = re.exec(chunk))) {
    let text = m[3];
    for (const [a, b] of AY_IN_TEXT) text = text.replace(a, b);
    paras.push({ n: Number(m[1]), page: Number(m[2]), text });
  }
  const tabs = [...chunk.matchAll(/<!-- (table|figure):(\w+) page:(\d+) -->/g)].map((x) => ({ key: x[2], page: Number(x[3]) }));
  sections[id] = { id, title, page, paras, objects: tabs, raw: chunk };
  order.push(id);
}

// cover: the lecturer line is replaced by the placeholder requested for the cover (see ISSUES.md §1)
const coverLines = sections.cover.raw.split('\n').filter((l) => l.startsWith('    ')).map((l) => l.trim())
  .map((l) => (l.startsWith('Lecturer') ? deck.meta.lecturer : l));

// ------------------------------------------------------------------ references (drafting notes removed)
const refText = sections.refs.raw.split('\n').filter((l) => /^\[\d+\]/.test(l));
const DRAFT = [/\s*\(\s*lỗi\s*\)/g, /\s*\(\s*check(?: 3\.4\.1)?\s*\)/g, /\s+\|\s*$/];
const references = {};
for (const line of refText) {
  const n = Number(line.match(/^\[(\d+)\]/)[1]);
  let t = line.replace(/^\[\d+\]\s*/, '').replace(/[​ ]/g, ' ').trim();
  const raw = t;
  for (const d of DRAFT) t = t.replace(d, '');
  t = t.replace(/World Bank(?=\s*https?:)/, 'World Bank').replace(/\s{2,}/g, ' ').trim();
  const url = (t.match(/https?:\/\/\S+$/) || [])[0] || '';
  const text = url ? t.slice(0, t.length - url.length).trim() : t;
  references[n] = { n, text, url, removedDraftNotes: raw !== t };
}
for (let n = 1; n <= N_SOURCES; n++) if (!references[n]) errors.push(`reference [${n}] missing`);

// ------------------------------------------------------------------ notes resolution (verbatim)
function tableText(key) {
  const t = tables[key];
  if (!t) { errors.push(`table ${key} missing`); return ''; }
  const lines = [t.caption, t.header.join(' | '), ...t.rows.map((r) => r.join(' | ')), t.source];
  if (t.note) lines.push(t.note);
  return lines.join('\n');
}
function figureText(key) {
  const c = charts[key];
  if (!c) { errors.push(`chart ${key} missing`); return ''; }
  return [c.caption, c.source, c.basis ? `Data basis (build note): ${c.basis}` : ''].filter(Boolean).join('\n');
}
function resolveNote(ref) {
  if (ref === 'cover') return { ref, label: 'Cover page', paras: coverLines.map((t) => ({ text: t })) };
  if (/^T\d+$/.test(ref)) return { ref, label: tables[ref]?.caption || ref, kind: 'table', paras: [{ text: tableText(ref) }] };
  if (/^F\d+$/.test(ref)) return { ref, label: charts[ref]?.caption || ref, kind: 'figure', paras: [{ text: figureText(ref) }] };
  const [sid, range] = ref.split('#');
  const s = sections[sid];
  if (!s) { errors.push(`notes ref ${ref}: unknown section`); return { ref, label: ref, paras: [] }; }
  let paras = s.paras;
  if (range) {
    const [a, b] = range.split('-').map(Number);
    paras = s.paras.filter((p) => p.n >= a && p.n <= (b || a));
    if (paras.length !== (b || a) - a + 1) errors.push(`notes ref ${ref}: paragraph out of range (section has ${s.paras.length})`);
  }
  return { ref, sid, label: s.title, page: paras[0]?.page || s.page, paras: paras.map((p) => ({ n: p.n, page: p.page, text: p.text })) };
}

// ------------------------------------------------------------------ slides
const parts = deck.parts;
// References are paginated: REFS_PER_PAGE entries per section so every entry stays ≥ 19 px on the stage.
const REFS_PER_PAGE = 10;
const planned = deck.slides.flatMap((s) => {
  if (s.tpl !== 'refs') return [s];
  const pages = Math.ceil(N_SOURCES / REFS_PER_PAGE);
  return Array.from({ length: pages }, (_, k) => ({ ...s, title: `${s.title} (${k + 1}/${pages})`,
    refRange: [k * REFS_PER_PAGE + 1, Math.min(N_SOURCES, (k + 1) * REFS_PER_PAGE)] }));
});
const slides = planned.map((s, i) => {
  const part = parts[s.part];
  if (!part) errors.push(`slide ${i + 1}: unknown part ${s.part}`);
  if (s.table && !tables[s.table]) errors.push(`slide ${i + 1}: table ${s.table} missing`);
  for (const c of s.charts || []) if (!charts[c]) errors.push(`slide ${i + 1}: chart ${c} missing`);
  const out = { ...s, i, n: i + 1, id: `s${i + 1}`, partLabel: part?.label || '', giant: s.giant || (s.tpl === 'hero' && part?.heroGiant) || part?.giant || '',
    hero3d: part?.hero3d, roman: part?.roman || '' };
  out.notes = (s.notes || []).map(resolveNote);
  if (s.table) out.tableData = tables[s.table];
  if (s.charts) out.chartData = s.charts.map((k) => ({ key: k, ...charts[k] }));
  return out;
});
// first slide of each part is its anchor (agenda links, keys 1–9)
const partStart = {};
for (const s of slides) if (!(s.part in partStart)) partStart[s.part] = s.n;

// ------------------------------------------------------------------ text of a slide (for citations and checks)
function slideStrings(s) {
  const out = [];
  const add = (x) => { if (typeof x === 'string' && x) out.push(x); };
  [s.title, s.sub, s.lead, s.quote, s.foot].forEach(add);
  (s.bullets || []).forEach((b) => (typeof b === 'string' ? add(b) : (add(b.t), (b.sub || []).forEach(add))));
  (s.items || []).forEach((it) => (typeof it === 'string' ? add(it) : (add(it.d), add(it.t), add(it.h), add(it.b))));
  (s.cards || []).forEach((c) => { add(c.h); add(c.b); });
  (s.steps || []).forEach((c) => { add(c.h); add(c.b); });
  (s.nums || []).forEach((c) => { add(c.v); add(c.l); });
  for (const side of ['left', 'right']) if (s[side]) { add(s[side].h); (s[side].items || []).forEach(add); }
  if (s.tableData) {
    const t = s.tableData;
    add(t.caption); t.header.forEach(add); t.rows.forEach((r) => r.forEach(add)); add(t.source);
    if (s.show_note) add(t.note);
  }
  (s.chartData || []).forEach((c) => { add(c.caption); add(c.source); });
  return out;
}

// ------------------------------------------------------------------ citation index
// "Cited for": every sentence of the paper (and every table/figure source line) that cites [n],
// with the locator exactly as printed and the section/slide where it appears.
const firstSlideForPara = {};
const firstSlideForObj = {};
for (const s of slides) for (const nt of s.notes) {
  if (nt.kind === 'table' || nt.kind === 'figure') { firstSlideForObj[nt.ref] ??= s.n; continue; }
  for (const p of nt.paras) if (nt.sid) firstSlideForPara[`${nt.sid}#${p.n}`] ??= s.n;
}
for (const s of slides) { if (s.table) firstSlideForObj[s.table] ??= s.n; for (const c of s.charts || []) firstSlideForObj[c] ??= s.n; }

const splitSentences = (t) => t.replace(/\b(pp|p|paras|para|No|e\.g|i\.e|vs|al|Dr|Mr|U\.S|St)\.\s/g, '$1.\u0007').replace(/(n\.d)\.\s/g, '$1.\u0007')
  .split(/(?<=[.?!”"])\s+(?=[A-Z“"(\d])/).map((x) => x.replace(/\u0007/g, ' '));

const cites = {};
for (let n = 1; n <= N_SOURCES; n++) cites[n] = { n, citedFor: [], locators: [], sections: [], slides: [], inferred: [] };
const addCite = (n, entry, loc, sectionLabel, inferredText) => {
  const c = cites[n];
  if (!c) return;
  if (!c.citedFor.some((e) => e.text === entry.text)) c.citedFor.push(entry);
  if (loc && !c.locators.includes(loc)) c.locators.push(loc);
  if (sectionLabel && !c.sections.includes(sectionLabel)) c.sections.push(sectionLabel);
  if (inferredText && !c.inferred.includes(inferredText)) c.inferred.push(inferredText);
};
for (const sid of order) {
  const s = sections[sid];
  if (sid === 'refs' || sid === 'cover') continue;
  const label = s.title;
  for (const p of s.paras) {
    for (const sent of splitSentences(p.text)) {
      for (const tok of tokenize(sent)) {
        const slide = firstSlideForPara[`${sid}#${p.n}`] || null;
        const entry = { text: plain(sent), sid, para: p.n, page: p.page, slide };
        if (tok.t === 'cite') for (const pt of tok.parts) addCite(pt.n, entry, pt.loc, label);
        if (tok.t === 'ay') addCite(tok.n, entry, '', label, tok.status === 'inferred' ? tok.text : '');
      }
    }
  }
}
const objSection = (o) => sections[o.section] ? sections[o.section].title : o.section;
for (const [key, t] of Object.entries(tables)) {
  const slide = firstSlideForObj[key] || null;
  const lines = [t.source, t.note, ...t.rows.flat()].filter(Boolean);
  for (const line of lines) for (const tok of tokenize(line)) {
    const entry = { text: `${t.caption.split('.')[0]}: ${plain(line)}`, sid: t.section, page: t.page, slide };
    if (tok.t === 'cite') for (const pt of tok.parts) addCite(pt.n, entry, pt.loc, objSection(t));
    if (tok.t === 'ay') {
      const loc = (tok.text.match(/^\d{4}[a-c]?,\s*(.+)$/) || tok.text.match(/^[^(]*\(\d{4}[a-c]?,\s*(.+)\)$/) || [])[1] || '';
      addCite(tok.n, entry, loc, objSection(t), tok.status === 'inferred' ? tok.text : '');
    }
  }
}
for (const [key, c] of Object.entries(charts)) {
  if (!/^F\d+$/.test(key) || !c.source) continue;
  const slide = firstSlideForObj[key] || null;
  const sec = Object.values(sections).find((s) => s.objects.some((o) => o.key === key));
  for (const tok of tokenize(c.source)) if (tok.t === 'ay') {
    const loc = (tok.text.match(/^\d{4}[a-c]?,\s*(.+)$/) || [])[1] || '';
    addCite(tok.n, { text: `${c.caption.split('.')[0]}: ${plain(c.source)}`, sid: sec?.id, slide }, loc, sec?.title, tok.status === 'inferred' ? tok.text : '');
  }
}
// slides that show [n]
for (const s of slides) {
  const ns = new Set(slideStrings(s).flatMap(citedNumbers));
  for (const n of ns) if (cites[n] && !cites[n].slides.includes(s.n)) cites[n].slides.push(s.n);
}

// ------------------------------------------------------------------ output
const outDir = path.join(root, 'src/data');
fs.mkdirSync(outDir, { recursive: true });
const data = { meta: deck.meta, parts, partStart, slides, references, cites, built: new Date().toISOString().slice(0, 10),
  paperSections: order.filter((id) => !['refs'].includes(id)).map((id) => ({ id, title: sections[id].title, page: sections[id].page })) };
fs.writeFileSync(path.join(outDir, 'deck.json'), JSON.stringify(data));
// paper text index used by verify-content (not shipped to the browser)
fs.writeFileSync(path.join(root, 'content/.paper-index.json'), JSON.stringify({ sections, order, coverLines }));

if (errors.length) { console.error('build-content: ' + errors.length + ' error(s)\n  ' + errors.join('\n  ')); process.exit(1); }
const uncited = Object.values(cites).filter((c) => !c.citedFor.length).map((c) => c.n);
console.log(`build-content: ${slides.length} sections, ${Object.keys(references).length} references, sources never cited in body: [${uncited.join(', ')}]`);
export { slideStrings };
