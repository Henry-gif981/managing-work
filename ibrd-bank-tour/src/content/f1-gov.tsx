import { scene } from './kit';

const a = (n: string) => `anchor:f1-gov:${n}`;
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

const p = scene('f1-gov', [
  {
    title: 'Board of Governors',
    source: 'Section 1.3.1 · p. 13',
    side: tiers(0),
    callouts: [{ from: '.k-card .h2', to: a('governors'), label: 'Governors' }],
    body: `The **highest decision-making body** of the IBRD. Each member country appoints one Governor and one Alternate Governor, usually the minister of finance or the governor of the central bank.

The Board meets once a year at the Annual Meetings of the World Bank Group and the IMF. It keeps the most important decisions, such as admitting new members, increasing or reducing capital, and approving the annual financial statements. Because it meets only once a year, it delegates most day-to-day powers to the Board of Executive Directors.`,
  },
  {
    title: 'Board of Executive Directors',
    source: 'Section 1.3.1 · pp. 13-14',
    side: tiers(1),
    callouts: [{ from: '.k-card .h2', to: a('directors'), label: 'Executive Directors' }],
    body: `The President and **{eds|n} Executive Directors**, working at headquarters in Washington, D.C. and meeting several times a week. The Board approves loans, guarantees and the annual budget, sets operational policies and reviews country strategies.

A few large shareholders appoint their own Executive Director, while most members are grouped into **constituencies** that elect one Executive Director to represent them. Decisions are usually made by consensus, but formal votes are weighted by each country's shareholding.`,
  },
  {
    title: 'President',
    source: 'Section 1.3.1 · p. 13',
    side: tiers(2),
    callouts: [{ from: '.k-card .h2', to: a('president'), label: 'President' }],
    body: `The President chairs the Board of Executive Directors and leads the entire World Bank Group. The President is selected by the Executive Directors for a term of {president-term}, which can be renewed, and does not vote except to break a tie.

The President manages staff and daily operations and proposes loans and policies to the Board for approval. The current President is **Ajay Banga**, who began his term on {banga-start} [12].`,
  },
  {
    title: 'A division of roles',
    source: 'Section 1.3.1 · p. 13',
    side: tiers(3),
    body: `In short, the Board of Governors sets the overall direction, the Board of Executive Directors turns it into policies and approves operations, and the President carries them out.

This division of roles helps balance the interests of member countries with the need for efficient management.`,
  },
]);
export const beats = p.beats;
export default p.View;
