import { scene } from './kit';
import { useFocus } from '../primitives/focus';

const a = (n: string) => `anchor:f1-gov:${n}`;
const S = 'Section 1.3.1 · p. 16';

const tiers = (focus: number) => (
  <div className="tiers">
    {[
      ['Board of Governors', 'sets the overall direction'],
      ['Board of Executive Directors', 'turns it into policies, approves operations'],
      ['President', 'carries them out'],
    ].map(([t, d], i) => (
      <div key={t} className={'tier' + (focus === i || focus === 3 ? ' on' : '')}>
        <b>{t}</b>
        <span>{d}</span>
      </div>
    ))}
  </div>
);

const OWN = ['United States', 'Japan', 'China', 'Germany', 'France', 'United Kingdom'];
export const CONSTITUENCY = ['Brunei Darussalam', 'Fiji', 'Indonesia', 'Lao PDR', 'Malaysia', 'Nepal', 'Singapore', 'Thailand', 'Tonga', 'Viet Nam'];

function CountryChip({ name, vn }: { name: string; vn?: boolean }) {
  const cls = useFocus(vn ? 'cc-vn' : undefined);
  return (
    <span id={vn ? 'cc-vn' : undefined} className={`chip ${vn ? 'cyan' : ''} ${vn ? cls : ''}`}>
      {name}
    </span>
  );
}
const seats = (
  <div className="card seats">
    <div className="kicker">Own seat</div>
    <div className="chips">
      {OWN.map((c) => (
        <span key={c} className="chip navy">
          {c}
        </span>
      ))}
      <span className="chip navy">Saudi Arabia</span>
    </div>
    <div className="kicker" style={{ marginTop: 14 }}>
      Vietnam's constituency · 10 countries
    </div>
    <div className="chips" id="constituency">
      {CONSTITUENCY.map((c) => (
        <CountryChip key={c} name={c} vn={c === 'Viet Nam'} />
      ))}
    </div>
  </div>
);

const p = scene('f1-gov', [
  {
    kicker: 'Section 1.3 · 1.3.1',
    title: 'Board of Governors',
    source: S,
    side: tiers(0),
    callouts: [{ from: '.k-card', to: a('governors'), label: 'Governors' }],
    body: `The **highest decision-making body**: one Governor per member, usually the finance minister or central bank governor. It meets once a year, keeps the biggest decisions (new members, capital, accounts) and **delegates day-to-day powers** to the Executive Directors.`,
  },
  {
    kicker: 'Section 1.3.1',
    title: 'Board of Executive Directors',
    source: S,
    side: tiers(1),
    callouts: [{ from: '.k-card', to: a('directors'), label: 'Executive Directors' }],
    body: `The **President and {eds|n} Executive Directors** meet several times a week in Washington, D.C. They approve loans, guarantees and the budget. With **{ibrd-members} members but only {eds|n} seats**, not every country has its own director.`,
  },
  {
    kicker: 'Section 1.3.1',
    title: 'Who has a seat of its own',
    source: S,
    side: seats,
    body: `The **six largest shareholders** each appoint their own Executive Director: the United States, Japan, China, Germany, France and the United Kingdom. **Saudi Arabia** also has a seat of its own.`,
  },
  {
    kicker: 'Section 1.3.1',
    title: 'Constituencies',
    source: S,
    side: seats,
    body: `All other members form **constituencies**. Each group jointly elects one Executive Director, supported by an **Alternate Executive Director**, who speaks for the group and **casts its combined votes**.`,
  },
  {
    kicker: 'Section 1.3.1',
    title: "Vietnam's voice on the Board",
    source: S,
    side: seats,
    focus: ['cc-vn'],
    callouts: [{ from: '#cc-vn', to: a('directors'), label: 'Board' }],
    body: `Vietnam has **no seat of its own**: it sits in a **ten-country constituency**. As of November 2026 it is represented by Executive Director **John Patrick Antonysamy** (Malaysia), with Alternate **Nakhafi Hassan** (Malaysia). Vietnam's views reach the Board through this office.`,
  },
  {
    kicker: 'Section 1.3.1',
    title: 'President',
    source: S,
    side: tiers(2),
    callouts: [{ from: '.k-card', to: a('president'), label: 'President' }],
    body: `The President chairs the Board and leads the World Bank Group, for a **five-year renewable term**, voting only to break a tie. **Ajay Banga** has held the post since {banga-start} [12].`,
  },
  {
    kicker: 'Section 1.3.1',
    title: 'A division of roles',
    source: S,
    side: tiers(3),
    body: `**Governors set direction · Directors approve operations · President carries them out.** This balances members' interests with efficient management.`,
  },
]);
export const beats = p.beats;
export default p.View;
