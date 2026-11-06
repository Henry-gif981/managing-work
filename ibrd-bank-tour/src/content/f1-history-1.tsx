import { scene, R } from './kit';
import { Timeline } from '../primitives/bits';
import { F } from '../primitives/Fact';

const a = (n: string) => `anchor:f1-history-1:${n}`;
const S = 'Section 1.2 · p. 14';
export const STAGES = (
  <div className="card" style={{ width: 720 }}>
    <Timeline
      id="stages"
      items={[
        { id: 's1', date: <F id="stage1" />, label: <R t="Founding and post-war reconstruction" /> },
        { id: 's2', date: <F id="stage2" />, label: <R t="Shift to development and expansion" /> },
        { id: 's3', date: <F id="stage3" />, label: <R t="Crisis and reform" /> },
        { id: 's4', date: <F id="stage4" />, label: <R t="The 21st century" /> },
      ]}
    />
  </div>
);

const p = scene('f1-history-1', [
  {
    kicker: 'Section 1.2',
    title: 'Four stages',
    source: S,
    side: STAGES,
    callouts: [{ from: '.k-card', to: a('era1') }],
    body: `The IBRD's history falls into **four stages**, each reflecting changes in the world economy and in members' needs.`,
  },
  {
    kicker: 'Section 1.2 · Stage 1',
    title: 'Founding and reconstruction',
    source: S,
    focus: ['stages-s1'],
    side: STAGES,
    callouts: [{ from: '.k-card', to: a('era1'), label: '1944-1950s' }],
    body: `Created at **Bretton Woods in {bretton-woods}** with the IMF, the IBRD began work in {ibrd-ops}. Its first loan, **{first-loan}**, went to France in {first-loan-year}, the year of its first bonds [11].`,
  },
  {
    kicker: 'Section 1.2 · Stage 1',
    title: 'From Europe to developing countries',
    source: S,
    focus: ['stages-s1'],
    side: STAGES,
    callouts: [{ from: '.k-card', to: a('era1') }],
    body: `When the **Marshall Plan** ({marshall-plan}) took over most of Europe's reconstruction, the IBRD turned its attention to **developing countries** [10].`,
  },
  {
    kicker: 'Section 1.2 · Stage 2',
    title: 'Shift to development',
    source: S,
    focus: ['stages-s2'],
    side: STAGES,
    callouts: [{ from: '.k-card', to: a('era2'), label: '1950s-1970s' }],
    body: `The IBRD financed **power plants, roads, railways and irrigation**. IFC ({ifc-founded}) and IDA ({ida-founded}) took other roles, and under **Robert McNamara** lending shifted towards poverty, rural development, education and health [10].`,
  },
]);
export const beats = p.beats;
export default p.View;
