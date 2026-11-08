import { scene, R } from './kit';
import { Timeline } from '../primitives/bits';
import { F } from '../primitives/Fact';

const to = 'anchor:f3-ida-graduation:timeline';
const tl = (
  <div className="card" style={{ width: 1440 }}>
    <Timeline
      id="grad"
      items={[
        { id: 'tep', date: <F id="tep-approval" />, label: <R t="TEP approved for an IBRD loan [45; 46]" /> },
        { id: 'grad', date: <F id="graduation-date" />, label: <R t="Vietnam graduates from regular IDA eligibility" /> },
        { id: 'ida18', date: <F id="ida18-period" />, label: <R t="Transitional IDA18 support {ida18-sdr} (~{ida18-usd}) alongside IBRD access [3]" /> },
        { id: 'umic', date: <F id="umic-date" />, label: <R t="Reclassified upper-middle-income, distinct from IDA graduation [4]" /> },
      ]}
    />
  </div>
);
const terms = (
  <div className="cl-row terms-compare">
    <div className="cl-step" style={{ background: 'var(--wb-cyan)', color: 'var(--wb-navy)' }}>
      <b>Traditional IDA credits</b>
      <span>concessional terms</span>
    </div>
    <div className="cl-step" style={{ background: 'var(--wb-blue)' }}>
      <b>IBRD lending</b>
      <span>generally closer to market-based pricing: debt-service capacity, project selection, economic returns and fiscal risk become more prominent</span>
    </div>
  </div>
);
const p = scene('f3-ida-graduation', [
  {
    layout: 'centre',
    title: 'Graduation from IDA',
    source: 'Section 3.1.2 · p. 30',
    centre: tl,
    focus: ['grad-grad', 'grad-ida18'],
    callouts: [{ from: '#grad-grad', to, label: '1 July 2017' }],
    body: `Vietnam graduated from regular IDA on 1 July 2017 [3].`,
  },
  {
    layout: 'centre',
    title: 'Closer to market terms',
    source: 'Section 3.1.2 · pp. 30-31',
    centre: (
      <div className="card" style={{ width: 1440 }}>
        {terms}
      </div>
    ),
    body: `IDA credits are concessional; IBRD loans are priced closer to the market.`,
  },
  {
    layout: 'centre',
    title: 'IBRD was not a new lender',
    source: 'Section 3.1.2 · p. 31',
    centre: tl,
    focus: ['grad-tep'],
    callouts: [{ from: '#grad-tep', to: 'anchor:f3-ida-graduation:tep', label: 'TEP' }],
    body: `TEP was approved for an IBRD loan on 7 Aug 2014 [45; 46].`,
  },
  {
    layout: 'centre',
    title: 'A shift in lending mix',
    source: 'Section 3.1.2 · p. 31',
    centre: tl,
    focus: ['grad-umic'],
    body: `Graduation changes the mix; it does not replace every IDA project. The Jul 2026 reclassification is a separate event [4].`,
  },
]);
export const beats = p.beats;
export default p.View;
