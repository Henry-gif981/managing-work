import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { Stat } from '../primitives/bits';
import { F } from '../primitives/Fact';
import { TABLE17 } from '../data/tables';

const a = (n: string) => `anchor:f3-ccsep-overview:${n}`;
const table = (
  <DataTable
    id="t17"
    width={1200}
    columns={[
      { key: 'm', label: 'Milestone' },
      { key: 'plan', label: 'Planned', align: 'right', width: 280 },
      { key: 'act', label: 'Actual', align: 'right', width: 280 },
    ]}
    rows={TABLE17.map((r) => ({ id: r.id, cells: { m: <b>{r.m}</b>, plan: r.plan, act: r.act } }))}
    caption={<R t="Table 3.3.1. Planned and actual project implementation timeline. Source: [36]; [57]; [63, Key Dates]. The ICR gives no separate implementation end date, so the actual date shown is the loan closing date." />}
  />
);
const row = (id: string, label: string, body: string) => ({
  layout: 'centre' as const,
  band: 'right' as const,
  title: 'Table 3.3.1 · Planned vs actual timeline',
  label,
  source: 'Section 3.3.1 · Table 3.3.1 · p. 44',
  centre: table,
  focus: [`t17-${id}`],
  callouts: [{ from: `#t17-${id}-act`, to: a('map'), label }],
  body,
});
const p = scene('f3-ccsep-overview', [
  {
    title: 'Coastal cities under strain',
    kicker: 'Section 3.3.1 · Case study 2 · urban and environment',
    layout: 'right',
    source: 'Section 3.3.1 · p. 44',
    side: (
      <div className="card k-stats">
        <Stat id="st-ww" value={<F id="urban-ww-treated" />} label="of urban wastewater treated (only about)" tone="bad" />
        <Stat value={<F id="sector-need" />} label="investment need per year (around)" />
        <Stat value={<F id="sector-covered" />} label="covered by expected funding (about)" tone="warn" />
      </div>
    ),
    body: `In the 2010s, rapid urbanization and limited resources in a lower-middle-income economy strained infrastructure and sanitation. **Only about {urban-ww-treated} of urban wastewater was treated**, and combined drainage often overflowed in the rainy season, discharging untreated wastewater onto streets and beaches of coastal cities.

The sector needed around {sector-need} per year, while expected funding covered only about {sector-covered} [36]. The project needed long-term World Bank capital, combining an IBRD loan with IDA concessional credits.`,
  },
  {
    title: 'CCSEP in four cities',
    kicker: 'Section 3.3.1',
    layout: 'left',
    source: 'Section 3.3.1 · p. 44',
    callouts: [
      { from: '.k-card .h2', to: a('dong-hoi'), label: 'Dong Hoi' },
      { from: '.k-card .h2', to: a('quy-nhon'), label: 'Quy Nhon' },
      { from: '.k-card .h2', to: a('nha-trang'), label: 'Nha Trang' },
      { from: '.k-card .h2', to: a('phan-rang'), label: 'Phan Rang-Thap Cham' },
    ],
    camera: 'f3-ccsep-cities',
    body: `The **Vietnam Coastal Cities Sustainable Environment Project (CCSEP, {ccsep-id})** was appraised in {ccsep-appraised} under Investment Project Financing.

It continued the earlier Coastal Cities Environmental Sanitation Project (CCESP, {ccesp-period}) in **Dong Hoi, Quy Nhon and Nha Trang**, and expanded to **Phan Rang-Thap Cham**.`,
  },
  {
    title: 'Dates, cost and actors',
    kicker: 'Section 3.3.1',
    layout: 'right',
    source: 'Section 3.3.1 · p. 44',
    body: `Approved on {ccsep-approved}; the financing agreement was signed on {ccsep-signed} and became effective on {ccsep-effective}. The appraisal schedule ran from {ccsep-approved} to {ccsep-end-plan}, with loan closing on {ccsep-closing-plan}; the deadline was extended and the loan closed on **{ccsep-closing-date}**. Total cost at appraisal: **{ccsep-total}**.

The Government of Vietnam was the borrower and the World Bank the financier; implementation was decentralized to **Quang Binh, Binh Dinh, Khanh Hoa and Ninh Thuan** through PMUs under the provincial People's Committees [36; 57].`,
  },
  row('approval', 'Approval', `Approval and signing went to plan: {ccsep-approved} and {ccsep-signed}.`),
  row('effective', 'Effectiveness', `Effectiveness: planned **3/8/2017**, actual **18/1/2018**; implementation therefore started on 18/1/2018 instead of 5/5/2017.`),
  row('end', 'Implementation end', `Implementation end: planned 30/6/2022, actual 30/6/2024 (the ICR gives no separate end date, so the loan closing date is shown).`),
  row('closing', 'Loan closing', `Loan closing: planned **31/12/2022**, actual **30/6/2024**.`),
  {
    title: 'Objective and three indicators',
    kicker: 'Section 3.3.1',
    layout: 'right',
    source: 'Section 3.3.1 · p. 45',
    callouts: [{ from: '#st-ben', to: a('houses'), label: 'Beneficiaries' }],
    aside: (
      <div className="k-stats">
        <Stat id="st-ben" value={<F id="ccsep-beneficiaries" />} label="direct beneficiaries (approximately)" />
        <Stat value={<F id="ccsep-sewer" />} label="people with household sewer connections" />
        <Stat value={<F id="ccsep-cost-recovery" />} label="service cost recovery" />
      </div>
    ),
    body: `The objective was **to increase access to sanitation services and improve the operational efficiency of service providers** in the four cities, through flood control, wastewater collection and treatment, solid waste management and urban connectivity, plus institutional reforms under Decree No. {decree-80} [58]: performance-based service contracts and cost-reflective tariff roadmaps. Three main indicators [36]:`,
  },
]);
export const beats = p.beats;
export default p.View;
