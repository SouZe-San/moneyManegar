import { clearAllTransactionTable } from "./transaction";
import { clearMemberTable } from "./member";
import { clearGroup_MemberTable, clearGroupTable } from "./group";
import { clearBudgetTable } from "./budget";
import { clearUdharTransactionTable } from "./udhar";
import type { SQLiteDatabase } from "expo-sqlite";
import { resetAllHeaderImages } from "./image";

export {
  addData_in_AllTransaction,
  fetchAllTransaction,
  getTotalIncome,
  getTotalExpense,
  getTotalIncomeMonthWise,
  getTotalExpenseMonthWise,
  fetchOnlyExpense,
  fetchOnlyIncome,
  fetchMonthlyExpense,
  fetchMonthlyIncome,
  fetchTotalExpenseAccordingExpanse,
  deleteTransaction_from_AllTransaction,
  clearAllTransactionTable,
} from "./transaction";

export {
  memberCreate,
  fetchAllMember,
  fetchMemberBy_id,
  addDueAmount_of_Member,
  removeDueAmount_of_Member,
  addOweAmount_of_Member,
  removeOweAmount_of_Member,
  updateMember,
  updateImage_of_Member,
  updateName_of_Member,
  deleteMember,
  clearMemberTable,
} from "./member";

export {
  groupCreate,
  addMember_in_Group,
  fetchAllGroup,
  fetchAllMember_of_Group,
  fetchGroupId,
  fetchGroupBy_id,
  fetchAll_Group_Member,
  updateGroup,
  updateGroupMember3,
  deleteGroup,
  deleteGroupMember_ON_grpDelete,
  deleteGroupMember_ON_memDelete,
  clearGroup_MemberTable,
  clearGroupTable,
} from "./group";

export {
  addBudget,
  fetchAllBudgetsRaw,
  fetchAllBudgets,
  fetchThisMonthBudget,
  isBudgetHave,
  deleteBudget,
  clearBudgetTable,
} from "./budget";

export {
  add_udhar,
  add_Transaction_In_AllTransaction,
  fetchAllUnPaidTransaction,
  fetchUdharBy_MemberUserId,
  deleteSingleTransaction,
  clearUdharTransactionTable,
} from "./udhar";

export {
fetchHeaderImages,resetAllHeaderImages,resetHeaderImage,setHeaderImage
} from "./image";

export const resetDb = async (db: SQLiteDatabase) => {
  try {
    await clearGroup_MemberTable(db);
    await clearAllTransactionTable(db);
    await clearUdharTransactionTable(db);
    await clearGroupTable(db);
    await clearMemberTable(db);
    await clearBudgetTable(db);
    await resetAllHeaderImages(db);
  } catch (error) {
    console.error("Error clearing tables:", error);
    throw new Error("KILL KIL KILL KILL");
  }
};
