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
      await db.runAsync("INSERT INTO MemberTable (userName,userId) VALUES (?,?)", [
        data.userName,
        data.userId,
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
const groupCreate = async (db: SQLiteDatabase, data: { groupName: string; groupIcon: string }) => {
  db.withTransactionAsync(async () => {
    try {
      await db.runAsync("INSERT INTO GroupTable (name,logo) VALUES (?,?)", [
        data.groupName,
        data.groupIcon,
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
  data: { groupId: string; memberId: string }
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
// Fetch All unPaid Transaction

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
    console.error("Error fetching data: ", error);
    return 0;
  }
};

// Fetch All Member
const fetchAllMember = async (db: SQLiteDatabase) => {
  try {
    const rows: Members[] = await db.getAllAsync("SELECT * FROM MemberTable");
    return rows;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
};

// Fetch All Group
const fetchAllGroup = async (db: SQLiteDatabase) => {
  try {
    const rows: IGroup[] = await db.getAllAsync("SELECT * FROM GroupTable");
    return rows;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
};

// Fetch All Member of a Group
const fetchAllMember_of_Group = async (db: SQLiteDatabase, groupId: string) => {
  try {
    const rows: Members[] = await db.getAllAsync("SELECT * FROM Group_Member WHERE groupId = ?", [
      groupId,
    ]);
    return rows;
  } catch (error) {
    console.error("Error fetching data: ", error);
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
    console.error("Error fetching data: ", error);
    return null;
  }
};

// Calculation

// ! DATA UPDATING - ALTAR ---->

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
  clearGroupTable,
  clearGroup_MemberTable,
  clearMemberTable,
};
