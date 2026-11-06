import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { ESS } from '../data/tables';

const a = (n: string) => `anchor:f1-safeguards:${n}`;
const table = (
  <DataTable
    id="t143"
    width={1300}
    columns={[
      { key: 'std', label: 'Standard', width: 170 },
      { key: 'title', label: 'Title' },
    ]}
    rows={ESS.map((t, i) => ({ id: `ess${i + 1}`, cells: { std: <b>ESS{i + 1}</b>, title: t } }))}
    caption={<R t="Table 1.4.3. The ten Environmental and Social Standards of the ESF. Source: Authors' compilation from [24]." />}
  />
);
const p = scene('f1-safeguards', [
  {
    kicker: 'Section 1.4.3',
    title: 'Rules that come with the money',
    source: 'Section 1.4.3 · p. 20',
    callouts: [{ from: '.k-card', to: a('stamps'), label: 'Safeguards' }],
    body: `IBRD money comes with **environmental, social and procurement rules**, mainly for IPF. The **Environmental and Social Framework (ESF)**, approved on {esf-approved}, applies to IPF projects started on or after {esf-applies} [24].`,
  },
  {
    kicker: 'Section 1.4.3',
    title: 'Old and new systems',
    source: 'Section 1.4.3 · p. 20',
    body: `Earlier projects stay under the older **Safeguard Policies**, such as **Operational Policy (OP) 4.12** on involuntary resettlement. The two systems run in parallel for about {esf-parallel} [25].`,
  },
  {
    layout: 'centre',
    kicker: 'Section 1.4.3',
    title: 'Table 1.4.3 · Ten Environmental and Social Standards',
    label: 'Ten ESSs',
    source: 'Section 1.4.3 · Table 1.4.3 · p. 20',
    centre: table,
    callouts: [{ from: '.k-head', to: a('stamps'), label: 'Ten stamps' }],
    body: `The ESF shifts responsibility to the borrower, who must meet **ten Environmental and Social Standards (ESSs)** throughout the project [24].`,
  },
  {
    layout: 'centre',
    kicker: 'Section 1.4.3',
    title: 'Table 1.4.3 · Ten Environmental and Social Standards',
    label: 'ESS5',
    source: 'Section 1.4.3 · Table 1.4.3 · p. 20',
    centre: table,
    focus: ['t143-ess5'],
    callouts: [{ from: '#t143-ess5', to: a('ess5'), label: 'ESS5' }],
    body: `**ESS5** covers land acquisition, restrictions on land use and involuntary resettlement: often the hardest standard to meet.`,
  },
  {
    kicker: 'Section 1.4.3',
    title: 'Procurement Framework',
    source: 'Section 1.4.3 · p. 21',
    callouts: [{ from: '.k-card', to: a('papers'), label: 'Procurement' }],
    body: `The **Procurement Framework** applies to projects with a concept note on or after {proc-framework} [26]. It allows tailored approaches, and each new project prepares a **Project Procurement Strategy for Development (PPSD)**.`,
  },
  {
    kicker: 'Section 1.4.3',
    title: 'Stricter than domestic rules',
    source: 'Section 1.4.3 · p. 21',
    callouts: [{ from: '.k-card', to: a('ess5'), label: 'Land and resettlement' }],
    body: `These requirements are often **stricter than domestic rules**, especially on **land compensation and resettlement**. Where the two systems differ, projects can face delays or the cancellation of some contracts [57; 60].`,
  },
]);
export const beats = p.beats;
export default p.View;
