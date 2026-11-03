import { scene } from './kit';
import { Timeline } from '../primitives/bits';
import { F } from '../primitives/Fact';
import { R } from './kit';

const milestones = (
  <div className="card" style={{ width: 1440 }}>
    <Timeline
      id="vn-path"
      items={[
        { id: 'eligible', date: <F id="vn-ibrd-eligible" />, label: <R t="Bank declares Vietnam IBRD-eligible [1; 2]" /> },
        { id: 'pir', date: <F id="pir1-approved" />, label: <R t="First IBRD loan: {pir1-ibrd} Public Investment Reform loan approved [1; 2]" /> },
        { id: 'grad', date: <F id="vn-ida-graduation" />, label: <R t="Vietnam graduates from IDA; no more regular IDA credits" /> },
        { id: 'ibrd', date: <F id="vn-ibrd-from" />, label: <R t="Borrows only from the IBRD and on non-concessional IDA terms; transitional support in IDA18 ({ida18-period}) [3]" /> },
        { id: 'umic', date: <F id="vn-umic" />, label: <R t="Reclassified as an upper-middle-income economy [4]" /> },
      ]}
    />
  </div>
);

/** Qualitative cost ladder exactly as the paper ranks it (no figures given in Introduction 1.2). */
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
        <span>most commercial loans: dearer and shorter-term than IBRD loans</span>
      </div>
    </div>
  </div>
);

const p = scene('f1-rationale-2', [
  {
    layout: 'centre',
    title: 'Why the IBRD matters for Vietnam',
    source: 'Introduction 1.2 · pp. 4-5',
    centre: milestones,
    body: `For many years, Vietnam relied on IDA, the World Bank's window for low-income countries, which offers loans with very low interest rates and long repayment periods. As the economy grew, this changed. From {vn-ibrd-from}, both remaining windows (the IBRD and non-concessional IDA terms) carry higher interest rates.`,
  },
  {
    layout: 'centre',
    title: 'A middle path',
    source: 'Introduction 1.2 · p. 5',
    centre: ladder,
    body: `This shift makes the IBRD Vietnam's main source of World Bank financing. IBRD loans are more expensive than IDA credits, but still cheaper and longer-term than most commercial loans. Vietnam's investment needs keep growing: at graduation, market analysts noted official financing alone would not be enough, so Vietnam would also have to borrow on capital markets and pay to do so [5]. The IBRD offers a middle path: reasonable terms for large, long-term projects the market may not support on its own.`,
  },
  {
    title: 'Choosing projects more carefully',
    source: 'Introduction 1.2 · p. 5',
    callouts: [{ from: '.k-card .h2', to: 'anchor:f1-rationale-2:map', label: 'Vietnam' }],
    body: `Higher borrowing costs mean Vietnam must choose and manage projects more carefully. After graduation, Deputy Prime Minister Pham Binh Minh asked the Ministry of Planning and Investment to report on how to mobilize loans in the future, especially non-concessional loans [6].

Beyond money, the IBRD brings project appraisal, technical advice and international standards, which help Vietnam use each loan more effectively. Understanding its lending terms, procedures and priorities is therefore important as Vietnam moves into a new stage of development finance.`,
  },
]);
export const beats = p.beats;
export default p.View;
