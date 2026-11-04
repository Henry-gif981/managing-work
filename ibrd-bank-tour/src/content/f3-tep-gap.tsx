import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { Stat } from '../primitives/bits';
import { F } from '../primitives/Fact';
import { TABLE16 } from '../data/tables';

const a = (n: string) => `anchor:f3-tep-gap:${n}`;
const table = (
  <DataTable
    id="t16"
    width={1300}
    columns={[
      { key: 'measure', label: 'Measure' },
      { key: 'value', label: 'million USD', align: 'right', width: 200 },
      { key: 'meaning', label: 'Meaning' },
    ]}
    rows={TABLE16.map((r) => ({ id: r.id, cells: { measure: <b>{r.measure}</b>, value: <R t={r.value} />, meaning: <R t={r.meaning} /> } }))}
    caption={<R t="Table 16. TEP financing gap: definitions and derived comparisons (million USD). Source: Authors’ compilation and calculations from [46, Annex 3, Table 3.2; 41, pp. v, x, 17]." />}
  />
);
const row = (i: number) => ({
  layout: 'centre' as const,
  title: 'Table 16 · The financing gap',
  label: TABLE16[i].measure,
  source: 'Section 3.2.5 · Table 16 · p. 45',
  centre: table,
  focus: [`t16-${TABLE16[i].id}`],
  callouts: [{ from: `#t16-${TABLE16[i].id}-measure`, to: a(TABLE16[i].anchor), label: TABLE16[i].measure }],
});
const p = scene('f3-tep-gap', [
  {
    title: 'Committed is not disbursed',
    kicker: 'Section 3.2.5',
    source: 'Section 3.2.5 · p. 44',
    side: (
      <div className="card k-stats">
        <Stat id="st-disb" value={<F id="tep-ibrd-disb-pct" />} label="of the IBRD commitment disbursed" />
        <Stat value={<F id="tep-gap" />} label="commitment minus disbursement" tone="bad" />
      </div>
    ),
    body: `Against the {tep-ibrd|2} commitment, the closing accounts report IBRD disbursement of **{tep-ibrd-disb|2}**, or {tep-ibrd-disb-pct} of the original amount. The difference is **{tep-gap|2} ({tep-gap-pct})**.

Actual total project cost was {tep-actual-total|2}, {tep-cost-cut|2} below appraisal. The original counterpart allocation of {tep-counterpart|2} and the final amount of approximately {tep-counterpart-final|2} also differ [46, Annex 3; 41, p. v].`,
  },
  {
    title: 'Not automatically a failure',
    kicker: 'Section 3.2.5',
    source: 'Section 3.2.5 · p. 44',
    body: `The unused envelope should not automatically be labeled an implementation failure: **lower steel prices, competition in procurement and reductions in planned activities** all reduced the financing requirement.

IEG refers to approximately **{tep-ieg-cancel} of loan savings cancelled** at closure. This reported cancellation is not a substitute for the {tep-gap|2} calculated difference: the two numbers describe **different accounting concepts** and should not be treated as interchangeable without a full reconciliation of loan-account transactions [41, pp. x, 17].`,
  },
  ...TABLE16.map((_, i) => row(i)),
  {
    title: 'Why the schedule slipped',
    kicker: 'Section 3.2.5',
    source: 'Section 3.2.5 · p. 45',
    body: `The schedule overrun was more directly linked to implementation shortcomings. Selecting and approving **smart-grid technology**, including concerns about taking substations offline, required roughly {smartgrid-years}; Component 2 had made little progress by the {tep-restructure-year} restructuring. Some works were also delayed by bidding-related processing and by compensation and land acquisition, so the project closed {tep-delay-years} later than planned.

IEG nevertheless rated the overall outcome **highly satisfactory** because the principal capacity, efficiency and reliability objectives were substantially achieved [56, pp. 3, 12; 41, pp. x-xi, 17-18].`,
  },
  {
    title: 'Environmental and social issues',
    kicker: 'Section 3.2.5',
    source: 'Section 3.2.5 · p. 45',
    side: (
      <div className="card k-stats">
        <Stat value={<F id="tep-affected-hh" />} label="affected households (approximately)" tone="warn" />
        <Stat value={<F id="tep-relocated-hh" />} label="relocated households" tone="warn" />
      </div>
    ),
    body: `Environmental and social issues remained material. The independent assessment records approximately {tep-affected-hh} affected households, including {tep-relocated-hh} relocated, and notes **unresolved compensation or resettlement cases** subject to post-closure follow-up.

This supports a differentiated assessment: strong engineering and economic results, while safeguards, land access and inter-agency coordination caused important administrative costs. Physical outputs alone did not resolve these institutional constraints [41, pp. x-xi, Appendix B].`,
  },
  {
    title: 'Sustainability beyond the project',
    kicker: 'Section 3.2.5',
    source: 'Section 3.2.5 · p. 45',
    callouts: [{ from: '.k-card .h2', to: a('gauge'), label: 'Tariffs and investment' }],
    body: `Sustainability depends on factors outside the project boundary. IEG warned that NPT's ability to maintain and expand the network depends on **more adequate transmission tariffs** and **timely capital investment**, particularly as variable renewable generation expands.

TEP illustrates the complementary role of finance, technical assistance and managerial capacity, but also the **limits of project-specific investment** when national network planning and tariffs lag demand and generation growth [41, pp. 18-20].`,
  },
]);
export const beats = p.beats;
export default p.View;
