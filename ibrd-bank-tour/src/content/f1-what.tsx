import { scene } from './kit';

const to = 'anchor:f1-what:counter';
const S = 'Section 1.1.1 · p. 13';
const p = scene('f1-what', [
  {
    kicker: 'Section 1.1 · 1.1.1',
    title: 'A development cooperative',
    source: S,
    callouts: [{ from: '.k-card', to, label: 'Information' }],
    body: `The **International Bank for Reconstruction and Development (IBRD)** is owned by {ibrd-members} member countries and, with IDA, forms the **World Bank** [9]. It is not profit-driven: it raises funds on capital markets and lends them for development.`,
  },
  {
    kicker: 'Section 1.1.1',
    title: 'Role and mission',
    source: S,
    body: `Besides loans, it offers **guarantees, risk management and advisory services**. It shares the World Bank Group's mission: **end extreme poverty and boost shared prosperity on a livable planet**, with job creation at its centre.`,
  },
  {
    kicker: 'Section 1.1.1',
    title: 'Who can borrow',
    source: S,
    callouts: [{ from: '.k-card', to, label: 'Borrowers' }],
    body: `Main borrowers are **middle-income countries** and creditworthy poorer ones. Lending goes to governments, or to public bodies **with a government guarantee**. As countries grow richer they move from IDA to IBRD lending, as Vietnam did.`,
  },
]);
export const beats = p.beats;
export default p.View;
