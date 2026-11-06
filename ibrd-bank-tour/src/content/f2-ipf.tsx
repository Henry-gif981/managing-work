import { scene } from './kit';

const p = scene('f2-ipf', [
  {
    title: 'Investment Project Financing (IPF)',
    kicker: 'Section 2.1.3 · IPF',
    source: 'Section 2.1.3 · p. 24',
    callouts: [{ from: '.k-card', to: 'anchor:f2-ipf:dossier', label: 'IPF' }],
    body: `IPF is organized around **components, a results framework, and an implementing agency**. Each component has its own budget, and because disbursement follows contract progress, **delays in land clearance or bidding directly slow the flow of funds**.`,
  },
]);
export const beats = p.beats;
export default p.View;
