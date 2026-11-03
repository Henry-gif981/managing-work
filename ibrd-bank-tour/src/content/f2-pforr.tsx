import { scene } from './kit';
import { Chip } from '../primitives/bits';

const to = 'anchor:f2-pforr:dossier';
const p = scene('f2-pforr', [
  {
    title: 'PforR: money for measurable results',
    kicker: 'Section 2.1.3 · PforR',
    source: 'Section 2.1.3 · p. 24',
    callouts: [{ from: '.k-card .h2', to, label: 'PforR' }],
    body: `Program-for-Results links money to measurable results. The borrower and the Bank agree on **Disbursement-Linked Indicators (DLIs)**, and funds are released only after an agreed agency **verifies** that each target is met.

Because spending is not traced item by item, PforR relies on the country's own fiduciary and environmental systems, which are assessed beforehand.`,
  },
  {
    title: 'Choosing DLIs',
    kicker: 'Section 2.1.3 · PforR',
    source: 'Section 2.1.3 · p. 24',
    body: `IEG has found that **the choice of DLIs is critical**: they must lead clearly to the program's development objective, and monitoring should not focus on DLIs alone [35].`,
  },
  {
    title: 'Three instruments, three needs',
    kicker: 'Section 2.1.3',
    source: 'Section 2.1.3 · p. 24',
    callouts: [{ from: '.k-card .h2', to: 'anchor:f2-pforr:table', label: 'Three dossiers' }],
    aside: (
      <div className="chips">
        <Chip tone="navy">IPF builds assets</Chip>
        <Chip tone="cyan">DPF supports reforms</Chip>
        <Chip tone="warn">PforR rewards performance</Chip>
      </div>
    ),
    body: `The three instruments answer different needs. IPF builds assets, DPF supports reforms, and PforR rewards the performance of existing programs.

For Vietnam, which has mainly used IPF for infrastructure, the choice matters: **a results-based design shifts more responsibility, and more risk, onto domestic agencies**.`,
  },
]);
export const beats = p.beats;
export default p.View;
