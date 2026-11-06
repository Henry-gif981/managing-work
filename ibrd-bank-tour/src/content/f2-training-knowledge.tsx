import { scene } from './kit';

const to = 'anchor:f2-training-knowledge:blackboard';
const S = 'Section 2.3.2 · p. 27';
const p = scene('f2-training-knowledge', [
  {
    title: 'Learning by doing',
    kicker: 'Section 2.3.2',
    layout: 'right',
    source: S,
    callouts: [{ from: '.k-card', to, label: 'Knowledge transfer' }],
    body: `Most knowledge transfer happens **through doing**: borrower staff apply Bank procurement and safeguard rules on real contracts while Bank specialists review key steps.`,
  },
  {
    title: 'Dedicated programs',
    kicker: 'Section 2.3.2',
    layout: 'right',
    source: S,
    body: `In {mooc-year} the Bank launched a **massive open online course (MOOC) on public procurement** [43], and its **e-procurement courses** give certification to participants who pass an exam [44].`,
  },
  {
    title: 'Skills build up across projects',
    kicker: 'Section 2.3.2',
    layout: 'right',
    source: S,
    callouts: [{ from: '.k-card', to, label: 'Cumulative skills' }],
    body: `Skills also build up across projects: the **Independent Evaluation Group (IEG)** found that the power transmission utility's regional boards had built capabilities in procurement, contract administration, financial management, safeguards and reporting [41].`,
  },
  {
    title: 'Safeguards are harder to transfer',
    kicker: 'Section 2.3.2',
    layout: 'right',
    source: S,
    body: `Experience in one coastal city shows that knowing the Bank's resettlement standards is not enough when **local compensation rules and land prices differ**.`,
  },
]);
export const beats = p.beats;
export default p.View;
