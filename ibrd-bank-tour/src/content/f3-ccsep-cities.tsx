import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { Chart } from '../primitives/Chart';
import { Note } from '../primitives/bits';
import { F } from '../primitives/Fact';
import { TABLE19, FIGURES } from '../data/tables';
import { factValue } from '../data/facts';

const a = (n: string) => `anchor:f3-ccsep-cities:${n}`;
const PIN: Record<string, string> = { dh: 'dong-hoi', nt: 'nha-trang', pr: 'phan-rang', qn: 'quy-nhon' };
const f7 = FIGURES.fig7;
const fig7 = (
  <Chart
    id="f7"
    kind="stacked"
    width={1160}
    height={430}
    categories={f7.map((c) => c.city)}
    series={[
      { name: 'IDA on-granted', values: f7.map((c) => factValue(c.grant)), color: 'var(--series-1)' },
      { name: 'IDA on-lent', values: f7.map((c) => factValue(c.lent)), color: 'var(--series-2)' },
      { name: 'IBRD (100% on-lent)', values: f7.map((c) => factValue(c.ibrd)), color: 'var(--series-3)' },
      { name: 'Counterpart funding', values: f7.map((c) => factValue(c.cp)), color: 'var(--series-4)' },
    ]}
    max={100}
    format={(v) => `${v}`}
    caption={<R t="Figure 3.3.3. Sources of funding by city (million USD). Source: projects.worldbank.org; segment values read from the data labels of the paper's figure (p. 52)." />}
  />
);
const city = (j: number, body: string) => ({
  layout: 'centre' as const,
  band: 'right' as const,
  title: 'Figure 3.3.3 · Sources of funding by city',
  label: f7[j].city,
  source: 'Section 3.3.2 · Figure 3.3.3 · p. 48',
  centre: fig7,
  focus: [`f7-c${j}`],
  callouts: [{ from: `#f7-3-${j}`, to: a(PIN[f7[j].id]), label: f7[j].city }],
  body,
});
const t19 = (
  <DataTable
    id="t19"
    width={1350}
    columns={[
      { key: 'src', label: 'Funding source' },
      { key: 'app', label: 'Appraisal (USD m)', align: 'right', width: 160 },
      { key: 'appS', label: 'Share', align: 'right', width: 130 },
      { key: 'adj', label: 'Adjusted (USD m)', align: 'right', width: 160 },
      { key: 'adjS', label: 'Share', align: 'right', width: 130 },
      { key: 'chg', label: 'Change (adjusted - appraisal)', align: 'right', width: 200 },
      { key: 'close', label: 'Actual at closing (USD m, ICR)', align: 'right', width: 200 },
    ]}
    rows={TABLE19.map((r) => ({
      id: r.id,
      kind: r.id === 'total' ? 'total' : undefined,
      cells: {
        src: <b>{r.src}</b>,
        app: <F id={r.app} unit={false} />,
        appS: r.appS ? <F id={r.appS} fixed={2} /> : '100.00',
        adj: <F id={r.adj} unit={false} />,
        adjS: r.adjS ? <F id={r.adjS} fixed={2} /> : '100.00',
        chg: <>{factValue(r.chg) > 0 ? '+' : ''}<F id={r.chg} unit={false} /></>,
        close: <F id={r.close} unit={false} />,
      },
    }))}
    caption={<R t="Table 3.3.3. Funding structure: plan vs. adjusted (million USD; shares in %). Source: [36, Annex 2]; [57]; actual amounts at closing from [63, Data Sheet, p. ii]. Change = adjusted minus appraisal." />}
  />
);
const row = (i: number, pin: string) => ({
  layout: 'centre' as const,
  band: 'right' as const,
  title: 'Table 3.3.3 · Plan vs adjusted',
  label: TABLE19[i].src,
  source: 'Section 3.3.2 · Table 3.3.3 · p. 49',
  centre: t19,
  focus: [`t19-${TABLE19[i].id}`],
  callouts: [{ from: `#t19-${TABLE19[i].id}-close`, to: a(pin), label: TABLE19[i].src }],
});
const f8 = FIGURES.fig8;
const fig8 = (
  <Chart
    id="f8"
    kind="grouped"
    width={1160}
    height={420}
    categories={f8.cities}
    series={[
      { name: 'Plan', values: f8.plan.map(factValue), color: 'var(--series-2)' },
      { name: 'Adjusted (stated in the text)', values: f8.adjusted.map((id) => (id ? factValue(id) : 0)), color: 'var(--series-4)' },
    ]}
    max={100}
    format={(v) => (v ? `${v}` : 'n/s')}
    caption={<R t="Figure 3.3.4. Total funding by city: plan vs. adjusted (million USD). Source: projects.worldbank.org. n/s = adjusted value not stated in the paper's text (see note)." />}
  />
);
const p = scene('f3-ccsep-cities', [
  {
    title: 'Funding by city',
    kicker: 'Section 3.3.2',
    layout: 'right',
    source: 'Section 3.3.2 · p. 47',
    callouts: [{ from: '.k-card .h2', to: a('phan-rang'), label: 'Phan Rang-Thap Cham' }],
    camera: 'f3-ccsep-cities',
    body: `Funds were allocated across the four cities at varying scales: **Phan Rang-Thap Cham {city-pr}**, Nha Trang {city-nt}, Dong Hoi {city-dh} and Quy Nhon {city-qn} [36, Annex 2, Tables 2.2-2.5]. Phan Rang was a new locality with its own dedicated resettlement site, and its PMU managed the largest program [36, paras. 34, 63].

Under the IBRD portion, **Nha Trang ({city-nt-ibrd})** and **Dong Hoi ({city-dh-ibrd})** received the largest allocations, for major roads and bridges under Component 2 [36, para. 46, Table 1].`,
  },
  city(0, `**Dong Hoi** ({city-dh}): IDA on-granted {f7-dh-grant}, IDA on-lent {f7-dh-lent}, IBRD {f7-dh-ibrd}, counterpart {f7-dh-cp}.`),
  city(1, `**Nha Trang** ({city-nt}): IDA on-granted {f7-nt-grant}, on-lent {f7-nt-lent}, IBRD {f7-nt-ibrd}, counterpart {f7-nt-cp}.`),
  city(2, `**Phan Rang-Thap Cham** ({city-pr}): IDA on-granted {f7-pr-grant}, on-lent {f7-pr-lent}, IBRD {f7-pr-ibrd}, counterpart {f7-pr-cp}.`),
  city(3, `**Quy Nhon** ({city-qn}): IDA on-granted {f7-qn-grant}, on-lent {f7-qn-lent}, IBRD {f7-qn-ibrd}, counterpart {f7-qn-cp}.`),
  {
    title: 'Decentralized disbursement',
    kicker: 'Section 3.3.2',
    layout: 'right',
    source: 'Section 3.3.2 · p. 48',
    body: `Each province opened a **designated USD account** at a commercial bank, with ceilings adjusted on {designated-forecast|n}-month financial forecasts [36, Annex 3, para. 21], and the project used four methods: advances, reimbursements, special commitments and direct payments [para. 22]. The Bank financed {wb-eligible-share} of eligible expenditures, including taxes; counterpart funds covered compensation, resettlement, staff salaries, operating costs, training and workshops [para. 24].

Withdrawals had {withdrawal-conditions|n} conditions: on-lending agreements approved by the Ministry of Finance and provinces, counterpart allocations approved by People's Committees, and wastewater tariff roadmaps approved by People's Committees [36, Data Sheet, para. 62].`,
  },
  {
    title: 'The 2022 restructuring',
    kicker: 'Section 3.3.2',
    layout: 'right',
    source: 'Section 3.3.2 · pp. 48-49',
    callouts: [{ from: '.k-card .h2', to: a('nha-trang'), label: 'NT-2.1 / NT-2.2' }],
    camera: 'f3-ccsep-cities',
    body: `During implementation the structure was adjusted to reduce loan capital and increase counterpart funding. At the borrower's request, the Bank cancelled **{cancel-ibrd} of IBRD** and approximately **{cancel-ida} of IDA ({cancel-ida-sdr})** funding: bidding savings, a change in the payment source for IBRD fees and interest, and SDR depreciation [57].

The cancellations took effect on {cancel-effective}; the restructuring was completed on {restructure-done} [57; 63, p. 6]. The scope was described as unchanged, but part of package **NT-2.1** and all of **NT-2.2** in Nha Trang were cancelled: largely, not entirely, unchanged [57, para. 4].`,
  },
  row(0, 'dong-hoi'),
  row(1, 'nha-trang'),
  row(2, 'phan-rang'),
  row(3, 'quy-nhon'),
  row(4, 'phan-rang'),
  {
    title: 'Adjusted commitments and actual spending',
    kicker: 'Section 3.3.2',
    layout: 'right',
    source: 'Section 3.3.2 · p. 49',
    body: `Unlike Table 3.3.2, Table 19 shows **total financing**, including contingencies, VAT and capitalized fees. Loan capital fell from {ccsep-wb} to {adj-wb} and total investment from {ccsep-total} to {adj-total}; counterpart funding rose from {ccsep-cp} to {adj-cp}, from {ccsep-cp-pct} to {cp-share-adj} [36, Annex 2; 57].`,
  },
  {
    title: 'By city, and at closing',
    kicker: 'Section 3.3.2',
    layout: 'right',
    source: 'Section 3.3.2 · p. 49',
    camera: 'f3-ccsep-cities',
    callouts: [{ from: '.k-card .h2', to: a('phan-rang'), label: 'Phan Rang-Thap Cham' }],
    body: `Adjustments varied among cities. **Quy Nhon** saw the sharpest decrease ({city-qn} → {city-qn-adj}); **Phan Rang-Thap Cham** was the only city to increase ({city-pr} → {city-pr-adj}), with counterpart funding rising from {f7-pr-cp} to {city-pr-cp-adj}. These are adjusted commitments, not disbursed amounts.

At closing: World Bank disbursements {close-wb} (IBRD {close-ibrd}; IDA {close-ida}), counterpart spending {close-cp}, total actual cost **{close-total}** [63, p. ii].`,
  },
  {
    layout: 'centre',
    band: 'right',
    title: 'Figure 3.3.4 · Plan vs adjusted by city',
    label: 'Figure 3.3.4',
    source: 'Section 3.3.2 · Figure 3.3.4 · p. 50',
    centre: fig8,
    focus: ['f8-c1', 'f8-c3'],
    callouts: [{ from: '#f8-1-3', to: a('phan-rang'), label: 'Phan Rang +10.0' }],
    aside: (
      <Note>
        <R t="The paper's text states adjusted totals only for Quy Nhon ({city-qn-adj}) and Phan Rang-Thap Cham ({city-pr-adj}). Figure 3.3.4 has no data labels for Dong Hoi and Nha Trang, so their adjusted bars are not reproduced (logged in docs/paper-inconsistencies.md)." />
      </Note>
    ),
  },
]);
export const beats = p.beats;
export default p.View;
