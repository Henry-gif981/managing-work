import { scene, R } from './kit';
import { Timeline } from '../primitives/bits';
import { F } from '../primitives/Fact';

const a = (n: string) => `anchor:f1-history-1:${n}`;
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
    title: 'Four stages',
    source: 'Section 1.2 · p. 12',
    side: STAGES,
    callouts: [{ from: '.k-card .h2', to: a('era1') }],
    body: `The history of the IBRD can be divided into {stages-count|n} main stages, each reflecting changes in the global economy and in the needs of member countries.`,
  },
  {
    title: 'Founding and post-war reconstruction',
    kicker: 'Section 1.2 · Stage 1',
    source: 'Section 1.2 · p. 12',
    focus: ['stages-s1'],
    side: STAGES,
    callouts: [{ from: '.k-card .h2', to: a('era1'), label: '1944-1950s' }],
    body: `**{stage1}.** The IBRD was created at the Bretton Woods Conference in {bretton-woods}, together with the International Monetary Fund, as part of the effort to rebuild the world economy after the Second World War. It began operations in {ibrd-ops}.

Its first loan, worth {first-loan}, went to France in {first-loan-year} to support reconstruction [11]. In the same year, the IBRD issued its first bonds on the US market, laying the foundation for its funding model.`,
  },
  {
    title: 'From Europe to developing countries',
    kicker: 'Section 1.2 · Stage 1',
    source: 'Section 1.2 · p. 12',
    focus: ['stages-s1'],
    side: STAGES,
    callouts: [{ from: '.k-card .h2', to: a('era1') }],
    body: `However, when the United States launched the Marshall Plan in {marshall-plan}, much of Europe's reconstruction was financed through that program.

This led the IBRD to turn its attention to developing countries [10].`,
  },
  {
    title: 'Shift to development and expansion',
    kicker: 'Section 1.2 · Stage 2',
    source: 'Section 1.2 · p. 12',
    focus: ['stages-s2'],
    side: STAGES,
    callouts: [{ from: '.k-card .h2', to: a('era2'), label: '1950s-1970s' }],
    body: `**{stage2}.** The IBRD mainly financed large infrastructure projects such as power plants, roads, railways and irrigation systems in Asia, Africa and Latin America. New institutions met different needs: IFC in {ifc-founded} to support the private sector, and IDA in {ida-founded} to serve the poorest countries, letting the IBRD focus on middle-income economies.

From the {mcnamara-from}, under President Robert McNamara, it placed greater emphasis on poverty reduction, rural development, education and health, and its lending grew rapidly [10].`,
  },
]);
export const beats = p.beats;
export default p.View;
void R;
