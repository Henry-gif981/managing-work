import { scene, R, FocusItem } from './kit';
import { TABLE9 } from '../data/tables';

const a = (n: string) => `anchor:f3-legal:${n}`;
const spine = (
  <div className="card legal-card">
    <ol className="legal-tl" id="t9">
      {TABLE9.map((r) => (
        <FocusItem key={r.id} id={`t9-${r.id}`}>
          <span className="lt-date">
            <R t={r.date} />
          </span>
          <span className="lt-inst">
            <b>{r.inst}</b> <R t={r.cite} />
          </span>
          <span className="lt-rel">
            <R t={r.rel} />
          </span>
        </FocusItem>
      ))}
    </ol>
    <div className="caption">
      <R t="Table 3.1.2. Selected milestones in Vietnam’s regulatory framework for ODA and concessional loans. Source: Authors’ compilation from [49; 50; 51; 52; 53; 54; 55]." />
    </div>
  </div>
);
const row = (i: number) => ({
  layout: 'centre' as const,
  band: 'right' as const,
  title: 'Table 3.1.2 · ODA regulatory milestones',
  label: TABLE9[i].inst,
  source: 'Section 3.1.4 · Table 3.1.2 · p. 32',
  centre: spine,
  focus: [`t9-${TABLE9[i].id}`],
  callouts: [{ from: `#t9-${TABLE9[i].id}`, to: a('timeline'), label: TABLE9[i].inst.split(' and ')[0] }],
});
const p = scene('f3-legal', [
  {
    title: 'Two overlapping systems',
    source: 'Section 3.1.4 · p. 32',
    callouts: [{ from: '.k-card .h2', to: a('timeline'), label: 'Legal timeline' }],
    body: `Multilateral borrowing is implemented within two overlapping systems:

- **Vietnamese public-investment and public-debt rules**: project approval, external-loan administration, on-lending and allocation of counterpart funds.
- **World Bank requirements** in the financing agreement and project documents: eligible expenditure, procurement, financial management, reporting, safeguards and supervision.

A project can run into difficulties where the timing and documentation requirements of these systems do not align.`,
  },
  {
    title: 'Read the law as of its period',
    source: 'Section 3.1.4 · p. 33',
    body: `At TEP's approval in 2014, the overarching ODA and concessional-loan decree was **Decree No. 38/2013/ND-CP** [49]. It was replaced by Decree No. 16/2016/ND-CP [50], and later by Decree No. 56/2020/ND-CP [51].

Decree No. 114/2021/ND-CP, as amended by Decree No. 20/2023/ND-CP, helps explain an earlier phase of ODA administration but should not be presented as the current principal decree [52; 53].`,
  },
  {
    title: 'The current framework',
    source: 'Section 3.1.4 · p. 33',
    body: `As at {legal-as-at}, **Decree No. 242/2025/ND-CP** (effective {decree242-effective}), as amended by **Decree No. 119/2026/ND-CP** (issued {decree119-issued}), forms the principal current decree-level framework [54; 55].

The 2026 amendment contains transitional provisions, so the date on which a project proposal or investment decision was approved matters. Since TEP closed on {tep-closed}, this regime is **contextual**, not a basis for retrospectively judging the project's 2014 legal compliance.`,
  },
  ...TABLE9.map((_, i) => row(i)),
  {
    title: 'Safeguard rules also changed',
    source: 'Section 3.1.4 · p. 33',
    body: `The World Bank's Environmental and Social Framework (ESF) applies to new investment project financing initiated on or after {esf-from} [24]. TEP, initiated before that date and classified as a **Category B** project, was governed by the earlier safeguard policies and related project instruments. Applying the later ESF standards retroactively to the 2014 operation would be methodologically incorrect [45].`,
  },
  {
    title: 'From context to cases',
    source: 'Section 3.1.4 · p. 33',
    callouts: [{ from: '.k-card .h2', to: 'anchor:f3-legal:tep', label: 'Case 1: TEP' }],
    body: `This historical and regulatory context is the basis for assessing the IBRD in practice.

The first case concerns an **energy-transmission investment approved before IDA graduation**, which lets the analysis distinguish the financing mechanism from the timing of Vietnam's transition to IBRD borrowing.`,
  },
]);
export const beats = p.beats;
export default p.View;
