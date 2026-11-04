import { scene, FocusItem } from './kit';
import { RECS } from '../data/tables';

const a = (n: string) => `anchor:f3-recs-1:${n}`;
export const recList = (
  <div className="card">
    <ol className="focus-list recs">
      {RECS.map((r, i) => (
        <FocusItem key={i} id={`rec-${i + 1}`}>
          <b>{i + 1}.</b> {r}
        </FocusItem>
      ))}
    </ol>
  </div>
);
const p = scene('f3-recs-1', [
  {
    title: 'Recommendations for Vietnam',
    source: 'Section 3.4.3 · p. 62',
    side: recList,
    callouts: [{ from: '.k-card .h2', to: a('compass'), label: 'Direction' }],
    body: `Vietnam's reclassification as an **upper-middle-income economy in {umic-year}** means that future World Bank borrowing will rely on IBRD terms [4].

Using this more expensive capital well requires changes **on the domestic side**, where the two cases show the main constraints lie. The paper makes {recs-count|n} recommendations.`,
  },
  {
    title: '1 · Prepare projects more fully',
    source: 'Section 3.4.3 · p. 62',
    side: recList,
    focus: ['rec-1'],
    body: `**Technology choices, technical approvals and land acquisition plans** should be settled before the loan is signed. TEP's four-year delay on smart-grid technology could have been shortened by earlier regulatory coordination [41].

A **Preparation Advance** can finance this work and be refinanced from the loan.`,
  },
  {
    title: '2 · Secure counterpart funding at the start',
    source: 'Section 3.4.3 · p. 62',
    side: recList,
    focus: ['rec-2'],
    body: `Counterpart funds should be included in the **medium-term public investment plan when the project is approved**, not after effectiveness.

Before on-lending to provinces, the **Ministry of Finance should check each province's debt capacity**, as the CCSEP PAD did for Binh Dinh.`,
  },
  {
    title: '3 · Align compensation with Bank standards early',
    source: 'Section 3.4.3 · pp. 62-63',
    side: recList,
    focus: ['rec-3'],
    callouts: [{ from: '#rec-3', to: a('scales'), label: 'ESS5' }],
    body: `For new projects under the ESF, land valuation, consultation and grievance mechanisms should **meet ESS5 from the preparation stage**.

**Independent land price valuation** and **early consultation with affected households** would reduce the risk seen in Nha Trang, where disputes over prices led to cancelled contracts and a formal complaint.`,
  },
]);
export const beats = p.beats;
export default p.View;
