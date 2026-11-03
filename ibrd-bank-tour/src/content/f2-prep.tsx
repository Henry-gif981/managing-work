import { scene } from './kit';
import { Stat } from '../primitives/bits';
import { F } from '../primitives/Fact';

const to = 'anchor:f2-prep:plans';
const p = scene('f2-prep', [
  {
    title: 'More than a loan',
    kicker: 'Section 2.2',
    source: 'Section 2.2 · p. 24',
    callouts: [{ from: '.k-card .h2', to, label: 'Technical support' }],
    body: `Technical support is what distinguishes IBRD financing from a commercial loan. The Bank helps **design the project** before money is committed, **advises on policy** outside any single loan, and **tracks results** until well after completion.`,
  },
  {
    title: 'Designing the project',
    source: 'Section 2.2.1 · p. 25',
    side: (
      <div className="card">
        <Stat id="st-eirr" value={<F id="tep-eirr" />} label="TEP: economic internal rate of return (EIRR) estimated at appraisal" tone="good" />
      </div>
    ),
    callouts: [{ from: '#st-eirr', to, label: 'Appraisal' }],
    body: `During preparation, the borrower designs the project with advice from a Bank task team of technical, financial, procurement and safeguard specialists. The team helps define the components and check the technical design, and tests economic and financial viability.

For TEP, the appraisal estimated an EIRR of {tep-eirr} (see Section 3.2.4). Such analysis gives the borrower an independent check before it takes on debt.`,
  },
  {
    title: 'Safeguard instruments and the Preparation Advance',
    source: 'Section 2.2.1 · p. 25',
    callouts: [{ from: '.k-card .h2', to, label: 'ESIA' }],
    body: `Preparation also produces the environmental and social instruments required by the Bank's policies: impact assessments, resettlement plans and stakeholder consultations. CCSEP prepared an **environmental and social impact assessment for each city** and a **resettlement policy framework for all {ccsep-cities|n}** [36].

Where preparation itself is costly, the borrower can use a **Preparation Advance**, which is later refinanced from the loan [37].`,
  },
  {
    title: 'Preparation shapes what follows',
    source: 'Section 2.2.1 · p. 25',
    body: `The quality of preparation shapes everything that follows.

IEG concluded that more thorough advance preparation and regulatory coordination on **TEP's smart-grid component** would have avoided the need to extend the project (see Section 3.2.3).`,
  },
]);
export const beats = p.beats;
export default p.View;
