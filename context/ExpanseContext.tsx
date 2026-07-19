import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useColorScheme } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

import type { Members, IGroup, IUdahar, expenseType } from "@/types/expanse";

import {
  fetchAllGroup,
  fetchAllMember,
  fetchTotalExpenseAccordingExpanse,
  getTotalExpense,
  getTotalIncome,
  getTotalExpenseMonthWise,
  getTotalIncomeMonthWise,
} from "@/hooks/useQueries";
import { useThemeColorMapping } from "@/hooks/useThemeColor";
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
  // allTransaction: IUdahar[];
  onRefresh: () => void;
  refresh: boolean;
  // removeTransaction: (transactionId: string) => void;
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
  let leftBalance: number = openingBalance + totalIncome - totalExpense;
  const db = useSQLiteContext();

  const theme = useColorScheme() ?? "light";

  const fetchData = async () => {
    try {
      const members = await fetchAllMember(db);
      setMember(members);
      const groups = await fetchAllGroup(db);
      setGroups(groups);
      const income = await getTotalIncome(db);
      const incomeThisMonth = await getTotalIncomeMonthWise(db);
      const expense = await getTotalExpense(db);
      const expenseThisMonth = await getTotalExpenseMonthWise(db);

      setTotalIncomeMonthWise(incomeThisMonth ?? 0);
      setTotalExpenseMonthWise(expenseThisMonth ?? 0);

      setTotalIncome(income ?? 0);
      setTotalExpense(expense ?? 0);

      const data = await aggregateExpenses();
      setExpenseTypeData(data);
    } catch (error) {
      showToastWithMsg("Data fetching Failed !!");
      console.error("Error fetching data: ", error);
      // Handle error state if needed
    } finally {
      setRefresh(false);
    }
  };

  const firstRefresh = async () => {
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
  };
  useEffect(() => {
    fetchData();
  }, []);

  const aggregateExpenses = async () => {
    const raw: { expenseType: expenseType; total_expense: number }[] =
      await fetchTotalExpenseAccordingExpanse(db);

    const mapped = raw
      .filter((d) => d.total_expense > 0)
      .sort((a, b) => b.total_expense - a.total_expense);

    const TOP = 6;
    const result = mapped
      .slice(0, TOP)
      .map(({ total_expense, expenseType }) => ({
        text: expenseType,
        value: total_expense,
        color: useThemeColorMapping(theme, expenseType),
      }));

    const rest = mapped.slice(TOP);
    if (rest.length) {
      const othersTotal = rest.reduce((s, d) => s + d.total_expense, 0);
      const existing = result.find((r) => r.text === "Others");
      if (existing) existing.value += othersTotal;
      else
        result.push({
          text: "Others" as expenseType,
          value: othersTotal,
          color: useThemeColorMapping(theme, "Others" as expenseType),
        });
    }

    return result;
  };

  const onRefresh = useCallback(() => {
    setRefresh(true);

    fetchData();
  }, []);

  const totalBudget = [
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
  ];

  return (
    <ExpenseContext.Provider
      value={{
        totalIncome,
        totalIncomeMonthWise,
        totalExpense,
        totalExpenseMonthWise,
        userName,
        email,
        firstRefresh,
        leftBalance,
        // allTransaction,
        // removeTransaction,
        refresh,
        onRefresh,
        groups,
        members,
        totalBudget,
        expenseTypeData,
        expenseInMonth,
        setExpenseInMonth,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook to use the ExpenseContext
export const useExpense = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }
  return context;
};
