import { scene } from './kit';

const to = 'anchor:f1-rationale-1:globe';
const p = scene('f1-rationale-1', [
  {
    title: 'Long-term needs, limited resources',
    source: 'Introduction 1.1 · p. 4',
    callouts: [{ from: '.k-card .h2', to, label: 'Developing economies' }],
    body: `For developing economies, the need for long-term investment in infrastructure, energy, health and education far exceeds what domestic resources can provide. Savings are limited and tax bases are narrow. Borrowing on international markets often comes at a high cost or with short maturities, if it is available at all.

This is where **multilateral development banks (MDBs)** step in. Backed by member-state capital and strong credit ratings, they raise funds cheaply in global markets and pass those advantages on through longer maturities and lower interest rates.`,
  },
  {
    title: 'Stable, long-term capital',
    source: 'Introduction 1.1 · p. 4',
    body: `MDBs' most direct contribution is stable, long-term capital, which suits infrastructure projects that may take decades to pay back. This stability matters most in crises: during the {crisis-2008} financial crisis and the COVID-19 pandemic, private capital withdrew, while MDBs expanded their lending to keep essential investment going.

MDBs also play a **catalytic role**: by co-financing, offering guarantees and sharing risk, they make projects more attractive to commercial banks and private investors who might otherwise hold back.`,
  },
  {
    title: 'Value beyond finance',
    source: 'Introduction 1.1 · p. 4',
    callouts: [{ from: '.k-card .h2', to, label: 'Shared challenges' }],
    body: `Their value also goes beyond finance. Through project appraisal, technical assistance and international standards on procurement and safeguards, MDBs help raise project quality and build the capacity of borrowing governments.

Their multilateral nature also allows them to coordinate action on shared challenges such as **climate change** and **regional connectivity**.`,
  },
]);
export const beats = p.beats;
export default p.View;
