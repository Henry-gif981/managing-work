import { scene, R, detail } from './kit';
import { DataTable } from '../primitives/DataTable';
import { TABLE4 } from '../data/tables';

const a = (n: string) => `anchor:f2-cycle:${n}`;
const table = (
  <DataTable
    id="t4"
    width={1440}
    columns={[
      { key: 'stage', label: 'Stage', width: 250 },
      { key: 'act', label: 'Main activities' },
      { key: 'lead', label: 'Lead role', width: 230 },
      { key: 'doc', label: 'Key document', width: 340 },
    ]}
    rows={TABLE4.map((r) => ({ id: r.id, cells: { stage: <b>{r.stage}</b>, act: r.act, lead: r.lead, doc: r.doc } }))}
    caption={<R t="Table 2.1.1. Stages of the World Bank project cycle. Source: Authors' compilation from [27]." />}
  />
);
const T = 'Table 2.1.1 · The project cycle';
const row = (i: number) => ({
  layout: 'centre' as const,
  kicker: 'Section 2.1.1',
  title: T,
  label: TABLE4[i].stage,
  source: 'Section 2.1.1 · Table 2.1.1 · p. 22',
  centre: table,
  camera: `f2-cycle-${TABLE4[i].id}`,
  focus: [`t4-${TABLE4[i].id}`],
  callouts: [{ from: `#t4-${TABLE4[i].id}`, to: a(`stage-${i + 1}`), label: `Stage ${i + 1}` }],
});

const p = scene('f2-cycle', [
  // patch 8: one beat in the main flow, the whole Table 2.1.1 (no row highlight)
  {
    layout: 'centre',
    title: 'Financial support',
    label: 'Financial support',
    kicker: 'Section 2.1 · 2.1.1',
    source: 'Section 2.1 · 2.1.1 · Table 2.1.1 · p. 22',
    centre: table,
    body: `The IBRD delivers financial support through **specific mechanisms**: project cycle, disbursement procedures, and financial instruments.

First, the IBRD provides financial support through a structured **6-stage project cycle**[27]. While the borrower owns and implements the project, the Bank advises, appraises, finances, and supervises.`,
  },
  ...detail(row(0), row(1), row(2), row(3), row(4), row(5), {
    title: 'Project cycle',
    kicker: 'Section 2.1.1',
    label: 'Restructuring and domestic steps',
    source: 'Section 2.1.1 · p. 23',
    camera: 'f2-cycle-restructure',
    callouts: [{ from: '.k-card', to: a('stage-5'), label: 'Stage 5' }],
    body: `The project cycle continues after approval. Projects can be restructured when scope, costs, or timing change.

In Vietnam, IBRD processes must run alongside domestic steps like project approvals and local funding. Friction between both systems often causes delays.`,
  }),
]);
export const beats = p.beats;
export default p.View;
