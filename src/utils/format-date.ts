import { format, parseISO } from "date-fns";
import { nb } from "date-fns/locale";

export const formatISODateString = (isoDateString?: string) =>
  isoDateString
    ? format(parseISO(isoDateString), "d. MMMM", { locale: nb })
    : "-";
