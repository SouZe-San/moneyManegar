import { Groups, ITransaction, IUdahar, Members, IGroup, expenseType } from "@/types/expanse";
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
    } catch (error) {
      console.error("From useQueries \n Error inserting transaction:", error);
    }
  });
};

const add_Transaction_In_AllTransaction = async (db: SQLiteDatabase, data: ITransaction) => {
  db.withTransactionAsync(async () => {
    try {
      await db.runAsync(
        "INSERT INTO AllTransactions (amount, type, expenseType, date, expanseDesc,toWhom) VALUES (?, ?, ?, ?, ?,?)",
        [data.amount, data.type, data.expenseType, data.date, data.expanseDesc, data.toWhom!]
      );
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

    await db.runAsync("UPDATE MemberTable SET dueAmount = dueAmount + ? WHERE _id = ?", []); // update dueAmount in MemberTable
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
    const rows: IUdahar[] = await db.getAllAsync("SELECT * FROM UdharTransactions");
    return rows;
  } catch (error) {
    console.error("Error fetching Udhari Data: ", error);
    return [];
  }
};
// calculate total Income and expense
const getTotalIncome = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync<{ total: number }>(
      "SELECT SUM(amount) as total FROM AllTransactions WHERE type = 'income'"
    );
    return rows[0].total;
  } catch (error) {
    console.error("Error fetching totalIncome: ", error);
    return 0;
  }
};
const getTotalExpense = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync<{ total: number }>(
      "SELECT SUM(amount) as total FROM AllTransactions WHERE type = 'expense'"
    );

    return rows[0].total;
  } catch (error) {
    console.error("Error fetching totalIncome: ", error);
    return 0;
  }
};

const fetchOnlyExpense = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync<{ amount: number }>(
      "SELECT amount FROM AllTransactions WHERE type = 'expense'"
    );
    return rows.map((row) => {
      return { value: row.amount };
    });
  } catch (error) {
    console.error("Error fetching totalIncome: ", error);
    return [];
  }
};
const fetchOnlyIncome = async (db: SQLiteDatabase) => {
  try {
    const rows = await db.getAllAsync<{ amount: number }>(
      "SELECT amount FROM AllTransactions WHERE type = 'income'"
    );
    return rows.map((row) => {
      return { value: row.amount };
    });
  } catch (error) {
    console.error("Error fetching totalIncome: ", error);
    return [];
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
      "SELECT _id FROM GroupTable WHERE name = ? AND EXISTS (SELECT 1 FROM GroupTable WHERE name = ?) ",
      [groupName, groupName]
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
const fetchTotalExpenseAccordingExpanse = async (db: SQLiteDatabase) => {
  const query =
    "SELECT expenseType, SUM(amount) AS total_expense FROM AllTransactions WHERE type = 'expense' GROUP BY expenseType";
  try {
    const rows = await db.getAllAsync<{ expenseType: expenseType; total_expense: number }>(query);
    return rows;
  } catch (error) {
    console.error("Error fetching Expense As Type: ", error);
    return [];
  }
};
// Fetch according Date

// Calculation

// ! DATA UPDATING - ALTAR ---->

//member

// update any member's due amount
const addDueAmount_of_Member = async (
  db: SQLiteDatabase,
  data: { userName: string; amount: number }
) => {
  try {
    await db.runAsync("UPDATE MemberTable SET dueAmount = dueAmount + ? WHERE userName = ?", [
      data.amount,
      data.userName,
    ]);
  } catch (error) {
    console.error("Error updating dueAmount in MemberTable: ", error);
  }
};
const removeDueAmount_of_Member = async (
  db: SQLiteDatabase,
  data: { userName: string; amount: number }
) => {
  try {
    await db.runAsync("UPDATE MemberTable SET dueAmount = dueAmount - ? WHERE userName = ?", [
      data.amount,
      data.userName,
    ]);
  } catch (error) {
    console.error("Error updating dueAmount in MemberTable: ", error);
  }
};

// update any member's owned amount
const addOweAmount_of_Member = async (
  db: SQLiteDatabase,
  data: { userName: string; amount: number }
) => {
  try {
    await db.runAsync("UPDATE MemberTable SET owedAmount = owedAmount + ? WHERE userName = ?", [
      data.amount,
      data.userName,
    ]);
  } catch (error) {
    console.error("Error updating dueAmount in MemberTable: ", error);
  }
};
const removeOweAmount_of_Member = async (
  db: SQLiteDatabase,
  data: { userName: string; amount: number }
) => {
  try {
    await db.runAsync("UPDATE MemberTable SET owedAmount = owedAmount - ? WHERE userName = ?", [
      data.amount,
      data.userName,
    ]);
  } catch (error) {
    console.error("Error updating dueAmount in MemberTable: ", error);
  }
};

// update any member's details
const updateMember = async (
  db: SQLiteDatabase,
  data: { _id?: number; userName: string; imgUrl: string }
) => {
  try {
    if (!data._id) {
      throw new Error("Member Id not provided");
    }
    await db.runAsync("UPDATE MemberTable SET userName = ? imgUrl = ? WHERE _id = ?", [
      data.userName,
      data.imgUrl,
      data._id,
    ]);
  } catch (error) {
    console.error("Error updating MemberTable: ", error);
  }
};

const updateImage_of_Member = async (db: SQLiteDatabase, data: { _id: number; imgUrl: string }) => {
  try {
    await db.runAsync("UPDATE MemberTable SET imgUrl = ? WHERE _id = ?", [data.imgUrl, data._id]);
  } catch (error) {
    console.error("Error updating MemberTable: ", error);
  }
};
const updateName_of_Member = async (
  db: SQLiteDatabase,
  data: { _id: number; userName: string }
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

// update any group's details

const updateGroup = async (db: SQLiteDatabase, data: IGroup) => {
  try {
    if (!data._id) {
      throw new Error("Group Id not provided");
    }
    await db.runAsync("UPDATE GroupTable SET name = ?, logo = ?, imgUrl = ? WHERE _id = ?", [
      data.name,
      data.logo,
      data.imgUrl,
      data._id,
    ]);
  } catch (error) {
    console.error("Error updating GroupTable: ", error);
  }
};

const updateGroupMember3 = async (
  db: SQLiteDatabase,
  data: { groupId: number; memberId: number; action: "add" | "remove" }
) => {
  try {
    if (data.action === "add") {
      // Attempt to add the member to the group
      await db.runAsync("INSERT INTO Group_Member (groupId, memberId) VALUES (?, ?)", [
        data.groupId,
        data.memberId,
      ]);
    } else if (data.action === "remove") {
      // Attempt to remove the member from the group
      await db.runAsync("DELETE FROM Group_Member WHERE groupId = ? AND memberId = ?", [
        data.groupId,
        data.memberId,
      ]);
    } else {
      throw new Error("Invalid action specified. Use 'add' or 'remove'.");
    }
  } catch (error) {
    console.error("From updateGroupMember \nError While Updating Group Member: ", error);
    throw new Error("Error While Updating Group Member");
  }
};

// ! DATA DELETING - DELETION ---->

const clearGroup_MemberTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM Group_Member;");
  } catch (error) {
    console.error("Error clearing Group_Member table:", error);
  }
};
const clearMemberTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM MemberTable;");
  } catch (error) {
    console.error("Error on clearing MemberTable table:", error);
  }
};
const clearGroupTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM GroupTable;");
  } catch (error) {
    console.error("Error clearing GroupTable table:", error);
  }
};
const clearAllTransactionTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM AllTransactions;");
  } catch (error) {
    console.error("Error clearing AllTransactions table:", error);
  }
};
const clearUdharTransactionTable = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM UdharTransactions;");
  } catch (error) {
    console.error("Error clearing UdharTransactions table:", error);
  }
};

const deleteMember = async (db: SQLiteDatabase, memberId: number) => {
  try {
    await db.runAsync("DELETE FROM MemberTable WHERE _id = ?", [memberId]);
  } catch (error) {
    console.error("Error deleting Member: ", error);
    throw new Error("Some Terrible Happens from Delete members ");
  }
};

const deleteGroup = async (db: SQLiteDatabase, groupId: number) => {
  try {
    await db.runAsync("DELETE FROM Group_Member WHERE groupId = ? ", [groupId]);
    await db.runAsync("DELETE FROM GroupTable WHERE _id = ?", [groupId]);
  } catch (error) {
    console.error("Error deleting Group: ", error);
    throw new Error("Some Terrible Happens From Deleting Groups");
  }
};

const deleteGroupMember_ON_grpDelete = async (db: SQLiteDatabase, groupId: number) => {
  try {
    await db.runAsync("DELETE FROM Group_Member WHERE groupId = ? ", [groupId]);
  } catch (error) {
    console.error("Error deleting Group Member on Group Delete: ", error);
    throw new Error("Some Terrible Happens On mem Delete for  Group");
  }
};
const deleteGroupMember_ON_memDelete = async (db: SQLiteDatabase, memberId: number) => {
  try {
    await db.runAsync("DELETE FROM Group_Member WHERE memberId = ? ", [memberId]);
  } catch (error) {
    console.error("Error deleting Group-Member on MemberDelete: ", error);
  }
};

const deleteSingleTransaction = async (db: SQLiteDatabase, transactionId: string) => {
  try {
    await db.runAsync("DELETE FROM UdharTransactions WHERE _id = ?", [transactionId]);
  } catch (error) {
    console.error("Error deleting Transaction: ", error);
    throw new Error("Some Terrible Happens AT Transaction Delete");
  }
};

const resetDb = async (db: SQLiteDatabase) => {
  try {
    await clearGroup_MemberTable(db);
    await clearGroupTable(db);
    await clearMemberTable(db);
    await clearAllTransactionTable(db);
    await clearUdharTransactionTable(db);
  } catch (error) {
    console.error("Error clearing GroupTable table:", error);
    throw new Error("KILL KIL KILL KILL");
  }
};

// export all functions
export {
  // Insert
  addData_in_AllTransaction,
  add_Transaction_In_AllTransaction,
  add_udhar,
  memberCreate,
  groupCreate,
  addMember_in_Group,

  // Fetch
  getTotalIncome,
  getTotalExpense,
  fetchAllMember,
  fetchAllGroup,
  fetchAllMember_of_Group,
  fetchGroupId,
  fetchAllTransaction,
  fetchAllUnPaidTransaction,
  fetchTotalExpenseAccordingExpanse,
  fetchOnlyExpense,
  fetchOnlyIncome,

  // Update
  addDueAmount_of_Member,
  addOweAmount_of_Member,
  removeDueAmount_of_Member,
  removeOweAmount_of_Member,
  updateImage_of_Member,
  updateName_of_Member,
  updateMember,
  updateGroup,
  updateGroupMember3,

  // Delete
  deleteMember,
  deleteGroup,
  deleteGroupMember_ON_grpDelete,
  deleteGroupMember_ON_memDelete,
  deleteSingleTransaction,

  // Clear
  clearAllTransactionTable,
  clearUdharTransactionTable,
  fetchGroupBy_id,
  fetchMemberBy_id,
  clearGroupTable,
  clearGroup_MemberTable,
  clearMemberTable,
  resetDb,
};
