import { scene } from './kit';
import { Note } from '../primitives/bits';
import { R } from './kit';

const to = 'anchor:f1-objectives:desk';
const p = scene('f1-objectives', [
  {
    title: 'Objective 1 · Mechanisms of IBRD involvement',
    source: 'Introduction 3.1 · p. 6',
    layout: 'right',
    callouts: [{ from: '.k-card .h2', to }],
    body: `The first objective is to examine how the IBRD takes part in financing projects, from raising funds to supporting projects on the ground.

- **Funding side:** how the IBRD mobilizes capital through its member countries' contributions and bond issues on international markets, and how this lets it lend on favorable terms.
- **Lending side:** its main instruments (investment project financing, development policy financing, program-for-results and guarantees) and when each is applied.`,
  },
  {
    title: 'Objective 1 · Following the project cycle',
    source: 'Introduction 3.1 · p. 6',
    layout: 'right',
    body: `The study also follows the IBRD project cycle: identification, preparation, appraisal, negotiation and approval, implementation and supervision, and completion and evaluation.

This shows how the IBRD shares responsibilities with the borrowing government at each stage, and how it works with co-financiers and private investors to mobilize additional capital. The aim is to clarify not only what the IBRD finances but how its involvement shapes the quality and outcomes of projects.`,
  },
  {
    title: 'Objective 2 · Two case studies in Vietnam',
    source: 'Introduction 3.2 · pp. 6-7',
    layout: 'right',
    body: `The second objective is to see how the IBRD's mechanisms work in practice in Vietnam, through two projects:

- **TEP** (Transmission Efficiency Project, {tep-period}): a completed energy project financed mainly by an IBRD loan, with {tep-counterpart} of counterpart funds, clear results and official evaluation reports.
- **CCSEP** (Coastal Cities Sustainable Environment Project, {ccsep-period}): an urban and environment project blending a smaller IBRD loan with an IDA credit and counterpart funds, documented in the completion report, independent review and Inspection Panel case records [61; 63; 64].`,
    aside: (
      <Note>
        <R t="The paper dates TEP {tep-period} here, while Section 1.4.3 says TEP was approved in {tep-approved}: approval year and implementation period." />
      </Note>
    ),
  },
  {
    title: 'Objective 2 · Four criteria',
    source: 'Introduction 3.2 · p. 7',
    layout: 'right',
    body: `Recent IBRD projects approved after IDA graduation, such as those in Binh Duong and the southern waterway network, are mentioned only as context, since their results are not yet available [7; 8].

Both cases are evaluated against {criteria-count|n} criteria: **relevance** to Vietnam's development needs, **effectiveness** in reaching project goals, **efficiency** in using resources and **sustainability** of results. The study also looks at implementation difficulties and how they were handled, to show what IBRD financing can bring after IDA and to draw lessons for future IBRD projects.`,
  },
]);
export const beats = p.beats;
export default p.View;
