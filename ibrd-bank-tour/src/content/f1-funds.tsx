import { scene } from './kit';

const a = (n: string) => `anchor:f1-funds:${n}`;
const S = 'Section 1.3.3 · p. 17';
const compare = (
  <div className="card compare">
    <div>
      <b>IDA</b>
      <span>depends on regular donations from rich countries</span>
    </div>
    <div>
      <b>IBRD</b>
      <span>funds itself through the market: large scale, low cost, but dearer than IDA credits</span>
    </div>
  </div>
);
const p = scene('f1-funds', [
  {
    kicker: 'Section 1.3.3',
    title: 'Paid-in and callable capital',
    source: S,
    callouts: [{ from: '.k-card', to: a('vault'), label: 'Callable capital' }],
    body: `Members subscribe shares, but only a small part is **paid in**. The rest is **callable capital**, payable only if the IBRD cannot pay bondholders, and **never called**. A capital increase was agreed in {capital-increase} [14].`,
  },
  {
    kicker: 'Section 1.3.3',
    title: 'Bonds on capital markets',
    source: S,
    callouts: [{ from: '.k-card', to: a('bonds'), label: 'Bonds' }],
    body: `The largest source is **bonds** sold worldwide. A long-held **AAA rating** lets the IBRD borrow cheaply and pass the savings on; it also issues **green and sustainable development bonds** [15].`,
  },
  {
    kicker: 'Section 1.3.3',
    title: 'Other sources',
    source: S,
    callouts: [{ from: '.k-card', to: a('counter'), label: 'Treasury' }],
    body: `**Loan repayments** are lent again and **net income** strengthens capital. Newer tools such as **hybrid capital** and **shareholder guarantees** raise lending capacity without large capital increases.`,
  },
  {
    kicker: 'Section 1.3.3',
    title: 'IBRD versus IDA funding',
    source: S,
    side: compare,
    body: `IDA relies on donations; the IBRD **funds itself through the market**. It can lend at scale and low cost, but its loans are **more expensive than IDA credits**.`,
  },
]);
export const beats = p.beats;
export default p.View;
