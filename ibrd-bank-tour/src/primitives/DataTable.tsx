import type { ReactNode } from 'react';
import { useFocus } from './focus';
import { useOv } from '../edit/store';
import { R } from '../content/kit';

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
      {caption && <Caption id={id}>{caption}</Caption>}
    </div>
  );
}

/** Caption with an optional browser edit (edit mode). */
function Caption({ id, children }: { id: string; children: ReactNode }) {
  const o = useOv(`cap:${id}`);
  return (
    <div className="dt-caption" data-edit={`cap:${id}`} data-edit-label={`Table caption · ${id}`}>
      {o != null ? <R t={o} className="cell-rich" /> : children}
    </div>
  );
}

function Th({ tableId, col }: { tableId: string; col: Column }) {
  const o = useOv(`c:${tableId}-h-${col.key}`);
  return (
    <th
      id={`${tableId}-h-${col.key}`}
      style={{ textAlign: col.align ?? 'left', width: col.width }}
      data-edit={`c:${tableId}-h-${col.key}`}
      data-edit-label={`Table header · ${tableId} · ${col.key}`}
    >
      {o != null ? <R t={o} className="cell-rich" /> : col.label}
    </th>
  );
}

function Td({ tableId, row, col }: { tableId: string; row: Row; col: Column }) {
  const cellId = `${tableId}-${row.id}-${col.key}`;
  const cls = useFocus(cellId, `${tableId}-${row.id}`, `${tableId}-col-${col.key}`, tableId);
  const o = useOv(`c:${cellId}`);
  return (
    <td
      id={cellId}
      className={`${cls} ${col.align === 'right' ? 'num' : ''}`}
      style={{ textAlign: col.align ?? 'left' }}
      data-edit={`c:${cellId}`}
      data-edit-label={`Table cell · ${tableId} · ${row.id} · ${col.key}`}
    >
      {o != null ? <R t={o} className="cell-rich" /> : row.cells[col.key]}
    </td>
  );
}
