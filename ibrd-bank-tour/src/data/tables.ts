/**
 * Text of the paper's tables and lists, cell by cell (numbers are fact ids in {braces}).
 * Pure data so `npm run check-facts` can count rows. Rendered by src/content/*.
 */
export const TABLE1 = [
  { id: 'ibrd', inst: 'IBRD', year: '{ibrd-founded}', clients: 'Governments of middle-income and creditworthy poorer countries', act: 'Loans, guarantees, risk management, advisory services', funds: 'Bonds on international capital markets, member capital' },
  { id: 'ida', inst: 'IDA', year: '{ida-founded}', clients: 'Governments of the poorest countries', act: 'Grants and very low-interest or interest-free loans', funds: 'Contributions from donor countries' },
  { id: 'ifc', inst: 'IFC', year: '{ifc-founded}', clients: 'Private enterprises in developing countries', act: 'Loans, equity investment, advisory services', funds: 'Own capital and market borrowing' },
  { id: 'miga', inst: 'MIGA', year: '{miga-founded}', clients: 'Foreign investors and lenders', act: 'Insurance against political risks such as war or expropriation', funds: 'Member capital and premiums' },
  { id: 'icsid', inst: 'ICSID', year: '{icsid-founded}', clients: 'Governments and foreign investors', act: 'Settling investment disputes through arbitration and conciliation', funds: 'Contributions from the World Bank and fees' },
];

export const TABLE2 = [
  { id: 'ipf', inst: 'Investment Project Financing (IPF)', what: 'Ring-fenced project activities: works, goods, consulting services', against: 'Eligible expenditures actually incurred', suited: 'Infrastructure and other projects with a defined scope' },
  { id: 'dpf', inst: 'Development Policy Financing (DPF)', what: 'A program of policy and institutional actions', against: 'Completion of agreed prior actions', suited: 'Sector or economy-wide reforms; budget support' },
  { id: 'pforr', inst: 'Program-for-Results (PforR)', what: "Part of a government's own expenditure program", against: 'Verified achievement of Disbursement-Linked Indicators', suited: 'Programs where results can be measured and verified' },
];

export const TABLE3 = [
  { id: 'rate', term: 'Interest rate', set: 'Reference rate (SOFR for USD) + variable spread', src: '[19]' },
  { id: 'final', term: 'Final maturity', set: 'Up to {final-mat-new}; up to {final-mat-max} for some projects', src: '[20; 21]' },
  { id: 'avg', term: 'Average maturity', set: 'Up to {avg-mat-new}', src: '[20]' },
  { id: 'sml', term: 'Short Maturity Loan', set: '{sml-maturity|n}-year final maturity, {sml-discount} spread discount', src: '[22]' },
  { id: 'front', term: 'Front-end fee', set: '{front-end-fee} of the committed amount, charged once', src: '[18]' },
  { id: 'commit', term: 'Commitment fee', set: '{commitment-fee} a year on the undisbursed balance, from {commitment-fee-start} after signing', src: '[18]' },
];

export const ESS = [
  'Assessment and Management of Environmental and Social Risks and Impacts',
  'Labor and Working Conditions',
  'Resource Efficiency and Pollution Prevention and Management',
  'Community Health and Safety',
  'Land Acquisition, Restrictions on Land Use and Involuntary Resettlement',
  'Biodiversity Conservation and Sustainable Management of Living Natural Resources',
  'Indigenous Peoples',
  'Cultural Heritage',
  'Financial Intermediaries',
  'Stakeholder Engagement and Information Disclosure',
];

export const TABLE4 = [
  { id: 's1', stage: '1. Identification', act: 'Bank and government agree on a project concept consistent with the Country Partnership Framework', lead: 'Borrower and Bank', doc: 'Project Concept Note, Project Information Document' },
  { id: 's2', stage: '2. Preparation', act: 'Feasibility studies, technical design, environmental and social instruments, procurement plan', lead: 'Borrower, with Bank advice', doc: 'Feasibility study, ESIA, resettlement plan' },
  { id: 's3', stage: '3. Appraisal', act: 'Bank reviews technical, economic, financial, institutional and E&S aspects', lead: 'Bank', doc: 'Project Appraisal Document (PAD)' },
  { id: 's4', stage: '4. Negotiation and Board approval', act: 'Legal agreements negotiated; Board of Executive Directors approves; loan signed and declared effective', lead: 'Borrower and Bank', doc: 'Loan Agreement' },
  { id: 's5', stage: '5. Implementation and supervision', act: 'Borrower carries out the project; Bank supervises and may restructure', lead: 'Borrower; Bank supervises', doc: 'Implementation Status and Results Report (ISR)' },
  { id: 's6', stage: '6. Completion and evaluation', act: 'Results assessed; lessons recorded; independent validation', lead: 'Bank, then IEG', doc: 'Implementation Completion and Results Report (ICR)' },
];

export const TABLE5 = [
  { id: 'advance', method: 'Advance', how: 'Bank deposits funds in a borrower’s designated account; the borrower pays eligible expenses and documents them later', use: 'Many small and recurring payments' },
  { id: 'reimb', method: 'Reimbursement', how: 'Borrower pays first from its own funds; the Bank then refunds eligible expenditures', use: 'Expenses the borrower can pre-finance' },
  { id: 'direct', method: 'Direct payment', how: 'Bank pays a supplier, contractor or consultant directly at the borrower’s request', use: 'Large contract payments' },
  { id: 'special', method: 'Special commitment', how: 'Bank commits to pay a third party under a letter of credit opened by a commercial bank', use: 'Imported goods and equipment' },
];

export const TABLE6 = [
  { id: 'tep-asset', project: 'TEP', activity: 'Asset management system for NPT', position: 'Fully operational; used for investment and maintenance decisions' },
  { id: 'tep-tariff', project: 'TEP', activity: 'Cost-reflective transmission tariff, IFRS reporting, testing laboratory', position: 'Carried out mainly with NPT/EVN funds' },
  { id: 'ccsep-psmu', project: 'CCSEP', activity: 'Public Service Management Units in each city', position: 'Established' },
  { id: 'ccsep-tariff', project: 'CCSEP', activity: 'Wastewater tariff roadmaps, household connection policies', position: 'Approved or issued; implementation varies by city' },
  { id: 'ccsep-contracts', project: 'CCSEP', activity: 'Performance-based service contracts', position: 'Largely not yet in use as of {ccsep-contracts-check}, except at the Nha Trang treatment plant; all {ccsep-contracts|n} contracts signed and in operation by closing in {ccsep-closing}' },
];

export const TABLE7 = [
  { id: 'prep', stage: 'Preparation and appraisal', fin: 'Loan size, instrument and terms agreed; Project Preparation Advance if needed', tech: 'Feasibility, economic analysis, safeguard instruments, results framework', train: 'Assessment of the implementing agency’s capacity' },
  { id: 'impl', stage: 'Implementation', fin: 'Disbursement against eligible expenditures or results', tech: 'Supervision, ISRs, restructuring when needed', train: 'PMU training in procurement, financial management and safeguards' },
  { id: 'after', stage: 'Completion and after', fin: 'Loan repayment; savings cancelled', tech: 'ICR and IEG evaluation; lessons for new projects', train: 'Systems and institutions left in place (e.g. TEP’s asset management system)' },
];

// ======================= Chapter 3 =======================
/** Table 8 (p. 33): TEP vs SAHEP at appraisal */
export const TABLE8 = [
  { id: 'id', ind: 'World Bank project ID', tep: '{tep-id}', sahep: '{sahep-id}' },
  { id: 'approval', ind: 'Approval date', tep: '{tep-approval}', sahep: '{sahep-approval}' },
  { id: 'inst', ind: 'Financing institution', tep: 'IBRD (loan {tep-loan-no})', sahep: 'IDA credit' },
  { id: 'wb', ind: 'World Bank financing (million USD)', tep: '{tep-ibrd|2}', sahep: '{sahep-ida|2}' },
  { id: 'cp', ind: 'Counterpart financing (million USD)', tep: '{tep-counterpart|2}', sahep: '{sahep-counterpart|2}' },
  { id: 'total', ind: 'Total appraisal cost (million USD)', tep: '{tep-total|2}', sahep: '{sahep-total|2}' },
  { id: 'sector', ind: 'Primary sector', tep: 'Electricity transmission', sahep: 'Higher education' },
];

/** Table 9 (p. 34): milestones of the ODA regulatory framework */
export const TABLE9 = [
  { id: 'd38', inst: 'Decree 38/2013/ND-CP', date: 'Effective 6 June 2013', rel: 'Principal ODA framework at TEP approval in 2014', cite: '[49]' },
  { id: 'd16', inst: 'Decree 16/2016/ND-CP', date: 'Effective 2 May 2016', rel: 'Replaced Decree 38/2013; historical implementation period', cite: '[50]' },
  { id: 'd56', inst: 'Decree 56/2020/ND-CP', date: 'Effective 25 May 2020', rel: 'Replaced Decree 16/2016; pre-2021 ODA framework', cite: '[51]' },
  { id: 'd114', inst: 'Decree 114/2021/ND-CP and Decree 20/2023/ND-CP', date: '2021-9 September 2025', rel: 'Subsequent ODA framework; superseded', cite: '[52; 53]' },
  { id: 'd242', inst: 'Decree 242/2025/ND-CP', date: 'Effective {decree242-effective}', rel: 'Current principal decree as at {legal-as-at}', cite: '[54]' },
  { id: 'd119', inst: 'Decree 119/2026/ND-CP', date: 'Issued {decree119-issued}; effective from 1 January 2026 (retroactive)', rel: 'Amends Decree 242/2025; includes transition rules', cite: '[55]' },
];

/** Table 10 (p. 36): TEP profile */
export const TABLE10 = [
  { id: 'name', item: 'Project name / ID', info: 'Transmission Efficiency Project (TEP) / {tep-id}' },
  { id: 'loan', item: 'Loan number / instrument', info: '{tep-loan-no} / Investment Project Financing' },
  { id: 'borrower', item: 'Borrower / responsible agency', info: 'Socialist Republic of Viet Nam / NPT (EVN subsidiary)' },
  { id: 'dates', item: 'Approval / effectiveness', info: '{tep-approval} / {tep-effective}' },
  { id: 'closing', item: 'Original / actual closing', info: '{tep-closing-orig} / {tep-closed}' },
  { id: 'ibrd', item: 'Appraisal IBRD loan', info: 'USD {tep-ibrd|2} million' },
  { id: 'cp', item: 'Appraisal borrower contribution', info: 'USD {tep-counterpart|n} million' },
  { id: 'total', item: 'Appraisal total project cost', info: 'USD {tep-total|n} million' },
  { id: 'actual', item: 'Actual total project cost at closing', info: 'USD {tep-actual-total|n} million' },
];

/** Table 11 (p. 37): TEP cost by component, million USD */
export const TABLE11 = [
  { id: 'c1', comp: 'Enhancing Transmission Infrastructure', app: 'tep-c1-app', act: 'tep-c1-act', pct: 'tep-c1-pct' },
  { id: 'c2', comp: 'Developing Smart Grid Network', app: 'tep-c2-app', act: 'tep-c2-act', pct: 'tep-c2-pct' },
  { id: 'c3', comp: 'Capacity Building', app: 'tep-c3-app', act: 'tep-c3-act', pct: 'tep-c3-pct' },
  { id: 'fee', comp: 'Front-end fee', app: 'tep-fee', act: 'tep-fee', pct: 'tep-fee-pct' },
  { id: 'total', comp: 'Total project cost', app: 'tep-total', act: 'tep-actual-total', pct: 'tep-total-pct' },
];

/** Table 12 (p. 37): TEP financing by source, million USD */
export const TABLE12 = [
  { id: 'c1', comp: '1. Transmission infrastructure', appT: 'tep-c1-app', actT: 'tep-c1-act', appI: 'tep-c1-ibrd-app', actI: 'tep-c1-ibrd-act' },
  { id: 'c2', comp: '2. Smart-grid network', appT: 'tep-c2-app', actT: 'tep-c2-act', appI: 'tep-c2-ibrd-app', actI: 'tep-c2-ibrd-act' },
  { id: 'c3', comp: '3. Capacity building', appT: 'tep-c3-app', actT: 'tep-c3-act', appI: 'tep-c3-ibrd-app', actI: 'tep-c3-ibrd-act' },
  { id: 'fee', comp: 'Front-end fee', appT: 'tep-fee', actT: 'tep-fee', appI: 'tep-fee', actI: 'tep-fee' },
  { id: 'total', comp: 'TOTAL', appT: 'tep-total', actT: 'tep-actual-total', appI: 'tep-ibrd', actI: 'tep-ibrd-disb' },
];

/** Table 13 (p. 40): TEP institutional and digital systems */
export const TABLE13 = [
  { id: 'ams', ws: 'Asset management system (AMS)', purpose: 'Data-supported maintenance and capital-investment decisions', pos: 'Operational; actual subcomponent cost {tep-ams-cost}, including {tep-c3-ibrd-act} IBRD' },
  { id: 'tariff', ws: 'Cost-reflective transmission tariff', purpose: 'Support financial sustainability and tariff-related analysis', pos: '{tep-tariff-cost} actual cost; financed by NPT/borrower' },
  { id: 'ifrs', ws: 'IFRS-related reporting capacity', purpose: 'Improve financial reporting and governance', pos: '{tep-ifrs-cost} actual cost; financed by NPT/borrower' },
  { id: 'lab', ws: 'Electrical testing laboratory', purpose: 'Improve capacity for specialised testing', pos: 'Partial upgrade; {tep-lab-cost} actual cost; financed by NPT/borrower' },
  { id: 'info', ws: 'Operation/equipment information system (Component 2)', purpose: 'Upgrade related digital management information system', pos: 'Cancelled after existing system judged adequate' },
];

/** Table 14 (p. 41): TEP outputs */
export const TABLE14 = [
  { id: 'new', ind: 'New transmission lines', target: 'tep-new-lines-target', actual: 'tep-new-lines', pct: 'tep-new-lines-pct', anchor: 'new-lines' },
  { id: 'rehab', ind: 'Rehabilitated transmission lines', target: 'tep-rehab-target', actual: 'tep-rehab', pct: 'tep-rehab-pct', anchor: 'rehab-lines' },
  { id: 'mw', ind: 'Additional transformer capacity', target: 'tep-mw-target', actual: 'tep-mw', pct: 'tep-mw-pct', anchor: 'transformer-capacity' },
  { id: 's500', ind: '500-kV smart-grid substations', target: 'tep-500-target', actual: 'tep-500', pct: 'tep-500-pct', anchor: 'smartgrid-500kv' },
  { id: 's220', ind: '220-kV smart-grid substations', target: 'tep-220-target', actual: 'tep-220', pct: 'tep-220-pct', anchor: 'smartgrid-220kv' },
];

/** Table 15 (p. 43): system-level indicators */
export const TABLE15 = [
  { id: 'om', ind: 'O&M cost per energy transmitted', early: '{om-baseline} (baseline)', late: '{om-2021} (2021 and 2022)', scope: 'Lower unit costs; NPT-wide', anchor: 'transformer' },
  { id: 'unserved', ind: 'Unserved energy caused by transmission failures', early: '{unserved-2012} (2012)', late: '{unserved-2021} (2021)', scope: 'Large reduction; system indicator', anchor: 'substation' },
  { id: 'saidi', ind: 'Avg. interruption duration per customer', early: '{saidi-2018} (2018)', late: '{saidi-2021} (2021)', scope: 'Improved reliability indicator', anchor: 'pylon-220' },
  { id: 'saifi', ind: 'Avg. interruption frequency per customer', early: '{saifi-2018} (2018)', late: '{saifi-2021} (2021)', scope: 'Improved reliability indicator', anchor: 'pylon-500' },
  { id: 'loss', ind: 'Transmission losses', early: '{loss-2015} (2015)', late: '{loss-2021} (2021); {loss-2022} (2022)', scope: 'Improved by closing then worsened', anchor: 'gauge' },
];

/** Table 16 (p. 45): TEP financing gap, million USD */
export const TABLE16 = [
  { id: 'commit', measure: 'IBRD amount committed at appraisal', value: '{tep-ibrd|2}', meaning: 'Original approved financing envelope', anchor: 'cash' },
  { id: 'disb', measure: 'IBRD amount actually disbursed', value: '{tep-ibrd-disb|2}', meaning: 'World Bank financing used through project closing', anchor: 'cash' },
  { id: 'gap', measure: 'Commitment minus disbursement', value: '{tep-gap|2}', meaning: 'Derived arithmetic gap: {tep-gap-pct} of commitment', anchor: 'cash' },
  { id: 'cancel', measure: 'Loan savings reported cancelled by IEG', value: '~{tep-ieg-cancel|2}', meaning: 'Separate approximate cancellation figure in IEG assessment', anchor: 'cash' },
  { id: 'app', measure: 'Total project cost at appraisal', value: '{tep-total|2}', meaning: 'Initial budget; includes fee', anchor: 'substation' },
  { id: 'act', measure: 'Total actual project cost', value: '{tep-actual-total|2}', meaning: 'Closing expenditure', anchor: 'substation' },
  { id: 'cut', measure: 'Appraisal minus actual project cost', value: '{tep-cost-cut|2}', meaning: 'Derived reduction in overall project cost ({tep-cost-cut-pct})', anchor: 'substation' },
];

/** Table 17 (p. 48): CCSEP timeline */
export const TABLE17 = [
  { id: 'approval', m: 'Approval', plan: '5/5/2017', act: '5/5/2017' },
  { id: 'signing', m: 'Agreement signing', plan: '27/10/2017', act: '27/10/2017' },
  { id: 'effective', m: 'Effectiveness date', plan: '3/8/2017', act: '18/1/2018' },
  { id: 'start', m: 'Implementation start', plan: '5/5/2017', act: '18/1/2018' },
  { id: 'end', m: 'Implementation end', plan: '30/6/2022', act: '30/6/2024' },
  { id: 'closing', m: 'Loan closing', plan: '31/12/2022', act: '30/6/2024' },
];

/** Table 18 (p. 51): CCSEP components and sources, base cost (million USD); '-' = none */
export const TABLE18 = [
  { id: 'c1', comp: '1. Sanitation Infrastructure Expansion', total: 'c1-base', ida: 'c1-base', ibrd: null, cp: null, anchor: 'pipes' },
  { id: 'c2', comp: '2. Urban Connectivity Improvement', total: 'c2-base', ida: null, ibrd: 'c2-base', cp: null, anchor: 'bridge' },
  { id: 'c3', comp: '3. Compensation and Site Clearance', total: 'c3-base', ida: 'c3-ida', ibrd: null, cp: 'c3-cp', anchor: 'houses' },
  { id: 'c4', comp: '4. Implementation Support and Institutional Reform', total: 'c4-base', ida: null, ibrd: null, cp: 'c4-base', anchor: 'tank' },
  { id: 'total', comp: 'Total Base Cost', total: 'base-total', ida: 'base-ida', ibrd: 'base-ibrd', cp: 'base-cp', anchor: 'pipes' },
] as { id: string; comp: string; total: string; ida: string | null; ibrd: string | null; cp: string | null; anchor: string }[];

/** Table 19 (p. 53): CCSEP plan vs adjusted (million USD) */
export const TABLE19 = [
  { id: 'wb', src: 'Total WB financing', app: 'ccsep-wb', appS: 't19-wb-share', adj: 'adj-wb', adjS: 't19-adj-wb-share', chg: 'chg-wb', close: 'close-wb' },
  { id: 'ibrd', src: 'IBRD', app: 'ccsep-ibrd', appS: 't19-ibrd-share', adj: 'adj-ibrd', adjS: 't19-adj-ibrd-share', chg: 'chg-ibrd', close: 'close-ibrd' },
  { id: 'ida', src: 'IDA', app: 'ccsep-ida', appS: 't19-ida-share', adj: 'adj-ida', adjS: 't19-adj-ida-share', chg: 'chg-ida', close: 'close-ida' },
  { id: 'cp', src: 'Counterpart funding', app: 'ccsep-cp', appS: 't19-cp-share', adj: 'adj-cp', adjS: 't19-adj-cp-share', chg: 'chg-cp', close: 'close-cp' },
  { id: 'total', src: 'Total project cost', app: 'ccsep-total', appS: null, adj: 'adj-total', adjS: null, chg: 'chg-total', close: 'close-total' },
] as { id: string; src: string; app: string; appS: string | null; adj: string; adjS: string | null; chg: string; close: string }[];

/** Table 20 (p. 56): CCSEP KPIs at 30/6/2024 */
export const TABLE20 = [
  { id: 'ben', ind: 'Direct beneficiaries', target: 'kpi-ben-target', actual: 'kpi-ben', ratio: 'kpi-ben-pct', anchor: 'houses' },
  { id: 'sewer', ind: 'People with access to sewer connections', target: 'kpi-sewer-target', actual: 'kpi-sewer', ratio: 'kpi-sewer-pct', anchor: 'pipes' },
  { id: 'cost', ind: 'Cost recovery level', target: 'ccsep-cost-recovery', actual: 'kpi-cost', ratio: 'kpi-cost', anchor: 'tank' },
  { id: 'roads', ind: 'Roads (km)', target: 'kpi-roads', actual: 'kpi-roads', ratio: 'kpi-cost', anchor: 'road' },
  { id: 'bridges', ind: 'Bridges', target: 'kpi-bridges', actual: 'kpi-bridges', ratio: 'kpi-cost', anchor: 'bridge' },
];

/** Figure 7 (p. 52): sources of funding by city (stack order bottom → top) */
export const FIG7 = [
  { id: 'dh', city: 'Dong Hoi', grant: 'f7-dh-grant', lent: 'f7-dh-lent', ibrd: 'f7-dh-ibrd', cp: 'f7-dh-cp', total: 'city-dh' },
  { id: 'nt', city: 'Nha Trang', grant: 'f7-nt-grant', lent: 'f7-nt-lent', ibrd: 'f7-nt-ibrd', cp: 'f7-nt-cp', total: 'city-nt' },
  { id: 'pr', city: 'Phan Rang-Thap Cham', grant: 'f7-pr-grant', lent: 'f7-pr-lent', ibrd: 'f7-pr-ibrd', cp: 'f7-pr-cp', total: 'city-pr' },
  { id: 'qn', city: 'Quy Nhon', grant: 'f7-qn-grant', lent: 'f7-qn-lent', ibrd: 'f7-qn-ibrd', cp: 'f7-qn-cp', total: 'city-qn' },
];

/** Recommendations (Section 3.4.3, pp. 62-63) */
export const RECS = [
  'Prepare projects more fully before approval',
  'Secure counterpart funding at the start',
  'Align compensation with World Bank standards early',
  'Strengthen and stabilize PMUs',
  'Streamline domestic procedures',
  'Choose instruments strategically',
];

/** Figures rebuilt as SVG: every plotted value is a fact id (checked against the tables by check-facts). */
export const FIGURES = {
  /** Figure 1 (p. 38): appraisal vs actual, IBRD + borrower */
  fig1: { categories: ['Appraisal financing', 'Actual expenditure'], ibrd: ['tep-ibrd', 'tep-ibrd-disb'], borrower: ['tep-counterpart', 'tep-counterpart-final'], totals: ['tep-total', 'tep-actual-total'] },
  /** Figure 2 (p. 38): component expenditure, fee excluded */
  fig2: { categories: ['Transmission infrastructure', 'Smart-grid network', 'Capacity building'], appraisal: ['tep-c1-app', 'tep-c2-app', 'tep-c3-app'], actual: ['tep-c1-act', 'tep-c2-act', 'tep-c3-act'] },
  /** Figure 3 (p. 41): achievement vs target (%) */
  fig3: { categories: TABLE14.map((r) => r.ind), values: TABLE14.map((r) => r.pct) },
  /** Figure 4 (p. 43): transmission loss ratio (%) */
  fig4: { categories: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'], values: ['loss-2015', 'loss-2016', 'loss-2017', 'loss-2018', 'loss-2019', 'loss-2020', 'loss-2021', 'loss-2022'] },
  /** Figure 5 (p. 49): CCSEP financing structure at appraisal */
  fig5: { parts: ['ccsep-ibrd', 'ccsep-ida', 'ccsep-cp'], shares: ['ccsep-ibrd-pct', 'ccsep-ida-pct', 'ccsep-cp-pct'], total: 'ccsep-total' },
  /** Figure 6 (p. 50): on-granted share of each source (rest on-lent) */
  fig6: { categories: ['IBRD loan (all four cities)', 'IDA credit – Dong Hoi', 'IDA credit – Phan Rang', 'IDA credit – Quy Nhon', 'IDA credit – Nha Trang'], ongrant: [null, 'ongrant-dh', 'ongrant-pr', 'ongrant-qn', 'ongrant-nt'] as (string | null)[] },
  /** Figure 7 (p. 52): sources by city */
  fig7: FIG7,
  /** Figure 8 (p. 54): total funding by city, plan vs adjusted. Adjusted values are stated in the text only for Quy Nhon and Phan Rang-Thap Cham. */
  fig8: { cities: ['Dong Hoi', 'Quy Nhon', 'Nha Trang', 'Phan Rang-Thap Cham'], plan: ['city-dh', 'city-qn', 'city-nt', 'city-pr'], adjusted: [null, 'city-qn-adj', null, 'city-pr-adj'] as (string | null)[] },
};
