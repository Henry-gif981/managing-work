import { scene, ProportionBar, R } from './kit';
import { Stat } from '../primitives/bits';
import { F } from '../primitives/Fact';
import { factValue } from '../data/facts';

const a = (n: string) => `anchor:f3-ccsep-impl:${n}`;
const disb = (
  <div className="card" style={{ width: 1300 }}>
    <ProportionBar
      id="disb"
      parts={[
        { id: 'disb-done', label: 'disbursed by 31 Oct 2022', value: factValue('disb-2022-pct'), color: 'var(--series-2)' },
        { id: 'disb-rest', label: 'of the original loan capital not yet disbursed', value: 100 - factValue('disb-2022-pct'), color: 'var(--surface-2)', text: 'var(--wb-navy)' },
      ]}
    />
    <div className="caption" style={{ marginTop: 8 }}>
      <R t="IBRD {disb-ibrd-2022} + IDA {disb-ida-2022} ≈ {disb-2022} of {ccsep-wb}; PAD projection by end FY2022: {pad-disb-fy22} [57]." />
    </div>
  </div>
);
const p = scene('f3-ccsep-impl', [
  {
    title: 'Slower than planned',
    kicker: 'Section 3.3.3',
    layout: 'right',
    source: 'Section 3.3.3 · p. 50',
    callouts: [{ from: '.k-card .h2', to: a('tank'), label: 'CCSEP works' }],
    body: `Implementation was slower than planned in both timeline and disbursement. The financing agreement became effective on {ccsep-effective}, **about five and a half months behind** the original schedule of {ccsep-effective-plan}, and the loan closing date had to be **extended by {ccsep-extension}**, from {ccsep-closing-plan} to {ccsep-closing-date} (Table 3.3.1) [36; 59; 57].`,
  },
  {
    layout: 'centre',
    band: 'right',
    title: 'Disbursement by late 2022',
    source: 'Section 3.3.3 · p. 50',
    centre: disb,
    focus: ['disb-done'],
    callouts: [{ from: '#disb-done', to: a('tank'), label: 'About 36%' }],
    body: `The PAD projected {pad-disb-fy22} disbursed by end FY2022; by late 2022 the IBRD had disbursed only {disb-ibrd-2022} and IDA {disb-ida-2022}, about **{disb-2022} = {disb-2022-pct} of the original loan capital**. The root cause was **counterpart funding**: allocations started only in July 2019, so nothing was disbursed in 2017 and 2018, and compensation, site clearance and contractor capacity kept slowing progress.`,
  },
  {
    title: 'Capital available, not disbursed',
    kicker: 'Section 3.3.3',
    layout: 'right',
    source: 'Section 3.3.3 · pp. 50-51',
    side: (
      <div className="card k-stats">
        <Stat value={<F id="contracts-signed" />} label="signed contracts" />
        <Stat value={<F id="physical-pct" />} label="physical volume of contract value (about)" tone="warn" />
        <Stat id="st-close" value={<F id="close-pct" />} label="of US$236.2 million disbursed by closing (about)" />
      </div>
    ),
    body: `Signed contracts reached {contracts-signed}, but physical construction was only about {physical-pct} of contract value [57]. **World Bank capital was not lacking but could not be disbursed** because of bottlenecks in counterpart funding and contract execution.

These figures are as of {disb-2022-date}, the date of the Restructuring Paper. By loan closing on {ccsep-closing-date}, disbursements had reached {close-wb} (IBRD {close-ibrd}; IDA {close-ida}), about {close-pct} of the original commitment of {ccsep-wb} [63, p. ii].`,
  },
  {
    title: 'Technical support and ratings',
    kicker: 'Section 3.3.3',
    layout: 'right',
    source: 'Section 3.3.3 · p. 51',
    body: `CCSEP was **Category A** for environmental and social safeguards, subject to involuntary resettlement policy OP 4.12 and procurement under World Bank guidelines [36]. The Bank supported it through appraisal, supervision, progress ratings and restructuring decisions.

At the end of 2022, implementation progress was rated **Moderately Satisfactory**, but the likelihood of achieving the development objective was downgraded to **Moderately Unsatisfactory**. Procurement, financial management and safeguards were all Moderately Satisfactory, and legal covenants were fully complied with [57].`,
  },
  {
    title: 'Why it was delayed',
    kicker: 'Section 3.3.3',
    layout: 'right',
    source: 'Section 3.3.3 · p. 51',
    callouts: [{ from: '.k-card .h2', to: a('nha-trang'), label: 'Nha Trang' }],
    body: `The delay had several causes:

- slow site clearance and compensation, particularly in **Nha Trang and Phan Rang**
- weak consultant and contractor capacity
- major storms in {storms-year}
- the COVID-19 pandemic in {covid-years}
- weak contract management: delayed contract extensions, payments and completion certificates`,
  },
  {
    title: 'Component 3: resettlement',
    kicker: 'Section 3.3.3',
    layout: 'right',
    source: 'Section 3.3.3 · p. 51',
    callouts: [{ from: '.k-card .h2', to: a('nha-trang'), label: 'Ngoc Hiep site' }],
    body: `Component 3 had the most significant bottlenecks. The PAD estimated **{pad-affected-hh} affected households**, of which {pad-relocate-hh} required relocation [36].

In **Nha Trang**, the Ngoc Hiep resettlement site was only in phase 1, and only **{nt-plans-approved} of {nt-plans} compensation plans** had been approved. A third of the approved plans were rejected by residents, halting most Component 2 contracts. Package NT-2.1 was partly and NT-2.2 fully cancelled, reducing affected households by approximately {nt-affected-cut} and relocated households by about {nt-relocated-cut}.`,
  },
  {
    title: 'Phan Rang, Dong Hoi, Quy Nhon',
    kicker: 'Section 3.3.3',
    layout: 'right',
    source: 'Section 3.3.3 · pp. 51-52',
    callouts: [{ from: '.k-card .h2', to: a('phan-rang'), label: 'Phan Dang Luu site' }],
    body: `In **Phan Rang**, the Phan Dang Luu resettlement site was completed, with {pr-plans-approved} of {pr-plans} compensation plans approved, while **Dong Hoi and Quy Nhon** largely completed their resettlement activities [57].`,
  },
  {
    title: 'Training and capacity building',
    kicker: 'Section 3.3.3',
    layout: 'right',
    source: 'Section 3.3.3 · p. 52',
    body: `Plans relied on PMUs inherited from CCESP, except Phan Rang, which set up a new PMU with **{phanrang-from-oda|n} of its {phanrang-staff|n} staff** transferred from water-sector ODA units. Support included training in procurement, financial management and safeguards; internal audit teams; financial management manuals; governance and integrity action plans; and technical assistance from **PPIAF ({ppiaf})** and **GIZ** for reform under Decree No. {decree-80}.

Goals: a service management unit per city, **{ccsep-contracts-goal|n} performance-based service contracts**, {tariff-roadmaps|n} tariff roadmaps and {connection-policies|n} connection policies [36].`,
  },
  {
    title: 'PMU capacity and the Bank’s advice',
    kicker: 'Section 3.3.3',
    layout: 'right',
    source: 'Section 3.3.3 · p. 52',
    body: `In practice, **PMU capacity remained a key cause of delay**. After restructuring, the Bank recommended:

- adding qualified staff
- better coordination between PMUs and provincial departments
- amending contract terms with contractors and consultants
- more frequent supervision
- monthly progress meetings plus biweekly site clearance meetings [57]`,
  },
  {
    title: 'Institutions: late, not abandoned',
    kicker: 'Section 3.3.3',
    layout: 'right',
    source: 'Section 3.3.3 · p. 52',
    callouts: [{ from: '.k-card .h2', to: a('tank'), label: 'Service contracts' }],
    body: `Public Service Management Units (PSMUs) were set up in each city. Drainage and wastewater assets went to People's Committees and road assets to transport departments; connection policies and septic tank sludge plans were issued and tariff roadmaps approved, with implementation varying by locality.

As of late 2022, performance-based contracts were largely unexecuted, except at the **Nha Trang wastewater treatment plant**. By closing, **all {ccsep-contracts|n} contracts had been signed and were in operation**: the reforms were completed late rather than abandoned [63, Table 5].`,
  },
  {
    title: 'Three forms of support, one bottleneck',
    kicker: 'Section 3.3.3',
    layout: 'right',
    source: 'Section 3.3.3 · p. 52',
    body: `The three forms of support complemented one another but hit the same bottleneck. Bank funds could not be disbursed while counterpart funding arrived late; technical support identified resettlement risks early and addressed them through restructuring, but weak PMUs slowed compensation and contracts; training bore fruit only with enough staff and ready contracts.

By late 2022: about {disb-2022-pct} disbursed, about {ccsep-cancelled} cancelled, Nha Trang scaled back, an {ccsep-extension} extension. At closing in June 2024, about {close-pct} disbursed, and the IBRD loan only {close-ibrd} of {ccsep-ibrd} [63, p. ii].`,
  },
  {
    title: 'The IBRD in a blended package',
    kicker: 'Section 3.3.3',
    layout: 'right',
    source: 'Section 3.3.3 · p. 52',
    callouts: [{ from: '.k-card .h2', to: a('bridge'), label: 'Component 2' }],
    body: `The case shows the **limited weight of the IBRD within a blended package**. The IBRD loan was only {ccsep-ibrd-pct} of planned cost ({ibrd-share-adj} after adjustment) and fully financed Component 2, while the larger IDA credit financed the sanitation infrastructure [36, Annex 2, Table 2.1; 57].`,
  },
]);
export const beats = p.beats;
export default p.View;
