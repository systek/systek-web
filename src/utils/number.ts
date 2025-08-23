export function vw(rem: number, base = 105): string {
  return `${((rem / base) * 100).toFixed(3)}vw`;
}
