import type { Budget } from "@/types/expanse";
import { type SQLiteDatabase } from "expo-sqlite";

// ─── INSERT ──────────────────────────────────────────────────────────────────

export const addBudget = async (
  db: SQLiteDatabase,
  data: { date: string; amount: number },
) => {
  try {
    await db.runAsync(
      "INSERT INTO BudgetTable (amount, date) SELECT ?, ? WHERE NOT EXISTS (   SELECT 1 FROM BudgetTable   WHERE strftime('%Y-%m', date) = strftime('%Y-%m', ?) )",
      [data.amount, data.date, data.date],
    );
  } catch (error) {
    console.error("Error - Insert budget : ", error);
  }
};

// ─── READ ────────────────────────────────────────────────────────────────────

export const fetchAllBudgetsRaw = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync<{
      _id: number;
      amount: number;
      date: string;
    }>("SELECT * FROM BudgetTable");
    return rows;
  } catch (error) {
    console.error("Error fetching raw Budgets: ", error);
    return [];
  }
};

export const fetchAllBudgets = async (db: SQLiteDatabase) => {
  const query =
    "SELECT   b._id,   STRFTIME('%Y', b.date) AS year,   STRFTIME('%m', b.date) AS month,   COALESCE(b.amount, 0) AS budget_amount,   COALESCE(     SUM(       CASE         WHEN a.type = 'expense' THEN a.amount         WHEN a.type = 'income' THEN - a.amount         ELSE 0       END     ),     0   ) AS total_expense FROM   (     SELECT       _id,       DATE,       amount     FROM       BudgetTable   ) b   LEFT JOIN AllTransactions a ON STRFTIME(     '%Y-%m',     '20' || SUBSTR(a.date, 7, 2) || '-' || SUBSTR(a.date, 4, 2) || '-' || SUBSTR(a.date, 1, 2)   ) = STRFTIME('%Y-%m', b.date)   AND a.expenseType not in ('Salary','Gift','Business') GROUP BY   STRFTIME('%Y-%m', b.date) ORDER BY   STRFTIME('%Y-%m', b.date) ASC";

  try {
    const rows: Budget[] = await db.getAllAsync(query);
    return rows;
  } catch (error) {
    console.error("Error fetching Budgets: ", error);
    return [];
  }
};

export const fetchThisMonthBudget = async (db: SQLiteDatabase) => {
  const query =
    "SELECT   strftime('%m', b.date) AS month,   COALESCE(b.amount, 0) AS budget_amount,     COALESCE(     SUM(       CASE WHEN a.type = 'expense' THEN a.amount WHEN a.type = 'income'  THEN -a.amount ELSE 0 END     ), 0   ) AS total_expense FROM BudgetTable b LEFT JOIN AllTransactions a ON STRFTIME(     '%Y-%m',     '20' || SUBSTR(a.date, 7, 2) || '-' || SUBSTR(a.date, 4, 2) || '-' || SUBSTR(a.date, 1, 2)   )  = strftime('%Y-%m', b.date)   AND a.expenseType not in ('Salary','Gift','Business') WHERE strftime('%Y-%m', b.date) = strftime('%Y-%m','now','localtime') GROUP BY strftime('%Y-%m', b.date)";

  try {
    const rows = await db.getAllAsync<{
      month: string;
      budget_amount: number;
      total_expense: number;
    }>(query);
    return rows[0];
  } catch (error) {
    console.error("Error fetching Budgets: ", error);
    return null;
  }
};

export const isBudgetHave = async (db: SQLiteDatabase) => {
  const query = "SELECT _id from BudgetTable LIMIT 1";
  try {
    const rows = await db.getAllAsync(query);
    return rows;
  } catch (error) {
    console.error("Error fetching Budgets: ", error);
    return [];
  }
};

// ─── DELETE ──────────────────────────────────────────────────────────────────

export const deleteBudget = async (db: SQLiteDatabase, budgetId: string) => {
  try {
    await db.runAsync("DELETE FROM BudgetTable WHERE _id = ?", [budgetId]);
  } catch (error) {
    console.error("Error deleting Budget: ", error);
    throw new Error("Some Terrible Happens AT Budget Delete");
  }
};

export const clearBudgetTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM BudgetTable;");
  } catch (error) {
    console.error("Error clearing BudgetTable table:", error);
  }
};
