import dayjs, { Dayjs } from "dayjs";

/**
 * The app stores dates as "DD/MM/YY" text everywhere (AllTransactions,
 * UdharTransactions). dayjs cannot parse that without the customParseFormat
 * plugin — which this project does not load — so parse it by hand.
 *
 * Returns today if the string is missing or malformed, so callers never get
 * an Invalid Date.
 */
export const parseAppDate = (s?: string | null): Dayjs => {
  if (!s) return dayjs();
  const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return dayjs();

  const day = parseInt(m[1], 10);
  const month = parseInt(m[2], 10);
  let year = parseInt(m[3], 10);
  if (m[3].length <= 2) year += 2000; // "26" -> 2026

  const d = dayjs(new Date(year, month - 1, day));
  return d.isValid() ? d : dayjs();
};

/** Dayjs -> the app's stored format. */
export const toAppDate = (d: Dayjs): string => d.format("DD/MM/YY");

/** "18/07/26" -> "18 Jul" — compact form for list rows. */
export const shortAppDate = (s?: string | null): string =>
  parseAppDate(s).format("DD MMM");
