import { scene, R, detail } from './kit';
import { DataTable } from '../primitives/DataTable';
import { Chart } from '../primitives/Chart';
import { Stat } from '../primitives/bits';
import { F } from '../primitives/Fact';
import { TABLE12, FIGURES } from '../data/tables';
import { factValue } from '../data/facts';

const a = (n: string) => `anchor:f3-tep-financing:${n}`;
const table = (
  <DataTable
    id="t12"
    width={1300}
    columns={[
      { key: 'comp', label: 'Component' },
      { key: 'appT', label: 'Appraisal total', align: 'right', width: 200 },
      { key: 'actT', label: 'Actual total', align: 'right', width: 200 },
      { key: 'appI', label: 'Appraisal IBRD', align: 'right', width: 200 },
      { key: 'actI', label: 'Actual IBRD', align: 'right', width: 200 },
    ]}
    rows={TABLE12.map((r) => ({
      id: r.id,
      kind: r.id === 'total' ? 'total' : undefined,
      cells: { comp: <b>{r.comp}</b>, appT: <F id={r.appT} fixed={2} />, actT: <F id={r.actT} fixed={2} />, appI: <F id={r.appI} fixed={2} />, actI: <F id={r.actI} fixed={2} /> },
    }))}
    caption={<R t="Table 3.2.3. TEP component financing by source: appraisal versus actual (million USD). Source: Adapted from [46, Annex 3, Table 3.2, p. 49]. IBRD component allocations and actual costs are taken from the original table." />}
  />
);
const fig1 = (
  <Chart
    id="f1"
    kind="stacked"
    width={1000}
    height={460}
    categories={FIGURES.fig1.categories}
    series={[
      { name: 'IBRD financing', values: FIGURES.fig1.ibrd.map(factValue), color: 'var(--series-1)' },
      { name: 'Borrower financing', values: FIGURES.fig1.borrower.map(factValue), color: 'var(--series-3)' },
    ]}
    max={800}
    format={(v) => `${v}`}
    caption={<R t="Figure 3.2.1. TEP financing structure: committed/appraised resources ({tep-total|2}) versus actual closing expenditure ({tep-actual-total|2}) (million USD). Source: [46, Annex 3, Table 3.2]. Actual expenditure is not equivalent to contractual loan availability." />}
  />
);
const ANCH: Record<string, string> = { c1: 'infra', c2: 'smartgrid', c3: 'capacity', fee: 'cash', total: 'cash' };
const row = (i: number, body?: string, label?: string) => ({
  layout: 'centre' as const,
  title: 'Table 3.2.3 · Financing by source',
  label: label ?? TABLE12[i].comp,
  source: 'Section 3.2.2 · Table 3.2.3 · p. 35',
  centre: table,
  focus: [`t12-${TABLE12[i].id}`],
  callouts: [{ from: `#t12-${TABLE12[i].id}-comp`, to: a(ANCH[TABLE12[i].id]), label: TABLE12[i].comp.replace(/^\d\.\s/, '') }],
  body,
});
const split = (
  <div className="card k-stats split-stats">
    <Stat id="sp-infra" value={<F id="tep-c1-ibrd-act" fixed={2} />} label="transmission infrastructure" />
    <Stat id="sp-sg" value={<F id="tep-c2-ibrd-act" fixed={2} />} label="smart-grid works" />
    <Stat id="sp-cb" value={<F id="tep-c3-ibrd-act" fixed={2} />} label="capacity building" tone="bad" />
    <Stat id="sp-fee" value={<F id="tep-fee" fixed={2} />} label="front-end fee" />
  </div>
);
const p = scene('f3-tep-financing', [
  row(0, `IBRD financing was primarily allocated to transmission infrastructure, the largest investment component [46].`),
  // rows 2-4 are already in the table on screen; Figure 3.2.1 (committed vs disbursed) belongs to scene 45: detail beats
  ...detail(row(1), row(2), row(3)),
  // at appraisal (planned), not the amount actually spent
  row(4, `The estimated project cost was USD 731.25 million, including USD 500 million from IBRD and USD 231.25 million from Vietnam [45; 46].`, 'At appraisal: total financing'),
  ...detail({
    layout: 'centre',
    title: 'Figure 3.2.1 · Committed vs actual',
    label: 'IBRD 500.00 vs 318.53',
    source: 'Section 3.2.2 · Figure 3.2.1 · p. 36',
    centre: fig1,
    focus: ['f1-s0'],
    callouts: [{ from: '#f1-0-1', to: a('cash'), label: 'IBRD disbursed' }],
    body: `IBRD committed {tep-ibrd|2}; IBRD actually disbursed {tep-ibrd-disb|2} (**{tep-ibrd-disb-pct}**). Borrower financing: {tep-counterpart|2} at appraisal, about {tep-counterpart-final|2} at closing (Section 3.2.5).`,
  }),
  {
    title: 'Where the US$318.53 million went',
    kicker: 'Section 3.2.2',
    source: 'Section 3.2.2 · p. 36',
    side: split,
    focus: ['sp-cb'],
    callouts: [{ from: '#sp-cb', to: a('capacity'), label: 'Capacity building' }],
    body: `Most IBRD funds were used for infrastructure and smart-grid investments, while capacity building relied mainly on domestic resources [46].`,
  },
  {
    title: 'Contractual Disciplines',
    kicker: 'Section 3.2.2',
    source: 'Section 3.2.2 · p. 36',
    callouts: [{ from: '.k-card .h2', to: a('infra'), label: 'Competitive bidding' }],
    body: `IBRD financing also required compliance with procurement, financial management and environmental and social safeguards [41, pp. ix-xi, 17].`,
  },
]);
export const beats = p.beats;
export default p.View;
