// Inline markup shared by the browser deck and the Node build/check scripts.
//   **bold**            key phrase
//   [44; 41, pp. 2–3]   numbered citations; each number becomes its own link, locators stay plain text
//   {{ay:Wes (2023)|14|certain}}   author–year citation mapped to a numbered source
// Project, loan and decree codes are detected and set in the mono face.

export const N_SOURCES = 58;
const CODE_RE = /(P\d{6}|\d{4}-VN|IBRD-\d{5}|RES\d{5}|\d{1,3}\/\d{4}\/ND-CP|NT-2\.\d)/g;

// "[41, Annex 3; 42, pp. 2–3]" -> [{n:41, loc:'Annex 3'}, {n:42, loc:'pp. 2–3'}]; null if not a citation
export function parseCiteGroup(inner) {
  const parts = inner.split(';').map((s) => s.trim()).filter(Boolean);
  if (!parts.length) return null;
  const out = [];
  for (const p of parts) {
    const m = p.match(/^(\d{1,2})(?:\s*,\s*(.+))?$/);
    if (!m) return null;
    const n = Number(m[1]);
    if (n < 1 || n > N_SOURCES) return null;
    out.push({ n, loc: m[2] ? m[2].trim() : '' });
  }
  return out;
}

// Tokenize one line of markup.
export function tokenize(str) {
  const tokens = [];
  let i = 0;
  let buf = '';
  let bold = false;
  const push = (tok) => {
    if (buf) { tokens.push({ t: 'text', v: buf, bold }); buf = ''; }
    if (tok) tokens.push({ ...tok, bold });
  };
  while (i < str.length) {
    if (str.startsWith('**', i)) { push(); bold = !bold; i += 2; continue; }
    if (str.startsWith('{{ay:', i)) {
      const end = str.indexOf('}}', i);
      const [text, n, status] = str.slice(i + 5, end).split('|');
      push({ t: 'ay', text, n: Number(n), status });
      i = end + 2;
      continue;
    }
    if (str[i] === '[') {
      const end = str.indexOf(']', i);
      if (end > i) {
        const parts = parseCiteGroup(str.slice(i + 1, end));
        if (parts) { push({ t: 'cite', parts }); i = end + 1; continue; }
      }
    }
    buf += str[i];
    i += 1;
  }
  push();
  return tokens;
}

export const plain = (str) => tokenize(str).map((t) => {
  if (t.t === 'text') return t.v;
  if (t.t === 'ay') return t.text;
  return '[' + t.parts.map((p) => p.n + (p.loc ? ', ' + p.loc : '')).join('; ') + ']';
}).join('');

export const citedNumbers = (str) => {
  const ns = [];
  for (const t of tokenize(str)) {
    if (t.t === 'cite') ns.push(...t.parts.map((p) => p.n));
    if (t.t === 'ay') ns.push(t.n);
  }
  return ns;
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const codes = (s) => esc(s).replace(CODE_RE, '<span class="code">$1</span>');

// HTML for the deck. Citation links carry data-src so the drawer can open without leaving the section.
export function toHTML(str) {
  return tokenize(str).map((t) => {
    let h;
    if (t.t === 'text') h = codes(t.v);
    else if (t.t === 'ay') {
      const cls = t.status === 'inferred' ? 'cite cite-ay inferred' : 'cite cite-ay';
      h = `<a class="${cls}" href="#src-${t.n}" data-src="${t.n}" data-status="${t.status}">${esc(t.text)}</a>`;
    } else {
      h = '<span class="cite-group">[' + t.parts.map((p) =>
        `<a class="cite" href="#src-${p.n}" data-src="${p.n}" aria-label="Source ${p.n}">${p.n}</a>` +
        (p.loc ? `<span class="cite-loc">, ${esc(p.loc)}</span>` : '')).join('<span class="cite-sep">; </span>') + ']</span>';
    }
    return t.bold && t.t === 'text' ? `<strong>${h}</strong>` : h;
  }).join('');
}
