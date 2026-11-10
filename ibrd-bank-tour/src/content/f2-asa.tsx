import { scene, keepBeats } from './kit';
import { Chip } from '../primitives/bits';

const to = 'anchor:f2-asa:library';
const K = 'Section 2.2.2';
const T = 'Advisory Services and analytics (ASA)';
const channels = (on: number) => (
  <div className="chips asa-chips">
    {["Bank's administrative budget", 'Donor trust funds', 'Reimbursable Advisory Services (RAS)'].map((c, i) => (
      <Chip key={c} tone={i === on ? 'cyan' : 'navy'}>
        {c}
      </Chip>
    ))}
  </div>
);
// patch 8c: main-flow beats [1, 2, 3]; the others are detail beats (key V)
const p = scene('f2-asa', keepBeats([1, 2, 3], [
  {
    title: T,
    kicker: K,
    source: 'Section 2.2.2 · p. 25',
    callouts: [{ from: '.k-card', to, label: 'ASA' }],
    body: `ASA represent non-lending activities such as policy notes and technical advice. They serve a dual purpose: directly informing national policy formulation and establishing the institutional groundwork for future loan-financed operations [38].`,
  },
  {
    title: T,
    kicker: K,
    source: 'Section 2.2.2 · p. 25',
    aside: channels(-1),
    body: `ASA is funded through **three channels**: the Bank's administrative budget, donor trust funds, and Reimbursable Advisory Services.`,
  },
  {
    title: T,
    kicker: K,
    source: 'Section 2.2.2 · p. 25',
    aside: channels(2),
    callouts: [{ from: '.k-card', to, label: 'RAS' }],
    body: `Under **Reimbursable Advisory Services (RAS)**, clients request and pay for customized technical advice under a legal agreement. RAS is offered mainly to middle- and high-income countries, so it is **increasingly relevant to Vietnam** [38; 40].`,
  },
  {
    title: T,
    kicker: K,
    source: 'Section 2.2.2 · p. 25',
    callouts: [{ from: '.k-card', to }],
    body: `In Vietnam, analytical work underpins major policy dialogues for reforms and builds local regulatory capacity. By resolving institutional bottlenecks early, ASA enhances project readiness and ensures effective loan execution [2].`,
  },
]));
export const beats = p.beats;
export default p.View;
