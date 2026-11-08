import { scene, R } from './kit';

const a = (n: string) => `anchor:f3-eval-achievements:${n}`;
const cards = (
  <div className="mini-cards">
    <div className="mini-card">
      <R t="26-year maturity [23]" />
    </div>
    <div className="mini-card">
      <R t="10-year grace [23]" />
    </div>
    <div className="mini-card">
      <R t="lower costs through competitive bidding [41]" />
    </div>
  </div>
);
const p = scene('f3-eval-achievements', [
  {
    title: 'Two cases, one lesson',
    kicker: 'Section 3.4',
    source: 'Section 3.4 · p. 55',
    callouts: [{ from: '.k-card .h2', to: a('table'), label: 'Executive office' }],
    body: `IBRD support is a package of finance, technical support and training. Results depend on domestic absorption.`,
  },
  {
    title: 'Financial mobilization',
    source: 'Section 3.4.1 · p. 55',
    aside: cards,
  },
  {
    title: 'Higher technical standards',
    source: 'Section 3.4.1 · p. 55',
    callouts: [{ from: '.k-card .h2', to: a('compass'), label: 'Standards' }],
    body: `TEP: smart grid at 15 substations, +4,263 MW [41]. CCSEP: sewers and treatment in four cities.`,
  },
  {
    title: 'Higher management standards',
    source: 'Section 3.4.1 · pp. 55-56',
    callouts: [{ from: '.k-card .h2', to: a('scales'), label: 'Management' }],
    body: `Bank procurement, financial and safeguard rules applied. CCSEP cost recovery: 100% in all four cities [63, Table 5].`,
  },
]);
export const beats = p.beats;
export default p.View;
