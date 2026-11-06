import { scene } from './kit';

const to = 'anchor:f2-dpf:dossier';
const p = scene('f2-dpf', [
  {
    title: 'Development Policy Financing (DPF)',
    kicker: 'Section 2.1.3 · DPF',
    source: 'Section 2.1.3 · p. 24',
    callouts: [{ from: '.k-card', to, label: 'DPF' }],
    body: `Development Policy Financing works through a **policy matrix**. The government completes prior actions, such as issuing a decree or adopting a new procedure, and the loan is then released to the budget.

Vietnam's **Public Investment Reform (PIR)** series shows how this works.`,
  },
  {
    title: 'The Public Investment Reform (PIR) series',
    kicker: 'Section 2.1.3 · DPF',
    source: 'Section 2.1.3 · p. 24',
    callouts: [{ from: '.k-card', to, label: 'PIR' }],
    body: `Vietnam's DPF approach is demonstrated through three main reform operations: **PIR 1, PIR 2, and Power-Sector Reform**. These operations aimed to strengthen the public investment cycle, improve the legal basis for public-private partnerships, and support energy sector development [2; 31; 34].`,
  },
]);
export const beats = p.beats;
export default p.View;
