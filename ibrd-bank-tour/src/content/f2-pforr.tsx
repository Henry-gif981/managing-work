import { scene } from './kit';
import { Chip } from '../primitives/bits';

const p = scene('f2-pforr', [
  {
    title: 'Program-for-Results (PforR)',
    kicker: 'Section 2.1.3 · PforR',
    source: 'Section 2.1.3 · p. 24',
    callouts: [{ from: '.k-card', to: 'anchor:f2-pforr:dossier', label: 'PforR' }],
    body: `PforR links money to **Disbursement-Linked Indicators (DLIs)**, releasing funds only after verified results while relying on country's own fiduciary and environmental systems.

**Independent Evaluation Group (IEG)** highlights that DLIs must lead clearly to development objectives, and monitoring should not focus on DLIs alone [35].`,
  },
  {
    title: 'Three instruments, three needs',
    kicker: 'Section 2.1.3',
    source: 'Section 2.1.3 · p. 24',
    callouts: [{ from: '.k-card', to: 'anchor:f2-pforr:table', label: 'Three dossiers' }],
    aside: (
      <div className="chips">
        <Chip tone="navy">IPF builds assets</Chip>
        <Chip tone="cyan">DPF supports reforms</Chip>
        <Chip tone="warn">PforR rewards performance</Chip>
      </div>
    ),
    body: `For Vietnam, which has mainly used IPF for infrastructure, the choice matters: a **results-based design** shifts more responsibility, and more risk, onto domestic agencies.`,
  },
]);
export const beats = p.beats;
export default p.View;
