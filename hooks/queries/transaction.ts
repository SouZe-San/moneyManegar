import type { ITransaction, expenseType } from "@/types/expanse";
import { type SQLiteDatabase } from "expo-sqlite";
import { isoFromTxnDate } from "./utils";

// ─── INSERT ──────────────────────────────────────────────────────────────────

export const addData_in_AllTransaction = async (
  db: SQLiteDatabase,
  data: ITransaction,
) => {
  db.withTransactionAsync(async () => {
    try {
      await db.runAsync(
        "INSERT INTO AllTransactions (amount, type, expenseType, date, expanseDesc) VALUES (?, ?, ?, ?, ?)",
        [data.amount, data.type, data.expenseType, data.date, data.expanseDesc],
      );
    } catch (error) {
      console.error("From useQueries \n Error inserting transaction:", error);
    }
  });
};

// ─── READ ────────────────────────────────────────────────────────────────────

export const fetchAllTransaction = async (db: SQLiteDatabase) => {
  try {
    const rows: ITransaction[] = await db.getAllAsync(
      "SELECT * FROM AllTransactions",
    );
    return rows;
  } catch (error) {
    console.error("Error fetching AllTransactions: ", error);
    return [];
  }
};

export const getTotalIncome = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync<{ total: number }>(
      "SELECT SUM(amount) as total FROM AllTransactions WHERE type = 'income'",
    );
    return rows[0].total;
  } catch (error) {
    console.error("Error fetching totalIncome: ", error);
    return 0;
  }
};

export const getTotalExpense = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync<{ total: number }>(
      "SELECT SUM(amount) as total FROM AllTransactions WHERE type = 'expense'",
    );
    return rows[0].total;
  } catch (error) {
    console.error("Error fetching totalExpense: ", error);
    return 0;
  }
};

export const getTotalIncomeMonthWise = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync<{ total: number }>(
      `SELECT SUM(amount) as total
       FROM AllTransactions
       WHERE type = 'income'
       AND STRFTIME(     '%Y-%m',     ${isoFromTxnDate("date")}   ) = strftime('%Y-%m','now','localtime') `,
    );
    return rows[0].total ?? 0;
  } catch (error) {
    console.error("Error fetching totalIncomeMonthWise: ", error);
    return 0;
  }
};

export const getTotalExpenseMonthWise = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync<{ total: number }>(
      `SELECT SUM(amount) as total
      FROM AllTransactions
      WHERE type = 'expense'
      AND STRFTIME(     '%Y-%m',     ${isoFromTxnDate("date")}   ) = strftime('%Y-%m','now','localtime') `,
    );
    return rows[0].total ?? 0;
  } catch (error) {
    console.error("Error fetching totalExpenseMonthWise: ", error);
    return 0;
  }
};

export const fetchOnlyExpense = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync<{ amount: number }>(
      "SELECT amount FROM AllTransactions WHERE type = 'expense'",
    );
    return rows.map((row) => ({ value: row.amount }));
  } catch (error) {
    console.error("Error fetching fetchOnlyExpense: ", error);
    return [];
  }
};

export const fetchOnlyIncome = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync<{ amount: number }>(
      "SELECT amount FROM AllTransactions WHERE type = 'income'",
    );
    return rows.map((row) => ({ value: row.amount }));
  } catch (error) {
    console.error("Error fetching fetchOnlyIncome: ", error);
    return [];
  }
};

export const fetchMonthlyExpense = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync<{ ym: string; value: number }>(
      `SELECT
          STRFTIME('%Y-%m', ${isoFromTxnDate("date")}) AS ym,
         SUM(amount) AS value
       FROM AllTransactions
       WHERE type = 'expense'
       GROUP BY ym
       ORDER BY ym DESC
       LIMIT 4`,
    );
    return rows.reverse().map((r) => ({
      value: r.value ?? 0,
      label: new Date(r.ym + "-01").toLocaleString("en-US", { month: "short" }),
    }));
  } catch (error) {
    console.error("Error fetching monthly expense: ", error);
    return [];
  }
};

export const fetchMonthlyIncome = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync<{ ym: string; value: number }>(
      `SELECT
         STRFTIME('%Y-%m', ${isoFromTxnDate("date")}) AS ym,
         SUM(amount) AS value
       FROM AllTransactions
       WHERE type = 'income'
       GROUP BY ym
       ORDER BY ym DESC
       LIMIT 4`,
    );
    return rows.reverse().map((r) => ({
      value: r.value ?? 0,
      label: new Date(r.ym + "-01").toLocaleString("en-US", { month: "short" }),
    }));
  } catch (error) {
    console.error("Error fetching monthly income: ", error);
    return [];
  }
};

export const fetchTotalExpenseAccordingExpanse = async (db: SQLiteDatabase) => {
  const query =
    "SELECT expenseType, SUM(amount) AS total_expense FROM AllTransactions WHERE type = 'expense' GROUP BY expenseType";
  try {
    const rows = await db.getAllAsync<{
      expenseType: expenseType;
      total_expense: number;
    }>(query);
    return rows;
  } catch (error) {
    console.error("Error fetching Expense As Type: ", error);
    return [];
  }
};

// ─── DELETE ──────────────────────────────────────────────────────────────────

export const deleteTransaction_from_AllTransaction = async (
  db: SQLiteDatabase,
  transactionId: string,
) => {
  try {
    await db.runAsync("DELETE FROM AllTransactions WHERE _id = ?", [
      transactionId,
    ]);
  } catch (error) {
    console.error("Error deleting AllTransaction row: ", error);
    throw new Error("Some Terrible Happens AT AllTransaction Delete");
  }
};

export const clearAllTransactionTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM AllTransactions;");
  } catch (error) {
    console.error("Error clearing AllTransactions table:", error);
  }
};
