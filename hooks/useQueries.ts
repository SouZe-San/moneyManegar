import { Groups, ITransaction, IUdahar, Members, IGroup } from "@/types/expanse";
import { type SQLiteDatabase } from "expo-sqlite";

// ! Data INSERTING - INSERTION ---->

// data insert im AllTransaction Table
const addData_in_AllTransaction = async (db: SQLiteDatabase, data: ITransaction) => {
  db.withTransactionAsync(async () => {
    try {
      await db.runAsync(
        "INSERT INTO AllTransactions (amount, type, expenseType, date, expanseDesc) VALUES (?, ?, ?, ?, ?)",
        [data.amount, data.type, data.expenseType, data.date, data.expanseDesc]
      );
      console.log("====================================");
      console.log("Transaction inserted:");
      console.log("====================================");
    } catch (error) {
      console.error("From useQueries \n Error inserting transaction:", error);
    }
  });
};

// data insert im UdharTransactions Table
const add_udhar = async (db: SQLiteDatabase, data: IUdahar) => {
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
      ]
    );
    console.log("====================================");
    console.log("Transaction inserted:");
    console.log("====================================");
  } catch (error) {
    console.error("From useQueries \nError inserting transaction:", error);
  }
};

// data insert im MemberTable Table
const memberCreate = async (db: SQLiteDatabase, data: Members) => {
  db.withTransactionAsync(async () => {
    try {
      await db.runAsync("INSERT INTO MemberTable (userName,userId,imgUrl) VALUES (?,?,?)", [
        data.userName,
        data.userId,
        data.imgUrl,
      ]);
      console.log("====================================");
      console.log("Member inserted:");
      console.log("===================================");
    } catch (error) {
      console.error("From useQueries \nError While Member Add : ", error);
    }
  });
};

// Create new Group
const groupCreate = async (db: SQLiteDatabase, data: IGroup) => {
  db.withTransactionAsync(async () => {
    try {
      await db.runAsync("INSERT INTO GroupTable (name,logo,imgUrl) VALUES (?,?,?)", [
        data.name,
        data.logo,
        data.imgUrl,
      ]);
      console.log("====================================");
      console.log("Group Created !!");
      console.log("===================================");
    } catch (error) {
      console.error("From useQueries \nError While Creating Group : ", error);
    }
  });
};

// add Member in Group
const addMember_in_Group = async (
  db: SQLiteDatabase,
  data: { groupId: number; memberId: number }
) => {
  try {
    await db.runAsync("INSERT INTO Group_Member (groupId, memberId) VALUES (?,?)", [
      data.groupId,
      data.memberId,
    ]);
    console.log("====================================");
    console.log("Member Added in Group !!");
    console.log("===================================");
  } catch (error) {
    console.error("From useQueries \nError While Adding Member in Group : ", error);
    throw new Error("Error While Adding Member in Group");
  }
};

// ! DATE FETCHING - READ ---->

// Fetch All Transaction
const fetchAllTransaction = async (db: SQLiteDatabase) => {
  try {
    const rows: ITransaction[] = await db.getAllAsync("SELECT * FROM AllTransactions");
    return rows;
  } catch (error) {
    console.error("Error fetching AllTransactions: ", error);
    return [];
  }
};
// Fetch All unPaid Transaction

const fetchAllUnPaidTransaction = async (db: SQLiteDatabase) => {
  try {
    const rows: IUdahar[] = await db.getAllAsync(
      "SELECT * FROM UdharTransactions WHERE type = 'debt'"
    );
    return rows;
  } catch (error) {
    console.error("Error fetching Udhari Data: ", error);
    return [];
  }
};
// calculate total Income and expense
const totalIncome = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync(
      "SELECT SUM(amount) as total FROM AllTransactions WHERE type = 'income'"
    );
    console.log("============All Tra========================");
    console.log(rows);

    return;
  } catch (error) {
    console.error("Error fetching totalIncome: ", error);
    return 0;
  }
};

// Fetch All Member
const fetchAllMember = async (db: SQLiteDatabase) => {
  try {
    const rows: Members[] = await db.getAllAsync("SELECT * FROM MemberTable");
    return rows;
  } catch (error) {
    console.error("Error fetching Members: ", error);
    return [];
  }
};

// Fetch All Group
const fetchAllGroup = async (db: SQLiteDatabase) => {
  try {
    const rows: IGroup[] = await db.getAllAsync("SELECT * FROM GroupTable");
    return rows;
  } catch (error) {
    console.error("Error fetching All groups: ", error);
    return [];
  }
};

// Fetch All Member of a Group
const fetchAllMember_of_Group = async (db: SQLiteDatabase, groupId: number) => {
  try {
    const rows = await db.getAllAsync<{ memberId: number }>(
      "SELECT memberId FROM Group_Member WHERE groupId = ?",
      [groupId]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching Members of a group: ", error);
    return [];
  }
};

// Fetch the group of the given name and return the id
const fetchGroupId = async (db: SQLiteDatabase, groupName: string) => {
  try {
    const rowId = await db.getFirstAsync<{ _id: number }>(
      "SELECT _id FROM GroupTable WHERE name = ?",
      [groupName]
    );
    return rowId;
  } catch (error) {
    console.error("Error fetching GroupId: ", error);
    return null;
  }
};

const fetchGroupBy_id = async (db: SQLiteDatabase, id: string) => {
  try {
    const grp: IGroup | null = await db.getFirstAsync("SELECT * FROM GroupTable WHERE _id = ?", [
      Number(id),
    ]);
    return grp;
  } catch (error) {
    console.log("Error From Fetch single Group,: ", error);
    return null;
  }
};

const fetchMemberBy_id = async (db: SQLiteDatabase, id: number) => {
  try {
    const member: Members | null = await db.getFirstAsync(
      "SELECT * FROM MemberTable WHERE _id = ?",
      [id]
    );
    return member;
  } catch (error) {
    console.log("Error From Fetch single Member,: ", error);
    return null;
  }
};

// Fetch according Expanse

// Fetch according Date

// Calculation

// ! DATA UPDATING - ALTAR ---->

// update any member's due amount

// update any member's owned amount

// update any member's details

// update any group's details

// update

// ! DATA DELETING - DELETION ---->
const clearGroup_MemberTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM Group_Member;");
    console.log("All records deleted from Group_Member table.");
  } catch (error) {
    console.error("Error clearing Group_Member table:", error);
  }
};
const clearMemberTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM MemberTable;");
    console.log("All records deleted from MemberTable table.");
  } catch (error) {
    console.error("Error on clearing MemberTable table:", error);
  }
};
const clearGroupTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM GroupTable;");
    console.log("All records deleted from GroupTable table.");
  } catch (error) {
    console.error("Error clearing GroupTable table:", error);
  }
};

const resetDb = async (db: SQLiteDatabase) => {
  try {
    await clearGroup_MemberTable(db);
    await clearGroupTable(db);
    await clearMemberTable(db);
  } catch (error) {
    console.error("Error clearing GroupTable table:", error);
  }
};

// export all functions
export {
  addData_in_AllTransaction,
  add_udhar,
  memberCreate,
  groupCreate,
  addMember_in_Group,
  totalIncome,
  fetchAllMember,
  fetchAllGroup,
  fetchAllMember_of_Group,
  fetchGroupId,
  fetchGroupBy_id,
  fetchMemberBy_id,
  clearGroupTable,
  clearGroup_MemberTable,
  clearMemberTable,
  resetDb,
  fetchAllTransaction,
  fetchAllUnPaidTransaction,
};
