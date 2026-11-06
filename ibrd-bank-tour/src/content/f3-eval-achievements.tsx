import { scene } from './kit';
import { Stat } from '../primitives/bits';
import { F } from '../primitives/Fact';

const a = (n: string) => `anchor:f3-eval-achievements:${n}`;
const p = scene('f3-eval-achievements', [
  {
    title: 'Two cases, one lesson',
    kicker: 'Section 3.4',
    source: 'Section 3.4 · p. 55',
    callouts: [{ from: '.k-card .h2', to: a('table'), label: 'Executive office' }],
    body: `Taken together, the two cases show that **IBRD support works as a package of finance, technical support and training**, and that its results depend on whether domestic systems can absorb it.

This section summarizes the achievements and limitations common to both projects and draws recommendations for Vietnam.`,
  },
  {
    title: 'Financial mobilization',
    source: 'Section 3.4.1 · p. 55',
    side: (
      <div className="card k-stats">
        <Stat value={<F id="tep-ibrd" />} label={<>TEP: <F id="tep-maturity" /> maturity, <F id="tep-grace" /> grace</>} />
        <Stat value={<F id="ccsep-ibrd-maturity" />} label="CCSEP IBRD loan maturity" />
        <Stat value={<F id="cp-share-adj" />} label="CCSEP counterpart share after restructuring" />
      </div>
    ),
    body: `IBRD loans gave Vietnam **long-term capital on terms domestic markets could not easily match**. TEP received {tep-ibrd} with a {tep-maturity} maturity and a {tep-grace} grace period [23]; CCSEP's IBRD loan carried a {ccsep-ibrd-maturity} maturity [36].

Both projects also mobilized counterpart resources: NPT committed {tep-counterpart} to TEP, and CCSEP's counterpart share rose to {cp-share-adj} after restructuring. In TEP, competitive bidding under Bank rules lowered capital costs, so the same objectives were achieved with less borrowing [41].`,
  },
  {
    title: 'Higher technical standards',
    source: 'Section 3.4.1 · p. 55',
    callouts: [{ from: '.k-card .h2', to: a('compass'), label: 'Standards' }],
    body: `TEP introduced **smart-grid technology** in {tep-500|n} 500-kV and {tep-220|n} 220-kV substations and added **{tep-mw}** of transformer capacity. Operating costs per MWh fell from {om-baseline} to {om-2021}, and unserved energy dropped sharply [41].

CCSEP extended **sewer networks and treatment capacity** in four coastal cities that had treated only a small share of their wastewater.`,
  },
  {
    title: 'Higher management standards',
    source: 'Section 3.4.1 · pp. 55-56',
    callouts: [{ from: '.k-card .h2', to: a('scales'), label: 'Management' }],
    body: `Both projects applied the Bank's **procurement, financial management and safeguard rules**, and their implementing units built skills in these areas. NPT's asset management system now supports investment and maintenance decisions.

In CCSEP, the reforms under Decree No. {decree-80} produced service management units, connection policies and tariff roadmaps, and **cost recovery reached {kpi-cost} in all four cities** by closing [63, Table 5]. These institutional changes are likely to last longer than any single project.`,
  },
]);
export const beats = p.beats;
export default p.View;
