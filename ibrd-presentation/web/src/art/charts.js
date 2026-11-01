// Quiet engraved charts drawn from content/charts.yaml (numbers printed in the paper only).
// Labels are >= 21 viewBox units (>= 20 px on the stage). Series use ink, hatching, teal and ochre.
// One colour, one meaning across the deck: any series named "IBRD ..." is teal; brick red is kept for the UI
// accent (citations, rules) and never encodes data.
let cid = 0;
const IBRD_FILL = '#2C6E6A';
const FILLS = ['#2F4458', 'url(#HATCH)', '#7A8C9C', '#C9A24A'];
const INK_ON = new Set(['url(#HATCH)', '#C9A24A']); // fills that take dark labels
const fmt = (v, f) => (v == null ? '' : f === '0"%"' ? `${v}%` : f === '0.0"%"' ? `${Number(v).toFixed(1)}%` : f === '0.00' ? Number(v).toFixed(2) : f === '0.0' ? Number(v).toFixed(1) : String(v));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function chartSVG(c, count = 1) {
  const W = 1000, H = count > 1 ? 250 : 600;
  const id = 'c' + ++cid;
  // hatch on a light slate tint, so even a very short hatched bar shows as a tone
  const defs = `<defs><pattern id="${id}h" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#D3DAE1"/><line x1="0" y1="0" x2="0" y2="7" stroke="#2F4458" stroke-width="2.4"/></pattern></defs>`;
  const base = (i, name) => (/^IBRD\b/.test(name || '') ? IBRD_FILL : FILLS[i % FILLS.length]);
  const fill = (i, name) => base(i, name).replace('HATCH', id + 'h');
  const labelColor = (i, name) => (INK_ON.has(base(i, name)) ? '#23292F' : '#FFF8EA');
  const MINH = 4; // visual floor for a bar's height in px (value labels always print the data value)
  const T = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-size="${Math.max(21, o.s || 21)}" text-anchor="${o.a || 'middle'}" fill="${o.c || '#23292F'}" font-weight="${o.w || 400}" font-family="Be Vietnam Pro, sans-serif" style="font-variant-numeric:tabular-nums">${esc(t)}</text>`;
  // label on a hatched fill: a small cream plate keeps the number readable (>= 4.5:1) without hiding the hatch
  const TB = (x, y, t, o = {}) => { const s = o.s || 20, w = String(t).length * s * 0.62 + 14;
    return `<rect x="${x - w / 2}" y="${y - s * 0.86}" width="${w}" height="${s * 1.18}" rx="4" fill="#FBF2DE" fill-opacity=".94"/>` + T(x, y, t, { ...o, c: '#23292F' }); };
  const legend = (series, y) => { let x = 20; return series.map((s, i) => { const o = `<rect x="${x}" y="${y - 16}" width="22" height="22" fill="${fill(i, s.name)}" stroke="#2F4458"/>${T(x + 30, y, s.name, { a: 'start' })}`; x += 30 + s.name.length * 12 + 40; return o; }).join(''); };
  let body = '';
  if (c.type === 'bar_stacked' || c.type === 'bar_clustered') {
    const stacked = c.type === 'bar_stacked';
    const totals = c.categories.map((_, ci) => (stacked ? c.series.reduce((a, s) => a + (s.values[ci] || 0), 0) : Math.max(...c.series.map((s) => s.values[ci] || 0))));
    const max = Math.max(...totals) * 1.12;
    const top = 50, bot = H - 44, left = 70, right = W - 20;
    const y = (v) => bot - ((bot - top) * v) / max;
    const gw = (right - left) / c.categories.length;
    const stepV = [10, 20, 25, 50, 100, 200, 250, 500].find((st) => max / st <= 5) || 1000;
    for (let v = 0; v <= max; v += stepV) { body += `<line x1="${left}" x2="${right}" y1="${y(v)}" y2="${y(v)}" stroke="#2F4458" stroke-opacity=".18"/>${T(left - 10, y(v) + 6, v, { a: 'end', c: '#4A5D6E' })}`; }
    c.categories.forEach((cat, ci) => {
      const x0 = left + gw * ci + gw * 0.18, bw = gw * 0.64;
      if (stacked) {
        let acc = 0;
        const outside = [];
        c.series.forEach((s, si) => { const v = s.values[ci]; if (!v) return; const y1 = y(acc + v), y0 = y(acc);
          body += `<rect x="${x0}" y="${y1}" width="${bw}" height="${Math.max(MINH, y0 - y1)}" fill="${fill(si, s.name)}" stroke="#2F4458" stroke-width="1.2"/>`;
          const lab = fmt(v, c.number_format);
          if (y0 - y1 > 30) body += (base(si, s.name) === 'url(#HATCH)' ? TB : T)(x0 + bw / 2, (y0 + y1) / 2 + 8, lab, { s: 21, c: labelColor(si, s.name), w: 600 });
          else outside.push({ yMid: (y0 + y1) / 2, lab });
          acc += v; });
        // thin segments: label beside the bar with a short leader, spaced so labels never collide
        let last = Infinity;
        outside.forEach((o) => { const ly = Math.min(o.yMid + 8, last - 24); last = ly;
          body += `<path d="M${x0 + bw},${o.yMid} H${x0 + bw + 14} L${x0 + bw + 22},${ly - 7}" stroke="#2F4458" stroke-width="1.4" fill="none"/>` + T(x0 + bw + 26, ly, o.lab, { a: 'start', w: 600 }); });
        body += T(x0 + bw / 2, y(acc) - 10, fmt(+acc.toFixed(2), c.number_format), { w: 600 });
      } else {
        const n = c.series.length, w1 = bw / n;
        c.series.forEach((s, si) => { const v = s.values[ci]; if (v == null) return;
          body += `<rect x="${x0 + si * w1}" y="${Math.min(y(v), bot - MINH)}" width="${w1 - 6}" height="${Math.max(MINH, bot - y(v))}" fill="${fill(si, s.name)}" stroke="#2F4458" stroke-width="1.4"/>${T(x0 + si * w1 + (w1 - 6) / 2, Math.min(y(v), bot - MINH) - 8, fmt(v, c.number_format), { w: 600 })}`; });
      }
      body += T(x0 + bw / 2, bot + 28, cat, {});
    });
    body += `<line x1="${left}" x2="${right}" y1="${bot}" y2="${bot}" stroke="#2F4458" stroke-width="2"/>` + legend(c.series, 22);
  } else if (c.type === 'bar_horizontal' || c.type === 'bar_horizontal_stacked100') {
    const st = c.type === 'bar_horizontal_stacked100';
    const left = st ? 330 : 280, right = W - 70, top = st ? 46 : 14, rowH = (H - top - (st ? 10 : 40)) / c.categories.length;
    const max = st ? 100 : Math.max(...c.series[0].values) * 1.08;
    const x = (v) => left + ((right - left) * v) / max;
    if (!st) [0, 50, 100, 150, 200].forEach((v) => { body += `<line x1="${x(v)}" x2="${x(v)}" y1="${top}" y2="${H - 34}" stroke="#2F4458" stroke-opacity="${v === 100 ? .7 : .15}" ${v === 100 ? 'stroke-dasharray="6 5"' : ''}/>${T(x(v), H - 10, v + '%', { c: '#4A5D6E' })}`; });
    c.categories.forEach((cat, ci) => {
      const yy = top + rowH * ci + rowH * 0.18, bh = rowH * 0.64;
      body += T(left - 14, yy + bh / 2 + 7, cat, { a: 'end' });
      let acc = 0;
      c.series.forEach((s, si) => { const v = s.values[ci]; if (!v) return;
        body += `<rect x="${x(acc)}" y="${yy}" width="${x(acc + v) - x(acc)}" height="${bh}" fill="${st ? fill(si, s.name) : fill(v < 100 ? 1 : 0)}" stroke="#2F4458" stroke-width="1.2"/>`;
        if (st) body += (base(si, s.name) === 'url(#HATCH)' ? TB : T)((x(acc) + x(acc + v)) / 2, yy + bh / 2 + 8, v + '%', { w: 600, c: labelColor(si, s.name) });
        else body += T(x(v) + 10, yy + bh / 2 + 7, fmt(v, c.number_format), { a: 'start', w: 600 });
        acc += v; });
    });
    if (st) body += legend(c.series, 24);
  } else if (c.type === 'bar_kpi') {
    // actual as % of target: one bar per indicator, dashed 100 % target line, the lowest bar in ochre
    const v = c.series[0].values, n = v.length, low = Math.min(...v);
    const left = 470, right = W - 110, top = 54, bot = H - 40, rowH = (bot - top) / n;
    const x = (val) => left + ((right - left) * val) / 100;
    [0, 25, 50, 75].forEach((g) => { body += `<line x1="${x(g)}" x2="${x(g)}" y1="${top - 6}" y2="${bot}" stroke="#2F4458" stroke-opacity=".15"/>${T(x(g), H - 10, g + '%', { c: '#4A5D6E' })}`; });
    body += `<line x1="${x(100)}" x2="${x(100)}" y1="${top - 18}" y2="${bot}" stroke="#2F4458" stroke-width="2.4" stroke-dasharray="8 6"/>${T(x(100), H - 10, '100%', { c: '#4A5D6E', w: 600 })}${T(x(100), top - 26, c.target || '', { w: 600 })}`;
    v.forEach((val, i) => {
      const yy = top + rowH * i + rowH * 0.2, bh = rowH * 0.6, hl = val === low;
      body += T(left - 16, yy + bh / 2 + 8, c.categories[i], { a: 'end' });
      body += `<rect x="${left}" y="${yy}" width="${Math.max(MINH, x(val) - left)}" height="${bh}" fill="${hl ? '#A87A2A' : '#2F4458'}" stroke="#2F4458" stroke-width="1.2"/>`;
      body += T(x(val) + 12, yy + bh / 2 + 8, fmt(val, c.number_format), { a: 'start', w: 700, c: hl ? '#7A5410' : '#23292F' });
    });
  } else if (c.type === 'line') {
    const v = c.series[0].values, min = 2.0, max = 2.7;
    const left = 70, right = W - 30, top = 30, bot = H - 44;
    const xs = (i) => left + ((right - left) * i) / (v.length - 1), ys = (val) => bot - ((bot - top) * (val - min)) / (max - min);
    for (let g = 2.0; g <= 2.71; g += 0.1) body += `<line x1="${left}" x2="${right}" y1="${ys(g)}" y2="${ys(g)}" stroke="#2F4458" stroke-opacity=".15"/>${T(left - 10, ys(g) + 6, g.toFixed(1), { a: 'end', c: '#4A5D6E' })}`;
    const d = v.map((val, i) => `${i ? 'L' : 'M'}${xs(i)},${ys(val)}`).join('');
    body += `<path d="${d} L${xs(v.length - 1)},${bot} L${xs(0)},${bot}z" fill="url(#${id}h)" opacity=".35"/><path d="${d}" stroke="#2F4458" stroke-width="3.5" fill="none"/>`;
    v.forEach((val, i) => { body += `<circle cx="${xs(i)}" cy="${ys(val)}" r="7" fill="#FBF2DE" stroke="#2F4458" stroke-width="3"/>${TB(xs(i), ys(val) - 18, val.toFixed(2), { w: 600 })}${T(xs(i), bot + 28, c.categories[i], {})}`; });
    body += `<line x1="${left}" x2="${right}" y1="${bot}" y2="${bot}" stroke="#2F4458" stroke-width="2"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(c.caption)}">${defs}${body}</svg>`;
}
