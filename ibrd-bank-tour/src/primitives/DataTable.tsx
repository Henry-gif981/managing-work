import type { ReactNode } from 'react';
import { useFocus } from './focus';

export interface Column {
  key: string;
  label: ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: number;
}
export interface Row {
  id: string;
  cells: Record<string, ReactNode>;
  kind?: 'total' | 'sub';
}

/**
 * Every row and cell has a DOM id:  row = `${id}-${row.id}`,  cell = `${id}-${row.id}-${col.key}`,
 * header = `${id}-h-${col.key}`. A beat can focus a cell, a row, a column (`${id}-col-${key}`) or the table.
 */
export function DataTable({ id, columns, rows, caption, width }: { id: string; columns: Column[]; rows: Row[]; caption?: ReactNode; width?: number }) {
  const tableCls = useFocus(id);
  return (
    <div className={'dt-wrap ' + (tableCls.includes('is-focus') ? '' : '')} style={{ width }}>
      <table className="dt" id={id}>
        <thead>
          <tr>
            {columns.map((c) => (
              <Th key={c.key} tableId={id} col={c} />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} id={`${id}-${r.id}`} className={r.kind ?? ''}>
              {columns.map((c) => (
                <Td key={c.key} tableId={id} row={r} col={c} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <div className="dt-caption">{caption}</div>}
    </div>
  );
}

function Th({ tableId, col }: { tableId: string; col: Column }) {
  return (
    <th id={`${tableId}-h-${col.key}`} style={{ textAlign: col.align ?? 'left', width: col.width }}>
      {col.label}
    </th>
  );
}

function Td({ tableId, row, col }: { tableId: string; row: Row; col: Column }) {
  const cellId = `${tableId}-${row.id}-${col.key}`;
  const cls = useFocus(cellId, `${tableId}-${row.id}`, `${tableId}-col-${col.key}`, tableId);
  return (
    <td id={cellId} className={`${cls} ${col.align === 'right' ? 'num' : ''}`} style={{ textAlign: col.align ?? 'left' }}>
      {row.cells[col.key]}
    </td>
  );
}
