export function getDescription(
  content: string,
  maxLength: number = 160,
): string {
  const cleaned = (content ?? "")
    .replace(/\r?\n+/g, " ") // line breaks
    .replace(/\s+/g, " ") // other whitespace
    .trim();
  return cleaned.length > maxLength
    ? cleaned.slice(0, maxLength - 1).trim() + "…"
    : cleaned;
}
