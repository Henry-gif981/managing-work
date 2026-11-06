import { scene, R } from './kit';
import { Timeline } from '../primitives/bits';
import { F } from '../primitives/Fact';

const to = 'anchor:f3-1993:documents';
const tl = (
  <div className="card" style={{ width: 720 }}>
    <Timeline
      id="resume"
      items={[
        { id: 'oct93', date: <F id="resume-date" />, label: <R t="Bank resumes lending; two IDA credits: ~{ida-edu-1993} primary education, {ida-road-1993} highway rehabilitation" /> },
        { id: 'y94', date: <F id="hanoi-office" />, label: <R t="Resident office opens in Hanoi" /> },
      ]}
    />
  </div>
);
const p = scene('f3-1993', [
  {
    title: 'Lending resumes in 1993',
    source: 'Section 3.1.1 · p. 30',
    side: tl,
    callouts: [{ from: '.k-card .h2', to, label: 'Partnership records' }],
    body: `The present lending relationship took shape when the Bank **resumed lending in {resume-date}**, following the resolution of arrears and the re-establishment of external financial relations. Two IDA credits were approved that month: approximately {ida-edu-1993} for primary education and {ida-road-1993} for highway rehabilitation. The Bank opened its resident office in Hanoi in {hanoi-office}.

This re-engagement coincided with the early reforms under **Đổi Mới** and signalled the return of large-scale multilateral financing for infrastructure and human development [47].`,
  },
  {
    title: 'Beyond capital: IDA or IBRD?',
    source: 'Section 3.1.1 · p. 30',
    side: tl,
    body: `During the following two decades, the Bank's role extended beyond capital. IDA-financed operations supported physical infrastructure, education, poverty reduction and public-sector institutions, while policy analysis and project-level technical assistance helped public agencies manage complex investments.

The distinction matters for this paper: **"World Bank financing" is an umbrella description**. The institutional source of a loan may be IDA or IBRD and must be identified from the project's appraisal and legal documentation, not inferred from the World Bank name.`,
  },
]);
export const beats = p.beats;
export default p.View;
