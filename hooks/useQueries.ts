import { expanseType, ITransaction, IUdahar, Members } from "@/types/expanse";
import { type SQLiteDatabase } from "expo-sqlite";

// ! Data INSERTING - INSERTION ---->

// data insert im AllTransaction Table
const addData_in_AllTransaction = async (db: SQLiteDatabase, data: ITransaction) => {
  db.withTransactionAsync(async () => {
    try {
      await db.runAsync(
        "INSERT INTO AllTransactions (amount, type, expanseType, date, expanseDesc) VALUES (?, ?, ?, ?, ?)",
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
  db.withTransactionAsync(async () => {
    try {
      await db.runAsync(
        "INSERT INTO UdharTransactions (amount, type, expanseType, date, expanseDesc,toWhom, memberId) VALUES (?, ?, ?, ?, ?,?,?)",
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
  });
};

// data insert im MemberTable Table
const memberCreate = async (db: SQLiteDatabase, data: Members) => {
  db.withTransactionAsync(async () => {
    try {
      await db.runAsync("INSERT INTO MemberTable (userName,userId) VALUES (?,?)", [
        data.userName,
        data.useId,
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
  db.withTransactionAsync(async () => {
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
    }
  });
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
    const rows: Members[] = await db.getAllAsync("SELECT * FROM GroupTable");
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

// Calculation

// ! DATA UPDATING - ALTAR ---->

// ! DATA DELETING - DELETION ---->

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
};
