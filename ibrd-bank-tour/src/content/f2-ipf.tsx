import { scene } from './kit';

const to = 'anchor:f2-ipf:dossier';
const p = scene('f2-ipf', [
  {
    title: 'IPF: components and contracts',
    kicker: 'Section 2.1.3 · IPF',
    source: 'Section 2.1.3 · p. 23',
    callouts: [{ from: '.k-card .h2', to, label: 'IPF' }],
    body: `Investment Project Financing is organized around **components**, a **results framework** and an **implementing agency**. Each component has its own budget and financing source, and disbursement follows the progress of contracts.`,
  },
  {
    title: 'TEP as the model',
    kicker: 'Section 2.1.3 · IPF',
    source: 'Section 2.1.3 · pp. 23-24',
    callouts: [{ from: '.k-card .h2', to, label: 'TEP' }],
    body: `TEP illustrates the model: {tep-components|n} components, implemented by NPT's regional project management boards, with IBRD funds paid against works and equipment (see Section 3.2.2).

Because disbursement tracks physical progress, **delays in land clearance or bidding slow the flow of funds directly**.`,
  },
]);
export const beats = p.beats;
export default p.View;
