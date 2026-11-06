import { scene, R } from './kit';
import { Stat, Note } from '../primitives/bits';
import { F } from '../primitives/Fact';

const a = (n: string) => `anchor:f3-ccsep-nhatrang:${n}`;
const stats = (
  <div className="card k-stats nt-stats">
    <Stat value={<F id="nt-target-pct" />} label="of Nha Trang targets reached (about)" tone="bad" />
    <Stat value={<><F id="nt-plans-approved" />/<F id="nt-plans" /></>} label="compensation plans approved" tone="bad" />
    <Stat value={<F id="nt-rejected-share" />} label="of approved plans rejected by residents" tone="bad" />
    <Stat value={<><F id="nt-comp" />/<F id="nt-hh" /></>} label={<>households compensated at closing (<F id="nt-comp-pct" />)</>} tone="bad" />
    <Stat value={<F id="nt-embank-pct" />} label="of embankment works completed" tone="bad" />
  </div>
);
const p = scene('f3-ccsep-nhatrang', [
  {
    title: 'The single largest bottleneck',
    kicker: 'Section 3.3.4 · Nha Trang',
    layout: 'left',
    side: stats,
    source: 'Section 3.3.4 · p. 53',
    callouts: [{ from: '.k-card .h2', to: a('pin'), label: 'Nha Trang' }],
    body: `The single largest bottleneck was **resettlement in Nha Trang** (Section 3.3.3). Of the {nt-plans} households originally identified for compensation, only **{nt-plans-approved}** had approved plans after the restructuring, and two work packages (**NT-2.1 and NT-2.2**) were delayed and then cancelled, so the works could not be completed within the project period [60, executive summary, paras. 10, 29].`,
  },
  {
    title: 'At closing',
    kicker: 'Section 3.3.4 · Nha Trang',
    layout: 'left',
    side: stats,
    source: 'Section 3.3.4 · p. 53',
    callouts: [{ from: '.k-card .h2', to: a('pin'), label: '138 of 469' }],
    body: `At closing, only **{nt-comp} of the {nt-hh} affected households** in Nha Trang ({nt-comp-pct}) had been compensated, and {nt-to-relocate} households were still to be relocated [63, p. 19; 64, p. 17]. The land concerned: about {land-not-acq} not yet acquired, about {land-2018} acquired in 2018 and about {land-2021} in 2021 [60, paras. 11, 63].

World Bank Management cited "technical reasons" for the cancellations and said they would not affect the project development objective [60, paras. 49, 59].`,
    aside: (
      <Note>
        <R t="The Management Response puts the number of households affected by project works in Nha Trang at about {nt-hh-mgmt} [60, executive summary], against {nt-hh} in the ICR/IEG figures." />
      </Note>
    ),
  },
  {
    title: 'A complaint to the Inspection Panel',
    kicker: 'Section 3.3.4 · Nha Trang',
    layout: 'left',
    side: stats,
    source: 'Section 3.3.4 · p. 54',
    callouts: [{ from: '.k-card .h2', to: a('pin'), label: 'Ngoc Hiep Ward' }],
    body: `The bottleneck led to a formal complaint. In a request submitted by **{complainants|n} residents of Ngoc Hiep Ward** to the Inspection Panel on **{complaint-date}**, residents described land use and construction restrictions since {restrictions-since}, inconsistent resettlement policies, inadequate land compensation prices, and security pressure due to police presence [60, paras. 13, 17, 19, 23].

**These are allegations by the complainants and do not constitute conclusions.**`,
  },
  {
    title: 'Management review and the Board',
    kicker: 'Section 3.3.4 · Nha Trang',
    layout: 'left',
    side: stats,
    source: 'Section 3.3.4 · p. 54',
    body: `World Bank Management reviewed **{packages-reviewed|n} compensation packages** and identified **{packages-noncompliant|n} non-compliant cases**, referred to the PMU for correction in {pmu-referral}; {packages-lowprice|n} involved low land prices and were being revised. The compensation plan for the 5 ha area was officially revoked in {plan-revoked} [60, paras. 37, 40, 41].

The Board of Executive Directors **approved the investigation on {investigation-approved}** [61].`,
  },
  {
    title: 'Dispute resolution and investigation',
    kicker: 'Section 3.3.4 · Nha Trang',
    layout: 'left',
    side: stats,
    source: 'Section 3.3.4 · p. 54',
    body: `The parties entered a dispute resolution process, which concluded on {dispute-end} without a signed agreement after the complainants withdrew, although a confidential memorandum of understanding had been signed on {mou-date} [62].

The case returned to the Inspection Panel, which submitted its **Investigation Report on {panel-report}** [61].`,
  },
  {
    title: 'The Panel’s findings',
    kicker: 'Section 3.3.4 · Nha Trang',
    layout: 'left',
    side: stats,
    source: 'Section 3.3.4 · p. 54',
    body: `The Panel found the Bank in **non-compliance in {noncompliance-areas|n} areas**: alternatives were not explored to avoid displacing secondary households at the Ngoc Hiep resettlement site, and consultation and access to the grievance mechanism were inadequate in the project's early stages.

It found the Bank **in compliance** on land-use restrictions, which stemmed from the {master-plan} Master Plan and the {land-law} Land Law, and on valuation and compensation, after corrective measures. The Board approved the **Management Action Plan on {map-approved}** [61].`,
  },
  {
    title: 'Three direct causes',
    kicker: 'Section 3.3.4 · Nha Trang',
    layout: 'left',
    side: stats,
    source: 'Section 3.3.4 · p. 54 (Bank standards vs local rules: Sections 2.3.2, 3.4.2)',
    body: `{nt-causes|n} direct causes (Section 3.3.3) [57]:

1. disagreements over **land prices and compensation**, which led one-third of approved plans to be rejected;
2. **land-use restrictions since {restrictions-since}** without completed acquisition, prolonging residents' waiting;
3. **weak PMU capacity** and coordination with provincial authorities.

Resettlement was a **precondition** for the drainage to operate, not an auxiliary component. Knowing the Bank's resettlement standards was not enough when local compensation rules and land prices differed.`,
  },
]);
export const beats = p.beats;
export default p.View;
