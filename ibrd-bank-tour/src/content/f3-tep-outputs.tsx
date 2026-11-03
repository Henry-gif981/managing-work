import type { Beat } from './types';
import { ScenePanel, Card, Title } from '../primitives/ScenePanel';
import { DataTable } from '../primitives/DataTable';
import { Note } from '../primitives/bits';

/*
 * DEMO of the content mechanism (table in the centre, focus, a callout to a 3D prop).
 * The numbers below are placeholders, NOT from the paper. Replace with facts from src/data/facts.ts.
 */
export const beats: Beat[] = [
  { label: 'Table of outputs' },
  {
    label: 'Transformer capacity → the transformer',
    focus: ['tep-out-mva'],
    callouts: [{ from: '#tep-out-mva-item', to: 'anchor:f3-tep-outputs:transformer', label: 'Transformer' }],
  },
  { label: 'Focus the "achieved" column', focus: ['tep-out-col-actual'] },
];

const rows = [
  { id: 'lines', cells: { item: 'Transmission lines (km)', target: 'TBD', actual: 'TBD' } },
  { id: 'mva', cells: { item: 'Transformer capacity (MVA)', target: 'TBD', actual: 'TBD' } },
  { id: 'subs', cells: { item: 'Substations', target: 'TBD', actual: 'TBD' } },
];

export default function View() {
  return (
    <ScenePanel
      centre={
        <>
          <Card>
            <Title kicker="Section 3.2.4">TEP · Results: outputs</Title>
            <DataTable
              id="tep-out"
              width={760}
              columns={[
                { key: 'item', label: 'Output' },
                { key: 'target', label: 'Target', align: 'right' },
                { key: 'actual', label: 'Achieved', align: 'right' },
              ]}
              rows={rows}
              caption="Demo table: placeholder values, real figures come from src/data/facts.ts"
            />
          </Card>
          <Note>Demo of the callout mechanism: beat 2 links a cell to the transformer on the left.</Note>
        </>
      }
    />
  );
}
