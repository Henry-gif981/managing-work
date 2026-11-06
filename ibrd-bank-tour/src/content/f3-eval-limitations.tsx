import { scene } from './kit';
import { Chip } from '../primitives/bits';

const a = (n: string) => `anchor:f3-eval-limitations:${n}`;
const heads = (on: number) => (
  <div className="chips lim-chips">
    {['Slow disbursement', 'Procedural complexity', 'Counterpart funding', 'Safeguard gaps'].map((t, i) => (
      <Chip key={t} tone={i === on ? 'bad' : undefined}>
        {t}
      </Chip>
    ))}
  </div>
);
const p = scene('f3-eval-limitations', [
  {
    title: 'Slow disbursement',
    source: 'Section 3.4.2 · p. 56',
    aside: heads(0),
    callouts: [{ from: '.k-card .h2', to: a('scales'), label: 'Undisbursed balances' }],
    body: `Neither project used its loan as planned. TEP disbursed **{tep-ibrd-disb-pct}** of its IBRD commitment, although this partly reflected lower costs [46]. CCSEP disbursed nothing in 2017 and 2018 and only about **{disb-2022-pct}** of its loan capital by late 2022 [57]; even at closing it had disbursed about {close-pct} of the original commitment, and **less than half of the IBRD loan** [63, p. ii].

Because IBRD loans carry a commitment fee on undisbursed balances (Section 1.4.2), slow disbursement also raises the effective cost of borrowing.`,
  },
  {
    title: 'Procedural complexity',
    source: 'Section 3.4.2 · p. 56',
    aside: heads(1),
    body: `Projects must satisfy **both Vietnamese and World Bank procedures**.

In TEP, the choice and approval of smart-grid technology took about {smartgrid-years} [41]. In CCSEP, the loan became effective five and a half months late, and {withdrawal-conditions|n} disbursement conditions depended on approvals by the Ministry of Finance and provincial People's Committees [36].`,
  },
  {
    title: 'Counterpart funding',
    source: 'Section 3.4.2 · p. 56',
    aside: heads(2),
    body: `Domestic funding was often **the binding constraint**. CCSEP's provincial allocations began only in {ccsep-budget-start}, which delayed the entire project [57]. In TEP, NPT financed almost all of the capacity-building component, {tep-cb-npt} of {tep-cb-actual} [46].

Where loans are on-lent, provinces also bear real debt, and the PAD warned that **Binh Dinh** could exceed its debt ceiling [36].`,
  },
  {
    title: 'Safeguards vs domestic rules',
    source: 'Section 3.4.2 · p. 56',
    aside: heads(3),
    callouts: [{ from: '.k-card .h2', to: a('compass'), label: 'Land compensation' }],
    body: `**Land compensation** proved the most serious problem. In Nha Trang, only {nt-plans-approved} of {nt-plans} compensation plans had been approved by late 2022, residents rejected a third of the approved plans, two work packages were cancelled, and residents filed a complaint with the Inspection Panel [57; 60]. At closing, only {nt-comp-pct} of affected households in Nha Trang had been compensated [63, p. 19].

TEP also affected about {tep-affected-hh} households, with some cases still unresolved after closing [41]. Domestic land prices and procedures did not always meet the Bank's resettlement standards.`,
  },
]);
export const beats = p.beats;
export default p.View;
