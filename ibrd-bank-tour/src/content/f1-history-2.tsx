import { scene } from './kit';
import { STAGES } from './f1-history-1';

const a = (n: string) => `anchor:f1-history-2:${n}`;
const p = scene('f1-history-2', [
  {
    title: 'Crisis and reform',
    kicker: 'Section 1.2 · Stage 3',
    source: 'Section 1.2 · pp. 12-13',
    focus: ['stages-s3'],
    side: STAGES,
    callouts: [{ from: '.k-card .h2', to: a('era3'), label: '1980s-1990s' }],
    body: `**{stage3}.** The debt crisis of the {debt-crisis} hit many developing countries hard. In response, the IBRD introduced **structural adjustment lending**, which provided funds in exchange for economic reforms such as reducing budget deficits and opening markets. These programs helped some countries stabilize but were also criticized for their social costs.

In the {governance-decade}, the IBRD paid more attention to governance, anti-corruption, the environment and social safeguards.`,
  },
  {
    title: 'The 21st century',
    kicker: 'Section 1.2 · Stage 4',
    source: 'Section 1.2 · p. 13',
    focus: ['stages-s4'],
    side: STAGES,
    callouts: [{ from: '.k-card .h2', to: a('era4'), label: '2000-present' }],
    body: `**{stage4}.** The IBRD aligned its work with global development goals and played a counter-cyclical role, sharply increasing lending during the {crisis-2008} global financial crisis and the COVID-19 pandemic. In {wbg-goals-year}, the World Bank Group adopted two goals: ending extreme poverty and boosting shared prosperity.

Through its reform process, the IBRD has expanded its mission to global challenges such as climate change. Today its mission is to end extreme poverty and boost shared prosperity on a livable planet, with job creation at its center [10].`,
  },
  {
    title: 'Same model, wider focus',
    source: 'Section 1.2 · p. 13',
    side: STAGES,
    callouts: [{ from: '.k-card .h2', to: a('era4') }],
    body: `After more than {ibrd-age}, the IBRD has changed from a reconstruction bank for Europe into a global development institution.

Its funding model of borrowing on capital markets and lending to member countries has stayed the same, while its focus has steadily widened to meet new development needs.`,
  },
]);
export const beats = p.beats;
export default p.View;
