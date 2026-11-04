import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { Chip, Note, Stat } from '../primitives/bits';
import { F } from '../primitives/Fact';
import { TABLE20 } from '../data/tables';

const a = (n: string) => `anchor:f3-ccsep-results:${n}`;
const table = (
  <DataTable
    id="t20"
    width={1300}
    columns={[
      { key: 'ind', label: 'Indicator' },
      { key: 'target', label: 'Target (PAD)', align: 'right', width: 220 },
      { key: 'actual', label: 'Actual', align: 'right', width: 220 },
      { key: 'ratio', label: 'Ratio', align: 'right', width: 140 },
    ]}
    rows={TABLE20.map((r) => ({
      id: r.id,
      cells: { ind: <b>{r.ind}</b>, target: <F id={r.target} unit={r.id === 'cost'} />, actual: <F id={r.actual} unit={r.id === 'cost'} />, ratio: <F id={r.ratio} /> },
    }))}
    caption={<R t="Table 20. Key performance indicators at project completion (30/6/2024). Source: [63, Table 1, Table 5 and Annex 1] and [64, pp. 6–10]." />}
  />
);
const row = (i: number, body?: string) => ({
  layout: 'centre' as const,
  band: 'right' as const,
  title: 'Table 20 · KPIs at completion',
  label: TABLE20[i].ind,
  source: 'Section 3.3.4 · Table 20 · p. 56',
  centre: table,
  focus: [`t20-${TABLE20[i].id}`],
  callouts: [{ from: `#t20-${TABLE20[i].id}-ratio`, to: a(TABLE20[i].anchor), label: TABLE20[i].ind }],
  body,
});
const p = scene('f3-ccsep-results', [
  {
    title: 'Closing reports and ratings',
    kicker: 'Section 3.3.4',
    layout: 'right',
    source: 'Section 3.3.4 · p. 57',
    aside: (
      <div className="ratings">
        <div>
          <span>ICR outcome</span>
          <Chip tone="warn">
            <F id="ccsep-icr-outcome" />
          </Chip>
        </div>
        <div>
          <span>ICR Bank performance</span>
          <Chip tone="warn">
            <F id="ccsep-icr-bank" />
          </Chip>
        </div>
        <div>
          <span>ICR M&E quality</span>
          <Chip tone="bad">
            <F id="ccsep-me-quality" />
          </Chip>
        </div>
        <div>
          <span>IEG outcome</span>
          <Chip tone="good">
            <F id="ccsep-ieg-outcome" />
          </Chip>
        </div>
      </div>
    ),
    body: `The loan closed on {ccsep-closing-date}. The Bank issued its ICR on {icr-date}; IEG completed its review (ICRR) on {icrr-date} [63; 64]. IEG **raised the outcome to satisfactory**, citing high relevance, substantial efficacy and substantial efficiency, including an ex post EIRR of about **{ccsep-eirr}** against a {discount-rate} discount rate [63, pp. iii, 13; 64, pp. 12, 18].`,
  },
  row(0, `**Direct beneficiaries:** {kpi-ben} of {kpi-ben-target} = **{kpi-ben-pct}** of the PAD target [63, Table 1; 64, p. 7].`),
  row(1, `**Household sewer connections:** {kpi-sewer} of {kpi-sewer-target} = **{kpi-sewer-pct}**.`),
  row(2, `**Cost recovery:** all four cities reached full cost recovery for drainage and wastewater services [63, Table 5].`),
  row(3, `**Roads:** {kpi-roads} completed, meeting the original target but just short of the revised {rev-roads}.`),
  row(4, `**Bridges:** {kpi-bridges|n} of {kpi-bridges|n} completed.`),
  {
    layout: 'centre',
    band: 'right',
    title: 'Table 20 · Which totals?',
    label: 'ICR vs Annex 1',
    source: 'Section 3.3.4 · Table 20 note · p. 56',
    centre: table,
    focus: ['t20-ben', 't20-sewer'],
    callouts: [{ from: '#t20-ben-actual', to: a('houses'), label: 'Beneficiaries' }],
    aside: (
      <Note>
        <R t="Targets are the original PAD targets as reported by IEG; the restructuring revised several of them ({rev-ben} beneficiaries, {rev-sewer} sewer connections and {rev-roads} of roads). The ICR reports two sets of totals: {kpi-ben} and {kpi-sewer} in its main text (used by IEG and here), and {annex-ben} and {annex-sewer} in Annex 1." />
      </Note>
    ),
  },
  {
    title: 'Targets met, except Nha Trang',
    kicker: 'Section 3.3.4',
    layout: 'right',
    source: 'Section 3.3.4 · p. 58',
    body: `The project met most sanitation targets, except in Nha Trang. **Dong Hoi, Quy Nhon and Phan Rang exceeded their targets**, while **Nha Trang reached only about {nt-target-pct}** because some works were not completed and its new wastewater treatment plant was still in trial operation at closing [63, pp. 8–10]. All four cities reached full cost recovery [63, Table 5].`,
  },
  {
    title: 'Disbursement after restructuring',
    kicker: 'Section 3.3.4',
    layout: 'right',
    source: 'Section 3.3.4 · p. 58',
    side: (
      <div className="card k-stats">
        <Stat value={<F id="panel-disb" />} label="disbursed, Inspection Panel, August 2023" />
        <Stat value={<F id="close-pct" />} label="of US$236.2 million at closing (about)" />
        <Stat id="st-ibrd" value={<><F id="close-ibrd" unit={false} />/<F id="ccsep-ibrd" unit={false} /></>} label="IBRD: US$ million used of the loan" tone="bad" />
      </div>
    ),
    callouts: [{ from: '#st-ibrd', to: a('bridge'), label: 'IBRD loan' }],
    body: `Disbursement kept rising after restructuring: the Inspection Panel reported {panel-disb} in {panel-disb-date} [60, paras. 6, 55], and by closing the Bank had disbursed {close-wb}, about {close-pct} of {ccsep-wb} [63, p. ii]. These use different bases and show direction, not exact comparisons.

The **IBRD portion was the least used**: only {close-ibrd} of the {ccsep-ibrd} loan, after {cancel-ibrd} was cancelled and the unused balance returned [63, pp. ii, 6; 64, p. 3].`,
  },
  {
    title: 'Climate resilience',
    kicker: 'Section 3.3.4',
    layout: 'right',
    source: 'Section 3.3.4 · p. 58',
    body: `The PAD targeted reduced flood risk for approximately {flood-people-target} people, {embank-target} of embankments, {kpi-roads} of roads and {kpi-bridges|n} bridges [36]; the restructuring revised these to {flood-people-rev} people, {embank-rev} and {rev-roads}, bridges unchanged [64, pp. 8–9]. The paper compares with the original targets.

At completion: **{flood-people} people** with reduced flood risk, **{embank}** of embankments and channels, **{networks}** of drainage and wastewater networks, **{kpi-roads} of roads and {kpi-bridges|n} bridges**, meeting the original road target but just short of the revised one [63, Table 2, Annex 1; 64, pp. 6–7].`,
  },
  {
    title: 'The gap behind the totals',
    kicker: 'Section 3.3.4',
    layout: 'right',
    source: 'Section 3.3.4 · p. 58',
    body: `These totals hide the gap in **Nha Trang**: only **{nt-embank-pct} of the embankment works** were completed, and {nt-roads-left} of roads, a flood retention lake and a flood pumping station were left to be finished with counterpart funds [63, pp. 9, 20, 25].`,
  },
  {
    title: 'Lasting institutional results',
    kicker: 'Section 3.3.4',
    layout: 'right',
    source: 'Section 3.3.4 · p. 58',
    body: `More sustainable results lie in institutional capacity. Each city has a **PSMU** (Dong Hoi and Phan Rang set theirs up under the project); drainage and wastewater assets went to People's Committees, road assets to transport departments; connection policies and septage plans were issued; tariff roadmaps approved [57; 63, p. 12].

All {ccsep-contracts|n} performance-based contracts were signed and operating by closing, but ran **{contract-years-actual} years** instead of the {contract-years-plan} envisaged [64, pp. 10–11]. Nha Trang shows drainage benefits are fully realized only when networks and household connections are complete.`,
  },
]);
export const beats = p.beats;
export default p.View;
