import { scene } from './kit';

const p = scene('f1-ch1-title', [
  {
    layout: 'title',
    kicker: 'Floor 1 · Chapter 1',
    title: 'Chapter 1 · Overview of the IBRD',
    source: 'Chapter 1 · pp. 13-21',
    body: `- **1.1** What is the IBRD?
- **1.2** History and development
- **1.3** Organizational structure
- **1.4** Financing instruments and loan conditions`,
  },
]);
export const beats = p.beats;
export default p.View;
