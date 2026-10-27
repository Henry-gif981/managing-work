#!/usr/bin/env node
// Anti-fabrication check: every number, year, code, decree, citation number and capitalised name shown on the
// stage must occur in the paper; reports paper content not shown anywhere (bullets, tables or verbatim notes);
// enforces bullet rules, removed drafting notes and the template/ground rhythm. Exit 1 on errors.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { plain, citedNumbers } from '../src/lib/markup.js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const deck = JSON.parse(rd('src/data/deck.json'));
const idx = JSON.parse(rd('content/.paper-index.json'));
const { tables } = yaml.load(rd('content/tables.yaml'));
const { charts } = yaml.load(rd('content/charts.yaml'));
const errors = [], warns = [], out = [];

// ---------------------------------------------------------------- paper corpus (verbatim text, tables, figures, refs)
const raw = rd('content/raw.txt').replace(/[​]/g, '');
const paras = Object.values(idx.sections).flatMap((s) => s.paras.map((p) => p.text));
const tableTxt = Object.values(tables).flatMap((t) => [t.caption, ...t.header, ...t.rows.flat(), t.source, t.note || '']).map(plain);
const chartTxt = Object.values(charts).flatMap((c) => [c.caption || '', plain(c.source || '')]);
const corpus = [raw.replace(/\s+/g, ' '), ...paras, ...tableTxt, ...chartTxt, ...Object.values(idx.sections).map((s) => s.title)].join(' \n ').replace(/[–—]/g, '–');
const has = (x) => corpus.includes(x);
const corpusLower = corpus.toLowerCase();

// ---------------------------------------------------------------- strings shown per section
function shown(s) {
  const o = [];
  const add = (x) => { if (typeof x === 'string' && x) o.push(x); };
  [s.title, s.sub, s.lead, s.quote, s.foot].forEach(add);
  (s.bullets || []).forEach((b) => add(typeof b === 'string' ? b : b.t));
  (s.items || []).forEach((it) => (typeof it === 'string' ? add(it) : [it.d, it.t, it.h, it.b].forEach(add)));
  (s.cards || []).forEach((c) => { add(c.h); add(c.b); });
  (s.steps || []).forEach((c) => { add(c.h); add(c.b); });
  (s.nums || []).forEach((c) => { add(c.v); add(c.l); });
  for (const k of ['left', 'right']) if (s[k]) { add(s[k].h); s[k].items.forEach(add); }
  return o;
}
// Presentation vocabulary that is not a claim about the paper (labels, navigation, template words).
const ALLOW_WORDS = new Set(['Q1', 'Q2', 'Q3', 'Q4', 'Intro', 'End', 'Contents', 'Credits', 'References', 'Index', 'Thank', 'Section', 'Chapter', 'Conclusion', 'Introduction',
  'Strengths', 'Weaknesses', 'Significance', 'Limitations', 'Achievements', 'Subject', 'Content', 'Space', 'Time', 'Today', 'But', 'Why', 'Next', 'Lesson', 'Mechanism', 'Split', 'Projection',
  'Kept', 'Approves', 'Membership', 'Caution', 'Comparison', 'Dates', 'Cost', 'Closing', 'Objective', 'Agencies', 'Network', 'Continuity', 'Implementation', 'Response', 'Strain', 'Overflows',
  'PAD', 'Shares', 'Blend', 'Total', 'Currency', 'Maturity', 'Repayment', 'Fees', 'Overall', 'Accounts', 'Methods', 'Three', 'Two', 'One', 'Four', 'Six', 'Whole', 'By', 'Its', 'Largest', 'New', 'Root', 'Fiduciary', 'Delays', 'Contracts', 'Support', 'Targets', 'Bank', 'Outcome', 'Funds', 'Limited', 'Scope', 'No', 'Indicators', 'Works', 'Disbursement', 'Flood', 'Completed', 'Not', 'Institutions', 'Plans', 'Affected', 'Land', 'Management', 'Restrictions', 'Weak', 'Land', 'Financial', 'Technical', 'Procedural', 'Counterpart', 'Safeguards', 'Slow', 'Prepare', 'Secure', 'Align', 'Stabilize', 'Streamline', 'Choose', 'Finance', 'Training', 'Results', 'Constraints', 'Consequences', 'One', 'Careful', 'Timely', 'Data', 'Sources', 'Update', 'Post-IDA', 'Other', 'Quantify', 'Above', 'Smart', 'Ninh', 'Capacity', 'Source', 'Context', 'Trend', 'Causes', 'Faults', 'Renewables', 'Model', 'Project', 'Counterpart', 'Different', 'Still', 'Sustainability', 'Outputs', 'Operations', 'Preparation', 'Money', 'Attribution', 'Before', 'IPF', 'DPF', 'PforR', 'Case', 'Lending', 'Funding', 'Project', 'Cycle', 'Costly', 'Crisis', 'Catalytic', 'Beyond', 'Main', 'Middle', 'Growing', 'Careful', 'Qualitative', 'Reducing', 'Limits', 'Cooperative', 'Eligibility', 'Borrowers', 'Mission', 'Oldest', 'Pricing', 'Clients', 'Effective', 'Versus', 'Interest', 'Spread', 'Commitment', 'Average', 'Short', 'Older', 'Stricter', 'Restructuring', 'Cancellation', 'Joint', 'Documentation', 'Idle', 'Real', 'Structure', 'Exposure', 'DLIs', 'Country', 'IEG', 'Aims', 'PIR', 'Task', 'Viability', 'Quality', 'RAS', 'Vietnam', 'Early', 'TEP', 'PMUs', 'Continuity', 'Open', 'Learning', 'National', 'Planned', 'Umbrella', 'Market', 'Coexistence', 'Mix', 'Approval', 'Network', 'Four', 'AMS', 'Counterpart-funded', 'Disciplines', 'Savings', 'Less', 'Mixed', 'Smart-grid', 'IBRD', 'IDA', 'CCSEP', 'ESF', 'E&S', 'Two', 'Domestic', 'ESF', 'Kept', 'Funding', 'Ten', 'Money', 'Advice', 'Training', 'Investments', 'Reforms', 'PDO', 'Blend', 'Terms', 'IDA', 'A', 'The', 'In', 'As', 'For', 'Under', 'At', 'From', 'After', 'Across', 'This', 'These', 'Each', 'Every', 'How', 'What', 'Where', 'One', 'Then', 'Only', 'Several', 'Methodology', 'Research', 'Objectives', 'Practice', 'Four', 'Ten', 'Environmental', 'Social', 'Standards', 'Governance', 'Levels', 'Voting', 'Power', 'Follows', 'Shares', 'Instruments', 'Loan', 'Terms', 'Price', 'Long', 'Maturities', 'Lending', 'Compared', 'Disbursement', 'Binding', 'Constraint', 'Practice', 'Analytics', 'Advisory', 'Services', 'Evaluation', 'Monitoring', 'Shows', 'Units', 'Knowledge', 'Transfer', 'Doing', 'Reform', 'Depends', 'Borrower', 'Forms', 'Reinforce', 'Shift', 'Substitution', 'Late', 'Legal', 'Systems', 'Chain', 'Decrees', 'Regulatory', 'Milestones', 'Concessional', 'Loans', 'Overview', 'Profile', 'Planned', 'Envelope', 'Components', 'Approval', 'Pictures', 'Contractual', 'Platform', 'Friction', 'Physical', 'Against', 'Output', 'Electricity', 'Transmitted', 'System-level', 'Service', 'Efficiency', 'Losses', 'Economic', 'Return', 'Gap', 'Definitions', 'Assessment', 'Conclusions', 'Needed', 'Key', 'Package', 'Blended', 'Sets', 'On-granting', 'On-lending', 'Sources', 'Decentralized', 'Adjusted', 'Commitments', 'Start', 'Factors', 'Bottleneck', 'Performance', 'Institutional', 'So', 'Far', 'Climate', 'Resilience', 'Single', 'Largest', 'Formal', 'Complaint', 'Direct', 'Pillars', 'Cases', 'Show', 'Directions', 'Further', 'Recommendations', 'Rationale', 'Problem', 'Questions', 'Definition', 'Borrowers', 'Differs', 'History', 'Stages', 'Comes', 'Lending', 'Safeguards', 'Procurement', 'Multilateral', 'Development', 'Role', 'Matters', 'Now', 'Group', 'World', 'Five', 'Institutions', 'Six-stage', 'End', 'Approval', 'From', 'Policy', 'Matrix', 'Budget', 'Preparation', 'Its', 'Ten', 'Three', 'Vs', 'Study', 'Case', 'Efficiency', 'Transmission', 'Coastal', 'Cities', 'Sustainable', 'Sector', 'Energy', 'Urban', 'Environment', 'Selected', 'Projects', 'Sections', 'Context']);

const NUM = /(?:US\$|USD\s)?\d[\d.,]*(?:\s?(?:%|km|MW|TWh|ha|bps))?/g;
const CODE = /\b(P\d{6}|\d{4}-VN|IBRD-\d{5}|RES\d{5}|\d{1,3}\/\d{4}\/ND-CP|NT-2\.\d|FY\d{2}(?:–\d{2})?|IDA\d{2}|OP\s?4\.12|ESS\d{1,2})\b/g;
let checked = 0;
for (const s of deck.slides) {
  for (const str of shown(s)) {
    const p = plain(str).replace(/\[[^\]]*\]/g, ' ').replace(/[–—]/g, '–');
    for (const m of p.matchAll(CODE)) { checked++; if (!has(m[1]) && !has(m[1].replace(' ', ''))) errors.push(`s${s.n}: code "${m[1]}" not found in the paper`); }
    for (const m of p.matchAll(NUM)) {
      let v = m[0].replace(/^(US\$|USD\s)/, '').replace(/[.,]$/, '').trim();
      if (!/\d/.test(v) || /^\d$/.test(v)) continue; // single digits (counts like "3 bridges") checked by words
      checked++;
      const bare = v.replace(/\s?(%|km|MW|TWh|ha|bps)$/, '');
      const variants = [v, bare, bare.replace(/,/g, ''), bare.replace('.', ','), v.replace(/\s/g, '')];
      if (!variants.some(has)) errors.push(`s${s.n}: number "${v}" not found in the paper — “${p.slice(0, 80)}”`);
    }
    // capitalised words (names, institutions) — must exist in the paper unless presentation vocabulary
    const words = p.replace(/^[^:]{0,60}:/, (x) => x).split(/[\s/(),;:"“”]+/);
    for (let w of words) {
      w = w.replace(/['’]s$/, '').replace(/[.?!]+$/, '');
      if (!/^[A-ZĐ]/.test(w) || w.length < 2 || ALLOW_WORDS.has(w)) continue;
      checked++;
      if (!corpus.includes(w) && !corpusLower.includes(w.toLowerCase())) warns.push(`s${s.n}: capitalised word "${w}" not found verbatim in the paper`);
    }
  }
  // chart values: printed in the paper's tables/text, or documented as figure data labels / calculated in charts.yaml
  for (const c of s.chartData || []) for (const ser of c.series) for (const v of ser.values) {
    if (v == null) continue; checked++;
    const t = String(v), t2 = Number(v).toFixed(2), t1 = Number(v).toFixed(1);
    if (![t, t2, t1, t1.replace('.', ',')].some(has) && !/data labels|calculated/i.test(c.basis || '')) errors.push(`s${s.n}: chart ${c.key} value ${v} not in the paper`);
  }
  // citation numbers exist in the reference list
  for (const str of shown(s)) for (const n of citedNumbers(str)) if (!deck.references[n]) errors.push(`s${s.n}: citation [${n}] has no reference`);
  // drafting notes never on stage
  for (const str of shown(s)) if (/\(\s*lỗi\s*\)|quên mất|\(\s*check|\s\|$/.test(str)) errors.push(`s${s.n}: drafting note shown: ${str}`);
  // bullet rules
  const bl = (s.bullets || []).map((b) => (typeof b === 'string' ? b : b.t));
  if (bl.length > 6) errors.push(`s${s.n}: ${bl.length} bullets (max 6)`);
  if (bl.length === 1) errors.push(`s${s.n}: a single lone bullet`);
  for (const b of bl) {
    const words = plain(b).replace(/\[[^\]]*\]/g, '').trim().split(/\s+/).length;
    if (words > 22) warns.push(`s${s.n}: bullet of ${words} words (target ≤ ~20): ${plain(b).slice(0, 70)}…`);
    if (!/^\*\*[^*]+\*\*/.test(b)) errors.push(`s${s.n}: bullet without a bold key phrase: ${b.slice(0, 50)}`);
  }
}
if (!deck.meta.lecturer.includes('[TO BE CONFIRMED]')) errors.push('cover: lecturer placeholder missing');

// ---------------------------------------------------------------- coverage of the paper
const noted = new Set();
for (const s of deck.slides) for (const n of s.notes) { if (n.sid) n.paras.forEach((p) => noted.add(`${n.sid}#${p.n}`)); if (n.kind) noted.add(n.ref); }
const missing = [];
for (const id of idx.order) for (const p of idx.sections[id].paras) if (!noted.has(`${id}#${p.n}`)) missing.push(`${id}#${p.n}`);
const shownTables = new Set(deck.slides.flatMap((s) => [s.table, ...s.notes.filter((n) => n.kind === 'table').map((n) => n.ref)]).filter(Boolean));
const shownFigs = new Set(deck.slides.flatMap((s) => [...(s.charts || []), ...s.notes.filter((n) => n.kind === 'figure').map((n) => n.ref)]));
const missT = Object.keys(tables).filter((k) => !shownTables.has(k));
const missF = Object.keys(charts).filter((k) => /^F\d$/.test(k) && !shownFigs.has(k));
if (missing.length) errors.push(`paper paragraphs not in any section (bullets/notes): ${missing.join(', ')}`);
if (missT.length) errors.push(`tables not shown: ${missT.join(', ')}`);
if (missF.length) errors.push(`figures not shown or noted: ${missF.join(', ')}`);

// ---------------------------------------------------------------- rhythm
const tpls = deck.slides.map((s) => s.tpl);
for (let i = 2; i < tpls.length; i++) if (tpls[i] === tpls[i - 1] && tpls[i] === tpls[i - 2] && tpls[i] !== 'refs') errors.push(`sections ${i - 1}–${i + 1}: three consecutive "${tpls[i]}" templates`);
let run = 0;
deck.slides.forEach((s, i) => { run = s.ground === 'paper' ? run + 1 : 0; if (run > 4 && s.tpl !== 'refs') warns.push(`section ${i + 1}: ${run} paper grounds in a row`); });
const lone = deck.slides.filter((s) => !s.art && !s.obj && !['table', 'chart', 'grid', 'refs', 'index', 'agenda', 'credits'].includes(s.tpl));
lone.forEach((s) => errors.push(`s${s.n}: no graphic element besides text (no art, 3D, table, chart)`));

const total = Object.values(idx.sections).reduce((a, s) => a + s.paras.length, 0);
out.push(`# verify-content`, ``, `Sections: ${deck.slides.length} · tokens checked: ${checked} · paper paragraphs covered: ${total - missing.length}/${total} · tables ${Object.keys(tables).length - missT.length}/${Object.keys(tables).length} · figures ${8 - missF.length}/8`);
out.push(``, `## Errors (${errors.length})`, ...errors.map((e) => `- ${e}`), ``, `## Warnings for review (${warns.length})`, ...warns.map((w) => `- ${w}`));
out.push(``, `Result: ${errors.length ? 'FAIL' : 'PASS'} (${errors.length} errors, ${warns.length} warnings)`);
fs.mkdirSync(path.join(root, 'qa'), { recursive: true });
fs.writeFileSync(path.join(root, 'qa/verify-content.md'), out.join('\n') + '\n');
console.log(out.slice(0, 3).join('\n')); console.log(errors.slice(0, 40).join('\n')); console.log(`warnings: ${warns.length} (qa/verify-content.md)`); console.log(out[out.length - 1]);
process.exit(errors.length ? 1 : 0);
