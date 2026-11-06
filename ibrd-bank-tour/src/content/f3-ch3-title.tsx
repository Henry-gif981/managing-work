import { scene } from './kit';

const p = scene('f3-ch3-title', [
  {
    layout: 'title',
    kicker: 'Floor 3 · Chapter 3',
    title: 'Chapter 3 · The IBRD and selected projects in Vietnam',
    source: 'Chapter 3 · pp. 31-63',
    body: `- **3.1** Context of Vietnam-World Bank relations (entrance)
- **3.2** Case study 1: Transmission Efficiency Project (TEP), energy · left half
- **3.3** Case study 2: Coastal Cities Sustainable Environment Project (CCSEP), urban and environment · right half
- **3.4** Overall evaluation (executive office)`,
  },
  {
    title: 'Planned versus actual money',
    kicker: 'Section 3.1',
    source: 'Section 3.1 · p. 30',
    callouts: [{ from: '.k-card .h2', to: 'anchor:f3-ch3-title:aisle', label: 'Two case studies' }],
    body: `In the following analysis, monetary amounts are expressed in **USD**.

**Appraisal figures** refer to planned financing, whereas **amounts at project closing** describe reported expenditure or disbursement. Distinguishing these measures is essential when assessing the IBRD contribution to project financing [45; 46; 41].`,
  },
]);
export const beats = p.beats;
export default p.View;
