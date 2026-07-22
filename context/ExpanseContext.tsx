import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useColorScheme } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

import type { Members, IGroup, expenseType } from "@/types/expanse";

import {
  fetchTotalExpenseAccordingExpanse,
  getTotalExpense,
  getTotalIncome,
  getTotalExpenseMonthWise,
  getTotalIncomeMonthWise,
} from "@/hooks/queries/transaction";
import { fetchAllMember } from "@/hooks/queries/member";
import { fetchAllGroup } from "@/hooks/queries/group";
import { getThemeColorMapping } from "@/hooks/useThemeColor";
import { showToastWithMsg } from "@/hooks/useFunc";

export interface ExpenseContextType {
  totalIncome: number;
  totalExpense: number;
  totalExpenseMonthWise: number;
  totalIncomeMonthWise: number;
  leftBalance: number;
  userName: string | null;
  email: string | null;
  firstRefresh: () => Promise<void>;
  groups: IGroup[];
  members: Members[];
  onRefresh: () => void;
  refresh: boolean;
  totalBudget: {
    label: string;
    value: number;
    frontColor: string;
  }[];
  expenseTypeData: { text: expenseType; value: number; color: string }[];
  expenseInMonth: boolean;
  setExpenseInMonth: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [totalIncomeMonthWise, setTotalIncomeMonthWise] = useState<number>(0);
  const [totalExpenseMonthWise, setTotalExpenseMonthWise] = useState<number>(0);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [members, setMember] = useState<Members[]>([]);
  const [expenseTypeData, setExpenseTypeData] = useState<
    { text: expenseType; value: number; color: string }[]
  >([]);
  const [expenseInMonth, setExpenseInMonth] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const db = useSQLiteContext();

  const theme = useColorScheme() ?? "light";

  const aggregateExpenses = useCallback(async () => {
    const raw: { expenseType: expenseType; total_expense: number }[] =
      await fetchTotalExpenseAccordingExpanse(db);

    const TOP = 6;
    const result = raw.slice(0, TOP).map(({ total_expense, expenseType }) => ({
      text: expenseType,
      value: total_expense,
      color: getThemeColorMapping(theme, expenseType),
    }));

    const rest = raw.slice(TOP);
    if (rest.length) {
      const othersTotal = rest.reduce((s, d) => s + d.total_expense, 0);
      const existing = result.find((r) => r.text === "Others");
      if (existing) existing.value += othersTotal;
      else
        result.push({
          text: "Others" as expenseType,
          value: othersTotal,
          color: getThemeColorMapping(theme, "Others" as expenseType),
        });
    }

    return result;
  }, [db, theme]);

  const fetchData = useCallback(async () => {
    try {
      const [
        members,
        groups,
        income,
        incomeThisMonth,
        expense,
        expenseThisMonth,
        data,
      ] = await Promise.all([
        fetchAllMember(db),
        fetchAllGroup(db),
        getTotalIncome(db),
        getTotalIncomeMonthWise(db),
        getTotalExpense(db),
        getTotalExpenseMonthWise(db),
        aggregateExpenses(),
      ]);

      setMember(members);
      setGroups(groups);
      setTotalIncome(income ?? 0);
      setTotalIncomeMonthWise(incomeThisMonth ?? 0);
      setTotalExpense(expense ?? 0);
      setTotalExpenseMonthWise(expenseThisMonth ?? 0);
      setExpenseTypeData(data);
    } catch (error) {
      showToastWithMsg("Data fetching Failed !!");
      console.error("Error fetching data: ", error);
    } finally {
      setRefresh(false);
    }
  }, [db, aggregateExpenses]);

  const onRefresh = useCallback(() => {
    setRefresh(true);
    fetchData();
  }, [fetchData]);

  const leftBalance = useMemo(
    () => openingBalance + totalIncome - totalExpense,
    [openingBalance, totalIncome, totalExpense],
  );

  const totalBudget = useMemo(
    () => [
      {
        label: "Income",
        value: totalIncome,
        frontColor: "#b3df43",
      },
      {
        label: "Expense",
        value: totalExpense,
        frontColor: "#f33933",
      },
    ],
    [totalIncome, totalExpense],
  );

  const firstRefresh = useCallback(async () => {
    try {
      const useName = await SecureStore.getItemAsync("user");
      setUserName(useName);
      const resE = await SecureStore.getItemAsync("email");
      setEmail(resE);
      const resOb = await SecureStore.getItemAsync("openingBalance");
      setOpeningBalance(resOb ? parseFloat(resOb) || 0 : 0);

      const resExpeTy = await SecureStore.getItemAsync("durationType");
      const isMonth = resExpeTy === "true";
      setExpenseInMonth(isMonth);
    } catch (error) {
      console.log("Error in ExpenseProvider: ", error);
    }
  }, []);

  useEffect(() => {
    firstRefresh();
    fetchData();
  }, [firstRefresh, fetchData]);

  const value = useMemo(
    () => ({
      totalIncome,
      totalIncomeMonthWise,
      totalExpense,
      totalExpenseMonthWise,
      userName,
      email,
      firstRefresh,
      leftBalance,
      refresh,
      onRefresh,
      groups,
      members,
      totalBudget,
      expenseTypeData,
      expenseInMonth,
      setExpenseInMonth,
    }),
    [
      totalIncome,
      totalIncomeMonthWise,
      totalExpense,
      totalExpenseMonthWise,
      userName,
      email,
      firstRefresh,
      leftBalance,
      refresh,
      onRefresh,
      groups,
      members,
      totalBudget,
      expenseTypeData,
      expenseInMonth,
    ],
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

export const useExpense = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }
  return context;
};
