import { scene } from './kit';

const to = 'anchor:f1-problem:board';
const p = scene('f1-problem', [
  {
    title: 'Research problem',
    source: 'Introduction 2 · p. 5',
    layout: 'right',
    callouts: [{ from: '.k-card .h2', to }],
    body: `Since graduating from IDA, Vietnam has relied more on the IBRD for World Bank financing. However, IBRD loans come with different terms and procedures from the concessional credits Vietnam was used to.

A clear understanding of the IBRD is therefore needed for Vietnam to use this source of finance effectively.`,
  },
  {
    title: 'Four research questions',
    source: 'Introduction 2 · p. 6',
    layout: 'right',
    callouts: [{ from: '.k-card .h2', to }],
    body: `The paper addresses {rq-count|n} research questions:

1. What is the IBRD, and how was it formed and developed?
2. How is the IBRD organized and funded, and on what terms does it lend?
3. How does the IBRD support project financing through financial, technical and training assistance?
4. What results and limitations have selected IBRD-supported projects in Vietnam shown, and what lessons follow for Vietnam?`,
  },
]);
export const beats = p.beats;
export default p.View;
