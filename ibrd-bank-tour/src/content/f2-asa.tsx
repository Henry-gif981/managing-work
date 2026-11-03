import { scene, ProportionBar, R } from './kit';
import { factValue } from '../data/facts';

const a = (n: string) => `anchor:f2-asa:${n}`;
const bar = (
  <div className="card" style={{ width: 1360 }}>
    <ProportionBar
      id="asa"
      parts={[
        { id: 'asa-bb', label: "Bank's administrative budget", value: factValue('asa-admin'), color: 'var(--series-1)' },
        { id: 'asa-tf', label: 'Donor trust funds', value: factValue('asa-trust'), color: 'var(--series-2)' },
        { id: 'asa-ras', label: 'RAS', value: factValue('asa-ras'), color: 'var(--series-3)', text: 'var(--wb-navy)' },
      ]}
    />
    <div className="caption" style={{ marginTop: 10 }}>
      <R t="Funding of analytical and advisory disbursements, {asa-year}: total {asa-total} [39]. RAS = Reimbursable Advisory Services." />
    </div>
  </div>
);
const p = scene('f2-asa', [
  {
    title: 'Advice outside any single loan',
    source: 'Section 2.2.2 · p. 25',
    callouts: [{ from: '.k-card .h2', to: a('library'), label: 'ASA' }],
    body: `**Advisory Services and Analytics (ASA)** are the Bank's non-lending activities that help clients advance a development objective. Their outputs include analytical reports, policy notes, hands-on advice and knowledge-sharing workshops [38].

ASA can inform a country's policies directly, or prepare the ground for later loans.`,
  },
  {
    layout: 'centre',
    title: 'How ASA is funded',
    source: 'Section 2.2.2 · p. 25',
    centre: bar,
    focus: ['asa-tf'],
    callouts: [{ from: '#asa-bb', to: a('library'), label: 'ASA' }],
    body: `ASA is funded in {asa-funding-ways|n} ways. In {asa-year}, analytical and advisory disbursements totalled {asa-total}: {asa-admin} from the Bank's administrative budget, {asa-trust} from donor trust funds and {asa-ras} from Reimbursable Advisory Services [39].`,
  },
  {
    layout: 'centre',
    title: 'Reimbursable Advisory Services',
    source: 'Section 2.2.2 · p. 25',
    centre: bar,
    focus: ['asa-ras'],
    callouts: [{ from: '#asa-bb', to: a('library') }],
    body: `Under **Reimbursable Advisory Services (RAS)**, a client requests and pays for the advice under a legal agreement [38]. RAS is offered mainly to middle and high-income countries, which makes it **increasingly relevant to Vietnam** [40].`,
  },
  {
    title: 'ASA in Vietnam',
    source: 'Section 2.2.2 · pp. 25-26',
    callouts: [{ from: '.k-card .h2', to: a('library') }],
    body: `In Vietnam, analytical work has supported several of the reforms later financed by loans. The Public Investment Reform series, for example, rested on policy dialogue about the public investment cycle [2].

At project level, CCSEP drew on technical assistance from **PPIAF ({ppiaf})** and **GIZ** to support institutional reform under Decree No. {decree-80} (see Section 3.3.3).`,
  },
]);
export const beats = p.beats;
export default p.View;
