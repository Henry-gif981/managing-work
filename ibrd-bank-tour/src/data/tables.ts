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
