import { fact } from '../data/facts';

/** Render a fact value by id, e.g. <F id="tep-total" /> -> "US$ 300 million". */
export function F({ id, digits, unit = true }: { id: string; digits?: number; unit?: boolean }) {
  const f = fact(id);
  const v = typeof f.value === 'number' && digits !== undefined ? f.value.toFixed(digits) : String(f.value);
  return (
    <span className="fact" title={f.source}>
      {v}
      {unit && f.unit ? ` ${f.unit}` : ''}
    </span>
  );
}
