import { useEffect, useState } from 'react';
import { Chart } from './Chart';
import { DataTable } from './DataTable';
import { Chip, Cite, Note, Stat, Timeline } from './bits';
import { Card, Title, Caption } from './ScenePanel';
import { FocusContext } from './focus';
import { useDesignScale } from '../util/design';

/** ?demo=1 — gallery of every content primitive with DEMO data (not from the paper). Space toggles focus. */
export default function Demo() {
  const box = useDesignScale();
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === ' ' && setFocus((f) => !f);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  const ids = new Set(focus ? ['d-bar-0-2', 'd-grp-s1', 'd-tab-r2', 'd-h-0-1', 'd-line-c3', 'd-stk-c1', 'd-tl-b', 's1'] : []);
  const cats = ['2018', '2019', '2020', '2021', '2022'];
  return (
    <div className="viewport" style={{ background: 'var(--surface)' }}>
      <div className="design" style={{ transform: `translate(${box.ox}px, ${box.oy}px) scale(${box.s})`, padding: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignContent: 'start', pointerEvents: 'auto' }}>
        <FocusContext.Provider value={ids}>
          <Card>
            <Title kicker="Primitives demo · DEMO DATA">Gallery</Title>
            <Caption>Space toggles a focus set (glow + 35% dim). Not from the paper.</Caption>
            <div style={{ display: 'flex', gap: 30, marginTop: 16 }}>
              <Stat id="s1" value="42" unit="%" label="Stat (focused)" tone="good" />
              <Stat id="s2" value="7.5" unit="bn" label="Stat" />
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <Chip tone="navy">navy</Chip>
              <Chip tone="cyan">cyan</Chip>
              <Chip tone="warn">warn</Chip>
              <Chip tone="bad">bad</Chip>
              <Chip tone="good">good</Chip>
            </div>
            <p style={{ margin: '12px 0' }}>
              A sentence with a citation <Cite n={3} />.
            </p>
            <Note>A footnote about an inconsistency in the paper.</Note>
          </Card>
          <Chart id="d-bar" kind="bar" width={540} height={330} categories={cats} series={[{ name: 'A', values: [3, 5, 4, 7, 6] }]} unit="" />
          <Chart id="d-grp" kind="grouped" width={540} height={300} categories={cats} series={[{ name: 'Plan', values: [3, 5, 4, 7, 6] }, { name: 'Actual', values: [2, 4, 4, 5, 6] }]} />
          <Chart id="d-stk" kind="stacked" width={540} height={300} categories={cats} series={[{ name: 'IBRD', values: [3, 5, 4, 7, 6] }, { name: 'IDA', values: [2, 1, 2, 1, 1] }, { name: 'Gov.', values: [1, 1, 1, 2, 2] }]} />
          <Chart id="d-h" kind="hbar-target" width={540} height={300} categories={['Lines', 'Substations', 'Capacity', 'Losses']} series={[{ name: '% of target', values: [112, 96, 100, 74] }]} unit="%" />
          <Chart id="d-line" kind="line" width={540} height={300} categories={cats} series={[{ name: 'Disbursed', values: [10, 25, 45, 70, 92] }, { name: 'Committed', values: [30, 50, 70, 85, 100] }]} unit="%" />
          <div style={{ gridColumn: 'span 2' }}>
            <DataTable
              id="d-tab"
              columns={[
                { key: 'a', label: 'Item' },
                { key: 'b', label: 'Value', align: 'right' },
              ]}
              rows={[
                { id: 'r1', cells: { a: 'Row one', b: '1.0' } },
                { id: 'r2', cells: { a: 'Row two (focused)', b: '2.0' } },
                { id: 'tot', kind: 'total', cells: { a: 'Total', b: '3.0' } },
              ]}
              caption="DataTable with row/cell ids"
            />
          </div>
          <Card>
            <Timeline id="d-tl" items={[{ id: 'a', date: '1993', label: 'Resumed' }, { id: 'b', date: '2009', label: 'First IBRD loan' }, { id: 'c', date: '2017', label: 'IDA graduation' }]} />
          </Card>
        </FocusContext.Provider>
      </div>
    </div>
  );
}
