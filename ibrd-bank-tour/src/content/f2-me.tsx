import { scene } from './kit';
import { Stat, Chip } from '../primitives/bits';
import { F } from '../primitives/Fact';

const to = 'anchor:f2-me:board';
const p = scene('f2-me', [
  {
    title: 'The results framework',
    layout: 'right',
    source: 'Section 2.2.3 · p. 26',
    callouts: [{ from: '.k-card .h2', to, label: 'Results framework' }],
    body: `Every IBRD project is monitored against a results framework set at appraisal. It defines the **project development objective (PDO)**, its outcome indicators, intermediate indicators, baselines and targets.

CCSEP, for example, set {ccsep-indicators|n} key outcome indicators (see Section 3.3.1):`,
    aside: (
      <div className="k-stats">
        <Stat value={<F id="ccsep-beneficiaries" />} label="direct beneficiaries (about)" />
        <Stat value={<F id="ccsep-sewer" />} label="people with sewer connections" />
        <Stat value={<F id="ccsep-cost-recovery" />} label="cost recovery" />
      </div>
    ),
  },
  {
    title: 'Three levels of M&E',
    layout: 'right',
    source: 'Section 2.2.3 · p. 26',
    body: `M&E then works at {me-levels|n} levels:

1. **Supervision:** the Bank prepares regular Implementation Status and Results Reports (ISRs), rating progress towards the PDO and implementation performance [27].
2. **Completion:** at closing, the Bank prepares an Implementation Completion and Results Report (ICR) comparing results with targets.
3. **Independent evaluation:** the Independent Evaluation Group (IEG) validates the ICR and, for selected projects, prepares a Project Performance Assessment Report (PPAR).`,
  },
  {
    title: 'Evidence the borrower can use',
    layout: 'right',
    source: 'Section 2.2.3 · p. 26',
    callouts: [{ from: '.k-card .h2', to, label: 'TEP ratings' }],
    body: `This system produces evidence that the borrower can use. **TEP's PPAR** rated [41]:`,
    aside: (
      <div className="ratings">
        <div>
          <span>Outcome</span>
          <Chip tone="good">
            <F id="tep-ppar-outcome" />
          </Chip>
        </div>
        <div>
          <span>Bank performance</span>
          <Chip tone="good">
            <F id="tep-ppar-bank" />
          </Chip>
        </div>
        <div>
          <span>Quality of M&E</span>
          <Chip tone="navy">
            <F id="tep-ppar-me" />
          </Chip>
        </div>
      </div>
    ),
  },
  {
    title: 'Ratings as an early warning',
    layout: 'right',
    source: 'Section 2.2.3 · p. 26',
    body: `Ratings during implementation also act as an early warning. In {ccsep-downgrade-year}, CCSEP's likelihood of achieving its PDO was downgraded to **{ccsep-2022-rating}**, which led to restructuring. The ICR later rated the outcome **{ccsep-icr-outcome}**, and the IEG review raised it to **{ccsep-ieg-outcome}** [63, p. iii; 64, p. 18] (see Section 3.3.4).`,
    aside: (
      <div className="chips rating-path">
        <Chip tone="bad">
          <F id="ccsep-2022-rating" /> · <F id="ccsep-downgrade-year" />
        </Chip>
        <span>→</span>
        <Chip tone="warn">
          ICR: <F id="ccsep-icr-outcome" />
        </Chip>
        <span>→</span>
        <Chip tone="good">
          IEG: <F id="ccsep-ieg-outcome" />
        </Chip>
      </div>
    ),
  },
  {
    title: 'The limits of M&E',
    layout: 'right',
    source: 'Section 2.2.3 · p. 26',
    callouts: [{ from: '.k-card .h2', to, label: 'System-wide indicators' }],
    body: `M&E has limits. Many indicators, such as transmission losses, measure the whole system rather than the project alone. IEG therefore warned that some of TEP's improvements cannot be attributed to the project alone (see Section 3.2.4).

The CCSEP ICR and IEG both rated M&E quality **{ccsep-me-quality}** [63, p. 18; 64, p. 16], which shows that even completed projects can have weak results frameworks.`,
  },
]);
export const beats = p.beats;
export default p.View;
