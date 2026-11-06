import { scene } from './kit';
import { Chip } from '../primitives/bits';

const to = 'anchor:f2-package:table';
const p = scene('f2-package', [
  {
    title: 'The package depends on the borrower',
    kicker: 'Section 2.4',
    source: 'Section 2.4 · pp. 28-29',
    callouts: [{ from: '.k-card', to, label: 'Domestic side' }],
    aside: (
      <div className="chips">
        <Chip tone="bad">Counterpart funding</Chip>
        <Chip tone="bad">Land acquisition</Chip>
        <Chip tone="bad">PMU capacity</Chip>
      </div>
    ),
    body: `In the projects reviewed in this study, the binding constraints lay mainly on the **domestic side**: counterpart funding, land acquisition and PMU capacity. When these fail, IBRD money stays undisbursed, technical advice cannot be applied, and reforms take effect only late.`,
  },
  {
    title: 'The value lies in the combination',
    kicker: 'Section 2.4',
    source: 'Section 2.4 · p. 29',
    body: `The value of the IBRD lies less in any single form of support than in **their combination**, and that combination works only when **domestic systems are ready to absorb it**.`,
  },
]);
export const beats = p.beats;
export default p.View;
