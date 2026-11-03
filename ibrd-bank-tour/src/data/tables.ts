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
