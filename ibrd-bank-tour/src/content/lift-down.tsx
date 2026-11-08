import type { Beat, SceneViewProps } from './types';
import { R, SourceTag } from './kit';
import { useEdits } from '../edit/store';

/**
 * Conclusion, shown on the cabin's glass panel while the lift rides down: one beat per part of the
 * paper's Conclusion (pp. 63-65). Display: beat 1 = 3, 2 = 2, 3 = 1, 4 = G, 5 = G with doors open.
 * Decision: the user asked for exactly 5 beats, so beats 1.2 and 3 run longer than ~90 words and use two columns.
 */
interface Part {
  floor: string;
  kicker: string;
  title: string;
  source: string;
  body: string;
}
export const PARTS: Part[] = [
  {
    floor: '3',
    kicker: 'Conclusion 1.1 · Summary of findings',
    title: 'The three pillars of IBRD support',
    source: 'Conclusion 1.1 · p. 58',
    body: `The IBRD is the World Bank Group's lender to **middle-income and creditworthy poorer countries**. It raises funds on capital markets on the strength of its **AAA rating** and lends them on long maturities through three instruments: **IPF, DPF and PforR**.

Its support for project financing rests on three pillars. **Finance** pays for the investment through the project cycle and its disbursement methods. **Technical support** improves project design, policy and monitoring. **Training and capacity building** strengthen the people and institutions that carry out projects. These pillars work as one package, and each depends on the others.`,
  },
  {
    floor: '2',
    kicker: 'Conclusion 1.2 · Summary of findings',
    title: 'Re-evaluating project impacts',
    source: 'Conclusion 1.2 · p. 58',
    body: `The two case studies show both the value and the limits of this package in Vietnam. **TEP** shows what IBRD financing can achieve with a capable implementer: most transmission outputs met or exceeded their targets, operating costs fell, and IEG rated the outcome **{tep-ppar-outcome}**. It also shows that a successful project may still disburse far less than its commitment.

**CCSEP** shows a more mixed picture. Late counterpart funding, weak PMU capacity and resettlement disputes delayed it by {ccsep-delay-months}, led to cancelled funds and a formal complaint, and required more counterpart funding than planned ({close-cp} against {ccsep-cp}). It still met most of its main sanitation targets, and IEG rated its outcome **{ccsep-ieg-outcome}**, but Nha Trang reached only about {nt-target-pct} of its targets [63; 64].

Across both cases, **the binding constraints lay mainly on the domestic side rather than in the availability of IBRD money**.`,
  },
  {
    floor: '1',
    kicker: 'Conclusion 2',
    title: 'Significance of the paper',
    source: 'Conclusion 2 · p. 58',
    body: `The paper brings together the IBRD's organization, lending terms and modes of support in **one framework** and applies it consistently to two Vietnamese projects.

It distinguishes **planned from actual financing** and **IBRD funds from IDA and counterpart funds**, which avoids overstating the IBRD's contribution. Its findings are relevant to Vietnam's new stage of borrowing after IDA graduation and its {umic-year} reclassification as an upper-middle-income economy.`,
  },
  {
    floor: 'G',
    kicker: 'Conclusion 3',
    title: 'Limitations of the research',
    source: 'Conclusion 3 · p. 58',
    body: `The study relies on **secondary data** and could not verify results through field surveys or interviews. Many sources are prepared by the World Bank itself, although independent evaluations by IEG and the Inspection Panel were used where available.

For CCSEP, the ICR (2025) and the IEG review (2026) were used, but their end-of-project figures could not be checked in the field; IEG itself noted that **the restructuring lowered some targets without justification** and that **the beneficiary count may include some double counting** [64, pp. 3, 7].

Finally, two case studies cannot represent the whole IBRD portfolio in Vietnam, and system-wide indicators cannot be attributed to a single project.`,
  },
  {
    floor: 'G · doors open',
    kicker: 'Conclusion 4',
    title: 'Directions for further research',
    source: 'Conclusion 4 · p. 59',
    body: `- Follow **CCSEP after closing**: whether Nha Trang completes the remaining works with counterpart funds under the Post Completion Action Plan, and how the Management Action Plan approved in 2026 is implemented.
- Study **IBRD projects approved after IDA graduation**, such as the Binh Duong water environment project and the southern waterway program.
- Compare IBRD lending with **other multilateral lenders** in Vietnam, such as the Asian Development Bank, to see whether the same constraints apply.
- A **quantitative study of disbursement delays** across the portfolio could measure how much counterpart funding and land acquisition cost Vietnam in commitment fees and lost time.`,
  },
];

export const beats: Beat[] = PARTS.map((p) => ({ label: `${p.floor} · ${p.title}`, source: p.source }));

export default function View({ beat }: SceneViewProps) {
  const bi = Math.min(beat, PARTS.length - 1);
  const edits = useEdits((st) => st.edits);
  const orig = PARTS[bi];
  const p = { ...orig, title: edits[`s:lift-down:${bi}:title`] ?? orig.title, body: edits[`s:lift-down:${bi}:body`] ?? orig.body };
  const long = p.body.length > 700;
  return (
    <div className="glass-panel">
      <div className="card glass enter" key={beat}>
        <div className="glass-head">
          <span className="glass-floor">{p.floor.split(' ')[0]}</span>
          <div>
            <div className="kicker">{p.kicker}</div>
            <div className="h2" data-edit={`s:lift-down:${bi}:title`} data-edit-raw={orig.title} data-edit-label={`Conclusion · part ${bi + 1} · title`}>
              {p.title}
            </div>
          </div>
        </div>
        <div className={long ? 'glass-cols' : ''}>
          <R t={p.body} edit={{ key: `s:lift-down:${bi}:body`, raw: orig.body, label: `Conclusion · part ${bi + 1} · text` }} />
        </div>
        <ol className="glass-steps">
          {PARTS.map((q, i) => (
            <li key={i} className={i === beat ? 'on' : i < beat ? 'done' : ''}>
              <b>{q.floor.split(' ')[0]}</b> {q.title}
            </li>
          ))}
        </ol>
        <SourceTag s={p.source} />
      </div>
    </div>
  );
}
