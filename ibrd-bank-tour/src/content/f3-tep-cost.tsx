import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { Chart } from '../primitives/Chart';
import { F } from '../primitives/Fact';
import { TABLE11, FIGURES } from '../data/tables';
import { factValue } from '../data/facts';

const a = (n: string) => `anchor:f3-tep-cost:${n}`;
const table = (
  <DataTable
    id="t11"
    width={1300}
    columns={[
      { key: 'comp', label: 'Project component' },
      { key: 'app', label: 'Amount at approval', align: 'right', width: 230 },
      { key: 'act', label: 'Actual at closing', align: 'right', width: 230 },
      { key: 'pct', label: 'Actual / approval (%)', align: 'right', width: 240 },
    ]}
    rows={TABLE11.map((r) => ({
      id: r.id,
      kind: r.id === 'total' ? 'total' : undefined,
      cells: { comp: <b>{r.comp}</b>, app: <F id={r.app} fixed={2} />, act: <F id={r.act} fixed={2} />, pct: <F id={r.pct} fixed={2} /> },
    }))}
    caption={<R t="Table 11. TEP project cost by component at approval and at closing (million USD). Source: [46, Annex 3, Table 3.1, p. 48]. Amounts transcribed from the original table; percentages calculated by the authors; the fee row is labeled using the PAD [45]." />}
  />
);
const fig2 = (
  <Chart
    id="f2"
    kind="grouped"
    width={1240}
    height={440}
    categories={FIGURES.fig2.categories}
    series={[
      { name: 'Appraisal cost', values: FIGURES.fig2.appraisal.map(factValue), color: 'var(--series-3)' },
      { name: 'Actual cost', values: FIGURES.fig2.actual.map(factValue), color: 'var(--series-1)' },
    ]}
    max={700}
    format={(v) => v.toFixed(2)}
    caption={<R t="Figure 2. TEP expenditure by investment component at appraisal and at closing (million USD). Source: Chart prepared by the authors using data from [46, Annex 3, Table 3.1]. The {tep-fee} front-end fee is excluded from the three component bars but included in total project costs." />}
  />
);
const ANCH: Record<string, string> = { c1: 'infra', c2: 'smartgrid', c3: 'capacity', fee: 'cash', total: 'cash' };
const row = (i: number) => ({
  layout: 'centre' as const,
  title: 'Table 11 · Cost by component',
  label: TABLE11[i].comp,
  source: 'Section 3.2.2 · Table 11 · p. 37',
  centre: table,
  focus: [`t11-${TABLE11[i].id}`],
  callouts: [{ from: `#t11-${TABLE11[i].id}-comp`, to: a(ANCH[TABLE11[i].id]), label: TABLE11[i].comp }],
});
const bar = (j: number, body: string) => ({
  layout: 'centre' as const,
  title: 'Figure 2 · Appraisal vs closing',
  label: FIGURES.fig2.categories[j],
  source: 'Section 3.2.2 · Figure 2 · p. 38',
  centre: fig2,
  focus: [`f2-c${j}`],
  callouts: [{ from: `#f2-1-${j}`, to: a(['infra', 'smartgrid', 'capacity'][j]), label: FIGURES.fig2.categories[j] }],
  body,
});
const p = scene('f3-tep-cost', [
  {
    title: 'Two physical components',
    kicker: 'Section 3.2.2',
    source: 'Section 3.2.2 · p. 36',
    callouts: [{ from: '.k-card .h2', to: a('infra'), label: 'Transmission infrastructure' }],
    body: `**Component 1** financed construction, rehabilitation and upgrading of high-voltage transmission infrastructure. By increasing the power-transfer capacity of critical corridors and substations, it sought to ease load constraints, reduce system losses and improve reliability.

**Component 2** modernized monitoring, control and protection equipment in selected substations through **smart-grid technology**, mainly to improve operational information and fault management; it did not itself build additional transmission capacity [45; 56].`,
  },
  {
    title: 'Planned and actual cost',
    kicker: 'Section 3.2.2',
    source: 'Section 3.2.2 · pp. 36-37',
    body: `At appraisal, the infrastructure component accounted for {tep-c1-app} of total project cost, compared with {tep-c2-app} for smart-grid investments and {tep-c3-app} for capacity building. **Actual closing costs were lower in each category.**

The component breakdown is informative because it distinguishes the physical and digital assets created by the project from its smaller institutional reform agenda [46].`,
  },
  row(0),
  row(1),
  row(2),
  row(3),
  row(4),
  bar(0, `Transmission infrastructure: {tep-c1-app|2} planned, {tep-c1-act|2} actual ({tep-c1-pct}).`),
  bar(1, `Smart-grid network: {tep-c2-app|2} planned, {tep-c2-act|2} actual ({tep-c2-pct}).`),
  bar(2, `Capacity building: {tep-c3-app|2} planned, {tep-c3-act|2} actual ({tep-c3-pct}).`),
  {
    title: 'From cost to financing',
    kicker: 'Section 3.2.2',
    source: 'Section 3.2.2 · p. 37',
    callouts: [{ from: '.k-card .h2', to: a('cash'), label: 'Who paid' }],
    body: `Table 11 reproduces the component cost figures published in the World Bank completion report.

Table 12 then separates the **IBRD contribution** from the **borrower-financed portion**, providing the breakdown needed to assess the project's financing mechanism.`,
  },
]);
export const beats = p.beats;
export default p.View;
