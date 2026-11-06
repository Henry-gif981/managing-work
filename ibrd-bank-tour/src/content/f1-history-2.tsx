import { scene } from './kit';
import { STAGES } from './f1-history-1';

const a = (n: string) => `anchor:f1-history-2:${n}`;
const S = 'Section 1.2 · p. 14';
const p = scene('f1-history-2', [
  {
    kicker: 'Section 1.2 · Stage 3',
    title: 'Crisis and reform',
    source: S,
    focus: ['stages-s3'],
    side: STAGES,
    callouts: [{ from: '.k-card', to: a('era3'), label: '1980s-1990s' }],
    body: `After the 1980s debt crisis, **structural adjustment lending** traded funds for reforms; it helped some countries but was criticized for its social costs. The 1990s added **governance, anti-corruption and safeguards**.`,
  },
  {
    kicker: 'Section 1.2 · Stage 4',
    title: 'The 21st century',
    source: S,
    focus: ['stages-s4'],
    side: STAGES,
    callouts: [{ from: '.k-card', to: a('era4'), label: '2000-present' }],
    body: `The IBRD lent **counter-cyclically** in the {crisis-2008} crisis and COVID-19. Its mission today: **end extreme poverty and boost shared prosperity on a livable planet**, with job creation at its centre [10].`,
  },
  {
    kicker: 'Section 1.2',
    title: 'Same model, wider focus',
    source: S,
    side: STAGES,
    callouts: [{ from: '.k-card', to: a('era4') }],
    body: `After more than {ibrd-age}, the IBRD has grown from a reconstruction bank into a **global development institution**, still **borrowing on capital markets and lending to members**.`,
  },
]);
export const beats = p.beats;
export default p.View;
