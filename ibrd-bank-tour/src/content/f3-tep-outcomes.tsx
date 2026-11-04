import { scene, R } from './kit';
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
    caption={<R t="Table 15. Selected system-level service and efficiency indicators around TEP completion. Source: Authors’ compilation from [41, pp. 9–11, Tables 2.2–2.3; underlying EVN data]." />}
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
    caption={<R t="Figure 4. Vietnam’s electricity transmission loss ratio, 2015-2022 (%; axis from 2.0%, as in the paper). Source: [41, Table 2.3, p. 11], citing EVN data. 2016, 2017, 2018 and 2020 values are the data labels of the paper's figure. The system-wide ratio is not a TEP-only impact estimate." />}
  />
);
const row = (i: number) => ({
  layout: 'centre' as const,
  title: 'Table 15 · System-level indicators',
  label: TABLE15[i].ind,
  source: 'Section 3.2.4 · Table 15 · p. 43',
  centre: table,
  focus: [`t15-${TABLE15[i].id}`],
  callouts: [{ from: `#t15-${TABLE15[i].id}-ind`, to: a(TABLE15[i].anchor), label: TABLE15[i].ind.split(' per ')[0].split(' caused')[0] }],
});
const p = scene('f3-tep-outcomes', [
  {
    title: 'Operating efficiency at closure',
    kicker: 'Section 3.2.4 · outcomes',
    source: 'Section 3.2.4 · p. 42',
    body: `Average **O&M expenditure per MWh** transmitted fell from {om-baseline} at baseline to {om-2021} in 2021, against a target of {om-target}, and stayed at that level in 2022. **Unserved energy** from transmission-system failures declined from {unserved-2012} at the end of 2012 to {unserved-2021} at closure. Average interruption duration and frequency decreased between 2018 and 2021.

These are consistent with better asset operation and reliability, but IEG warns that several measures relate to the **entire grid** and cannot be isolated to project sub-areas [41, pp. 9-11].`,
  },
  row(0),
  row(1),
  row(2),
  row(3),
  row(4),
  {
    layout: 'centre',
    title: 'Figure 4 · Transmission loss ratio',
    label: 'Loss ratio 2015-2022',
    source: 'Section 3.2.4 · Figure 4 · p. 43',
    centre: fig4,
    focus: ['f4-0-0', 'f4-0-4', 'f4-0-6', 'f4-0-7'],
    callouts: [{ from: '#f4-0-7', to: a('gauge'), label: '2.54% in 2022' }],
    aside: (
      <Note>
        <R t="The IEG executive summary reports {loss-2022-ieg-summary|2}% for 2022, whereas its Table 2.3 reports {loss-2022}. The chart uses Table 2.3." />
      </Note>
    ),
  },
  {
    title: 'Not a simple success story',
    kicker: 'Section 3.2.4',
    source: 'Section 3.2.4 · p. 44',
    body: `Transmission losses fell to {loss-2019} in 2019 but rose to {loss-2021} in 2021 and {loss-2022} in 2022. IEG linked the increase to changing grid flows as **wind and solar generation expanded**, congestion in the central and southern regions, and insufficient new transmission investment.

500-kV line faults fell from {faults500-2018|n} in 2018 to {faults500-2022|n} in 2022, while 220-kV faults rose from {faults220-2018|n} to {faults220-2022|n}: reliability improvements were not uniform [41, pp. 11-13].`,
  },
  {
    title: 'Renewables: handle with care',
    kicker: 'Section 3.2.4',
    source: 'Section 3.2.4 · p. 44',
    body: `TEP's greater transfer capacity and digital substation controls improved the technical conditions for intermittent generation. IEG cites the **Quang Ngai-Quy Nhon 220-kV line**'s contribution to better use of power from the **Thuong Kon Tum** hydropower plant.

But the evaluation does not quantify extra solar or wind MWh due solely to TEP, and documents continued curtailment and congestion. The defensible conclusion: **TEP supported the network's capability to integrate renewables**, not that it eliminated curtailment or achieved a verified increase in renewable generation [41, pp. 8-13].`,
  },
  {
    title: 'Economic returns',
    kicker: 'Section 3.2.4',
    source: 'Section 3.2.4 · p. 44',
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
  },
]);
export const beats = p.beats;
export default p.View;
