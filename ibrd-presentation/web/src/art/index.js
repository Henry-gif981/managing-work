// Engraving library — hand-built SVG drawn in code: strokes + hatching, no filters, no fills except paper
// and the brick-red accents. `currentColor` is the ink, so the same drawing works on paper and wash grounds.
// Strokes that "draw" on entry carry class="stroke" and pathLength=2400 (see base.css).
import { VN_PATH, VN_W, VN_H } from './vietnam.js';

let uid = 0;
const S = 'class="stroke" pathLength="2400"';
const r2 = (v) => Math.round(v * 10) / 10;
const pts = (a) => a.map((p) => p.map(r2).join(',')).join(' ');

// hatch pattern defs (unique ids per drawing)
function hatchDefs(id, { gap = 7, angle = 45, w = 1.1 } = {}) {
  return `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})"><line x1="0" y1="0" x2="0" y2="${gap}" stroke="currentColor" stroke-width="${w}"/></pattern>`;
}
function cross(id, gap = 7, w = 0.9) {
  return `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse"><path d="M0,0L${gap},${gap}M${gap},0L0,${gap}" stroke="currentColor" stroke-width="${w}"/></pattern>`;
}
const svg = (vb, defs, body) => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${body}</svg>`;

// guilloche: hypotrochoid family, the banknote device
function guilloche(cx, cy, R, r, d, turns, n = 900, sw = 0.7) {
  let p = '';
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2 * turns;
    const x = cx + (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
    const y = cy + (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
    p += (i ? 'L' : 'M') + r2(x) + ',' + r2(y);
  }
  return `<path d="${p}" stroke-width="${sw}"/>`;
}
function rosette(cx, cy, size, sw = 0.7) {
  return guilloche(cx, cy, size, size * 0.27, size * 0.33, 9, 1400, sw)
    + guilloche(cx, cy, size * 0.62, size * 0.17, size * 0.21, 7, 900, sw)
    + `<circle cx="${cx}" cy="${cy}" r="${size * 1.06}" stroke-width="${sw * 1.6}"/><circle cx="${cx}" cy="${cy}" r="${size * 1.12}" stroke-width="${sw}"/>`;
}
// coin seen at an angle: stacked ellipses with reeded edge
function coinStack(cx, cy, rx, n, id) {
  let o = '';
  for (let i = n - 1; i >= 0; i--) {
    const y = cy - i * 14;
    o += `<path d="M${cx - rx},${y} v14 a${rx},${rx * 0.32} 0 0 0 ${rx * 2},0 v-14" fill="#FBF2DE" stroke-width="1.6"/>`;
    for (let k = -rx + 6; k < rx; k += 7) o += `<line x1="${cx + k}" y1="${y + 4 + Math.abs(k / rx) * -2}" x2="${cx + k}" y2="${y + 12 + (1 - Math.abs(k / rx)) * rx * 0.3}" stroke-width=".7"/>`;
    o += `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${rx * 0.32}" fill="#FBF2DE" stroke-width="1.6"/>`;
  }
  const top = cy - (n - 1) * 14;
  o += `<ellipse cx="${cx}" cy="${top}" rx="${rx * 0.78}" ry="${rx * 0.24}" stroke-width=".9"/><ellipse cx="${cx}" cy="${top}" rx="${rx * 0.5}" ry="${rx * 0.15}" fill="url(#${id})" stroke-width=".8"/>`;
  return o;
}
function coinFace(cx, cy, r, id) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FBF2DE" stroke-width="2" ${S}/><circle cx="${cx}" cy="${cy}" r="${r - 8}" stroke-width="1"/>`
    + guilloche(cx, cy, r * 0.62, r * 0.2, r * 0.22, 6, 700, 0.6)
    + Array.from({ length: 48 }, (_, i) => { const a = (i / 48) * Math.PI * 2; return `<line x1="${r2(cx + Math.cos(a) * (r - 8))}" y1="${r2(cy + Math.sin(a) * (r - 8))}" x2="${r2(cx + Math.cos(a) * (r - 2))}" y2="${r2(cy + Math.sin(a) * (r - 2))}" stroke-width=".8"/>`; }).join('')
    + `<path d="M${cx + r * 0.2},${cy - r} A${r},${r} 0 0 1 ${cx + r * 0.2},${cy + r}" stroke="none" fill="url(#${id})" opacity=".55"/>`;
}
function plinth(cx, y, w, id) {
  return `<path d="M${cx - w / 2},${y} h${w} l-${w * 0.06},26 h-${w * 0.88} z" fill="#FBF2DE" stroke-width="1.8" ${S}/>
  <path d="M${cx - w * 0.44},${y + 26} h${w * 0.88} v14 h-${w * 0.88} z" fill="url(#${id})" stroke-width="1.4"/>
  <path d="M${cx - w * 0.5},${y + 40} h${w} v20 h-${w} z" fill="#FBF2DE" stroke-width="1.8"/>
  <line x1="${cx - w * 0.5}" y1="${y + 50}" x2="${cx + w * 0.5}" y2="${y + 50}" stroke-width=".8"/>`;
}

// ------------------------------------------------------------------------------------------------ drawings
const A = {};
A.globe = () => {
  const id = 'h' + ++uid;
  const cx = 300, cy = 310, R = 220;
  let mer = '';
  for (let k = 1; k < 6; k++) mer += `<ellipse cx="${cx}" cy="${cy}" rx="${r2(R * Math.cos((k * Math.PI) / 12))}" ry="${R}" stroke-width="1"/>`;
  let par = '';
  for (let k = -4; k <= 4; k++) { const y = cy + R * Math.sin((k * Math.PI) / 10); const rx = R * Math.cos((k * Math.PI) / 10); par += `<ellipse cx="${cx}" cy="${r2(y)}" rx="${r2(rx)}" ry="${r2(rx * 0.16)}" stroke-width=".9"/>`; }
  return svg('0 0 600 760', hatchDefs(id, { gap: 6, angle: 60 }) + hatchDefs(id + 'b', { gap: 8, angle: -30, w: 0.8 }) + `<clipPath id="${id}c"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>`,
    `<g clip-path="url(#${id}c)"><circle cx="${cx}" cy="${cy}" r="${R}" fill="#FBF2DE"/>${mer}${par}
      <path d="M${cx - R},${cy} a${R},${R} 0 1 0 ${2 * R},0 a${R},${R} 0 1 0 ${-2 * R},0z M${cx - R - 70},${cy - 40} a${R + 10},${R + 10} 0 1 0 ${2 * R + 20},0 a${R + 10},${R + 10} 0 1 0 ${-2 * R - 20},0z" fill="url(#${id})" fill-rule="evenodd" stroke="none"/></g>
    <circle cx="${cx}" cy="${cy}" r="${R}" stroke-width="2.4" ${S}/>
    <path d="M${cx - R - 28},${cy + 30} A${R + 30},${R + 30} 0 1 1 ${cx + R + 24},${cy + 60}" stroke-width="7" opacity=".25"/>
    <path d="M${cx - R - 28},${cy + 30} A${R + 30},${R + 30} 0 1 1 ${cx + R + 24},${cy + 60}" stroke-width="2" ${S}/>
    <line x1="${cx}" y1="${cy - R - 40}" x2="${cx}" y2="${cy + R + 40}" stroke-width="2" transform="rotate(-18 ${cx} ${cy})"/>
    <path d="M${cx - 20},${cy + R + 34} q20,24 40,0 v40 q-20,20 -40,0z" fill="url(#${id}b)" stroke-width="1.6"/>
    ${plinth(cx, cy + R + 96, 260, id + 'b')}
    ${coinStack(110, 690, 62, 4, id)}${coinFace(500, 650, 70, id)}`);
};
A.coins = () => {
  const id = 'h' + ++uid;
  return svg('0 0 600 760', hatchDefs(id, { gap: 5, angle: 70 }),
    `${coinStack(200, 520, 120, 7, id)}${coinFace(420, 300, 140, id)}${coinFace(470, 600, 90, id)}`);
};
A.temple = () => {
  const id = 'h' + ++uid;
  const x0 = 40, x1 = 560, top = 210;
  let cols = '';
  for (let i = 0; i < 6; i++) {
    const cx = 92 + i * 83;
    cols += `<rect x="${cx - 22}" y="${top + 120}" width="44" height="290" fill="#FBF2DE" stroke-width="1.6" ${S}/>`;
    for (let f = -14; f <= 14; f += 7) cols += `<line x1="${cx + f}" y1="${top + 126}" x2="${cx + f}" y2="${top + 404}" stroke-width=".8"/>`;
    cols += `<path d="M${cx - 30},${top + 108} h60 l-6,12 h-48z" fill="#FBF2DE" stroke-width="1.4"/><path d="M${cx - 30},${top + 410} h60 v12 h-60z" stroke-width="1.4"/>`;
    cols += `<rect x="${cx + 8}" y="${top + 122}" width="14" height="288" fill="url(#${id})" stroke="none"/>`;
  }
  let dent = '';
  for (let x = x0 + 14; x < x1 - 10; x += 18) dent += `<rect x="${x}" y="${top + 86}" width="9" height="10" stroke-width=".9"/>`;
  return svg('0 0 600 760', hatchDefs(id, { gap: 4, angle: 90, w: 1 }) + hatchDefs(id + 'p', { gap: 6, angle: 30 }),
    `<path d="M${x0 - 10},${top + 60} L300,${top - 70} L${x1 + 10},${top + 60} z" fill="#FBF2DE" stroke-width="2" ${S}/>
     <path d="M${x0 + 34},${top + 48} L300,${top - 44} L${x1 - 34},${top + 48} z" fill="url(#${id}p)" stroke-width="1"/>
     <circle cx="300" cy="${top + 10}" r="22" fill="#FBF2DE" stroke-width="1.4"/>${rosette(300, top + 10, 15, 0.5)}
     <rect x="${x0 - 10}" y="${top + 60}" width="${x1 - x0 + 20}" height="22" fill="#FBF2DE" stroke-width="1.8"/>
     <rect x="${x0}" y="${top + 82}" width="${x1 - x0}" height="26" fill="#FBF2DE" stroke-width="1.4"/>${dent}
     ${cols}
     <rect x="${x0 - 6}" y="${top + 422}" width="${x1 - x0 + 12}" height="18" fill="#FBF2DE" stroke-width="1.6"/>
     <rect x="${x0 - 22}" y="${top + 440}" width="${x1 - x0 + 44}" height="18" fill="url(#${id})" stroke-width="1.6"/>
     <rect x="${x0 - 38}" y="${top + 458}" width="${x1 - x0 + 76}" height="20" fill="#FBF2DE" stroke-width="1.8" ${S}/>
     <path d="M${x0 - 38},${top + 498} h${x1 - x0 + 76}" stroke-width="1" opacity=".5"/>`);
};
A.scales = () => {
  const id = 'h' + ++uid;
  const pan = (cx) => `<path d="M${cx - 90},470 q90,70 180,0z" fill="#FBF2DE" stroke-width="1.8" ${S}/><path d="M${cx - 70},482 q70,44 140,0" fill="url(#${id})" stroke="none"/>
    <path d="M${cx},250 L${cx - 88},470 M${cx},250 L${cx + 88},470 M${cx},250 L${cx},470" stroke-width="1" stroke-dasharray="3 4"/>`;
  return svg('0 0 600 760', hatchDefs(id, { gap: 5, angle: 20 }),
    `<path d="M300,150 v460" stroke-width="10" opacity=".18"/><path d="M296,150 h8 v460 h-8z" fill="#FBF2DE" stroke-width="1.6" ${S}/>
     <circle cx="300" cy="140" r="22" fill="#FBF2DE" stroke-width="1.8"/>${rosette(300, 140, 13, .5)}
     <path d="M90,248 Q300,218 510,248" stroke-width="7" opacity=".2"/><path d="M90,244 Q300,214 510,244 L510,252 Q300,222 90,252z" fill="#FBF2DE" stroke-width="1.6" ${S}/>
     <circle cx="104" cy="250" r="6" fill="currentColor"/><circle cx="496" cy="250" r="6" fill="currentColor"/>
     ${pan(104)}${pan(496)}
     ${coinStack(104, 455, 40, 3, id)}
     <path d="M210,610 h180 l30,40 h-240z" fill="url(#${id})" stroke-width="1.8"/><path d="M160,650 h280 v26 h-280z" fill="#FBF2DE" stroke-width="1.8" ${S}/>`);
};
A.vault = () => {
  const id = 'h' + ++uid;
  let bolts = '', spokes = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; bolts += `<circle cx="${r2(300 + Math.cos(a) * 205)}" cy="${r2(360 + Math.sin(a) * 205)}" r="9" fill="#FBF2DE" stroke-width="1.4"/>`; }
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; spokes += `<line x1="300" y1="360" x2="${r2(300 + Math.cos(a) * 96)}" y2="${r2(360 + Math.sin(a) * 96)}" stroke-width="5"/><circle cx="${r2(300 + Math.cos(a) * 104)}" cy="${r2(360 + Math.sin(a) * 104)}" r="12" fill="#FBF2DE" stroke-width="1.6"/>`; }
  return svg('0 0 600 760', hatchDefs(id, { gap: 5, angle: 45 }) + cross(id + 'x', 9),
    `<rect x="40" y="100" width="520" height="520" fill="url(#${id}x)" stroke-width="2" opacity=".55"/><rect x="40" y="100" width="520" height="520" stroke-width="2.2" ${S}/>
     <circle cx="300" cy="360" r="236" fill="#FBF2DE" stroke-width="2.4" ${S}/><circle cx="300" cy="360" r="224" stroke-width="1"/>
     <circle cx="300" cy="360" r="182" fill="url(#${id})" stroke-width="1.6"/><circle cx="300" cy="360" r="150" fill="#FBF2DE" stroke-width="1.6"/>
     ${bolts}${spokes}<circle cx="300" cy="360" r="34" fill="#FBF2DE" stroke-width="2"/>${rosette(300, 360, 22, .5)}
     <rect x="540" y="250" width="34" height="70" fill="#FBF2DE" stroke-width="1.6"/><rect x="540" y="400" width="34" height="70" fill="#FBF2DE" stroke-width="1.6"/>
     <path d="M80,660 h440 v40 h-440z" fill="url(#${id})" stroke-width="1.6"/>`);
};
A.ledger = () => {
  const id = 'h' + ++uid;
  let lines = '';
  for (let i = 0; i < 16; i++) { const y = 250 + i * 22; lines += `<path d="M78,${y + 40 - i * 1.6} Q170,${y + 30} 288,${y + 14}" stroke-width=".8" opacity=".7"/><path d="M312,${y + 14} Q430,${y + 30} 522,${y + 40 - i * 1.6}" stroke-width=".8" opacity=".7"/>`; }
  let txt = '';
  for (let i = 0; i < 10; i++) { const y = 262 + i * 30; txt += `<path d="M96,${y + 34 - i * 2} q30,-6 60,-2 t60,-4 t50,-2" stroke-width="1.6"/><path d="M332,${y + 6} q30,-4 60,0 t60,2" stroke-width="1.6"/>`; }
  return svg('0 0 600 760', hatchDefs(id, { gap: 5, angle: 80 }),
    `<path d="M300,236 Q170,200 50,250 L50,640 Q170,600 300,630 Q430,600 550,640 L550,250 Q430,200 300,236z" fill="#FBF2DE" stroke-width="2.2" ${S}/>
     <path d="M300,236 L300,630" stroke-width="1.6"/><path d="M40,262 L40,656 Q170,616 300,646 Q430,616 560,656 L560,262" stroke-width="1.4"/>
     <path d="M50,640 L40,656 M550,640 L560,656" stroke-width="1.2"/>
     <line x1="120" y1="235" x2="120" y2="618" stroke="#A13D2D" stroke-width="1.4"/>
     ${lines}${txt}
     <path d="M60,640 Q170,604 300,632 L300,640 Q170,612 60,650z" fill="url(#${id})" stroke="none"/>
     <path d="M430,120 C470,180 480,260 470,330 L462,330 C468,262 452,190 420,128z" fill="#FBF2DE" stroke-width="1.6" ${S}/>
     <path d="M430,120 C400,150 410,220 450,300" stroke-width="1"/><path d="M466,330 l-4,30" stroke-width="2.4"/>
     ${Array.from({ length: 12 }, (_, i) => `<line x1="${432 + i * 2.6}" y1="${140 + i * 15}" x2="${450 + i * 1.6}" y2="${135 + i * 15}" stroke-width=".7"/>`).join('')}`);
};
A.stamp = () => {
  const id = 'h' + ++uid;
  return svg('0 0 600 760', hatchDefs(id, { gap: 5, angle: 90 }),
    `<g transform="rotate(-12 300 520)">
       <circle cx="300" cy="520" r="170" stroke="#A13D2D" stroke-width="5" ${S}/><circle cx="300" cy="520" r="150" stroke="#A13D2D" stroke-width="1.6"/>
       <circle cx="300" cy="520" r="96" stroke="#A13D2D" stroke-width="1.6"/>
       <text x="300" y="545" text-anchor="middle" font-family="Cormorant, serif" font-weight="600" font-size="74" fill="#A13D2D" stroke="none" letter-spacing="4">IBRD</text>
       <path id="${id}t" d="M180,520 a120,120 0 1 1 240,0" stroke="none"/>
       <text font-family="Cormorant SC, serif" font-size="30" font-weight="600" letter-spacing="10" fill="#A13D2D" stroke="none"><textPath href="#${id}t" startOffset="50%" text-anchor="middle">1944</textPath></text>
       ${Array.from({ length: 30 }, (_, i) => { const a = (i / 30) * Math.PI * 2; return `<circle cx="${r2(300 + Math.cos(a) * 160)}" cy="${r2(520 + Math.sin(a) * 160)}" r="2.2" fill="#A13D2D" stroke="none"/>`; }).join('')}</g>
     <path d="M248,90 h104 v40 h-104z" fill="#FBF2DE" stroke-width="1.8" ${S}/><path d="M262,130 h76 l10,120 h-96z" fill="url(#${id})" stroke-width="1.8"/>
     <ellipse cx="300" cy="90" rx="62" ry="22" fill="#FBF2DE" stroke-width="1.8"/><path d="M220,250 h160 v40 h-160z" fill="#FBF2DE" stroke-width="2" ${S}/>
     <path d="M226,290 h148 v14 h-148z" fill="url(#${id})" stroke-width="1.4"/>`);
};
A.magnifier = () => {
  const id = 'h' + ++uid;
  let doc = '';
  for (let i = 0; i < 14; i++) doc += `<path d="M110,${200 + i * 30} h${180 + ((i * 53) % 120)}" stroke-width="1.6" opacity=".75"/>`;
  return svg('0 0 600 760', hatchDefs(id, { gap: 5, angle: 45 }) + `<clipPath id="${id}c"><circle cx="330" cy="360" r="150"/></clipPath>`,
    `<path d="M70,130 h370 l60,60 v470 h-430z" fill="#FBF2DE" stroke-width="2" ${S}/><path d="M440,130 v60 h60" stroke-width="1.6"/>
     ${doc}<rect x="110" y="610" width="140" height="24" stroke="#A13D2D" stroke-width="1.6"/>
     <g clip-path="url(#${id}c)"><circle cx="330" cy="360" r="150" fill="#FBF2DE"/>
       ${Array.from({ length: 7 }, (_, i) => `<path d="M170,${250 + i * 40} h${260 + (i % 3) * 30}" stroke-width="3.2"/>`).join('')}
       <path d="M200,230 a150,150 0 0 1 120,-20" stroke-width="10" opacity=".15"/></g>
     <circle cx="330" cy="360" r="150" stroke-width="3" ${S}/><circle cx="330" cy="360" r="166" stroke-width="12" opacity=".2"/><circle cx="330" cy="360" r="160" stroke-width="2"/>
     <path d="M436,470 l120,150 l-36,30 l-120,-150z" fill="url(#${id})" stroke-width="2" ${S}/>
     <path d="M444,480 l20,-16" stroke-width="2"/>`);
};
function gear(cx, cy, r, teeth, id, sw = 1.6) {
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2, a1 = a0 + Math.PI / teeth * 0.5, a2 = a0 + Math.PI / teeth, a3 = a0 + Math.PI / teeth * 1.5;
    const P = (a, rr) => `${r2(cx + Math.cos(a) * rr)},${r2(cy + Math.sin(a) * rr)}`;
    d += `${i ? 'L' : 'M'}${P(a0, r)}L${P(a1, r + 18)}L${P(a2, r + 18)}L${P(a3, r)}`;
  }
  return `<path d="${d}Z" fill="#FBF2DE" stroke-width="${sw}" ${S}/><circle cx="${cx}" cy="${cy}" r="${r * 0.7}" fill="url(#${id})" stroke-width="1.2"/><circle cx="${cx}" cy="${cy}" r="${r * 0.28}" fill="#FBF2DE" stroke-width="1.6"/>`
    + Array.from({ length: 5 }, (_, i) => { const a = (i / 5) * Math.PI * 2; return `<circle cx="${r2(cx + Math.cos(a) * r * 0.5)}" cy="${r2(cy + Math.sin(a) * r * 0.5)}" r="${r * 0.1}" fill="#FBF2DE" stroke-width="1"/>`; }).join('');
}
A.gears = () => {
  const id = 'h' + ++uid;
  return svg('0 0 600 760', hatchDefs(id, { gap: 5, angle: 30 }), `${gear(250, 300, 150, 18, id, 2)}${gear(440, 520, 96, 12, id)}${gear(170, 590, 70, 10, id)}`);
};
A.helmet = () => {
  const id = 'h' + ++uid;
  return svg('0 0 600 760', hatchDefs(id, { gap: 5, angle: 60 }),
    `<g transform="rotate(38 300 470)"><path d="M280,140 h40 v520 h-40z" fill="#FBF2DE" stroke-width="1.8" ${S}/>
       <path d="M300,80 a70,70 0 1 0 0.1,0 M262,96 v60 h76 v-60" fill="#FBF2DE" stroke-width="2"/><path d="M286,150 v500" stroke-width=".8"/>
       <path d="M300,700 a46,46 0 1 0 0.1,0" stroke-width="2"/></g>
     <path d="M110,420 Q110,200 300,190 Q490,200 490,420z" fill="#FBF2DE" stroke-width="2.2" ${S}/>
     <path d="M270,195 Q260,300 262,420 M330,195 Q340,300 338,420" stroke-width="1.6"/><path d="M262,195 h76" stroke-width="1.6"/>
     <path d="M350,210 Q470,240 480,410 L350,410z" fill="url(#${id})" stroke="none"/>
     <path d="M70,420 h460 q24,0 24,20 q0,22 -24,22 h-460 q-24,0 -24,-22 q0,-20 24,-20z" fill="#FBF2DE" stroke-width="2.2" ${S}/>
     <path d="M90,450 h420" stroke-width="1"/>`);
};
A.lecture = () => {
  const id = 'h' + ++uid;
  let rows = '';
  for (let i = 0; i < 6; i++) { const y = 420 + i * 46; const w = 300 + i * 46; rows += `<path d="M${300 - w / 2},${y} Q300,${y + 26} ${300 + w / 2},${y}" stroke-width="1.6" ${S}/><path d="M${300 - w / 2},${y + 14} Q300,${y + 40} ${300 + w / 2},${y + 14}" stroke-width=".8"/>`;
    for (let k = -3; k <= 3; k++) rows += `<circle cx="${300 + k * (w / 8)}" cy="${y - 10 + Math.abs(k) * 0.5}" r="7" fill="url(#${id})" stroke-width="1"/>`; }
  return svg('0 0 600 760', hatchDefs(id, { gap: 3, angle: 45, w: .9 }),
    `<path d="M80,330 V140 Q300,40 520,140 V330" fill="#FBF2DE" stroke-width="2" ${S}/>
     ${[0, 1, 2, 3].map((i) => `<path d="M${130 + i * 100},330 V170 Q${170 + i * 100},140 ${210 + i * 100},170 V330" stroke-width="1.4"/>`).join('')}
     <rect x="190" y="200" width="220" height="110" fill="#FBF2DE" stroke-width="1.8"/>
     ${[0, 1, 2].map((i) => `<path d="M210,${228 + i * 28} h${150 - i * 30}" stroke-width="1.4"/>`).join('')}
     <path d="M270,330 h60 l10,60 h-80z" fill="url(#${id})" stroke-width="1.6"/>${rows}`);
};
A.map = () => {
  const id = 'h' + ++uid;
  let grid = '';
  for (let i = 0; i <= 8; i++) grid += `<path d="M60,${110 + i * 70} Q300,${90 + i * 70} 540,${110 + i * 70}" stroke-width=".8" opacity=".55"/>`;
  for (let i = 0; i <= 7; i++) grid += `<path d="M${80 + i * 64},90 Q${70 + i * 64},400 ${80 + i * 64},690" stroke-width=".8" opacity=".55"/>`;
  const sc = 560 / VN_H;
  return svg('0 0 600 760', hatchDefs(id, { gap: 4, angle: 45, w: .8 }),
    `<rect x="50" y="80" width="500" height="620" fill="#FBF2DE" stroke-width="2" ${S}/><rect x="60" y="90" width="480" height="600" stroke-width="1"/>${grid}
     <g transform="translate(${300 - (VN_W * sc) / 2},110) scale(${r2(sc * 100) / 100})"><path d="${VN_PATH}" fill="url(#${id})" stroke-width="${r2(2 / sc)}" ${S}/></g>
     <g transform="translate(470,620)">${rosette(0, 0, 26, .5)}<path d="M0,-48 L8,0 L0,48 L-8,0z" fill="#A13D2D" stroke="none" opacity=".85"/></g>`);
};
A.pylon = () => {
  const id = 'h' + ++uid;
  const L = (x1, y1, x2, y2, w = 1.6) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${w}"/>`;
  let lat = '';
  const lv = [[130, 300, 170], [300, 268, 144], [430, 246, 124], [560, 222, 102], [700, 196, 74]];
  for (let i = 0; i < lv.length - 1; i++) { const [ya, xa] = [lv[i][0], lv[i][1]]; const [yb, xb] = [lv[i + 1][0], lv[i + 1][1]];
    lat += L(xa, ya, xb, yb, 2.2) + L(600 - xa, ya, 600 - xb, yb, 2.2) + L(xa, ya, 600 - xb, yb, 1) + L(600 - xa, ya, xb, yb, 1) + L(xa, ya, 600 - xa, ya, 1.4); }
  const arm = (y, w) => `<path d="M${300 - w},${y} L300,${y - 30} L${300 + w},${y}z" fill="#FBF2DE" stroke-width="1.8" ${S}/><path d="M${300 - w + 20},${y - 6} L${300 + w - 20},${y - 6}" stroke-width=".9"/>`
    + [-1, 1].map((sg) => `<path d="M${300 + sg * (w - 8)},${y} v52" stroke-width="2"/>${Array.from({ length: 6 }, (_, k) => `<ellipse cx="${300 + sg * (w - 8)}" cy="${y + 10 + k * 8}" rx="9" ry="3" fill="#FBF2DE" stroke-width="1"/>`).join('')}`).join('');
  return svg('0 0 600 760', hatchDefs(id, { gap: 5, angle: 60 }),
    `<path d="M0,240 Q150,300 300,252 T600,240" stroke-width="1.2" opacity=".7"/><path d="M0,336 Q150,396 300,348 T600,336" stroke-width="1.2" opacity=".7"/><path d="M0,430 Q150,486 300,440 T600,430" stroke-width="1.2" opacity=".7"/>
     <path d="M300,40 L300,96" stroke-width="2"/>${arm(150, 230)}${arm(250, 200)}${arm(350, 176)}
     ${L(270, 96, 330, 96)}${L(270, 96, 236, 700, 2.4)}${L(330, 96, 364, 700, 2.4)}
     ${[[96, 140], [140, 190], [190, 250], [250, 300], [300, 360], [360, 420], [420, 480], [480, 540], [540, 610], [610, 700]].map(([a, b]) => { const xa = 270 - (a - 96) * 0.056, xb = 270 - (b - 96) * 0.056; return L(xa, a, 600 - xb, b, 1) + L(600 - xa, a, xb, b, 1) + L(xa, a, 600 - xa, a, 1.2); }).join('')}
     <path d="M236,700 L364,700 L380,720 L220,720z" fill="url(#${id})" stroke-width="1.6"/>
     <path d="M120,722 h360" stroke-width="2" ${S}/><path d="M60,740 h480" stroke-width="1" opacity=".6"/>`);
};
A.substation = () => {
  const id = 'h' + ++uid;
  const tr = (x) => `<rect x="${x}" y="430" width="150" height="170" fill="#FBF2DE" stroke-width="2" ${S}/>
    ${Array.from({ length: 8 }, (_, i) => `<line x1="${x + 12 + i * 18}" y1="440" x2="${x + 12 + i * 18}" y2="590" stroke-width="1"/>`).join('')}
    <rect x="${x + 100}" y="436" width="44" height="158" fill="url(#${id})" stroke="none"/>
    ${[30, 75, 120].map((dx) => `<path d="M${x + dx},430 v-90" stroke-width="2"/>${Array.from({ length: 7 }, (_, k) => `<ellipse cx="${x + dx}" cy="${420 - k * 12}" rx="12" ry="4" fill="#FBF2DE" stroke-width="1.1"/>`).join('')}`).join('')}`;
  return svg('0 0 600 760', hatchDefs(id, { gap: 4, angle: 90 }),
    `<path d="M40,250 h520 M40,290 h520" stroke-width="2"/><path d="M80,250 v-80 M300,250 v-110 M520,250 v-80" stroke-width="2"/>
     ${[80, 300, 520].map((x) => `<path d="M${x - 40},170 h80" stroke-width="1.6"/>`).join('')}
     <path d="M80,250 L60,330 M80,250 L100,330 M300,250 L280,330 M300,250 L320,330 M520,250 L500,330 M520,250 L540,330" stroke-width="1"/>
     ${tr(70)}${tr(380)}<path d="M145,340 V290 M455,340 V290" stroke-width="1.6"/>
     <path d="M30,600 h540 v18 h-540z" fill="url(#${id})" stroke-width="1.6"/><path d="M20,618 h560" stroke-width="2" ${S}/>
     ${Array.from({ length: 12 }, (_, i) => `<path d="M${40 + i * 46},640 v60 M${30 + i * 46},650 h20" stroke-width="1.2"/>`).join('')}<path d="M30,664 h540 M30,690 h540" stroke-width="1"/>`);
};
function waves(y0, n, amp, len, sw = 1.4, x0 = 0, x1 = 600) {
  let o = '';
  for (let i = 0; i < n; i++) {
    const y = y0 + i * 22; let d = `M${x0},${y}`;
    for (let x = x0; x < x1; x += len) d += ` q${len / 4},${-amp} ${len / 2},0 t${len / 2},0`;
    o += `<path d="${d}" stroke-width="${sw - i * 0.08}" opacity="${1 - i * 0.07}"/>`;
  }
  return o;
}
A.coast = () => {
  const id = 'h' + ++uid;
  return svg('0 0 600 760', hatchDefs(id, { gap: 5, angle: 70 }),
    `<path d="M0,380 Q90,330 150,360 T300,330 Q380,300 430,340 T600,320 V430 H0z" fill="#FBF2DE" stroke-width="2" ${S}/>
     <path d="M0,400 Q120,370 220,390 T420,380 T600,370" stroke-width="1"/><path d="M300,330 Q380,300 430,340 T600,320 V360 Q480,350 430,370 T300,360z" fill="url(#${id})" stroke="none"/>
     ${[90, 140, 190, 400, 450].map((x, i) => `<rect x="${x}" y="${300 - (i % 3) * 30}" width="34" height="${60 + (i % 3) * 30}" fill="#FBF2DE" stroke-width="1.4"/>${Array.from({ length: 3 + (i % 3) }, (_, k) => `<rect x="${x + 8}" y="${310 - (i % 3) * 30 + k * 18}" width="7" height="8" stroke-width=".8"/><rect x="${x + 20}" y="${310 - (i % 3) * 30 + k * 18}" width="7" height="8" stroke-width=".8"/>`).join('')}`).join('')}
     <path d="M500,250 v100 M490,250 h20 l-10,-30z" stroke-width="1.6"/><circle cx="500" cy="232" r="5" fill="#A13D2D" stroke="none"/>
     ${waves(450, 12, 16, 60)}
     <path d="M120,520 q40,-30 80,0 l-10,16 h-60z" fill="#FBF2DE" stroke-width="1.6"/><path d="M160,500 v-60 l40,40z" fill="url(#${id})" stroke-width="1.4"/>
     <path d="M0,700 Q300,690 600,700" stroke-width="1" opacity=".5"/>`);
};
A.plant = () => {
  const id = 'h' + ++uid;
  const tank = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.34}" fill="#FBF2DE" stroke-width="2" ${S}/><ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.86}" ry="${rx * 0.29}" stroke-width="1"/>
    <path d="M${cx - rx},${cy} v40 a${rx},${rx * 0.34} 0 0 0 ${rx * 2},0 v-40" fill="url(#${id})" stroke-width="1.8"/>
    ${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<line x1="${cx}" y1="${cy}" x2="${r2(cx + Math.cos(a) * rx * 0.84)}" y2="${r2(cy + Math.sin(a) * rx * 0.28)}" stroke-width=".7"/>`; }).join('')}
    <path d="M${cx - rx * 0.86},${cy} L${cx + rx * 0.86},${cy}" stroke-width="2.2"/><circle cx="${cx}" cy="${cy}" r="6" fill="currentColor"/>`;
  return svg('0 0 600 760', hatchDefs(id, { gap: 4, angle: 90 }),
    `<path d="M70,150 h200 v170 h-200z" fill="#FBF2DE" stroke-width="2" ${S}/><path d="M60,150 l110,-60 l110,60z" fill="url(#${id})" stroke-width="1.8"/>
     ${[0, 1, 2].map((i) => `<rect x="${96 + i * 56}" y="190" width="30" height="44" stroke-width="1.2"/>`).join('')}<rect x="150" y="262" width="40" height="58" stroke-width="1.4"/>
     <path d="M300,320 v-200 h28 v200" fill="#FBF2DE" stroke-width="1.6"/>
     ${tank(170, 430, 120)}${tank(440, 380, 110)}${tank(430, 600, 120)}
     <path d="M290,430 h50 v-50 M300,600 h-30 v-110 M330,380 h-30" stroke-width="5" opacity=".22"/><path d="M290,430 h50 v-50 M300,600 h-30 v-110 M330,380 h-30" stroke-width="1.6"/>
     ${waves(690, 3, 8, 40, 1.2, 20, 580)}`);
};
A.bridge = () => {
  const id = 'h' + ++uid;
  let vouss = '';
  for (let i = 0; i <= 14; i++) { const a = Math.PI + (i / 14) * Math.PI; vouss += `<line x1="${r2(300 + Math.cos(a) * 190)}" y1="${r2(480 + Math.sin(a) * 190)}" x2="${r2(300 + Math.cos(a) * 226)}" y2="${r2(480 + Math.sin(a) * 226)}" stroke-width="1.2"/>`; }
  return svg('0 0 600 760', hatchDefs(id, { gap: 5, angle: 45 }) + cross(id + 'x', 10, .7),
    `<path d="M0,250 h600 v24 h-600z" fill="#FBF2DE" stroke-width="2" ${S}/>${Array.from({ length: 30 }, (_, i) => `<line x1="${10 + i * 20}" y1="230" x2="${10 + i * 20}" y2="250" stroke-width="1.2"/>`).join('')}<path d="M0,230 h600" stroke-width="1.6"/>
     <path d="M0,274 H74 V480 A226,226 0 0 1 526,480 V274 H600 V560 H0z" fill="url(#${id}x)" stroke-width="2" opacity=".85"/>
     <path d="M74,560 V480 A226,226 0 0 1 526,480 V560" stroke-width="2.2" ${S}/><path d="M110,560 V480 A190,190 0 0 1 490,480 V560" fill="#FBF2DE" stroke-width="1.6"/>${vouss}
     <path d="M110,500 A190,190 0 0 1 490,500 V560 H110z" fill="url(#${id})" stroke="none" opacity=".5"/>
     <path d="M250,560 h100 v-40 a50,50 0 0 0 -100,0z" fill="#FBF2DE" stroke-width="1.6"/>
     ${waves(580, 8, 10, 50)}`);
};
A.compass = () => {
  const id = 'h' + ++uid;
  const cx = 300, cy = 380;
  let ticks = '';
  for (let i = 0; i < 72; i++) { const a = (i / 72) * Math.PI * 2; const l = i % 9 === 0 ? 22 : i % 3 === 0 ? 14 : 8; ticks += `<line x1="${r2(cx + Math.cos(a) * 244)}" y1="${r2(cy + Math.sin(a) * 244)}" x2="${r2(cx + Math.cos(a) * (244 - l))}" y2="${r2(cy + Math.sin(a) * (244 - l))}" stroke-width="${i % 9 === 0 ? 2 : 1}"/>`; }
  let rose = '';
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2; const R = i % 4 === 0 ? 200 : i % 2 === 0 ? 140 : 96; const w = i % 4 === 0 ? 0.2 : 0.16;
    const P = (ang, rr) => `${r2(cx + Math.cos(ang) * rr)},${r2(cy + Math.sin(ang) * rr)}`;
    rose += `<path d="M${cx},${cy} L${P(a - w, R * 0.3)} L${P(a, R)}z" fill="#FBF2DE" stroke-width="1.4" ${i % 4 === 0 ? S : ''}/><path d="M${cx},${cy} L${P(a + w, R * 0.3)} L${P(a, R)}z" fill="url(#${id})" stroke-width="1.4"/>`;
  }
  return svg('0 0 600 760', hatchDefs(id, { gap: 4, angle: 30 }),
    `<circle cx="${cx}" cy="${cy}" r="262" stroke-width="8" opacity=".18"/><circle cx="${cx}" cy="${cy}" r="256" fill="#FBF2DE" stroke-width="2.4" ${S}/><circle cx="${cx}" cy="${cy}" r="244" stroke-width="1.2"/>${ticks}
     <circle cx="${cx}" cy="${cy}" r="210" stroke-width="1"/>${guilloche(cx, cy, 190, 50, 58, 9, 1200, .45)}${rose}
     <circle cx="${cx}" cy="${cy}" r="16" fill="#FBF2DE" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="6" fill="#A13D2D" stroke="none"/>
     <path d="M${cx},${cy - 200} l-16,-30 h32z" fill="#A13D2D" stroke="none"/>
     <path d="M${cx - 60},${cy + 268} h120 l20,50 h-160z" fill="url(#${id})" stroke-width="1.8"/><path d="M${cx - 110},${cy + 318} h220 v22 h-220z" fill="#FBF2DE" stroke-width="1.8"/>`);
};
A.seal = () => {
  const id = 'h' + ++uid;
  let edge = '';
  for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; const r = i % 2 ? 128 : 140; edge += `${i ? 'L' : 'M'}${r2(300 + Math.cos(a) * r)},${r2(300 + Math.sin(a) * r)}`; }
  return svg('0 0 600 600', '',
    `<path d="M240,380 L190,560 L240,520 L270,570 L300,400z" fill="#A13D2D" stroke="#A13D2D" stroke-width="1.5" opacity=".9"/>
     <path d="M360,380 L410,560 L360,520 L330,570 L300,400z" fill="#A13D2D" stroke="#A13D2D" stroke-width="1.5" opacity=".75"/>
     <path d="${edge}Z" fill="#A13D2D" stroke="#A13D2D" stroke-width="2" ${S}/>
     <circle cx="300" cy="300" r="100" stroke="#F7DCCB" stroke-width="2.4" opacity=".9"/><circle cx="300" cy="300" r="88" stroke="#F7DCCB" stroke-width="1" opacity=".8"/>
     <g stroke="#F7DCCB" opacity=".85">${guilloche(300, 300, 66, 18, 20, 7, 600, .6)}</g>
     <text x="300" y="318" text-anchor="middle" font-family="Cormorant, serif" font-weight="600" font-size="52" fill="#FBEADF" stroke="none" letter-spacing="2">1944</text>
     <path d="M210,250 q90,-60 180,0" stroke="#6E1F14" stroke-width="8" opacity=".25"/>`);
};
A.rosette = () => svg('0 0 600 600', '', `<g ${S}>${rosette(300, 300, 230, .8)}</g>${rosette(300, 300, 120, .6)}`);

// ------------------------------------------------------------------------------------------------ public API
export function art(key) { const f = A[key]; return f ? f() : ''; }
export const ART_KEYS = Object.keys(A);

// background patterns (absolute, inside .ground)
export function pattern(kind, o = {}) {
  const color = o.color || '#2F4458';
  if (kind === 'rosette') {
    const r = o.r || 320;
    return `<svg class="pattern" style="left:${(o.x || 1500) - r * 1.2}px;top:${(o.y || 800) - r * 1.2}px;width:${r * 2.4}px;height:${r * 2.4}px;opacity:${o.op}" viewBox="0 0 ${r * 2.4} ${r * 2.4}" fill="none" stroke="${color}">${rosette(r * 1.2, r * 1.2, r, 0.9)}</svg>`;
  }
  if (kind === 'ledger') {
    let l = '';
    for (let y = 150; y < 1080; y += 46) l += `<line x1="0" y1="${y}" x2="1920" y2="${y}"/>`;
    return `<svg class="pattern" style="inset:0;opacity:${o.op}" viewBox="0 0 1920 1080" stroke="#3B6E9E" stroke-width="1">${l}<line x1="76" y1="0" x2="76" y2="1080" stroke="#A13D2D" stroke-width="1.6"/></svg>`;
  }
  if (kind === 'graticule') {
    let l = '';
    for (let i = -6; i <= 6; i++) l += `<path d="M0,${540 + i * 90} Q960,${540 + i * 90 - (i * 22)} 1920,${540 + i * 90}"/>`;
    for (let i = -10; i <= 10; i++) l += `<path d="M${960 + i * 96},0 Q${960 + i * 104},540 ${960 + i * 96},1080"/>`;
    return `<svg class="pattern" style="inset:0;opacity:${o.op}" viewBox="0 0 1920 1080" fill="none" stroke="${color}" stroke-width="1">${l}</svg>`;
  }
  return '';
}
export function ornament(kind) {
  if (kind === 'rosette-small') return `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor">${rosette(50, 50, 40, .6)}</svg>`;
  if (kind === 'seal-small') return `<svg viewBox="0 0 200 200" fill="none" stroke="#A13D2D" style="transform:rotate(-12deg)"><circle cx="100" cy="100" r="88" stroke-width="3"/><circle cx="100" cy="100" r="78" stroke-width="1"/>${guilloche(100, 100, 56, 15, 17, 7, 600, .6)}<text x="100" y="112" text-anchor="middle" font-family="Cormorant, serif" font-weight="600" font-size="36" fill="#A13D2D" stroke="none">IBRD</text></svg>`;
  return '';
}
