import { scene } from './kit';

const to = 'anchor:f1-problem:board';
const p = scene('f1-problem', [
  {
    kicker: 'Introduction 2',
    title: 'Research problem',
    layout: 'right',
    source: 'Introduction 2 · p. 9',
    callouts: [{ from: '.k-card', to }],
    body: `Since graduating from IDA, Vietnam relies more on the IBRD. Its loans come with **different terms and procedures** from the concessional credits Vietnam knew, so using them well needs a **clear understanding of the IBRD**.`,
  },
  {
    kicker: 'Introduction 2',
    title: 'Four research questions',
    layout: 'right',
    source: 'Introduction 2 · p. 9',
    callouts: [{ from: '.k-card', to }],
    body: `1. What is the IBRD, and how did it develop?
2. How is it organized and funded, and on what terms does it lend?
3. How does it support projects through **financial, technical and training** assistance?
4. What results, limitations and lessons do IBRD-supported projects in Vietnam show?`,
  },
]);
export const beats = p.beats;
export default p.View;
