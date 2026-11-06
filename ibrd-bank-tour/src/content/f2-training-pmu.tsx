import { scene } from './kit';

const to = 'anchor:f2-training-pmu:desks';
const p = scene('f2-training-pmu', [
  {
    title: 'Leaving capacity behind',
    kicker: 'Section 2.3',
    layout: 'right',
    source: 'Section 2.3 · p. 26',
    callouts: [{ from: '.k-card', to, label: 'Training' }],
    body: `Training aims to leave the borrower able to manage similar investments **without outside help**, at three levels: **people**, their **skills** and the **institutions** they work for.`,
  },
  {
    title: 'Training project management units',
    kicker: 'Section 2.3.1',
    layout: 'right',
    source: 'Section 2.3.1 · p. 26',
    callouts: [{ from: '.k-card', to, label: 'Courses' }],
    body: `IBRD projects are run by **project management units (PMUs)**. The Bank trains them in project and financial management, procurement and safeguards, much of it through the World Bank's **Open Learning Campus** [42].`,
  },
  {
    title: 'When staff stay',
    kicker: 'Section 2.3.1',
    layout: 'right',
    source: 'Section 2.3.1 · p. 26',
    body: `Training works best when **staff stay with the unit**. In one urban project, most PMUs were carried over from an earlier project. Even so, weak PMU capacity remained a main cause of delay, and the Bank recommended adding qualified staff after restructuring [57].`,
  },
]);
export const beats = p.beats;
export default p.View;
