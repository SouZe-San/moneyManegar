import type { Members } from "@/types/expanse";
import { type SQLiteDatabase } from "expo-sqlite";

// ─── INSERT ──────────────────────────────────────────────────────────────────

export const memberCreate = async (db: SQLiteDatabase, data: Members) => {
  db.withTransactionAsync(async () => {
    try {
      await db.runAsync(
        "INSERT INTO MemberTable (userName,userId,imgUrl) VALUES (?,?,?)",
        [data.userName, data.userId, data.imgUrl],
      );
    } catch (error) {
      console.error("From useQueries \nError While Member Add : ", error);
    }
  });
};

// ─── READ ────────────────────────────────────────────────────────────────────

export const fetchAllMember = async (db: SQLiteDatabase) => {
  try {
    const rows: Members[] = await db.getAllAsync("SELECT * FROM MemberTable");
    return rows;
  } catch (error) {
    console.error("Error fetching Members: ", error);
    return [];
  }
};

export const fetchMemberBy_id = async (db: SQLiteDatabase, id: number) => {
  try {
    const member: Members | null = await db.getFirstAsync(
      "SELECT * FROM MemberTable WHERE _id = ?",
      [id],
    );
    return member;
  } catch (error) {
    console.log("Error From Fetch single Member,: ", error);
    return null;
  }
};
export const countMember_byName = async (db: SQLiteDatabase, name: string) => {
  try {
    const row: { count: number } | null = await db.getFirstAsync(
      "SELECT count(userName) AS count FROM MemberTable WHERE TRIM(userName) = ?",
      [name],
    );
    return row?.count;
  } catch (error) {
    console.log("Error From Fetch single Member,: ", error);
    return null;
  }
};

// ─── UPDATE ──────────────────────────────────────────────────────────────────

export const addDueAmount_of_Member = async (
  db: SQLiteDatabase,
  data: { _id: number; amount: number },
) => {
  try {
    const result = await db.runAsync(
      "UPDATE MemberTable SET dueAmount = dueAmount + ? WHERE _id = ?",
      [data.amount, data._id],
    );
    if (result.changes === 0) {
      console.warn("addDueAmount_of_Member: no member matched _id", data._id);
    }
  } catch (error) {
    console.error("Error updating dueAmount in MemberTable: ", error);
  }
};

export const removeDueAmount_of_Member = async (
  db: SQLiteDatabase,
  data: { _id: number; amount: number },
) => {
  try {
    await db.runAsync(
      "UPDATE MemberTable SET dueAmount = dueAmount - ? WHERE _id = ?",
      [data.amount, data._id],
    );
  } catch (error) {
    console.error("Error updating dueAmount in MemberTable: ", error);
  }
};

export const addOweAmount_of_Member = async (
  db: SQLiteDatabase,
  data: { _id: number; amount: number },
) => {
  try {
    await db.runAsync(
      "UPDATE MemberTable SET owedAmount = owedAmount + ? WHERE _id = ?",
      [data.amount, data._id],
    );
  } catch (error) {
    console.error("Error updating owedAmount in MemberTable: ", error);
  }
};

export const removeOweAmount_of_Member = async (
  db: SQLiteDatabase,
  data: { _id: number; amount: number },
) => {
  try {
    await db.runAsync(
      "UPDATE MemberTable SET owedAmount = owedAmount - ? WHERE _id = ?",
      [data.amount, data._id],
    );
  } catch (error) {
    console.error("Error updating owedAmount in MemberTable: ", error);
  }
};

export const updateMember = async (
  db: SQLiteDatabase,
  data: { _id?: number; userName: string; imgUrl: string },
) => {
  try {
    if (!data._id) {
      throw new Error("Member Id not provided");
    }
    await db.runAsync(
      "UPDATE MemberTable SET userName = ?, imgUrl = ? WHERE _id = ?",
      [data.userName, data.imgUrl, data._id],
    );
  } catch (error) {
    console.error("Error updating MemberTable: ", error);
  }
};

export const updateImage_of_Member = async (
  db: SQLiteDatabase,
  data: { _id: number; imgUrl: string },
) => {
  try {
    await db.runAsync("UPDATE MemberTable SET imgUrl = ? WHERE _id = ?", [
      data.imgUrl,
      data._id,
    ]);
  } catch (error) {
    console.error("Error updating MemberTable: ", error);
  }
};

export const updateName_of_Member = async (
  db: SQLiteDatabase,
  data: { _id: number; userName: string },
) => {
  try {
    await db.runAsync("UPDATE MemberTable SET userName = ? WHERE _id = ?", [
      data.userName,
      data._id,
    ]);
  } catch (error) {
    console.error("Error updating MemberTable: ", error);
  }
};

// ─── DELETE ──────────────────────────────────────────────────────────────────

export const deleteMember = async (db: SQLiteDatabase, memberId: number) => {
  try {
    await db.runAsync("DELETE FROM MemberTable WHERE _id = ?", [memberId]);
  } catch (error) {
    console.error("Error deleting Member: ", error);
    throw new Error("This member not settle all Debts!!!");
  }
};

export const clearMemberTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM MemberTable;");
  } catch (error) {
    console.error("Error on clearing MemberTable table:", error);
  }
};
