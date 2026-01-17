import moment from "moment";

/**
 * Convert ISO date string to readable format
 *
 * @param date - ISO string | Date | null
 * @param format - moment format string (optional)
 * @returns formatted date or "N/A"
 */
export const formatDateTime = (
  date?: string | Date | null,
  format: string = "DD/MM/YYYY"
): string => {
  if (!date) return "N/A";

  const m = moment(date);

  if (!m.isValid()) return "N/A";

  return m.format(format);
};
