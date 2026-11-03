import { scene } from './kit';

const a = (n: string) => `anchor:f1-funds:${n}`;
const compare = (
  <div className="card compare">
    <div>
      <b>IDA</b>
      <span>depends on regular donations from rich countries</span>
    </div>
    <div>
      <b>IBRD</b>
      <span>funds itself through the market: large scale, low cost, but loans dearer than IDA credits</span>
    </div>
  </div>
);
const p = scene('f1-funds', [
  {
    title: 'Two main sources',
    source: 'Section 1.3.3 · p. 15',
    callouts: [{ from: '.k-card .h2', to: a('counter'), label: 'Treasury' }],
    body: `The IBRD funds its lending mainly from two sources: **capital from its member countries** and **money raised by issuing bonds** on international capital markets. In addition, loan repayments and the IBRD's own earnings provide further resources.

**Paid-in capital.** When a country joins the IBRD, it subscribes to a certain number of shares. Only a small part of this subscribed capital is actually paid in cash.`,
  },
  {
    title: 'Callable capital and equity',
    source: 'Section 1.3.3 · p. 15',
    callouts: [{ from: '.k-card .h2', to: a('vault'), label: 'Callable capital' }],
    body: `The rest is **callable capital**, which members promise to pay only if the IBRD cannot meet its obligations to bondholders. This call has never been made in the IBRD's history.

Paid-in capital, together with retained earnings, forms the IBRD's equity. This equity acts as a cushion against losses and determines how much the IBRD can safely lend. When demand for lending grows, members can agree to a capital increase, as they did in {capital-increase} [14].`,
  },
  {
    title: 'Bond issuance',
    source: 'Section 1.3.3 · p. 15',
    callouts: [{ from: '.k-card .h2', to: a('bonds'), label: 'Bonds' }],
    body: `The largest source of funds is borrowing on international capital markets. Acting as a financial intermediary, the IBRD issues bonds in many currencies and sells them to investors such as central banks, pension funds and insurance companies around the world.

Its strong capital base, callable capital and careful financial management have kept the highest credit rating (**AAA**) for decades. It therefore borrows at very low interest rates and passes the savings on through loans with long maturities and reasonable costs.`,
  },
  {
    title: 'Green bonds and other sources',
    source: 'Section 1.3.3 · pp. 15-16',
    callouts: [{ from: '.k-card .h2', to: a('bonds') }],
    body: `In recent years, the IBRD has also issued **sustainable development bonds** and **green bonds**, linking investors' money to social and environmental goals [15].

**Other sources.** Loan repayments are recycled into new loans, and the IBRD's net income from lending and investments helps strengthen its capital. More recently, it has tried new tools, such as **hybrid capital** and **guarantees from shareholders**, to increase lending capacity without large capital increases.`,
  },
  {
    title: 'IBRD versus IDA funding',
    source: 'Section 1.3.3 · p. 16',
    side: compare,
    body: `This funding model is the main difference between the IBRD and IDA. IDA depends on regular donations from rich countries, while the IBRD can fund itself through the market.

As a result, the IBRD can lend on a large scale at low cost, but its loans are more expensive than IDA credits.`,
  },
]);
export const beats = p.beats;
export default p.View;
