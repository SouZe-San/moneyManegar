import { createContext, useState, useContext, useCallback, useEffect } from "react";
import { Members, IGroup, IUdahar, expenseType } from "@/types/expanse";
import * as SecureStore from "expo-secure-store";
import { useSQLiteContext } from "expo-sqlite";
import {
  fetchAllGroup,
  fetchAllMember,
  fetchTotalExpenseAccordingExpanse,
  getTotalExpense,
  getTotalIncome,
} from "@/hooks/useQueries";
import { useThemeColorMapping } from "@/hooks/useThemeColor";
import { useColorScheme } from "react-native";

export interface ExpenseContextType {
  totalIncome: number;
  totalExpense: number;
  leftBalance: number;
  userName: string | null;
  email: string | null;
  groups: IGroup[];
  members: Members[];
  allTransaction: IUdahar[];
  onRefresh: () => void;
  refresh: boolean;
  removeTransaction: (transactionId: string) => void;
  totalBudget: {
    label: string;
    value: number;
    frontColor: string;
  }[];
  expenseTypeData: { text: expenseType; value: number; color: string }[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [allTransaction, setAllTransaction] = useState<IUdahar[]>([]);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [userName, setUseName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [members, setMember] = useState<Members[]>([]);
  const [expenseTypeData, setExpenseTypeData] = useState<
    { text: expenseType; value: number; color: string }[]
  >([]);

  const [refresh, setRefresh] = useState<boolean>(false);
  const leftBalance: number = totalIncome - totalExpense;
  const db = useSQLiteContext();

  const theme = useColorScheme() ?? "light";

  const fetchData = async () => {
    console.log("Fetching data... {from Context Provider}");
    try {
      const members = await fetchAllMember(db);
      setMember(members);
      const groups = await fetchAllGroup(db);
      setGroups(groups);
      const income = await getTotalIncome(db);
      setTotalIncome(income ?? 0);
      const expense = await getTotalExpense(db);
      setTotalExpense(expense ?? 0);

      const data = await aggregateExpenses();
      setExpenseTypeData(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
      // Handle error state if needed
    } finally {
      setRefresh(false);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const useName = await SecureStore.getItemAsync("user");
        setUseName(useName);
        const resE = await SecureStore.getItemAsync("email");
        setEmail(resE);
      } catch (error) {
        console.log("Error in ExpenseProvider: ", error);
      }
    })();
    fetchData();
  }, []);

  const aggregateExpenses = async () => {
    const data: {
      expenseType: expenseType;
      total_expense: number;
    }[] = await fetchTotalExpenseAccordingExpanse(db);

    return data.map(({ total_expense, expenseType }) => ({
      text: expenseType,
      value: total_expense,
      color: useThemeColorMapping(theme, expenseType),
    }));
  };

  const onRefresh = useCallback(() => {
    setRefresh(true);
    console.log("Refreshing !! ");

    fetchData();
  }, []);

  const removeTransaction = useCallback((transactionId: string) => {
    console.log("Transaction ID: ", transactionId);
    setAllTransaction((prev) =>
      prev.filter((transaction) => transaction._id?.toString() !== transactionId)
    );
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
        totalExpense,
        userName,
        email,
        leftBalance,
        allTransaction,
        removeTransaction,
        refresh,
        onRefresh,
        groups,
        members,
        totalBudget,
        expenseTypeData,
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
