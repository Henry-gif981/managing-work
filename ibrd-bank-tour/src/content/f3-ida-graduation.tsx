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
    body: `Vietnam graduated from regular IDA eligibility **with effect from {graduation-date}**. Graduation marked a change in the expected composition and terms of new sovereign borrowing, not an immediate end to all IDA-related activity. The World Bank's {plr-year} Performance and Learning Review records transitional IDA18 support of {ida18-sdr} (approximately {ida18-usd} before a subsequent allocation reduction), alongside continuing access to IBRD financing [3]. Existing IDA-financed projects continued into later years.`,
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
    body: `The transition is relevant to project financing because IBRD lending is generally closer to market-based pricing than traditional IDA credits, making **debt-service capacity, project selection, economic returns and fiscal risk** more prominent considerations.`,
  },
  {
    layout: 'centre',
    title: 'IBRD was not a new lender',
    source: 'Section 3.1.2 · p. 31',
    centre: tl,
    focus: ['grad-tep'],
    callouts: [{ from: '#grad-tep', to: 'anchor:f3-ida-graduation:tep', label: 'TEP' }],
    body: `Yet the transition did not make the IBRD an entirely new lender to Vietnam. **TEP** (Section 3.2) was approved for an IBRD loan on {tep-approval}, almost three years before IDA graduation. It shows that an IBRD-financed project could coexist with an active IDA portfolio before the formal graduation date [45; 46].`,
  },
  {
    layout: 'centre',
    title: 'A shift in lending mix',
    source: 'Section 3.1.2 · p. 31',
    centre: tl,
    focus: ['grad-umic'],
    body: `Graduation is therefore **a shift in lending mix and financing conditions**, not a simple substitution of every IDA project by an IBRD project. Differences between the two institutions are most meaningful when traced to actual financing agreements, counterpart obligations and project results, rather than labels such as "soft loan" or "commercial loan". The reclassification as an upper-middle-income economy in {umic-date} is distinct from the 2017 IDA graduation [4].`,
  },
]);
export const beats = p.beats;
export default p.View;
