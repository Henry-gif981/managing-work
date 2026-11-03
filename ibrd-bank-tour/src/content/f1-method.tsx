import { scene } from './kit';
import { Chip } from '../primitives/bits';

const to = 'anchor:f1-method:board';
const p = scene('f1-method', [
  {
    title: 'A qualitative approach',
    source: 'Introduction 4 · p. 7',
    layout: 'right',
    callouts: [{ from: '.k-card .h2', to, label: 'Sources' }],
    body: `The study combines a **literature review** with **case study analysis**, relying mainly on secondary data from official and publicly available sources.

The literature review builds the theoretical and institutional background. Its main sources are World Bank websites and reports: the IBRD's descriptions of its financial products, Country Partnership Frameworks for Vietnam, project appraisal documents and implementation completion reports.`,
  },
  {
    title: 'Vietnamese sources',
    source: 'Introduction 4 · p. 7',
    layout: 'right',
    body: `These are supported by documents from the Government of Vietnam, the Ministry of Finance and the Ministry of Planning and Investment, which merged into the Ministry of Finance in {mpi-merger}. They include legal regulations on ODA and concessional loans and reports on the use of foreign loans.

Together, these sources help explain how the IBRD works and how Vietnam manages IBRD loans.`,
  },
  {
    title: 'Case studies and four criteria',
    source: 'Introduction 4 · p. 7',
    layout: 'right',
    body: `The case study analysis covers TEP and CCSEP. For each project, the study compares planned targets with actual results, using the four criteria set out in Section 3.2:`,
    aside: (
      <div className="chips" id="criteria">
        <Chip tone="navy">Relevance</Chip>
        <Chip tone="navy">Effectiveness</Chip>
        <Chip tone="navy">Efficiency</Chip>
        <Chip tone="navy">Sustainability</Chip>
      </div>
    ),
  },
  {
    title: 'Cross-checking the evidence',
    source: 'Introduction 4 · pp. 7-8',
    layout: 'right',
    body: `To reduce bias, data from the World Bank's own reports are checked against the Independent Evaluation Group's assessment and against Vietnamese government sources.

For CCSEP, the World Bank's completion report (ICR, {ccsep-icr-date}) and the Independent Evaluation Group's review ({ccsep-ieg-date}) are checked against the Restructuring Paper and the Inspection Panel case records [57; 60; 63; 64].`,
  },
  {
    title: 'Limitations',
    source: 'Introduction 4 · p. 8',
    layout: 'right',
    callouts: [{ from: '.k-card .h2', to }],
    body: `Because the study relies on secondary data, it cannot verify results through field surveys or interviews. In addition, some information depends on reports prepared by the World Bank itself.

These limits are reduced by using several independent sources and by clearly stating where each piece of data comes from.`,
  },
]);
export const beats = p.beats;
export default p.View;
