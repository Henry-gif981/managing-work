import { scene, R, detail } from './kit';
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
    caption={<R t="Table 3.2.7. TEP financing gap: definitions and derived comparisons (million USD). Source: Authors’ compilation and calculations from [46, Annex 3, Table 3.2; 41, pp. v, x, 17]." />}
  />
);
const row = (i: number) => ({
  layout: 'centre' as const,
  title: 'Table 3.2.7 · The financing gap',
  label: TABLE16[i].measure,
  source: 'Section 3.2.5 · Table 3.2.7 · p. 42',
  centre: table,
  focus: [`t16-${TABLE16[i].id}`],
  callouts: [{ from: `#t16-${TABLE16[i].id}-measure`, to: a(TABLE16[i].anchor), label: TABLE16[i].measure }],
});
const p = scene('f3-tep-gap', [
  {
    title: 'Committed Is Not Disbursed',
    kicker: 'Section 3.2.5',
    source: 'Section 3.2.5 · p. 41',
    // the comparison replaces Table 3.2.7 in the main flow (the full table stays in Details)
    side: (
      <div className="card gap-compare" id="gap-compare">
        <div className="gc-row">
          <span className="gc-label">Committed</span>
          <span className="gc-bar">
            <i style={{ width: '100%' }} className="gc-commit" />
          </span>
          <b>
            <F id="tep-ibrd" fixed={2} />
          </b>
        </div>
        <div className="gc-row">
          <span className="gc-label">Disbursed</span>
          <span className="gc-bar">
            <i style={{ width: '63.7%' }} className="gc-disb" />
          </span>
          <b>
            <F id="tep-ibrd-disb" fixed={2} />
          </b>
        </div>
        <div className="gc-note">
          <F id="tep-ibrd-disb-pct" /> of the IBRD commitment <R t="[46, Annex 3]" />
        </div>
      </div>
    ),
    body: `Although IBRD committed USD 500 million, actual disbursement reached only USD 318.53 million, equivalent to 63.7 percent of the original commitment [46, Annex 3; 41, p. v].`,
  },
  {
    title: 'Not Automatically a Failure',
    kicker: 'Section 3.2.5',
    source: 'Section 3.2.5 · p. 41',
    body: `However, this difference does not necessarily represent wasted financing. Procurement savings and adjustments to project activities also reduced funding requirements [41, pp. x, 17].`,
  },
  // Table 3.2.7 repeats numbers shown before: detail beats
  ...detail(...TABLE16.map((_, i) => row(i))),
  {
    title: 'Why the Schedule Slipped',
    kicker: 'Section 3.2.5',
    source: 'Section 3.2.5 · p. 42',
    body: `The project was delayed by two years, partly because preparing and approving smart-grid technologies took longer than expected [56, pp. 3, 12; 41, pp. x-xi, 17-18].`,
  },
  {
    title: 'Environmental and Social Issues',
    kicker: 'Section 3.2.5',
    source: 'Section 3.2.5 · p. 42',
    side: (
      <div className="card k-stats">
        <Stat value={<F id="tep-affected-hh" />} label="affected households (approximately)" tone="warn" />
        <Stat value={<F id="tep-relocated-hh" />} label="relocated households" tone="warn" />
      </div>
    ),
    body: `Land acquisition, compensation and resettlement issues also created implementation difficulties in some project areas [41, pp. x-xi, Appendix B].`,
  },
  // sustainability is assessed in scene 46: detail beat
  ...detail({
    title: 'Sustainability beyond the project',
    kicker: 'Section 3.2.5',
    source: 'Section 3.2.5 · p. 42',
    callouts: [{ from: '.k-card .h2', to: a('gauge'), label: 'Tariffs and investment' }],
    body: `Sustainability depends on factors outside the project boundary. IEG warned that NPT's ability to maintain and expand the network depends on **more adequate transmission tariffs** and **timely capital investment**, particularly as variable renewable generation expands.

TEP illustrates the complementary role of finance, technical assistance and managerial capacity, but also the **limits of project-specific investment** when national network planning and tariffs lag demand and generation growth [41, pp. 18-20].`,
  }),
]);
export const beats = p.beats;
export default p.View;
