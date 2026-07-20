/**
 * SQLite fragment that converts the app's stored `DD/MM/YY` date text
 * into ISO `YYYY-MM-DD` so SQLite date/strftime functions work on it.
 *
 * NOTE: assumes 21st-century years (prefixes "20"), matching how dates are
 * written on insert via dayjs("DD/MM/YY"). This is the single source of truth
 * for that assumption — change it here if the stored format ever changes.
 */
export const isoFromTxnDate = (col: string = "date") =>
  `'20' || SUBSTR(${col}, 7, 2) || '-' || SUBSTR(${col}, 4, 2) || '-' || SUBSTR(${col}, 1, 2)`;
