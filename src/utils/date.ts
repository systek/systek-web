import { format as dateFnsFormat } from "date-fns";
import { nb } from "date-fns/locale";

export function formatDate(
  date: number | string | Date,
  format = "d. MMMM",
): string {
  return dateFnsFormat(new Date(date), format, {
    locale: nb,
  });
}
