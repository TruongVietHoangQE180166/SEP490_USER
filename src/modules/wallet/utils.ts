export function fmt(n: number, dec = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export function pct(part: number, total: number) {
  if (total === 0) return 0;
  return Math.min((part / total) * 100, 100);
}
