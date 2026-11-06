import { scene, R } from './kit';
import { Timeline } from '../primitives/bits';
import { F } from '../primitives/Fact';

const milestones = (
  <div className="card" style={{ width: 1440 }}>
    <Timeline
      id="vn-path"
      items={[
        { id: 'eligible', date: <F id="vn-ibrd-eligible" />, label: <R t="Vietnam declared IBRD-eligible [1; 2]" /> },
        { id: 'pir', date: <F id="pir1-approved" />, label: <R t="First IBRD loan: {pir1-ibrd} Public Investment Reform loan [1; 2]" /> },
        { id: 'grad', date: <F id="vn-ida-graduation" />, label: <R t="Graduation from IDA: no more regular IDA credits" /> },
        { id: 'ibrd', date: <F id="vn-ibrd-from" />, label: <R t="Only IBRD and non-concessional IDA terms; IDA18 transition ({ida18-period}) [3]" /> },
        { id: 'umic', date: <F id="vn-umic" />, label: <R t="Reclassified as an upper-middle-income economy [4]" /> },
      ]}
    />
  </div>
);

const ladder = (
  <div className="cost-ladder">
    <div className="cl-axis">
      <span>cheaper · longer-term</span>
      <span>more expensive · shorter</span>
    </div>
    <div className="cl-row">
      <div className="cl-step" style={{ background: 'var(--wb-cyan)', color: 'var(--wb-navy)' }}>
        <b>IDA credits</b>
        <span>very low interest, long repayment</span>
      </div>
      <div className="cl-step" style={{ background: 'var(--wb-blue)' }}>
        <b>IBRD loans</b>
        <span>dearer than IDA, cheaper and longer than most commercial loans</span>
      </div>
      <div className="cl-step" style={{ background: 'var(--wb-navy)' }}>
        <b>Commercial loans</b>
        <span>dearer and shorter-term than IBRD loans</span>
      </div>
    </div>
  </div>
);

const p = scene('f1-rationale-2', [
  {
    layout: 'centre',
    kicker: 'Introduction 1.2',
    title: 'From IDA to IBRD',
    source: 'Introduction 1.2 · p. 8',
    centre: milestones,
    body: `As its economy grew, Vietnam moved from cheap **International Development Association (IDA)** credits to **International Bank for Reconstruction and Development (IBRD)** loans [1; 2; 3; 4].`,
  },
  {
    layout: 'centre',
    kicker: 'Introduction 1.2',
    title: 'A middle path',
    source: 'Introduction 1.2 · p. 8',
    centre: ladder,
    body: `The IBRD is now Vietnam's **main source of World Bank financing**. Its loans cost more than IDA credits but remain **cheaper and longer-term** than most commercial loans: a middle path for large, long-term projects the market may not fund [5].`,
  },
  {
    kicker: 'Introduction 1.2',
    title: 'Choosing projects carefully',
    source: 'Introduction 1.2 · p. 8',
    callouts: [{ from: '.k-card .h2', to: 'anchor:f1-rationale-2:map', label: 'Vietnam' }],
    body: `Higher borrowing costs mean Vietnam must **choose and manage projects more carefully** [6]. Beyond money, the IBRD brings **appraisal, technical advice and international standards**, so knowing its terms and procedures matters.`,
  },
]);
export const beats = p.beats;
export default p.View;
