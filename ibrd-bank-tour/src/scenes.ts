/**
 * The ordered scene list. Beat counts are NOT stored here: they are the length of the
 * `beats` array exported by src/content/<scene-id>.tsx (see src/content/index.ts).
 */
export type SceneKind = 'exterior' | 'door' | 'room' | 'lift' | 'exit';
export type SegmentId =
  | 'entrance'
  | 'intro'
  | 'ch1'
  | 'ch2'
  | 'context'
  | 'tep'
  | 'ccsep'
  | 'eval'
  | 'conclusion'
  | 'exit';

export interface Scene {
  id: string;
  kind: SceneKind;
  floor: 0 | 1 | 2 | 3;
  segment: SegmentId;
  title: string;
  sectionRef: string;
  objective: string;
  targetSeconds: number;
  optional?: boolean;
  /** waypoint id in src/camera/waypoints.ts */
  camera: string;
}

export const SEGMENTS: { id: SegmentId; label: string }[] = [
  { id: 'entrance', label: 'Entrance' },
  { id: 'intro', label: 'Floor 1 · Introduction' },
  { id: 'ch1', label: 'Floor 1 · Chapter 1' },
  { id: 'ch2', label: 'Floor 2 · Chapter 2' },
  { id: 'context', label: 'Floor 3 · Context' },
  { id: 'tep', label: 'Floor 3 · TEP' },
  { id: 'ccsep', label: 'Floor 3 · CCSEP' },
  { id: 'eval', label: 'Evaluation' },
  { id: 'conclusion', label: 'Conclusion' },
  { id: 'exit', label: 'Exit' },
];

type Row = [
  id: string,
  kind: SceneKind,
  floor: 0 | 1 | 2 | 3,
  segment: SegmentId,
  title: string,
  sectionRef: string,
  targetSeconds?: number,
];

const OPTIONAL = new Set([
  'f1-history-1',
  'f1-history-2',
  'f1-voting',
  'f2-vn-procedures',
  'f2-asa',
  'f2-institutional',
  'f3-1993',
  'f3-legal',
  'f3-ccsep-cities',
]);

const ROWS: Row[] = [
  // EXTERIOR
  ['ext-facade', 'exterior', 0, 'entrance', 'The IBRD and Its Development Project Financing in Vietnam', 'Title page', 30],
  ['ext-door', 'door', 0, 'entrance', 'Entering the Bank', '—', 8],
  // FLOOR 1 · INTRODUCTION
  ['f1-rationale-1', 'room', 1, 'intro', 'Rationale: Multilateral Development Finance', 'Introduction 1.1'],
  ['f1-rationale-2', 'room', 1, 'intro', 'Rationale: Why the IBRD Matters for Vietnam', 'Introduction 1.2'],
  ['f1-problem', 'room', 1, 'intro', 'Research Problem and Questions', 'Introduction 2'],
  ['f1-objectives', 'room', 1, 'intro', 'Research Objectives', 'Introduction 3'],
  ['f1-method', 'room', 1, 'intro', 'Research Methodology', 'Introduction 4'],
  ['f1-scope', 'room', 1, 'intro', 'Research Scope', 'Introduction 5'],
  ['f1-structure', 'room', 1, 'intro', 'Structure of the Paper', 'Introduction 6'],
  // FLOOR 1 · CHAPTER 1
  ['f1-ch1-title', 'room', 1, 'ch1', 'Chapter 1 · Overview of the IBRD', 'Chapter 1'],
  ['f1-what', 'room', 1, 'ch1', 'What Is the IBRD?', 'Section 1.1.1'],
  ['f1-wbg', 'room', 1, 'ch1', 'The World Bank Group: IBRD, IDA, IFC, MIGA, ICSID', 'Section 1.1.2'],
  ['f1-history-1', 'room', 1, 'ch1', 'History and Development (I)', 'Section 1.2'],
  ['f1-history-2', 'room', 1, 'ch1', 'History and Development (II)', 'Section 1.2'],
  ['f1-gov', 'room', 1, 'ch1', 'Governors, Executive Directors, President', 'Section 1.3.1'],
  ['f1-voting', 'room', 1, 'ch1', 'Voting Power', 'Section 1.3.2'],
  ['f1-funds', 'room', 1, 'ch1', 'Source of Funds', 'Section 1.3.3'],
  ['f1-instruments', 'room', 1, 'ch1', 'Three Instruments: IPF, DPF, PforR', 'Section 1.4.1'],
  ['f1-terms', 'room', 1, 'ch1', 'Loan Terms: Rates, Maturities, Fees', 'Section 1.4.2'],
  ['f1-safeguards', 'room', 1, 'ch1', 'Safeguards and Procurement (ESF)', 'Section 1.4.3'],
  ['lift-1-2', 'lift', 1, 'ch1', 'Lift to Floor 2', '—', 10],
  // FLOOR 2 · CHAPTER 2
  ['f2-ch2-title', 'room', 2, 'ch2', 'Chapter 2 · How the IBRD Supports Project Financing', 'Chapter 2'],
  ['f2-cycle', 'room', 2, 'ch2', 'The Project Cycle', 'Section 2.1.1'],
  ['f2-vn-procedures', 'room', 2, 'ch2', 'The Cycle in Vietnamese Procedures', 'Section 2.1.1'],
  ['f2-disbursement', 'room', 2, 'ch2', 'Disbursement Mechanisms', 'Section 2.1.2'],
  ['f2-counterpart', 'room', 2, 'ch2', 'Counterpart Funding Requirements', 'Section 2.1.2'],
  ['f2-ipf', 'room', 2, 'ch2', 'IPF in Practice', 'Section 2.1.3'],
  ['f2-dpf', 'room', 2, 'ch2', 'DPF in Practice', 'Section 2.1.3'],
  ['f2-pforr', 'room', 2, 'ch2', 'PforR in Practice', 'Section 2.1.3'],
  ['f2-prep', 'room', 2, 'ch2', 'Project Preparation and Feasibility Studies', 'Section 2.2.1'],
  ['f2-asa', 'room', 2, 'ch2', 'Analytical and Advisory Services (ASA)', 'Section 2.2.2'],
  ['f2-me', 'room', 2, 'ch2', 'Monitoring and Evaluation Frameworks', 'Section 2.2.3'],
  ['f2-training-pmu', 'room', 2, 'ch2', 'Training for Project Management Units', 'Section 2.3.1'],
  ['f2-training-knowledge', 'room', 2, 'ch2', 'Knowledge Transfer: Procurement and Safeguards', 'Section 2.3.2'],
  ['f2-institutional', 'room', 2, 'ch2', 'Strengthening Institutional Governance', 'Section 2.3.3'],
  ['f2-three-forms', 'room', 2, 'ch2', 'Overall Assessment: Three Forms of Support', 'Section 2.4'],
  ['f2-package', 'room', 2, 'ch2', 'Overall Assessment: The Support Package', 'Section 2.4'],
  ['lift-2-3', 'lift', 2, 'ch2', 'Lift to Floor 3', '—', 10],
  // FLOOR 3 · CONTEXT
  ['f3-ch3-title', 'room', 3, 'context', 'Chapter 3 · The IBRD and Selected Projects in Vietnam', 'Chapter 3'],
  ['f3-1993', 'room', 3, 'context', 'Resumption of the Partnership in 1993', 'Section 3.1.1'],
  ['f3-ida-graduation', 'room', 3, 'context', 'IDA Graduation (July 2017) and IBRD Lending', 'Section 3.1.2'],
  ['f3-sahep', 'room', 3, 'context', 'Comparison: SAHEP (2017)', 'Section 3.1.3'],
  ['f3-legal', 'room', 3, 'context', 'Legal Framework for ODA and Concessional Loans', 'Section 3.1.4'],
  // FLOOR 3 · TEP
  ['f3-tep-overview', 'room', 3, 'tep', 'TEP · Project Overview', 'Section 3.2.1'],
  ['f3-tep-cost', 'room', 3, 'tep', 'TEP · Components and Cost', 'Section 3.2.2'],
  ['f3-tep-financing', 'room', 3, 'tep', 'TEP · Financial Structure', 'Section 3.2.2'],
  ['f3-tep-impl', 'room', 3, 'tep', 'TEP · Implementation Support', 'Section 3.2.3'],
  ['f3-tep-outputs', 'room', 3, 'tep', 'TEP · Results: Outputs', 'Section 3.2.4'],
  ['f3-tep-outcomes', 'room', 3, 'tep', 'TEP · Results: Outcomes', 'Section 3.2.4'],
  ['f3-tep-gap', 'room', 3, 'tep', 'TEP · Challenges and Financing Gap', 'Section 3.2.5'],
  ['f3-tep-assess', 'room', 3, 'tep', 'TEP · Overall Assessment', 'Section 3.2.6'],
  // FLOOR 3 · CCSEP
  ['f3-ccsep-overview', 'room', 3, 'ccsep', 'CCSEP · Project Overview', 'Section 3.3.1'],
  ['f3-ccsep-structure', 'room', 3, 'ccsep', 'CCSEP · Components and Financial Structure', 'Section 3.3.2'],
  ['f3-ccsep-cities', 'room', 3, 'ccsep', 'CCSEP · The Four Cities', 'Section 3.3.2'],
  ['f3-ccsep-impl', 'room', 3, 'ccsep', 'CCSEP · Project Implementation', 'Section 3.3.3'],
  ['f3-ccsep-results', 'room', 3, 'ccsep', 'CCSEP · Results and Challenges', 'Section 3.3.4'],
  ['f3-ccsep-nhatrang', 'room', 3, 'ccsep', 'CCSEP · Nha Trang', 'Section 3.3.4'],
  // EVALUATION
  ['f3-eval-achievements', 'room', 3, 'eval', 'Achievements', 'Section 3.4.1'],
  ['f3-eval-limitations', 'room', 3, 'eval', 'Limitations', 'Section 3.4.2'],
  ['f3-recs-1', 'room', 3, 'eval', 'Recommendations for Vietnam (I)', 'Section 3.4.3'],
  ['f3-recs-2', 'room', 3, 'eval', 'Recommendations for Vietnam (II)', 'Section 3.4.3'],
  // CONCLUSION
  ['lift-down', 'lift', 3, 'conclusion', 'Conclusion', 'Conclusion 1–4', 90],
  // EXIT
  ['ex-sources', 'exit', 0, 'exit', 'Sources', 'References', 30],
  ['ex-thanks', 'exit', 0, 'exit', 'Thank You', '—', 20],
];

export const SCENES: Scene[] = ROWS.map(([id, kind, floor, segment, title, sectionRef, targetSeconds]) => ({
  id,
  kind,
  floor,
  segment,
  title,
  sectionRef,
  objective: 'TBD',
  targetSeconds: targetSeconds ?? 60,
  optional: OPTIONAL.has(id) || undefined,
  camera: id,
}));

export const SCENE_INDEX: Record<string, number> = Object.fromEntries(SCENES.map((s, i) => [s.id, i]));

export function sceneById(id: string): Scene | undefined {
  const i = SCENE_INDEX[id];
  return i === undefined ? undefined : SCENES[i];
}

/** Lift chapter cards, keyed by the lift-up scene id. */
export const LIFT_CARDS: Record<string, { floor: number; chapter: number; title: string }> = {
  'lift-1-2': { floor: 2, chapter: 2, title: 'How the IBRD Supports Project Financing' },
  'lift-2-3': { floor: 3, chapter: 3, title: 'The IBRD and Selected Projects in Vietnam' },
};
