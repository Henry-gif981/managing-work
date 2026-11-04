import { scene, R } from './kit';
import { DataTable } from '../primitives/DataTable';
import { Chart } from '../primitives/Chart';
import { Stat } from '../primitives/bits';
import { F } from '../primitives/Fact';
import { TABLE14, FIGURES } from '../data/tables';
import { factValue } from '../data/facts';

const a = (n: string) => `anchor:f3-tep-outputs:${n}`;
const combo = (
  <div className="combo">
    <Chart
      id="f3o"
      kind="hbar-target"
      width={760}
      height={420}
      categories={FIGURES.fig3.categories}
      series={[{ name: 'Achieved / target', values: FIGURES.fig3.values.map(factValue), color: 'var(--series-2)' }]}
      target={100}
      max={230}
      format={(v) => `${v.toFixed(1)}%`}
      caption={<R t="Figure 3. TEP output achievement relative to original results targets (%). Source: calculated by the authors from [41, p. 8]. 100% means the original output target was met, not that all project-wide economic benefits were realised." />}
    />
    <DataTable
      id="t14"
      width={560}
      columns={[
        { key: 'ind', label: 'Indicator' },
        { key: 'target', label: 'Target', align: 'right' },
        { key: 'actual', label: 'Actual', align: 'right' },
      ]}
      rows={TABLE14.map((r) => ({ id: r.id, cells: { ind: r.ind, target: <F id={r.target} />, actual: <F id={r.actual} /> } }))}
      caption={<R t="Table 14. Selected physical outputs [41, pp. viii–ix, 8]." />}
    />
  </div>
);
const bar = (i: number, body: string) => ({
  layout: 'centre' as const,
  title: 'Table 14 · Figure 3 · Physical outputs',
  label: TABLE14[i].ind,
  source: 'Section 3.2.4 · Table 14 · Figure 3 · p. 41',
  centre: combo,
  focus: [`f3o-0-${i}`, `t14-${TABLE14[i].id}`],
  callouts: [{ from: `#f3o-0-${i}`, to: a(TABLE14[i].anchor), label: TABLE14[i].ind }],
  body,
});
const p = scene('f3-tep-outputs', [
  {
    title: 'Physical outputs',
    kicker: 'Section 3.2.4',
    source: 'Section 3.2.4 · p. 41',
    callouts: [{ from: '.k-card .h2', to: a('new-lines'), label: 'New lines' }],
    body: `The evaluation record supports a favourable assessment of the main physical outputs. IEG reported **{tep-new-lines}** of new high-voltage lines and **{tep-rehab}** of rehabilitated lines, against targets of {tep-new-lines-target} and {tep-rehab-target}. A total of **{tep-mw}** of transformer capacity was installed against {tep-mw-target}.

Five 500-kV substations were upgraded with smart-grid technology, meeting the target; the project achieved {tep-220|n} of {tep-220-target|n} targeted 220-kV upgrades. The omitted **Ninh Binh** upgrade was cancelled because that substation was scheduled for dismantling [56, pp. 2-3; 41, pp. viii-ix, 8].`,
  },
  bar(0, `New transmission lines: {tep-new-lines} against {tep-new-lines-target} = **{tep-new-lines-pct}**.`),
  bar(1, `Rehabilitated transmission lines: {tep-rehab} against {tep-rehab-target} = **{tep-rehab-pct}**.`),
  bar(2, `Additional transformer capacity: {tep-mw} against {tep-mw-target} = **{tep-mw-pct}**.`),
  bar(3, `500-kV smart-grid substations: {tep-500|n} of {tep-500-target|n} = **{tep-500-pct|n}.0%**, the original target met.`),
  bar(4, `220-kV smart-grid substations: {tep-220|n} of {tep-220-target|n} = **{tep-220-pct}**. The Ninh Binh upgrade was cancelled because the substation was scheduled for dismantling.`),
  {
    title: 'Capacity and electricity transmitted',
    kicker: 'Section 3.2.4',
    source: 'Section 3.2.4 · p. 42',
    side: (
      <div className="card k-stats">
        <Stat id="st-cap" value={<F id="tep-capacity-2023" />} label="rise in transmission capacity vs baseline, March 2023 (almost 80% at closing)" tone="good" />
        <Stat value={<F id="npt-twh-2018" />} label="NPT system, 2018" />
        <Stat value={<F id="npt-twh-2021" />} label="2021" />
        <Stat value={<F id="npt-twh-2022" />} label="2022" />
      </div>
    ),
    callouts: [{ from: '#st-cap', to: a('transformer-capacity'), label: 'Capacity' }],
    body: `IEG reported that transmission capacity in the project areas had risen by almost {tep-capacity-closing} by closing and by {tep-capacity-2023} relative to the baseline by March 2023, after remaining work was completed.

For the broader NPT system, electricity transmitted was {npt-twh-2018} in 2018, {npt-twh-2021} in 2021 and {npt-twh-2022} in 2022. This national series is useful context but **not a measure of electricity supplied solely because of TEP** [41, pp. viii-ix, 8-9].`,
  },
]);
export const beats = p.beats;
export default p.View;
