import { scene } from './kit';

const to = 'anchor:f1-what:counter';
const p = scene('f1-what', [
  {
    title: 'Definition',
    source: 'Section 1.1.1 · p. 10',
    callouts: [{ from: '.k-card .h2', to, label: 'Information' }],
    body: `The International Bank for Reconstruction and Development (IBRD) is a global development cooperative owned by {ibrd-members} member countries. It is one of the {wbg-count|n} institutions of the World Bank Group and, together with IDA, forms what is commonly called the World Bank [9].

Although it is called a bank, the IBRD does not aim to maximize profit like a commercial bank. Instead, it raises funds on international capital markets and lends them to member countries for development purposes.`,
  },
  {
    title: 'Role and mission',
    source: 'Section 1.1.1 · p. 10',
    body: `Its role goes beyond lending: it provides loans, guarantees, risk management products and advisory services, and it also coordinates responses to regional and global challenges.

The IBRD shares the World Bank Group's mission: **to end extreme poverty and boost shared prosperity on a livable planet**. Job creation is now seen as central to this mission and a key driver of sustainable development. In practice, the IBRD supports projects and reforms that help countries grow in a sustainable and inclusive way.`,
  },
  {
    title: 'Borrowers and eligibility',
    source: 'Section 1.1.1 · p. 10',
    callouts: [{ from: '.k-card .h2', to, label: 'Who can borrow' }],
    body: `The IBRD's main borrowers are **middle-income countries**. It also lends to creditworthy poorer countries that are also eligible for IDA support, often through a mix of IBRD and IDA funding.

Borrowers are usually national governments, but the IBRD can also lend to public enterprises or local authorities, **provided the national government guarantees the loan**. Eligibility depends mainly on income level and creditworthiness. As a country grows richer, it moves from IDA to IBRD lending, as Vietnam did after {scope-graduation}.`,
  },
]);
export const beats = p.beats;
export default p.View;
