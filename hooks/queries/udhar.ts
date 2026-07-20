import type { IUdahar, ITransaction } from "@/types/expanse";
import { type SQLiteDatabase } from "expo-sqlite";

// ─── INSERT ──────────────────────────────────────────────────────────────────

export const add_udhar = async (db: SQLiteDatabase, data: IUdahar) => {
  try {
    await db.runAsync(
      "INSERT INTO UdharTransactions (amount, type, expenseType, date, expanseDesc,toWhom, memberId) VALUES (?, ?, ?, ?, ?,?,?)",
      [
        data.amount,
        data.type,
        data.expenseType,
        data.date,
        data.expanseDesc,
        data.toWhom,
        data.memberId,
      ],
    );
  } catch (error) {
    console.error("From useQueries \nError inserting transaction:", error);
  }
};

// ─── READ ────────────────────────────────────────────────────────────────────

export const fetchAllUnPaidTransaction = async (db: SQLiteDatabase) => {
  try {
    const rows: IUdahar[] = await db.getAllAsync(
      "SELECT * FROM UdharTransactions",
    );
    return rows;
  } catch (error) {
    console.error("Error fetching Udhari Data: ", error);
    return [];
  }
};

export const fetchUdharBy_MemberUserId = async (
  db: SQLiteDatabase,
  userId: number | undefined,
) => {
  if (!userId) return [];
  try {
    const rows = await db.getAllAsync<IUdahar>(
      "SELECT * FROM UdharTransactions WHERE memberId = ? ORDER BY _id DESC",
      [userId],
    );
    return rows;
  } catch (error) {
    console.error("Error fetching member udhar: ", error);
    return [];
  }
};

// ─── UPDATE ──────────────────────────────────────────────────────────────────

export const add_Transaction_In_AllTransaction = async (
  db: SQLiteDatabase,
  data: ITransaction,
) => {
  db.withTransactionAsync(async () => {
    try {
      await db.runAsync(
        "INSERT INTO AllTransactions (amount, type, expenseType, date, expanseDesc,toWhom, memberId) VALUES (?, ?, ?, ?, ?,?,?)",
        [
          data.amount,
          data.type,
          data.expenseType,
          data.date,
          data.expanseDesc,
          data.toWhom!,
          data.memberId!,
        ],
      );
    } catch (error) {
      console.error("From useQueries \n Error inserting transaction:", error);
    }
  });
};

// ─── DELETE ──────────────────────────────────────────────────────────────────

export const deleteSingleTransaction = async (
  db: SQLiteDatabase,
  transactionId: string,
) => {
  try {
    await db.runAsync("DELETE FROM UdharTransactions WHERE _id = ?", [
      transactionId,
    ]);
  } catch (error) {
    console.error("Error deleting Transaction: ", error);
    throw new Error("Some Terrible Happens AT Transaction Delete");
  }
};

export const clearUdharTransactionTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM UdharTransactions;");
  } catch (error) {
    console.error("Error clearing UdharTransactions table:", error);
  }
};
