import { createContext, useState, useContext, useCallback, useEffect } from "react";
import { ITransaction, Members, Groups, IGroup, IMember } from "@/types/expanse";

import { allTransactions } from "@/constants/tempVar";
import { useSQLiteContext } from "expo-sqlite";
import { fetchAllGroup, fetchAllMember } from "@/hooks/useQueries";

export interface ExpenseContextType {
  totalIncome: number;
  totalExpense: number;
  leftBalance: number;
  groups: IGroup[];
  members: Members[];
  allTransaction: ITransaction[];

  setIsLoadNeeded: React.Dispatch<React.SetStateAction<boolean>>;
  reset: () => void;
  addTransaction: (transaction: ITransaction) => void;
  removeTransaction: (transactionId: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [allTransaction, setAllTransaction] = useState<ITransaction[]>(allTransactions);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [members, setMember] = useState<Members[]>([]);

  const [isLoadNeeded, setIsLoadNeeded] = useState<boolean>(true);
  const leftBalance: number = totalIncome - totalExpense;
  const db = useSQLiteContext();

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data... {from Context Provider}");
      try {
        const groups = await fetchAllGroup(db);
        const members = await fetchAllMember(db);
        setGroups(groups);
        setMember(members);
      } catch (error) {
        console.error("Error fetching data: ", error);
        // Handle error state if needed
      }
    };

    fetchData();
  }, []);

  const reset = () => {
    setTotalIncome(0);
    setTotalExpense(0);
  };

  const addTransaction = (transaction: ITransaction) => {
    setAllTransaction((prev) => [...prev, transaction]);
  };

  const removeTransaction = useCallback((transactionId: string) => {
    console.log("Transaction ID: ", transactionId);
    setAllTransaction((prev) =>
      prev.filter((transaction) => transaction._id?.toString() !== transactionId)
    );
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        totalIncome,
        totalExpense,
        leftBalance,
        reset,
        allTransaction,
        addTransaction,
        removeTransaction,
        setIsLoadNeeded,
        groups,
        members,
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
