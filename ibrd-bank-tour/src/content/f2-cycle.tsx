import { scene, R } from './kit';
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
      { key: 'lead', label: 'Lead role', width: 210 },
      { key: 'doc', label: 'Key document', width: 330 },
    ]}
    rows={TABLE4.map((r) => ({ id: r.id, cells: { stage: <b>{r.stage}</b>, act: r.act, lead: r.lead, doc: r.doc } }))}
    caption={<R t="Table 4. Stages of the World Bank project cycle. Source: Authors' compilation from [27]." />}
  />
);
const T = 'Table 4 · The project cycle';
const row = (i: number) => ({
  layout: 'centre' as const,
  title: T,
  label: TABLE4[i].stage,
  source: i < 3 ? 'Section 2.1.1 · Table 4 · p. 21' : 'Section 2.1.1 · Table 4 · pp. 21-22',
  centre: table,
  camera: `f2-cycle-${TABLE4[i].id}`,
  focus: [`t4-${TABLE4[i].id}`],
  callouts: [{ from: `#t4-${TABLE4[i].id}-stage`, to: a(`stage-${i + 1}`), label: `Stage ${i + 1}` }],
});

const p = scene('f2-cycle', [
  {
    title: 'A fixed sequence of steps',
    kicker: 'Section 2.1 · 2.1.1',
    source: 'Section 2.1 · 2.1.1 · p. 21',
    callouts: [{ from: '.k-card .h2', to: a('table'), label: 'Project cycle' }],
    body: `Financial support is the IBRD's core activity, but money reaches a project only through a fixed sequence of steps: the project cycle, the way funds are paid out, and how each instrument works in practice.

Every IBRD operation passes through a **{cycle-stages|n}-stage project cycle** [27]. The Bank and the borrower work closely at each stage, but their roles differ: **the borrower owns and implements** the project; **the Bank advises, appraises, finances and supervises**.`,
  },
  row(0),
  row(1),
  row(2),
  row(3),
  row(4),
  row(5),
  {
    title: 'The cycle does not end with approval',
    label: 'Restructuring',
    source: 'Section 2.1.1 · p. 22',
    camera: 'f2-cycle-restructure',
    callouts: [{ from: '.k-card .h2', to: a('stage-5'), label: 'Stage 5' }],
    body: `During implementation, a project can be restructured when its scope, costs or timing change. **TEP** was restructured in {tep-restructured} and extended by {tep-extension}. **CCSEP** was restructured in {ccsep-restructured}, when about {ccsep-cancelled} of loan funds were cancelled (see Sections 3.2.5 and 3.3.2).`,
  },
]);
export const beats = p.beats;
export default p.View;
