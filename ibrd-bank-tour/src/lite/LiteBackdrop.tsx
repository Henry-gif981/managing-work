import type { ReactNode } from 'react';
import type { Scene } from '../scenes';
import { CCSEP_CITIES, VN_OUTLINE, project } from '../three/vietnam';

/** Static illustrated backgrounds used by Lite mode and Print mode (no WebGL). */
export type LiteSet = 'exterior' | 'lobby' | 'hall' | 'f2' | 'context' | 'tep' | 'ccsep' | 'exec' | 'lift' | 'exit';

export function liteSetOf(s: Scene): LiteSet {
  if (s.kind === 'lift') return 'lift';
  switch (s.segment) {
    case 'entrance':
      return s.kind === 'door' ? 'lobby' : 'exterior';
    case 'intro':
      return 'lobby';
    case 'ch1':
      return 'hall';
    case 'ch2':
      return 'f2';
    case 'context':
      return 'context';
    case 'tep':
      return 'tep';
    case 'ccsep':
      return 'ccsep';
    case 'eval':
      return 'exec';
    case 'conclusion':
      return 'lift';
    default:
      return 'exit';
  }
}

const INK = { stroke: 'var(--wb-navy)', strokeWidth: 2.5 } as const;
const STONE = 'var(--stone-1)';
const STONE2 = 'var(--stone-2)';

/** Room box in one-point perspective (vanishing point at the centre). */
function Room({ floor = 'var(--marble)', children }: { floor?: string; children?: ReactNode }) {
  const vx = 960,
    vy = 470;
  const bx0 = 620,
    bx1 = 1300,
    by0 = 250,
    by1 = 690;
  return (
    <g>
      <rect width={1920} height={1080} fill={STONE} />
      <polygon points={`0,1080 1920,1080 ${bx1},${by1} ${bx0},${by1}`} fill={floor} />
      <polygon points={`0,0 1920,0 ${bx1},${by0} ${bx0},${by0}`} fill="var(--page)" />
      <polygon points={`0,0 ${bx0},${by0} ${bx0},${by1} 0,1080`} fill={STONE} />
      <polygon points={`1920,0 ${bx1},${by0} ${bx1},${by1} 1920,1080`} fill={STONE} />
      <rect x={bx0} y={by0} width={bx1 - bx0} height={by1 - by0} fill={STONE2} />
      <g {...INK} fill="none" strokeWidth={1.5} opacity={0.5}>
        {Array.from({ length: 13 }, (_, i) => {
          const x = -400 + i * 226;
          return <line key={i} x1={x} y1={1080} x2={vx + (x - vx) * 0.36} y2={by1} />;
        })}
        {[760, 830, 920].map((y) => (
          <line key={y} x1={0} y1={y} x2={1920} y2={y} />
        ))}
      </g>
      <g {...INK} fill="none">
        <rect x={bx0} y={by0} width={bx1 - bx0} height={by1 - by0} />
        <line x1={0} y1={0} x2={bx0} y2={by0} />
        <line x1={1920} y1={0} x2={bx1} y2={by0} />
        <line x1={0} y1={1080} x2={bx0} y2={by1} />
        <line x1={1920} y1={1080} x2={bx1} y2={by1} />
      </g>
      <line x1={vx} y1={vy} x2={vx} y2={vy} />
      {children}
    </g>
  );
}

function Column({ x, y0, y1, w }: { x: number; y0: number; y1: number; w: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y0} width={w} height={y1 - y0} fill="var(--page)" {...INK} />
      {[-0.25, 0, 0.25].map((f) => (
        <line key={f} x1={x + f * w} y1={y0 + w * 0.3} x2={x + f * w} y2={y1 - w * 0.3} {...INK} strokeWidth={1.2} />
      ))}
      <rect x={x - w * 0.7} y={y0 - w * 0.25} width={w * 1.4} height={w * 0.25} fill={STONE2} {...INK} />
      <rect x={x - w * 0.7} y={y1} width={w * 1.4} height={w * 0.25} fill={STONE2} {...INK} />
    </g>
  );
}

function VietnamMap({ x, y, w, h, pins }: { x: number; y: number; w: number; h: number; pins?: boolean }) {
  const pts = VN_OUTLINE.map(([lon, lat]) => {
    const [u, v] = project(lon, lat);
    return `${x + u * w},${y + (1 - v) * h}`;
  }).join(' ');
  return (
    <g>
      <rect x={x - 16} y={y - 16} width={w + 32} height={h + 32} fill="var(--page)" {...INK} />
      <polygon points={pts} fill="var(--surface-2)" {...INK} />
      {pins &&
        CCSEP_CITIES.map((c) => {
          const [u, v] = project(c.lon, c.lat);
          return <circle key={c.id} cx={x + u * w} cy={y + (1 - v) * h} r={9} fill="var(--warn)" stroke="var(--wb-navy)" strokeWidth={2} />;
        })}
    </g>
  );
}

function Pylon({ x, base, h }: { x: number; base: number; h: number }) {
  const w0 = h * 0.18,
    w1 = h * 0.04;
  return (
    <g {...INK} fill="none">
      <polyline points={`${x - w0},${base} ${x - w1},${base - h} ${x + w1},${base - h} ${x + w0},${base}`} />
      {[0.2, 0.4, 0.6, 0.8].map((t) => {
        const y = base - h * t,
          ww = w0 + (w1 - w0) * t;
        return <path key={t} d={`M${x - ww},${y} L${x + ww},${y - h * 0.2} M${x + ww},${y} L${x - ww},${y - h * 0.2}`} strokeWidth={1.4} />;
      })}
      <line x1={x - h * 0.3} y1={base - h * 0.65} x2={x + h * 0.3} y2={base - h * 0.65} />
      <line x1={x - h * 0.22} y1={base - h * 0.8} x2={x + h * 0.22} y2={base - h * 0.8} />
    </g>
  );
}

function House({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-40} y={-50} width={80} height={50} fill="var(--page)" {...INK} />
      <polygon points="-48,-50 0,-86 48,-50" fill="var(--wb-blue)" {...INK} />
      <rect x={10} y={-26} width={14} height={26} fill="var(--wb-navy)" />
    </g>
  );
}

export function LiteBackdrop({ set }: { set: LiteSet }) {
  return (
    <div className="lite-bg">
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="lite-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--sky-top)" />
            <stop offset="0.62" stopColor="var(--sky-horizon)" />
          </linearGradient>
          <radialGradient id="lite-day" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--page)" />
            <stop offset="1" stopColor="var(--spill)" />
          </radialGradient>
        </defs>
        {set === 'exterior' && <ExteriorArt />}
        {set === 'lobby' && (
          <Room>
            <path d="M820,690 L820,420 A140,140 0 0 1 1100,420 L1100,690" fill="var(--surface)" {...INK} />
            <circle cx={1450} cy={640} r={90} fill="var(--wb-blue)" {...INK} />
            <ellipse cx={1450} cy={640} rx={40} ry={90} {...INK} fill="none" stroke="var(--page)" />
            <line x1={1450} y1={730} x2={1450} y2={860} {...INK} />
            <rect x={330} y={720} width={420} height={110} fill={STONE2} {...INK} />
            <rect x={320} y={710} width={440} height={14} fill="var(--wb-navy)" />
            <VietnamMap x={1690} y={300} w={140} h={260} />
          </Room>
        )}
        {set === 'hall' && (
          <Room>
            {[0, 1, 2, 3].map((i) => {
              const k = 1 - i * 0.2;
              const xL = 960 - 560 * k,
                xR = 960 + 560 * k;
              const y0 = 470 - 380 * k,
                y1 = 470 + 300 * k;
              return (
                <g key={i}>
                  <Column x={xL} y0={y0} y1={y1} w={70 * k} />
                  <Column x={xR} y0={y0} y1={y1} w={70 * k} />
                </g>
              );
            })}
            <polygon points="60,800 420,700 420,740 60,880" fill={STONE2} {...INK} />
          </Room>
        )}
        {set === 'f2' && (
          <Room floor="var(--surface)">
            <ellipse cx={960} cy={790} rx={300} ry={70} fill="var(--wood)" {...INK} />
            <line x1={960} y1={860} x2={960} y2={960} {...INK} />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={1420 + i * 70} y={260 + i * 4} width={50} height={560 - i * 10} fill={i % 2 ? 'var(--wb-navy)' : 'var(--wb-blue)'} {...INK} />
            ))}
            <rect x={120} y={360} width={360} height={180} fill="var(--wb-navy)" {...INK} />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={160 + i * 120} y={700} width={90} height={40} fill="var(--wood)" {...INK} />
            ))}
          </Room>
        )}
        {set === 'context' && (
          <Room>
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={60 + c * 120} y={260 + r * 170} width={90} height={130} fill="var(--paper)" {...INK} />),
            )}
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3].map((c) => <rect key={`b${r}${c}`} x={1410 + c * 120} y={260 + r * 170} width={90} height={130} fill="var(--paper)" {...INK} />),
            )}
            <rect x={460} y={780} width={1000} height={44} fill="var(--wb-navy)" />
            <line x1={480} y1={802} x2={1440} y2={802} stroke="var(--wb-cyan)" strokeWidth={5} />
          </Room>
        )}
        {set === 'tep' && (
          <Room>
            <circle cx={560} cy={560} r={420} fill="var(--warn)" opacity={0.12} />
            <Pylon x={330} base={900} h={620} />
            <Pylon x={700} base={880} h={420} />
            <rect x={980} y={640} width={260} height={220} fill="var(--steel)" {...INK} />
            <rect x={980} y={630} width={260} height={18} fill="var(--warn)" />
            {[1020, 1110, 1200].map((x) => (
              <line key={x} x1={x} y1={630} x2={x} y2={560} {...INK} strokeWidth={6} stroke="var(--page)" />
            ))}
          </Room>
        )}
        {set === 'ccsep' && (
          <Room>
            <circle cx={1360} cy={560} r={420} fill="var(--wb-cyan)" opacity={0.12} />
            {[0, 1, 2].map((i) => (
              <ellipse key={i} cx={360 + i * 90} cy={760 - (i === 2 ? 70 : 0)} rx={44} ry={44} fill={STONE2} {...INK} />
            ))}
            <ellipse cx={900} cy={760} rx={170} ry={40} fill="var(--wb-cyan)" {...INK} />
            <rect x={730} y={760} width={340} height={120} fill={STONE2} {...INK} />
            <House x={1150} y={880} />
            <House x={1260} y={900} s={0.8} />
            <VietnamMap x={1560} y={220} w={200} h={380} pins />
          </Room>
        )}
        {set === 'exec' && (
          <Room floor="var(--wb-navy)">
            {[700, 860, 1020, 1180].map((x) => (
              <rect key={x} x={x - 60} y={280} width={120} height={300} fill="var(--spill)" {...INK} />
            ))}
            <polygon points="760,720 1160,720 1300,900 620,900" fill="var(--wood)" {...INK} />
          </Room>
        )}
        {set === 'lift' && (
          <g>
            <rect width={1920} height={1080} fill="var(--steel)" />
            <rect x={560} y={160} width={800} height={920} fill={STONE2} {...INK} />
            <rect x={580} y={240} width={380} height={840} fill="var(--steel)" {...INK} />
            <rect x={960} y={240} width={380} height={840} fill="var(--steel)" {...INK} />
            <rect x={840} y={170} width={240} height={56} rx={6} fill="var(--wb-navy)" />
            <text x={960} y={212} textAnchor="middle" fontSize={40} fontWeight={700} fill="var(--wb-cyan)" fontFamily="var(--font-body)">
              G 1 2 3
            </text>
            <rect x={0} y={560} width={560} height={30} fill="var(--wb-navy)" />
            <rect x={1360} y={560} width={560} height={30} fill="var(--wb-navy)" />
          </g>
        )}
        {set === 'exit' && (
          <Room>
            <rect x={790} y={360} width={340} height={330} fill="url(#lite-day)" {...INK} />
            <polygon points="790,690 1130,690 1400,1080 520,1080" fill="var(--spill)" opacity={0.7} />
            <rect x={60} y={330} width={420} height={260} fill="var(--paper)" {...INK} />
          </Room>
        )}
      </svg>
    </div>
  );
}

function ExteriorArt() {
  const cols = [-7.5, -4.5, -1.5, 1.5, 4.5, 7.5];
  const sx = (x: number) => 960 + x * 34;
  return (
    <g>
      <rect width={1920} height={1080} fill="url(#lite-sky)" />
      <rect y={820} width={1920} height={260} fill="var(--ground)" />
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect x={s < 0 ? sx(-25) : sx(14)} y={420} width={11 * 34} height={400} fill={STONE} {...INK} />
          {[0, 1, 2].map((r) =>
            [-3.6, 0, 3.6].map((dx) => (
              <path
                key={`${r}${dx}`}
                d={`M${sx(s * 19.5 + dx) - 24},${760 - r * 125} v-60 a24,24 0 0 1 48,0 v60 z`}
                fill="var(--wb-blue)"
                {...INK}
              />
            )),
          )}
        </g>
      ))}
      <rect x={sx(-14)} y={380} width={28 * 34} height={440} fill={STONE} {...INK} />
      <polygon points={`${sx(-10)},320 ${sx(0)},220 ${sx(10)},320`} fill={STONE} {...INK} />
      <rect x={sx(-10)} y={320} width={20 * 34} height={50} fill={STONE2} {...INK} />
      {cols.map((x) => (
        <Column key={x} x={sx(x)} y0={372} y1={770} w={30} />
      ))}
      <rect x={sx(-1.6)} y={640} width={3.2 * 34} height={130} fill="var(--wb-navy)" {...INK} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={sx(-10.5 - i * 0.5)} y={770 + i * 10} width={(21 + i) * 34} height={10} fill={STONE2} {...INK} strokeWidth={1.2} />
      ))}
    </g>
  );
}
