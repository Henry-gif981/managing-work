import { scene } from './kit';

const p = scene('f2-counterpart', [
  {
    title: 'Counterpart funding requirements',
    kicker: 'Section 2.1.2',
    source: 'Section 2.1.2 · p. 23',
    callouts: [{ from: '.k-card', to: 'anchor:f2-counterpart:scales', label: 'Money available, not used' }],
    body: `The IBRD rarely finances the whole project, so the borrower contributes **counterpart funding**. This funding is often the **binding constraint on disbursement**, leaving available IBRD money unused while local debt obligations add to caution [36].`,
  },
]);
export const beats = p.beats;
export default p.View;
