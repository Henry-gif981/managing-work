import { scene } from './kit';
import { Stat } from '../primitives/bits';
import { F } from '../primitives/Fact';

const to = 'anchor:f2-training-pmu:desks';
const p = scene('f2-training-pmu', [
  {
    title: 'Leaving capacity behind',
    kicker: 'Section 2.3',
    layout: 'right',
    source: 'Section 2.3 · p. 27',
    callouts: [{ from: '.k-card .h2', to, label: 'Training' }],
    body: `Training and capacity building aim to leave the borrower able to manage similar investments without outside help. They work at {training-levels|n} levels: the **people** in project units, the **technical skills** those people apply, and the **institutions** they work for.`,
  },
  {
    title: 'Project management units',
    layout: 'right',
    source: 'Section 2.3.1 · p. 27',
    body: `In Vietnam, IBRD projects are run by project management units (PMUs) or boards attached to the implementing agency.

**TEP** was implemented through NPT's northern, central and southern project management boards. **CCSEP** used one PMU in each province (see Sections 3.2.1 and 3.3.1).`,
  },
  {
    title: 'The Open Learning Campus',
    layout: 'right',
    source: 'Section 2.3.1 · p. 27',
    callouts: [{ from: '.k-card .h2', to, label: 'Courses' }],
    body: `The Bank supports these units with training in project management, financial management, procurement and safeguards. Much of this is delivered through the World Bank's **Open Learning Campus**, which offers self-paced and blended courses.

Its project orientation courses, for example, cover Bank expectations, project and financial management, procurement, environmental and social risk management, and M&E [42].`,
  },
  {
    title: 'When staff stay',
    layout: 'right',
    source: 'Section 2.3.1 · p. 27',
    aside: (
      <div className="k-stats">
        <Stat value={<>
          <F id="phanrang-from-oda" />/<F id="phanrang-staff" />
        </>} label="Phan Rang PMU staff drawn from other ODA units" />
      </div>
    ),
    body: `Training is most effective when staff stay with the unit. CCSEP built on PMUs inherited from an earlier project, and the new PMU in Phan Rang drew {phanrang-from-oda|n} of its {phanrang-staff|n} staff from other ODA units (see Section 3.3.3).

Even so, **weak PMU capacity remained a main cause of delay**, and the Bank recommended adding qualified staff after restructuring.`,
  },
]);
export const beats = p.beats;
export default p.View;
