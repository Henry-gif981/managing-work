import { scene } from './kit';
import { recList } from './f3-recs-1';

const a = (n: string) => `anchor:f3-recs-2:${n}`;
const p = scene('f3-recs-2', [
  {
    title: '4 · Strengthen and stabilize PMUs',
    source: 'Section 3.4.3 · p. 63',
    side: recList,
    focus: ['rec-4'],
    callouts: [{ from: '#rec-4', to: a('table'), label: 'Professional PMUs' }],
    body: `Experienced staff should be kept in **professional PMUs that manage several projects over time**, rather than in units created and dissolved with each loan.

Training through the World Bank's **Open Learning Campus** should focus on contract management, procurement and safeguards.`,
  },
  {
    title: '5 · Streamline domestic procedures',
    source: 'Section 3.4.3 · p. 63',
    side: recList,
    focus: ['rec-5'],
    body: `Under **Decree No. 242/2025/ND-CP**, approval steps for project proposals, investment decisions, on-lending and counterpart allocation should be **shortened and scheduled to match the World Bank project cycle** [54].`,
  },
  {
    title: '6 · Choose instruments strategically',
    source: 'Section 3.4.3 · p. 63',
    side: recList,
    focus: ['rec-6'],
    callouts: [{ from: '#rec-6', to: a('compass'), label: 'Instrument choice' }],
    body: `For reform programs with measurable results, Vietnam can consider **PforR or DPF** rather than relying only on IPF.

**Reimbursable Advisory Services** can provide tailored advice where analytical support is needed outside a loan [40].`,
  },
]);
export const beats = p.beats;
export default p.View;
