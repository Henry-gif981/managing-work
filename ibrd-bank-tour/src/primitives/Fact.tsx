import { fact, type Fact } from '../data/facts';

/**
 * Format a fact for display. Unit conventions:
 *   'US$ million' | 'US$ billion' | 'US$'  -> "USD 500 million", "USD 350,000"
 *   '%'                                     -> "26%"
 *   'year' (calendar year) or no unit       -> plain value ("1944", "189")
 *   any other unit                          -> "35 years", "60 days", "20 bps"
 */
export function formatFact(f: Fact, withUnit = true): string {
  const v = f.value;
  const num = typeof v === 'number';
  const plain = !num
    ? String(v)
    : f.digits !== undefined
      ? v.toFixed(f.digits)
      : f.unit === 'year' || !f.unit
        ? v >= 10000
          ? v.toLocaleString('en-US')
          : String(v)
        : v.toLocaleString('en-US', { maximumFractionDigits: 3 });
  if (!withUnit || !f.unit || f.unit === 'year') return plain;
  for (const cur of ['US$', 'SDR']) {
    if (f.unit.startsWith(cur)) {
      const rest = f.unit.slice(cur.length).trim();
      // the paper writes "USD 500 million" (updated _10 version), so US$ units print as "USD ..."
      const label = cur === 'US$' ? 'USD' : cur;
      return `${label} ${plain}${rest ? (rest.startsWith('/') ? rest : ' ' + rest) : ''}`;
    }
  }
  if (f.unit === '%') return `${plain}%`;
  return `${plain} ${f.unit}`;
}

/** Render a fact by id, e.g. <F id="pir1-ibrd" /> -> "US$500 million". Hover shows the source. */
export function F({ id, unit = true, fixed }: { id: string; unit?: boolean; fixed?: number }) {
  const f = fact(id);
  const text = fixed !== undefined && typeof f.value === 'number' ? f.value.toFixed(fixed) : formatFact(f, unit);
  return (
    <span className="fact" title={f.source} data-fact={id}>
      {text}
    </span>
  );
}
