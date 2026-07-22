import { type SQLiteDatabase } from "expo-sqlite";
import dayjs from "dayjs";
import { parseEntry, type ParsedEntry } from "@/hooks/expanseParser";

export type InboxRow = {
  _id: number;
  raw_text: string;
  source: string;
  status: string;
  parsed_json: string | null;
  created_at: string;
};

// Add New
export const addInboxItem = (
  db: SQLiteDatabase,
  rawText: string,
  source = "text",
) =>
  db.runAsync(
    "INSERT INTO CaptureInbox (raw_text, source, status, created_at) VALUES (?,?, 'pending', ?)",
    [rawText.trim(), source, new Date().toISOString()],
  );

// Fetch all pending or Have to confirmed
export const fetchInbox = (db: SQLiteDatabase) =>
  db.getAllAsync<InboxRow>(
    "SELECT * FROM CaptureInbox WHERE status != 'confirmed' ORDER BY _id DESC",
  );

// Delete Row
export const deleteInboxItem = (db: SQLiteDatabase, id: number) =>
  db.runAsync("DELETE FROM CaptureInbox WHERE _id = ?", [id]);

// Process all pending: run the parser, store the draft (status: parsed)
export const processPending = async (db: SQLiteDatabase) => {
  const pending = await db.getAllAsync<InboxRow>(
    "SELECT * FROM CaptureInbox WHERE status = 'pending'",
  );
  for (const row of pending) {
    try {
      const parsed = await parseEntry(row.raw_text);
      const base = row.created_at ? dayjs(row.created_at) : dayjs();
      parsed.date = base
        .subtract(Math.max(0, parsed.dateOffsetDays ?? 0), "day")
        .format("DD/MM/YY");

      await db.runAsync(
        "UPDATE CaptureInbox SET parsed_json = ?, status = ? WHERE _id = ?",
        [
          JSON.stringify(parsed),
          parsed.amount > 0 ? "parsed" : "failed",
          row._id,
        ],
      );
    } catch {
      await db.runAsync(
        "UPDATE CaptureInbox SET status = 'failed' WHERE _id = ?",
        [row._id],
      );
    }
  }
  return pending.length;
};

// !
export const updateInboxText = (
  db: SQLiteDatabase,
  id: number,
  rawText: string,
) =>
  db.runAsync(
    "UPDATE CaptureInbox SET raw_text = ?, status = 'pending', parsed_json = NULL WHERE _id = ?",
    [rawText.trim(), id],
  );

//! edit parsed fields directly (amount / category / type / description)
export const updateParsedEntry = (
  db: SQLiteDatabase,
  id: number,
  parsed: ParsedEntry,
) =>
  db.runAsync(
    "UPDATE CaptureInbox SET parsed_json = ?, status = 'parsed' WHERE _id = ?",
    [JSON.stringify(parsed), id],
  );

//! confirm returns the new AllTransactions rowid + keeps the raw text (for undo)
export const confirmInboxEntry = async (
  db: SQLiteDatabase,
  row: InboxRow,
  edited?: Partial<ParsedEntry>,
) => {
  const parsed: ParsedEntry = {
    ...JSON.parse(row.parsed_json ?? "{}"),
    ...edited,
  };
  const base = row.created_at ? dayjs(row.created_at) : dayjs();
  const offset = Math.max(0, parsed.dateOffsetDays ?? 0);
   const date = parsed.date ?? base.subtract(offset, "day").format("DD/MM/YY");

  try {
    const res = await db.runAsync(
      "INSERT INTO AllTransactions (amount, type, expenseType, date, expanseDesc) VALUES (?,?,?,?,?)",
      [parsed.amount, parsed.type, parsed.category, date, parsed.description],
    );
    await db.runAsync("DELETE FROM CaptureInbox WHERE _id = ?", [row._id]);
    return {
      txnId: res.lastInsertRowId as number,
      raw: row.raw_text,
      source: row.source,
      parsed,
      createdAt: row.created_at,
    };
  } catch (error) {
    console.error("From Capture \n Error inserting transaction:", error);
    return {
      txnId: 0,
      raw: row.raw_text,
      source: row.source,
      parsed,
      createdAt: null,
    };
  }
};

// UNDO: delete the inserted txn, put the inbox row back as parsed
export const undoConfirm = async (
  db: SQLiteDatabase,
  undone: {
    txnId: number;
    raw: string;
    source: string;
    parsed: ParsedEntry;
    createdAt?: string;
  }[],
) => {
  await db.withTransactionAsync(async () => {
    for (const u of undone) {
      await db.runAsync("DELETE FROM AllTransactions WHERE _id = ?", [u.txnId]);
      await db.runAsync(
        "INSERT INTO CaptureInbox (raw_text, source, status, parsed_json, created_at) VALUES (?,?, 'parsed', ?, ?)",
        [
          u.raw,
          u.source,
          JSON.stringify(u.parsed),
          u.createdAt ?? new Date().toISOString(),
        ],
      );
    }
  });
};
