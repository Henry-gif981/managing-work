import { scene } from './kit';

const to = 'anchor:f2-prep:plans';
const K = 'Section 2.2.1';
const T = 'Project preparation and feasibility studies';
const p = scene('f2-prep', [
  {
    title: 'More than a loan',
    kicker: 'Section 2.2',
    source: 'Section 2.2 · p. 24',
    callouts: [{ from: '.k-card', to, label: 'Technical support' }],
    body: `**Technical support** is what sets IBRD financing apart from a commercial loan: the Bank helps **design** the project, **advises** on policy and **tracks results** long after completion.`,
  },
  {
    title: T,
    kicker: K,
    source: 'Section 2.2.1 · p. 24',
    callouts: [{ from: '.k-card', to, label: 'Feasibility' }],
    body: `During preparation, the borrower designs the project with advice from a Bank task team of technical, financial, procurement and safeguard specialists. The team helps define the components and check the technical design, and tests economic and financial viability.`,
  },
  {
    title: T,
    kicker: K,
    source: 'Section 2.2.1 · p. 25',
    body: `Preparation produces required environmental and social instruments, such as impact assessments and resettlement plans. Where preparation is costly, the borrower can use a **Preparation Advance**, which is later refinanced from the loan [36; 37].`,
  },
  {
    title: T,
    kicker: K,
    source: 'Section 2.2.1 · p. 25',
    body: `The quality of preparation shapes everything that follows. As Independent Evaluation Group (IEG) concluded, more thorough advance preparation and regulatory coordination on TEP would have avoided project extension [41].`,
  },
]);
export const beats = p.beats;
export default p.View;
