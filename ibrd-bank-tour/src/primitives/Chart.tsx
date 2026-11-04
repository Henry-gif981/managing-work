import type { ReactNode } from 'react';
import { useFocus } from './focus';

export type ChartKind = 'bar' | 'grouped' | 'stacked' | 'hbar-target' | 'line';
export interface Series {
  name: string;
  values: number[];
  /** CSS colour or token; defaults to series order navy, blue, cyan, warn */
  color?: string;
}
export interface ChartProps {
  id: string;
  kind: ChartKind;
  categories: string[];
  series: Series[];
  width?: number;
  height?: number;
  unit?: string;
  max?: number;
  /** axis minimum (line charts only); default 0 */
  min?: number;
  /** for hbar-target: value of the target line (default 100) */
  target?: number;
  caption?: ReactNode;
  format?: (v: number) => string;
}

const SERIES = ['var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)'];
const colorOf = (s: Series, k: number) => s.color ?? SERIES[k % SERIES.length];

/**
 * Plain-SVG charts with animated reveal. Element ids:
 *   bar/point `${id}-${seriesIndex}-${categoryIndex}`, series `${id}-s${k}`, category `${id}-c${j}`.
 */
export function Chart(p: ChartProps) {
  const W = p.width ?? 900,
    H = p.height ?? 460;
  const fmt = p.format ?? ((v: number) => `${+v.toFixed(1)}${p.unit ?? ''}`);
  return (
    <div className="chart" id={p.id} style={{ width: W + 44 }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {p.kind === 'hbar-target' ? <HBars {...p} W={W} H={H} fmt={fmt} /> : p.kind === 'line' ? <Lines {...p} W={W} H={H} fmt={fmt} /> : <Bars {...p} W={W} H={H} fmt={fmt} />}
      </svg>
      {p.series.length > 1 && (
        <div className="legend">
          {p.series.map((s, k) => (
            <span key={k}>
              <i style={{ background: colorOf(s, k) }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
      {p.caption && <div className="caption" style={{ marginTop: 8 }}>{p.caption}</div>}
    </div>
  );
}

type Inner = ChartProps & { W: number; H: number; fmt: (v: number) => string };
const PAD = { l: 80, r: 20, t: 34, b: 56 };

function niceMax(v: number) {
  if (v <= 0) return 1;
  const e = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / e;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e;
}

function Axes({ W, H, max, fmt, min = 0 }: { W: number; H: number; max: number; fmt: (v: number) => string; min?: number }) {
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const ih = H - PAD.t - PAD.b;
  return (
    <g>
      {ticks.map((t) => {
        const y = PAD.t + ih * (1 - t);
        return (
          <g key={t}>
            <line className="grid" x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} />
            <text x={PAD.l - 10} y={y + 8} textAnchor="end" fontSize={22}>
              {fmt(min + (max - min) * t)}
            </text>
          </g>
        );
      })}
      <line className="axis" x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} />
    </g>
  );
}

function Bars(p: Inner) {
  const { W, H, categories, series } = p;
  const stacked = p.kind === 'stacked';
  const sums = categories.map((_, j) => series.reduce((a, s) => a + (s.values[j] ?? 0), 0));
  const rawMax = stacked ? Math.max(...sums) : Math.max(...series.flatMap((s) => s.values));
  const max = p.max ?? niceMax(rawMax);
  const iw = W - PAD.l - PAD.r,
    ih = H - PAD.t - PAD.b;
  const bw = iw / categories.length;
  const groups = stacked || p.kind === 'bar' ? 1 : series.length;
  const barW = (bw * 0.7) / groups;
  return (
    <g>
      <Axes W={W} H={H} max={max} fmt={p.fmt} />
      {categories.map((c, j) => {
        let acc = 0;
        return (
          <g key={j}>
            {(p.kind === 'bar' ? series.slice(0, 1) : series).map((s, k) => {
              const v = s.values[j] ?? 0;
              const h = (v / max) * ih;
              const x = PAD.l + j * bw + bw * 0.15 + (stacked ? 0 : k * barW);
              const y = H - PAD.b - h - (stacked ? (acc / max) * ih : 0);
              acc += v;
              return <BarRect key={k} id={`${p.id}-${k}-${j}`} sid={`${p.id}-s${k}`} cid={`${p.id}-c${j}`} chart={p.id} x={x} y={y} w={stacked ? bw * 0.7 : barW - 4} h={h} fill={colorOf(s, k)} label={stacked ? undefined : p.fmt(v)} delay={j * 0.06 + k * 0.04} />;
            })}
            <text x={PAD.l + j * bw + bw / 2} y={H - PAD.b + 32} textAnchor="middle" fontSize={22}>
              {c}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function BarRect({ id, sid, cid, chart, x, y, w, h, fill, label, delay, horizontal }: { id: string; sid: string; cid: string; chart: string; x: number; y: number; w: number; h: number; fill: string; label?: string; delay: number; horizontal?: boolean }) {
  const cls = useFocus(id, sid, cid, chart);
  return (
    <g id={id} className={cls}>
      <rect className={horizontal ? 'hbar' : 'bar'} x={x} y={y} width={Math.max(0, w)} height={Math.max(0, h)} fill={fill} rx={3} style={{ animationDelay: `${delay}s` }} />
      {label && (
        <text x={horizontal ? x + w + 10 : x + w / 2} y={horizontal ? y + h / 2 + 8 : y - 8} textAnchor={horizontal ? 'start' : 'middle'} fontSize={20} fontWeight={700}>
          {label}
        </text>
      )}
    </g>
  );
}

function HBars(p: Inner) {
  const { W, H, categories, series } = p;
  const target = p.target ?? 100;
  const values = series[0]?.values ?? [];
  const max = p.max ?? Math.max(target * 1.2, ...values);
  const L = 300,
    R = 90;
  const iw = W - L - R;
  const rh = (H - 30) / categories.length;
  const tx = L + (target / max) * iw;
  return (
    <g>
      {categories.map((c, j) => {
        const v = values[j] ?? 0;
        const color = series[0]?.color ?? (v >= target ? 'var(--good)' : 'var(--series-2)');
        return (
          <g key={j}>
            <text x={L - 14} y={j * rh + rh / 2 + 8} textAnchor="end" fontSize={22}>
              {c}
            </text>
            <BarRect id={`${p.id}-0-${j}`} sid={`${p.id}-s0`} cid={`${p.id}-c${j}`} chart={p.id} x={L} y={j * rh + rh * 0.18} w={(v / max) * iw} h={rh * 0.64} fill={color} label={p.fmt(v)} delay={j * 0.07} horizontal />
          </g>
        );
      })}
      <line className="target" x1={tx} x2={tx} y1={0} y2={H - 24} />
      <text x={tx} y={H - 2} textAnchor="middle" fontSize={20} fill="var(--warn)" fontWeight={700}>
        target {p.fmt(target)}
      </text>
    </g>
  );
}

function Lines(p: Inner) {
  const { W, H, categories, series } = p;
  const max = p.max ?? niceMax(Math.max(...series.flatMap((s) => s.values)));
  const iw = W - PAD.l - PAD.r,
    ih = H - PAD.t - PAD.b;
  const x = (j: number) => PAD.l + (categories.length === 1 ? iw / 2 : (j / (categories.length - 1)) * iw);
  const min = p.min ?? 0;
  const y = (v: number) => H - PAD.b - ((v - min) / (max - min)) * ih;
  return (
    <g>
      <Axes W={W} H={H} max={max} min={min} fmt={p.fmt} />
      {categories.map((c, j) => (
        <text key={j} x={x(j)} y={H - PAD.b + 32} textAnchor="middle" fontSize={22}>
          {c}
        </text>
      ))}
      {series.map((s, k) => (
        <LineSeries key={k} p={p} k={k} s={s} x={x} y={y} />
      ))}
    </g>
  );
}

function LineSeries({ p, k, s, x, y }: { p: Inner; k: number; s: Series; x: (j: number) => number; y: (v: number) => number }) {
  const cls = useFocus(`${p.id}-s${k}`, p.id);
  const d = s.values.map((v, j) => `${j ? 'L' : 'M'}${x(j)},${y(v)}`).join(' ');
  return (
    <g className={cls}>
      <path className="line" d={d} pathLength={1} fill="none" stroke={colorOf(s, k)} strokeWidth={4} style={{ animationDelay: `${k * 0.15}s` }} />
      {s.values.map((v, j) => (
        <Point key={j} id={`${p.id}-${k}-${j}`} cid={`${p.id}-c${j}`} cx={x(j)} cy={y(v)} fill={colorOf(s, k)} />
      ))}
    </g>
  );
}

function Point({ id, cid, cx, cy, fill }: { id: string; cid: string; cx: number; cy: number; fill: string }) {
  const cls = useFocus(id, cid);
  return <circle id={id} className={cls} cx={cx} cy={cy} r={7} fill="var(--page)" stroke={fill} strokeWidth={4} />;
}
