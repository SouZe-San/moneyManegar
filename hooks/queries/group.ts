import type { IGroup } from "@/types/expanse";
import { type SQLiteDatabase } from "expo-sqlite";

// ─── INSERT ──────────────────────────────────────────────────────────────────

export const groupCreate = async (db: SQLiteDatabase, data: IGroup) => {
  db.withTransactionAsync(async () => {
    try {
      await db.runAsync(
        "INSERT INTO GroupTable (name,logo,imgUrl) VALUES (?,?,?)",
        [data.name, data.logo, data.imgUrl],
      );
    } catch (error) {
      console.error("From useQueries \nError While Creating Group : ", error);
    }
  });
};

export const addMember_in_Group = async (
  db: SQLiteDatabase,
  data: { groupId: number; memberId: number },
) => {
  try {
    await db.runAsync(
      "INSERT INTO Group_Member (groupId, memberId) VALUES (?,?)",
      [data.groupId, data.memberId],
    );
  } catch (error) {
    console.error(
      "From useQueries \nError While Adding Member in Group : ",
      error,
    );
    throw new Error("Error While Adding Member in Group");
  }
};

// ─── READ ────────────────────────────────────────────────────────────────────

export const fetchAllGroup = async (db: SQLiteDatabase) => {
  try {
    const rows: IGroup[] = await db.getAllAsync("SELECT * FROM GroupTable");
    return rows;
  } catch (error) {
    console.error("Error fetching All groups: ", error);
    return [];
  }
};

export const fetchAllMember_of_Group = async (
  db: SQLiteDatabase,
  groupId: number,
) => {
  try {
    const rows = await db.getAllAsync<{ memberId: number }>(
      "SELECT memberId FROM Group_Member WHERE groupId = ?",
      [groupId],
    );
    return rows;
  } catch (error) {
    console.error("Error fetching Members of a group: ", error);
    return [];
  }
};

export const fetchGroupId = async (db: SQLiteDatabase, groupName: string) => {
  try {
    const rowId = await db.getFirstAsync<{ _id: number }>(
      "SELECT _id FROM GroupTable WHERE name = ? AND EXISTS (SELECT 1 FROM GroupTable WHERE name = ?) ",
      [groupName, groupName],
    );
    return rowId;
  } catch (error) {
    console.error("Error fetching GroupId: ", error);
    return null;
  }
};

export const fetchGroupBy_id = async (db: SQLiteDatabase, id: string) => {
  try {
    const grp: IGroup | null = await db.getFirstAsync(
      "SELECT * FROM GroupTable WHERE _id = ?",
      [Number(id)],
    );
    return grp;
  } catch (error) {
    console.log("Error From Fetch single Group,: ", error);
    return null;
  }
};

export const fetchAll_Group_Member = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync<{
      _id: number;
      groupId: number;
      memberId: number;
    }>("SELECT * FROM Group_Member");
    return rows;
  } catch (error) {
    console.error("Error fetching Group_Member: ", error);
    return [];
  }
};

// ─── UPDATE ──────────────────────────────────────────────────────────────────

export const updateGroup = async (db: SQLiteDatabase, data: IGroup) => {
  try {
    if (!data._id) {
      throw new Error("Group Id not provided");
    }
    await db.runAsync(
      "UPDATE GroupTable SET name = ?, logo = ?, imgUrl = ? WHERE _id = ?",
      [data.name, data.logo, data.imgUrl, data._id],
    );
  } catch (error) {
    console.error("Error updating GroupTable: ", error);
  }
};

export const updateGroupMember3 = async (
  db: SQLiteDatabase,
  data: { groupId: number; memberId: number; action: "add" | "remove" },
) => {
  try {
    if (data.action === "add") {
      await db.runAsync(
        "INSERT INTO Group_Member (groupId, memberId) VALUES (?, ?)",
        [data.groupId, data.memberId],
      );
    } else if (data.action === "remove") {
      await db.runAsync(
        "DELETE FROM Group_Member WHERE groupId = ? AND memberId = ?",
        [data.groupId, data.memberId],
      );
    } else {
      throw new Error("Invalid action specified. Use 'add' or 'remove'.");
    }
  } catch (error) {
    console.error(
      "From updateGroupMember \nError While Updating Group Member: ",
      error,
    );
    throw new Error("Error While Updating Group Member");
  }
};

// ─── DELETE ──────────────────────────────────────────────────────────────────

export const deleteGroup = async (db: SQLiteDatabase, groupId: number) => {
  try {
    await db.runAsync("DELETE FROM Group_Member WHERE groupId = ? ", [groupId]);
    await db.runAsync("DELETE FROM GroupTable WHERE _id = ?", [groupId]);
  } catch (error) {
    console.error("Error deleting Group: ", error);
    throw new Error("Some Terrible Happens From Deleting Groups");
  }
};

export const deleteGroupMember_ON_grpDelete = async (
  db: SQLiteDatabase,
  groupId: number,
) => {
  try {
    await db.runAsync("DELETE FROM Group_Member WHERE groupId = ? ", [groupId]);
  } catch (error) {
    console.error("Error deleting Group Member on Group Delete: ", error);
    throw new Error("Some Terrible Happens On mem Delete for  Group");
  }
};

export const deleteGroupMember_ON_memDelete = async (
  db: SQLiteDatabase,
  memberId: number,
) => {
  try {
    await db.runAsync("DELETE FROM Group_Member WHERE memberId = ? ", [
      memberId,
    ]);
  } catch (error) {
    console.error("Error deleting Group-Member on MemberDelete: ", error);
  }
};

export const clearGroup_MemberTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM Group_Member;");
  } catch (error) {
    console.error("Error clearing Group_Member table:", error);
  }
};

export const clearGroupTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM GroupTable;");
  } catch (error) {
    console.error("Error clearing GroupTable table:", error);
  }
};
