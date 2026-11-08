import { scene } from './kit';

const p = scene('f3-ch3-title', [
  {
    layout: 'title',
    kicker: 'Floor 3 · Chapter 3',
    title: 'Vietnam and the IBRD in practice',
    source: 'Chapter 3 · pp. 31-63',
    body: `- **3.1** Context: Vietnam–World Bank relations
- **3.2** Case study 1: TEP (energy)
- **3.3** Case study 2: CCSEP (urban and environment)
- **3.4** Overall evaluation`,
  },
]);
export const beats = p.beats;
export default p.View;
