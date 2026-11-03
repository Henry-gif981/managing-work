import { scene } from './kit';

const to = 'anchor:f2-training-knowledge:blackboard';
const p = scene('f2-training-knowledge', [
  {
    title: 'Learning by doing',
    layout: 'right',
    source: 'Section 2.3.2 · p. 27',
    callouts: [{ from: '.k-card .h2', to, label: 'Knowledge transfer' }],
    body: `Much of the knowledge transfer happens through doing. Borrower staff apply the Bank's procurement rules and safeguard policies on real contracts, while Bank specialists review key steps.

Over time, this builds skills in **bidding**, **contract management** and **risk assessment**.`,
  },
  {
    title: 'Dedicated programs',
    layout: 'right',
    source: 'Section 2.3.2 · p. 27',
    body: `The Bank also runs dedicated programs. In {mooc-year}, it launched what it described as the world's first massive open online course (MOOC) on public procurement, the **Certificate Program in Public Procurement** [43].

E-procurement courses on the Open Learning Campus offer certification to participants who pass an examination [44].`,
  },
  {
    title: 'TEP and Nha Trang',
    layout: 'right',
    source: 'Section 2.3.2 · p. 28',
    callouts: [{ from: '.k-card .h2', to, label: 'Cumulative skills' }],
    body: `TEP shows the cumulative effect: IEG found that NPT's regional boards had built capabilities in procurement, contract administration, financial management, safeguards and reporting, partly from earlier World Bank projects [41].

**Safeguards proved harder to transfer.** Nha Trang shows that knowing the Bank's resettlement standards is not enough when local compensation rules and land prices differ (see Section 3.3.4).`,
  },
]);
export const beats = p.beats;
export default p.View;
