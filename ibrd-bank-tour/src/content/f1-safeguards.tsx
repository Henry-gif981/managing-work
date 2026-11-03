import { scene, FocusItem } from './kit';
import { ESS } from '../data/tables';

const a = (n: string) => `anchor:f1-safeguards:${n}`;
const list = (
  <div className="card ess-card">
    <ol className="focus-list ess-list" id="ess">
      {ESS.map((t, i) => (
        <FocusItem key={i} id={`ess-${i + 1}`}>
          <b>ESS{i + 1}</b>
          {t}
        </FocusItem>
      ))}
    </ol>
  </div>
);

const p = scene('f1-safeguards', [
  {
    title: 'Rules that come with the money',
    source: 'Section 1.4.3 · p. 19',
    callouts: [{ from: '.k-card .h2', to: a('stamps'), label: 'Safeguards' }],
    body: `IBRD financing comes with rules on environmental and social risks and on procurement. These rules apply mainly to **IPF**; DPF and PforR operations follow their own assessment procedures.

The **Environmental and Social Framework (ESF)** was approved by the Board on {esf-approved}. It applies to all IPF projects initiated on or after {esf-applies} [24].`,
  },
  {
    title: 'Old and new systems in parallel',
    source: 'Section 1.4.3 · p. 19',
    body: `Earlier projects continue under the older **Safeguard Policies**, such as OP 4.12 on involuntary resettlement. The two systems are expected to run in parallel for about {esf-parallel} [25].

This is why **TEP and CCSEP**, both prepared before {esf-cutoff}, followed the Safeguard Policies.`,
  },
  {
    layout: 'centre',
    title: 'The ten Environmental and Social Standards',
    label: 'Ten ESSs',
    source: 'Section 1.4.3 · p. 19',
    centre: list,
    callouts: [{ from: '#ess-1', to: a('stamps') }],
    body: `The ESF shifts more responsibility to the borrower. It sets out {ess-count|n} Environmental and Social Standards (ESSs) that borrowers must meet throughout the project [24].`,
  },
  {
    layout: 'centre',
    title: 'The ten Environmental and Social Standards',
    label: 'ESS5',
    source: 'Section 1.4.3 · pp. 19-20',
    centre: list,
    focus: ['ess-5'],
    callouts: [{ from: '#ess-5', to: a('ess5'), label: 'ESS5' }],
    body: `**ESS5: Land Acquisition, Restrictions on Land Use and Involuntary Resettlement.** Requirements are often stricter than domestic rules, especially on land compensation and resettlement (see below and Section 3.3.4).`,
  },
  {
    title: 'Procurement Framework',
    source: 'Section 1.4.3 · pp. 19-20',
    callouts: [{ from: '.k-card .h2', to: a('papers'), label: 'Procurement' }],
    body: `Procurement follows a separate framework. The **Procurement Framework** applies to projects with a concept note on or after {proc-framework} [26]. It replaced the earlier Procurement Guidelines and allows procurement approaches tailored to each project.

Each new project prepares a **Project Procurement Strategy for Development (PPSD)**, as CCSEP did. TEP, approved in {tep-approved}, still followed the earlier guidelines.`,
  },
  {
    title: 'Stricter than domestic rules',
    source: 'Section 1.4.3 · p. 20',
    callouts: [{ from: '.k-card .h2', to: a('ess5'), label: 'Land and resettlement' }],
    body: `These requirements are often stricter than domestic rules, especially on **land compensation and resettlement**.

Where the two systems differ, projects face delays or, as in **Nha Trang**, the loss of financing (see Section 3.3.4).`,
  },
]);
export const beats = p.beats;
export default p.View;
