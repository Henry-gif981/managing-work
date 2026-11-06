import { scene } from './kit';

const p = scene('f2-ch2-title', [
  {
    layout: 'title',
    kicker: 'Floor 2 · Chapter 2',
    title: 'Chapter 2 · How the IBRD supports project financing',
    source: 'Chapter 2 · pp. 22-29',
    body: `- **2.1** Financial support
- **2.2** Technical support
- **2.3** Training and capacity building
- **2.4** Overall assessment`,
  },
]);
export const beats = p.beats;
export default p.View;
