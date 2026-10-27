// Quiet engraved charts drawn from content/charts.yaml (numbers printed in the paper only).
// Labels are ≥ 19 px on the stage; series use ink, hatching and brick rather than many colours.
let cid = 0;
const FILLS = ['#2F4458', 'url(#HATCH)', '#A13D2D', '#C9A24A'];
const fmt = (v, f) => (v == null ? '' : f === '0"%"' ? `${v}%` : f === '0.0"%"' ? `${Number(v).toFixed(1)}%` : f === '0.00' ? Number(v).toFixed(2) : f === '0.0' ? Number(v).toFixed(1) : String(v));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function chartSVG(c, count = 1) {
  const W = 1000, H = count > 1 ? 250 : 540;
  const id = 'c' + ++cid;
  const defs = `<defs><pattern id="${id}h" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#FBF2DE"/><line x1="0" y1="0" x2="0" y2="7" stroke="#2F4458" stroke-width="2.2"/></pattern></defs>`;
  const fill = (i) => FILLS[i % FILLS.length].replace('HATCH', id + 'h');
  const T = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 20}" text-anchor="${o.a || 'middle'}" fill="${o.c || '#23292F'}" font-weight="${o.w || 400}" font-family="Be Vietnam Pro, sans-serif" style="font-variant-numeric:tabular-nums">${esc(t)}</text>`;
  const legend = (series, y) => series.map((s, i) => `<rect x="${20 + i * 250}" y="${y - 15}" width="20" height="20" fill="${fill(i)}" stroke="#2F4458"/>${T(48 + i * 250, y, s.name, { a: 'start', s: 19 })}`).join('');
  let body = '';
  if (c.type === 'bar_stacked' || c.type === 'bar_clustered') {
    const stacked = c.type === 'bar_stacked';
    const totals = c.categories.map((_, ci) => (stacked ? c.series.reduce((a, s) => a + (s.values[ci] || 0), 0) : Math.max(...c.series.map((s) => s.values[ci] || 0))));
    const max = Math.max(...totals) * 1.12;
    const top = 50, bot = H - 44, left = 70, right = W - 20;
    const y = (v) => bot - ((bot - top) * v) / max;
    const gw = (right - left) / c.categories.length;
    const stepV = [10, 20, 25, 50, 100, 200, 250, 500].find((st) => max / st <= 5) || 1000;
    for (let v = 0; v <= max; v += stepV) { body += `<line x1="${left}" x2="${right}" y1="${y(v)}" y2="${y(v)}" stroke="#2F4458" stroke-opacity=".18"/>${T(left - 10, y(v) + 6, v, { a: 'end', s: 18, c: '#4A5D6E' })}`; }
    c.categories.forEach((cat, ci) => {
      const x0 = left + gw * ci + gw * 0.18, bw = gw * 0.64;
      if (stacked) {
        let acc = 0;
        c.series.forEach((s, si) => { const v = s.values[ci]; if (!v) return; const y1 = y(acc + v), y0 = y(acc);
          body += `<rect x="${x0}" y="${y1}" width="${bw}" height="${y0 - y1}" fill="${fill(si)}" stroke="#2F4458" stroke-width="1.2"/>`;
          if (y0 - y1 > 24) body += T(x0 + bw / 2, (y0 + y1) / 2 + 7, fmt(v, c.number_format), { s: 19, c: si === 1 ? '#23292F' : '#FFF8EA', w: 600 });
          acc += v; });
        body += T(x0 + bw / 2, y(acc) - 10, fmt(+acc.toFixed(2), c.number_format), { s: 20, w: 600 });
      } else {
        const n = c.series.length, w1 = bw / n;
        c.series.forEach((s, si) => { const v = s.values[ci]; if (v == null) return;
          body += `<rect x="${x0 + si * w1}" y="${y(v)}" width="${w1 - 6}" height="${bot - y(v)}" fill="${fill(si)}" stroke="#2F4458" stroke-width="1.2"/>${T(x0 + si * w1 + (w1 - 6) / 2, y(v) - 8, fmt(v, c.number_format), { s: 19, w: 600 })}`; });
      }
      body += T(x0 + bw / 2, bot + 28, cat, { s: 19 });
    });
    body += `<line x1="${left}" x2="${right}" y1="${bot}" y2="${bot}" stroke="#2F4458" stroke-width="2"/>` + legend(c.series, 22);
  } else if (c.type === 'bar_horizontal' || c.type === 'bar_horizontal_stacked100') {
    const st = c.type === 'bar_horizontal_stacked100';
    const left = st ? 330 : 280, right = W - 70, top = st ? 46 : 14, rowH = (H - top - (st ? 10 : 40)) / c.categories.length;
    const max = st ? 100 : Math.max(...c.series[0].values) * 1.08;
    const x = (v) => left + ((right - left) * v) / max;
    if (!st) [0, 50, 100, 150, 200].forEach((v) => { body += `<line x1="${x(v)}" x2="${x(v)}" y1="${top}" y2="${H - 34}" stroke="#2F4458" stroke-opacity="${v === 100 ? .7 : .15}" ${v === 100 ? 'stroke-dasharray="6 5"' : ''}/>${T(x(v), H - 10, v + '%', { s: 18, c: '#4A5D6E' })}`; });
    c.categories.forEach((cat, ci) => {
      const yy = top + rowH * ci + rowH * 0.18, bh = rowH * 0.64;
      body += T(left - 14, yy + bh / 2 + 7, cat, { a: 'end', s: 19 });
      let acc = 0;
      c.series.forEach((s, si) => { const v = s.values[ci]; if (!v) return;
        body += `<rect x="${x(acc)}" y="${yy}" width="${x(acc + v) - x(acc)}" height="${bh}" fill="${fill(st ? si : (v < 100 ? 1 : 0))}" stroke="#2F4458" stroke-width="1.2"/>`;
        if (st) body += T((x(acc) + x(acc + v)) / 2, yy + bh / 2 + 7, v + '%', { s: 19, w: 600, c: si === 0 ? '#FFF8EA' : '#23292F' });
        else body += T(x(v) + 10, yy + bh / 2 + 7, fmt(v, c.number_format), { a: 'start', s: 20, w: 600 });
        acc += v; });
    });
    if (st) body += legend(c.series, 24);
  } else if (c.type === 'line') {
    const v = c.series[0].values, min = 2.0, max = 2.7;
    const left = 70, right = W - 30, top = 30, bot = H - 44;
    const xs = (i) => left + ((right - left) * i) / (v.length - 1), ys = (val) => bot - ((bot - top) * (val - min)) / (max - min);
    for (let g = 2.0; g <= 2.71; g += 0.1) body += `<line x1="${left}" x2="${right}" y1="${ys(g)}" y2="${ys(g)}" stroke="#2F4458" stroke-opacity=".15"/>${T(left - 10, ys(g) + 6, g.toFixed(1), { a: 'end', s: 18, c: '#4A5D6E' })}`;
    const d = v.map((val, i) => `${i ? 'L' : 'M'}${xs(i)},${ys(val)}`).join('');
    body += `<path d="${d} L${xs(v.length - 1)},${bot} L${xs(0)},${bot}z" fill="url(#${id}h)" opacity=".35"/><path d="${d}" stroke="#A13D2D" stroke-width="3.5" fill="none"/>`;
    v.forEach((val, i) => { body += `<circle cx="${xs(i)}" cy="${ys(val)}" r="7" fill="#FBF2DE" stroke="#A13D2D" stroke-width="3"/>${T(xs(i), ys(val) - 16, val.toFixed(2), { s: 19, w: 600 })}${T(xs(i), bot + 28, c.categories[i], { s: 19 })}`; });
    body += `<line x1="${left}" x2="${right}" y1="${bot}" y2="${bot}" stroke="#2F4458" stroke-width="2"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(c.caption)}">${defs}${body}</svg>`;
}
