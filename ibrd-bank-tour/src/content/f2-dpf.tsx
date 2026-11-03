import { scene } from './kit';
import { Stat, Cite } from '../primitives/bits';
import { F } from '../primitives/Fact';

const to = 'anchor:f2-dpf:dossier';
const ops = (focus: number) => (
  <div className="card ops">
    <div className={'op' + (focus === 0 ? ' on' : '')} id="op-pir1">
      <div className="kicker">
        PIR 1 · <F id="pir1-approved" /> <Cite n={2} />
      </div>
      <Stat value={<F id="pir1-ibrd" />} label="IBRD loan" />
    </div>
    <div className={'op' + (focus === 1 ? ' on' : '')} id="op-pir2">
      <div className="kicker">
        PIR 2 · <F id="pir2-approved" /> <Cite n={31} />
      </div>
      <div className="op-pair">
        <Stat value={<F id="pir2-ibrd" />} label="IBRD loan" />
        <Stat value={<F id="pir2-ida" />} label="IDA credit" />
      </div>
    </div>
    <div className={'op' + (focus === 2 ? ' on' : '')} id="op-psr">
      <div className="kicker">
        Power-sector reform DPF · <F id="psr-year" /> <Cite n={34} />
      </div>
      <div className="op-pair">
        <Stat value={<F id="psr-ibrd" />} label="from the IBRD" />
        <Stat value={<F id="psr-ida" />} label="from IDA" />
      </div>
    </div>
  </div>
);
const p = scene('f2-dpf', [
  {
    title: 'DPF: a policy matrix',
    kicker: 'Section 2.1.3 · DPF',
    source: 'Section 2.1.3 · p. 24',
    callouts: [{ from: '.k-card .h2', to, label: 'DPF' }],
    body: `Development Policy Financing works through a **policy matrix**. The government completes prior actions, such as issuing a decree or adopting a new procedure, and the loan is then released to the budget.

Vietnam's **Public Investment Reform (PIR)** series shows how this works.`,
  },
  {
    title: 'The Public Investment Reform series',
    kicker: 'Section 2.1.3 · DPF',
    source: 'Section 2.1.3 · p. 24',
    side: ops(0),
    body: `The first operation, a {pir1-ibrd} IBRD loan, was approved in {pir1-approved} as the first of {pir-ops|n} single-tranche operations [2].

The second, approved in {pir2-approved}, combined an IBRD loan of {pir2-ibrd} with an IDA credit of {pir2-ida} [31]. Its reforms aimed to strengthen the **public investment cycle** and the **legal basis for public-private partnerships** [32; 33].`,
  },
  {
    title: 'Power-sector reform',
    kicker: 'Section 2.1.3 · DPF',
    source: 'Section 2.1.3 · p. 24',
    side: ops(2),
    callouts: [{ from: '#op-psr', to, label: 'DPF' }],
    body: `A similar approach supported power-sector reform: in {psr-year}, a DPF operation combined {psr-ibrd} from the IBRD with {psr-ida} from IDA [34].`,
  },
]);
export const beats = p.beats;
export default p.View;
