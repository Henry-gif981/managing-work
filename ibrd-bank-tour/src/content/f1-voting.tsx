import { scene } from './kit';
import { Stat } from '../primitives/bits';
import { F } from '../primitives/Fact';

const to = 'anchor:f1-voting:stamps';
const votes = (
  <div className="card vote-eq">
    <div className="ve-part">
      <b>Basic votes</b>
      <span>shared equally among all members</span>
    </div>
    <div className="ve-op">+</div>
    <div className="ve-part">
      <b>Share votes</b>
      <span>one vote for each share held</span>
    </div>
    <div className="ve-op">=</div>
    <div className="ve-part total">
      <b>A member's votes</b>
      <span>one share, one vote</span>
    </div>
  </div>
);

const p = scene('f1-voting', [
  {
    title: 'Membership and shares',
    source: 'Section 1.3.2 · p. 14',
    callouts: [{ from: '.k-card .h2', to }],
    body: `To become a member of the IBRD, a country must first be a member of the **International Monetary Fund**. It must then subscribe to shares of the IBRD's capital; the number of shares depends mainly on the size of its economy.

Only a small part of this capital is actually paid in. The larger part is **callable capital**, which the IBRD can ask members to pay only if it cannot meet its own debt obligations. It acts as a guarantee that supports the IBRD's strong credit rating.`,
  },
  {
    title: 'One share, one vote',
    source: 'Section 1.3.2 · p. 14',
    side: votes,
    body: `Voting power follows the principle of **one share, one vote**, rather than one country, one vote as in the United Nations. Each member's votes consist of two parts:

- **Basic votes**, shared equally among all members to give smaller countries a minimum voice.
- **Share votes**, one vote for each share held.

As a result, countries that contribute more capital have more influence over decisions.`,
  },
  {
    title: 'Large shareholders and reforms',
    source: 'Section 1.3.2 · pp. 14-15',
    side: (
      <div className="card k-stats">
        <Stat id="st-us" value={<F id="us-votes" />} label="United States: the largest share of votes (around)" />
        <Stat id="st-85" value={<F id="supermajority" />} label="majority for some major decisions, e.g. amending the Articles of Agreement" tone="warn" />
      </div>
    ),
    body: `The United States holds the largest share of votes, at around {us-votes}, followed by Japan, China, Germany, France and the United Kingdom. Because some major decisions, such as amending the Articles of Agreement, require an {supermajority} majority, the United States effectively has a **veto** over them.

To make the system fairer, the IBRD carried out voting reforms in {voting-reform} and later capital increases. These raised basic votes and shifted more voting power to developing and transition countries.`,
  },
  {
    title: "Vietnam's voice",
    source: 'Section 1.3.2 · p. 15',
    callouts: [{ from: '#st-vn', to, label: 'Vietnam' }],
    side: (
      <div className="card">
        <Stat id="st-vn" value={<F id="vn-votes" />} label={<>of IBRD votes held by Vietnam, as of <F id="vn-votes-date" /> [13]</>} />
      </div>
    ),
    body: `Vietnam's voting power remains small. As of {vn-votes-date}, Vietnam held {vn-votes} of IBRD votes [13].

In practice, Vietnam takes part in decisions through the **constituency** it belongs to, which shares one Executive Director on the Board. Vietnam's influence therefore depends partly on cooperation with other members of its group.`,
  },
]);
export const beats = p.beats;
export default p.View;
