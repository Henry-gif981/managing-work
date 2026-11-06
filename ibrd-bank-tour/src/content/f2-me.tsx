import { scene } from './kit';

const to = 'anchor:f2-me:board';
const S = 'Section 2.2.3 · p. 25';
const p = scene('f2-me', [
  {
    title: 'The results framework',
    kicker: 'Section 2.2.3',
    layout: 'right',
    source: S,
    callouts: [{ from: '.k-card', to, label: 'Results framework' }],
    body: `Every IBRD project is monitored against a **results framework** set at appraisal. It defines the **Project Development Objective (PDO)**, outcome and intermediate indicators, baselines and targets.`,
  },
  {
    title: 'Three levels of M&E',
    kicker: 'Section 2.2.3',
    layout: 'right',
    source: S,
    body: `**Monitoring and evaluation (M&E)** works at three levels [27]:

1. **Supervision:** Implementation Status and Results Reports (ISRs).
2. **Completion:** an Implementation Completion and Results Report (ICR).
3. **Independent evaluation:** the Independent Evaluation Group (IEG) validates the ICR.`,
  },
  {
    title: 'Ratings as an early warning',
    kicker: 'Section 2.2.3',
    layout: 'right',
    source: 'Section 2.2.3 · p. 26',
    callouts: [{ from: '.k-card', to, label: 'Ratings' }],
    body: `A downgrade in a project's likelihood of achieving its PDO can lead to **restructuring**, and at completion IEG can **revise the outcome rating** given in the Bank's own ICR [63, p. iii; 64, p. 18].`,
  },
  {
    title: 'The limits of M&E',
    kicker: 'Section 2.2.3',
    layout: 'right',
    source: 'Section 2.2.3 · p. 26',
    body: `Many indicators, such as transmission losses, measure the **whole system**, so some improvements in a transmission project cannot be attributed to the project alone [41]. In another project, the ICR and IEG both rated M&E quality **modest** [63, p. 18; 64, p. 16].`,
  },
]);
export const beats = p.beats;
export default p.View;
