import { scene, R, FocusItem, keepBeats } from './kit';
import { DataTable } from '../primitives/DataTable';
import { TABLE7 } from '../data/tables';

const a = (n: string) => `anchor:f2-three-forms:${n}`;
const table = (
  <DataTable
    id="t7"
    width={1440}
    columns={[
      { key: 'stage', label: 'Stage', width: 230 },
      { key: 'fin', label: 'Financial support' },
      { key: 'tech', label: 'Technical support' },
      { key: 'train', label: 'Training and capacity building' },
    ]}
    rows={TABLE7.map((r) => ({ id: r.id, cells: { stage: <b>{r.stage}</b>, fin: r.fin, tech: r.tech, train: r.train } }))}
    caption={<R t="Table 2.4.1. The three forms of IBRD support across the project cycle. Source: Authors' compilation of Sections 2.1-2.3." />}
  />
);
const row = (i: number) => ({
  layout: 'centre' as const,
  kicker: 'Section 2.4',
  title: 'Table 2.4.1 · Three forms of support',
  label: TABLE7[i].stage,
  source: 'Section 2.4 · Table 2.4.1 · p. 28',
  centre: table,
  camera: `f2-three-forms-${TABLE7[i].id}`,
  focus: [`t7-${TABLE7[i].id}`],
  callouts: [{ from: `#t7-${TABLE7[i].id}-stage`, to: a(TABLE7[i].id), label: TABLE7[i].stage }],
});
const WAYS = [
  ['Money gives weight to advice', "a borrower is more likely to adopt the Bank's procurement and safeguard standards when they are conditions of a loan."],
  ['Advice protects the money', 'appraisal and supervision reduce the risk that funds are wasted on a poorly designed project.'],
  ['Training protects the results', 'assets built with IBRD funds keep working only if local institutions can operate and maintain them.'],
];
const ways = (
  <div className="card">
    <ol className="focus-list ways">
      {WAYS.map(([h, t], i) => (
        <FocusItem key={i} id={`way-${i + 1}`}>
          <b>{['First', 'Second', 'Third'][i]}, {h.toLowerCase()}:</b> {t}
        </FocusItem>
      ))}
    </ol>
  </div>
);
const way = (i: number) => ({
  kicker: 'Section 2.4',
  title: 'How the forms reinforce one another',
  label: WAYS[i][0],
  source: 'Section 2.4 · p. 28',
  side: ways,
  focus: [`way-${i + 1}`],
  body: `**${['First', 'Second', 'Third'][i]}, ${WAYS[i][0].toLowerCase()}**: ${WAYS[i][1]}`,
});
// patch 8c: main-flow beats 1 and 5 (the merged "how the forms reinforce one another")
const p = scene('f2-three-forms', keepBeats([1, 5], [
  {
    layout: 'centre',
    title: 'Table 2.4.1 · Three forms of support',
    label: 'One package',
    source: 'Section 2.4 · p. 28',
    centre: table,
    callouts: [{ from: '.k-head', to: a('prep'), label: 'Preparation' }],
    camera: 'f2-three-forms-prep',
    body: `The three forms of support are **one package**: finance pays for the investment, technical support makes it sound, and training makes it last.`,
  },
  row(0),
  row(1),
  row(2),
  // patch 8c: the three ways on one beat (no step-by-step reveal); the former single-way beats 6-7 are detail beats
  {
    kicker: 'Section 2.4',
    title: 'How the forms reinforce one another',
    label: 'How the forms reinforce one another',
    source: 'Section 2.4 · p. 28',
    body: WAYS.map(([h, t], i) => `- **${['First', 'Second', 'Third'][i]}, ${h.toLowerCase()}**: ${t}`).join('\n'),
  },
  way(1),
  way(2),
]));
export const beats = p.beats;
export default p.View;
