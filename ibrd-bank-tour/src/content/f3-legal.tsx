import { scene, R, FocusItem } from './kit';
import { TABLE9 } from '../data/tables';

const a = (n: string) => `anchor:f3-legal:${n}`;
const spine = (
  <div className="card legal-card">
    <ol className="legal-tl" id="t9">
      {TABLE9.map((r) => (
        <FocusItem key={r.id} id={`t9-${r.id}`}>
          <span className="lt-date">
            <R t={r.date} />
          </span>
          <span className="lt-inst">
            <b>{r.inst}</b> <R t={r.cite} />
          </span>
          <span className="lt-rel">
            <R t={r.rel} />
          </span>
        </FocusItem>
      ))}
    </ol>
    <div className="caption">
      <R t="Table 3.1.2. Selected milestones in Vietnam’s regulatory framework for ODA and concessional loans. Source: Authors’ compilation from [49; 50; 51; 52; 53; 54; 55]." />
    </div>
  </div>
);
const p = scene('f3-legal', [
  {
    title: 'Two overlapping systems',
    source: 'Section 3.1.4 · p. 32',
    callouts: [{ from: '.k-card .h2', to: a('timeline'), label: 'Legal timeline' }],
    body: `Vietnamese rules (approval, on-lending, counterpart funds) and World Bank rules (procurement, safeguards, supervision).`,
  },
  {
    title: 'Read the law as of its period',
    source: 'Section 3.1.4 · p. 33',
    body: `TEP (2014) fell under Decree 38/2013 [49], later replaced by Decrees 16/2016 [50] and 56/2020 [51].`,
  },
  {
    layout: 'centre',
    band: 'right',
    title: 'The current framework',
    label: 'The current framework',
    source: 'Section 3.1.4 · Table 3.1.2 · pp. 32-33',
    centre: spine,
    callouts: [{ from: '.k-head', to: a('timeline'), label: 'Legal timeline' }],
    body: `Today: Decree 242/2025, amended by Decree 119/2026. Context only, not a test of TEP's 2014 compliance [54; 55].`,
  },
]);
export const beats = p.beats;
export default p.View;
