import { scene } from './kit';
import { Chip } from '../primitives/bits';

const to = 'anchor:f2-package:table';
const p = scene('f2-package', [
  {
    title: 'The package depends on the borrower',
    source: 'Section 2.4 · pp. 29-30',
    callouts: [{ from: '.k-card .h2', to, label: 'Domestic side' }],
    aside: (
      <div className="chips">
        <Chip tone="bad">Counterpart funding</Chip>
        <Chip tone="bad">Land acquisition</Chip>
        <Chip tone="bad">PMU capacity</Chip>
      </div>
    ),
    body: `The package, however, depends on the borrower. The evidence in Chapter 3 shows that the binding constraints usually lie on the **domestic side**: counterpart funding, land acquisition and PMU capacity.

When these fail, IBRD money stays undisbursed, technical advice cannot be applied, and training stops at setup.`,
  },
  {
    title: 'The value lies in the combination',
    source: 'Section 2.4 · p. 30',
    body: `The value of the IBRD therefore lies less in any single form of support than in their combination, and that combination works only when domestic systems are ready to absorb it.

**Chapter 3 tests this argument against two projects in Vietnam.**`,
  },
]);
export const beats = p.beats;
export default p.View;
