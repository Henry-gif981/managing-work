import { scene } from './kit';
import { Chip } from '../primitives/bits';

const a = (n: string) => `anchor:f3-eval-limitations:${n}`;
const heads = (on: number) => (
  <div className="chips lim-chips">
    {['Slow disbursement', 'Procedural complexity', 'Counterpart funding', 'Safeguard gaps'].map((t, i) => (
      <Chip key={t} tone={i === on ? 'bad' : undefined}>
        {t}
      </Chip>
    ))}
  </div>
);
const p = scene('f3-eval-limitations', [
  {
    title: 'Slow disbursement',
    source: 'Section 3.4.2 · p. 56',
    aside: heads(0),
    callouts: [{ from: '.k-card .h2', to: a('scales'), label: 'Undisbursed balances' }],
    body: `TEP 63.7% of IBRD commitment [46]; CCSEP about 36% by late 2022 [57].`,
  },
  {
    title: 'Procedural complexity',
    source: 'Section 3.4.2 · p. 56',
    aside: heads(1),
    body: `TEP smart-grid approval about 4 years [41]; CCSEP effectiveness 5.5 months late [36].`,
  },
  {
    title: 'Counterpart funding',
    source: 'Section 3.4.2 · p. 56',
    aside: heads(2),
    body: `CCSEP provincial funds began only in Jul 2019 [57].`,
  },
  {
    title: 'Safeguards vs domestic rules',
    source: 'Section 3.4.2 · p. 56',
    aside: heads(3),
    callouts: [{ from: '.k-card .h2', to: a('compass'), label: 'Land compensation' }],
    body: `Nha Trang: only 29% of affected households compensated at closing [63, p. 19].`,
  },
]);
export const beats = p.beats;
export default p.View;
