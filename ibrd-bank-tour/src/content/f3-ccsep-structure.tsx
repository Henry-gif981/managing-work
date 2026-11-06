import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { Chart } from '../primitives/Chart';
import { F } from '../primitives/Fact';
import { TABLE18, FIGURES } from '../data/tables';
import { factValue } from '../data/facts';

const a = (n: string) => `anchor:f3-ccsep-structure:${n}`;
const fig5 = (
  <Chart
    id="f5"
    kind="stacked"
    width={700}
    height={470}
    categories={['Total project cost at appraisal']}
    series={[
      { name: `IBRD (${factValue('ccsep-ibrd-pct')}%)`, values: [factValue('ccsep-ibrd')], color: 'var(--series-2)' },
      { name: `IDA (${factValue('ccsep-ida-pct')}%)`, values: [factValue('ccsep-ida')], color: 'var(--series-1)' },
      { name: `Counterpart (${factValue('ccsep-cp-pct')}%)`, values: [factValue('ccsep-cp')], color: 'var(--series-3)' },
    ]}
    max={300}
    format={(v) => `${v}`}
    caption={<R t="Figure 3.3.1. Project financing structure as planned at appraisal (million USD; total {ccsep-total}, World Bank {ccsep-wb}). Source: projects.worldbank.org (shown in the paper as a pie chart)." />}
  />
);
const fig6 = (
  <Chart
    id="f6"
    kind="stacked"
    width={1200}
    height={330}
    categories={FIGURES.fig6.categories.map((c) => c.replace('IDA credit – ', 'IDA ').replace('IBRD loan (all four cities)', 'IBRD (all cities)'))}
    series={[
      { name: 'On-granted (%)', values: FIGURES.fig6.ongrant.map((id) => (id ? factValue(id) : 0)), color: 'var(--series-1)' },
      { name: 'On-lent (%)', values: FIGURES.fig6.ongrant.map((id) => (id ? 100 - factValue(id) : 100)), color: 'var(--series-3)' },
    ]}
    max={100}
    format={(v) => `${v}`}
    caption={<R t="Figure 3.3.2. Share of on-granting and on-lending by financing source (%). Source: projects.worldbank.org; shares from [36, para. 45]." />}
  />
);
const cell = (id: string | null) => (id ? <F id={id} /> : '-');
const t18 = (
  <DataTable
    id="t18"
    width={1300}
    columns={[
      { key: 'comp', label: 'Component' },
      { key: 'total', label: 'Total', align: 'right', width: 150 },
      { key: 'ida', label: 'IDA', align: 'right', width: 150 },
      { key: 'ibrd', label: 'IBRD', align: 'right', width: 150 },
      { key: 'cp', label: 'Counterpart funding', align: 'right', width: 220 },
    ]}
    rows={TABLE18.map((r) => ({
      id: r.id,
      kind: r.id === 'total' ? 'total' : undefined,
      cells: { comp: <b>{r.comp}</b>, total: <F id={r.total} unit={false} />, ida: r.ida ? <F id={r.ida} unit={false} /> : '-', ibrd: r.ibrd ? <F id={r.ibrd} unit={false} /> : '-', cp: r.cp ? <F id={r.cp} unit={false} /> : '-' },
    }))}
    caption={<R t="Table 3.3.2. Project components and financing sources (base cost, million USD). Source: projects.worldbank.org." />}
  />
);
void cell;
const comp = (i: number) => ({
  layout: 'centre' as const,
  band: 'right' as const,
  title: 'Table 3.3.2 · Components and sources',
  label: TABLE18[i].comp,
  source: 'Section 3.3.2 · Table 3.3.2 · p. 47',
  centre: t18,
  focus: [`t18-${TABLE18[i].id}`],
  callouts: [{ from: `#t18-${TABLE18[i].id}-cp`, to: a(TABLE18[i].anchor), label: TABLE18[i].comp.replace(/^\d\.\s/, '') }],
});
const part = (k: number, prop: string, label: string, body: string) => ({
  layout: 'centre' as const,
  band: 'right' as const,
  title: 'Figure 3.3.1 · Financing structure',
  label,
  source: 'Section 3.3.2 · Figure 3.3.1 · p. 45',
  centre: fig5,
  focus: [`f5-s${k}`],
  callouts: [{ from: `#f5-${k}-0`, to: a(prop), label }],
  body,
});
const p = scene('f3-ccsep-structure', [
  {
    title: 'A blended financing package',
    kicker: 'Section 3.3.2',
    layout: 'right',
    source: 'Section 3.3.2 · p. 45',
    body: `CCSEP was an **Investment Project Financing** operation, financing specific investment items rather than policy reforms or results [36, Data Sheet]. Total cost at appraisal was {ccsep-total}: World Bank financing {ccsep-wb} ({ccsep-wb-pct}) and Vietnamese counterpart funding {ccsep-cp} ({ccsep-cp-pct}) [36, Data Sheet, para. 43].

The World Bank portion blended an **IBRD loan of {ccsep-ibrd} ({ccsep-ibrd-pct})** with an **IDA credit of {ccsep-ida} ({ccsep-ida-pct})** [36, para. 66], reflecting Vietnam's status as a lower-middle-income country on blend terms shortly before IDA graduation [36, paras. 1, 44].`,
  },
  part(0, 'bridge', 'IBRD', `**IBRD:** {ccsep-ibrd} ({ccsep-ibrd-pct} of total cost).`),
  part(1, 'pipes', 'IDA', `**IDA:** {ccsep-ida} ({ccsep-ida-pct}).`),
  part(2, 'houses', 'Counterpart', `**Counterpart funding:** {ccsep-cp} ({ccsep-cp-pct}). Total {ccsep-total}; World Bank {ccsep-wb}.`),
  {
    title: 'Two sets of terms',
    kicker: 'Section 3.3.2',
    layout: 'right',
    source: 'Section 3.3.2 · p. 45',
    body: `The terms differed significantly [36, para. 44]:

- **IBRD loan:** denominated in USD, floating interest rate then based on LIBOR, **{ccsep-ibrd-maturity} maturity including a {ccsep-ibrd-grace} grace period**, equal principal repayments.
- **IDA credit:** denominated in **SDR**, **{ccsep-ida-maturity} maturity including a {ccsep-ida-grace} grace period**, interest rate of {ccsep-ida-rate} per annum ({ccsep-ida-service} service charge and {ccsep-ida-interest} interest), commitment fee of {ccsep-ida-commit} per annum, and no front-end fee.`,
  },
  {
    layout: 'centre',
    band: 'right',
    title: 'Figure 3.3.2 · On-granting and on-lending',
    label: 'On-lending policy',
    source: 'Section 3.3.2 · Figure 3.3.2 · p. 46',
    centre: fig6,
    focus: ['f6-c0'],
    callouts: [{ from: '#f6-1-0', to: a('nha-trang'), label: 'Provinces' }],
    body: `Under the Government's ODA on-lending policy, **the entire IBRD loan was on-lent** to the four provinces, while the IDA credit was split depending on each province's economic conditions: **{ongrant-dh} on-granted to Dong Hoi and Phan Rang, {ongrant-qn} to Quy Nhon, and {ongrant-nt} to Nha Trang** [36, para. 45].`,
  },
  {
    title: 'Real debt for the provinces',
    kicker: 'Section 3.3.2',
    layout: 'right',
    source: 'Section 3.3.2 · p. 46',
    body: `As a result, about **{ongrant-total-pct}** of total project cost was on-granted to local authorities, **{onlend-total-pct}** was on-lent and {ccsep-cp-pct} was counterpart funding [36, Annex 5, Table 5.1].

The on-lent funds, namely the entire IBRD loan and about {onlend-ida-pct} of the IDA credit (about **{onlend-total}** in total), were genuine debt-service obligations. The PAD warned that the project would significantly increase the debt burden of all four provinces, with **Binh Dinh** projected to slightly exceed its debt ceiling during {binh-dinh-period} [36, paras. 66, 75-76, Annex 5].`,
  },
  {
    title: 'Components 1 and 2',
    kicker: 'Section 3.3.2',
    layout: 'right',
    source: 'Section 3.3.2 · p. 46',
    body: `- **Component 1, Sanitation Infrastructure Expansion ({c1-base} base cost):** flood control works, drainage and wastewater collection networks, wastewater treatment plants, school and public sanitation facilities, revolving funds for household connections, and solid waste management [36, para. 31].
- **Component 2, Urban Connectivity Improvement ({c2-base}):** over {c2-roads} of strategic roads and {c2-bridges|n} bridges along canals, drains and rivers, creating or upgrading arterial and link roads to relieve congestion and improve connectivity [36, paras. 20, 33].`,
  },
  {
    title: 'Components 3 and 4, and who pays',
    kicker: 'Section 3.3.2',
    layout: 'right',
    source: 'Section 3.3.2 · pp. 46-47',
    body: `- **Component 3, Compensation and Site Clearance ({c3-base}):** compensation, land acquisition and resettlement [36, para. 34].
- **Component 4, Implementation Support and Institutional Reform ({c4-base}):** PMU capacity building and Decree No. {decree-80} on service contracts, tariff roadmaps and connection policies [36, para. 35].

Each source was linked to components: **IBRD fully financed Component 2**; **IDA** financed Component 1 and the resettlement-site infrastructure in Phan Rang under Component 3; **counterpart funds** covered compensation, site clearance, resettlement and all of Component 4 [36, para. 34, Annex 2 Table 2.1, Annex 5 Table 5.2].`,
  },
  ...TABLE18.map((_, i) => comp(i)),
  {
    layout: 'centre',
    band: 'right',
    title: 'Table 3.3.2 · Base cost vs total cost',
    label: 'Why IBRD is 46.0, not 31.2',
    source: 'Section 3.3.2 · Table 3.3.2 note · p. 47',
    centre: t18,
    focus: ['t18-total-ibrd', 't18-c2-ibrd'],
    callouts: [{ from: '#t18-c2-ibrd', to: a('bridge'), label: 'Component 2' }],
    body: `The table shows base costs only. The difference from total project cost comes from contingencies ({contingencies}), VAT ({vat}) and capitalized fees and interest ({cap-fees}), also financed by the three sources. **This is why the IBRD total is {ccsep-ibrd|n}.0 million, against {c2-base} of base cost for Component 2** [36, Annex 2, Table 2.1]. Minor differences in totals are due to rounding in the PAD.`,
  },
]);
export const beats = p.beats;
export default p.View;
