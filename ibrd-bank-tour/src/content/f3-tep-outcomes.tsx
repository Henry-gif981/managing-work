import { scene, R, detail } from './kit';
import { DataTable } from '../primitives/DataTable';
import { Chart } from '../primitives/Chart';
import { Stat, Note } from '../primitives/bits';
import { F } from '../primitives/Fact';
import { TABLE15, FIGURES } from '../data/tables';
import { factValue } from '../data/facts';

const a = (n: string) => `anchor:f3-tep-outcomes:${n}`;
const table = (
  <DataTable
    id="t15"
    width={1300}
    columns={[
      { key: 'ind', label: 'Indicator' },
      { key: 'early', label: 'Earlier observation', width: 280 },
      { key: 'late', label: 'Later observation', width: 300 },
      { key: 'scope', label: 'Interpretation / scope', width: 300 },
    ]}
    rows={TABLE15.map((r) => ({ id: r.id, cells: { ind: <b>{r.ind}</b>, early: <R t={r.early} />, late: <R t={r.late} />, scope: r.scope } }))}
    caption={<R t="Table 3.2.6. Selected system-level service and efficiency indicators around TEP completion. Source: Authors’ compilation from [41, pp. 9–11, Tables 2.2–2.3; underlying EVN data]." />}
  />
);
const fig4 = (
  <Chart
    id="f4"
    kind="line"
    width={1240}
    height={420}
    categories={FIGURES.fig4.categories}
    series={[{ name: 'Transmission loss ratio (%)', values: FIGURES.fig4.values.map(factValue), color: 'var(--series-2)' }]}
    min={2.0}
    max={2.7}
    format={(v) => v.toFixed(2)}
    caption={<R t="Figure 3.2.4. Vietnam’s electricity transmission loss ratio, 2015-2022 (%; axis from 2.0%, as in the paper). Source: [41, Table 2.3, p. 11], citing EVN data. 2016, 2017, 2018 and 2020 values are the data labels of the paper's figure. The system-wide ratio is not a TEP-only impact estimate." />}
  />
);
const row = (i: number, body?: string) => ({
  layout: 'centre' as const,
  title: 'Table 3.2.6 · System-level indicators',
  label: TABLE15[i].ind,
  source: 'Section 3.2.4 · Table 3.2.6 · p. 40',
  centre: table,
  focus: [`t15-${TABLE15[i].id}`],
  callouts: [{ from: `#t15-${TABLE15[i].id}-ind`, to: a(TABLE15[i].anchor), label: TABLE15[i].ind.split(' per ')[0].split(' caused')[0] }],
  body,
});
const p = scene('f3-tep-outcomes', [
  {
    title: 'Operating Efficiency at Closure',
    kicker: 'Section 3.2.4 · outcomes',
    source: 'Section 3.2.4 · p. 39',
    body: `Beyond physical infrastructure, the project also recorded improvements in operational efficiency and electricity supply reliability [41, pp. 9-11].`,
  },
  row(0, `Average operation and maintenance costs decreased from USD 0.87 to USD 0.67 per megawatt-hour transmitted.`),
  row(1, `Unserved energy declined significantly, from 4,875 to 817 megawatt-hours.`),
  // interruption duration, frequency and losses stay in Table 3.2.6; Figure 3.2.4 out of the main flow: detail beats
  ...detail(row(2), row(3), row(4), {
    layout: 'centre',
    title: 'Figure 3.2.4 · Transmission loss ratio',
    label: 'Loss ratio 2015-2022',
    source: 'Section 3.2.4 · Figure 3.2.4 · p. 40',
    centre: fig4,
    focus: ['f4-0-0', 'f4-0-4', 'f4-0-6', 'f4-0-7'],
    callouts: [{ from: '#f4-0-7', to: a('gauge'), label: '2.54% in 2022' }],
    aside: (
      <Note>
        <R t="The IEG executive summary reports {loss-2022-ieg-summary|2}% for 2022, whereas its Table 2.3 reports {loss-2022}. The chart uses Table 2.3." />
      </Note>
    ),
  }),
  {
    title: 'Not a Simple Success Story',
    kicker: 'Section 3.2.4',
    source: 'Section 3.2.4 · p. 41',
    body: `However, some operational indicators covered the national transmission system. Therefore, these improvements cannot be attributed entirely to TEP [41, pp. 11-13].`,
  },
  // renewables and economic returns: detail beats
  ...detail({
    title: 'Renewables: handle with care',
    kicker: 'Section 3.2.4',
    source: 'Section 3.2.4 · p. 41',
    body: `TEP's greater transfer capacity and digital substation controls improved the technical conditions for intermittent generation. IEG cites the **Quang Ngai-Quy Nhon 220-kV line**'s contribution to better use of power from the **Thuong Kon Tum** hydropower plant.

But the evaluation does not quantify extra solar or wind MWh due solely to TEP, and documents continued curtailment and congestion. The defensible conclusion: **TEP supported the network's capability to integrate renewables**, not that it eliminated curtailment or achieved a verified increase in renewable generation [41, pp. 8-13].`,
  },
  {
    title: 'Economic returns',
    kicker: 'Section 3.2.4',
    source: 'Section 3.2.4 · p. 41',
    side: (
      <div className="card k-stats">
        <Stat id="st-eirr" value={<F id="eirr-icr" />} label="EIRR re-estimated in the 2022 ICR" tone="good" />
        <Stat value={<F id="eirr-pad" />} label="EIRR at appraisal" />
        <Stat value={<F id="enpv" />} label="ENPV (around) at the 10% discount rate" />
      </div>
    ),
    callouts: [{ from: '#st-eirr', to: a('transformer') }],
    body: `The 2022 completion report re-estimated an aggregate economic internal rate of return (**EIRR**) of {eirr-icr}, against {eirr-pad} at appraisal, with an economic net present value of around {enpv} at the assumed {discount-rate} discount rate.

These are results of a cost-benefit model, **not an observed cash return** to the IBRD or a guaranteed financial return for NPT. The higher EIRR partly reflects substantially lower capital cost; results are sensitive to assumptions, including the value of avoided supply interruptions [46, Annex 4].`,
  }),
]);
export const beats = p.beats;
export default p.View;
