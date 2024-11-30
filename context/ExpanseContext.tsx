import { createContext, useState, useContext, useCallback } from "react";
import { IExpanse, Members } from "@/types/expanse";

import { expenses } from "@/constants/tempVar";

export interface ExpenseContextType {
  totalIncome: number;
  totalExpense: number;
  leftBalance: number;
  groups: Groups[];
  allTransaction: IExpanse[];
  addIncome: (amount: number) => void;
  addExpense: (amount: number) => void;
  reset: () => void;
  addTransaction: (transaction: IExpanse) => void;
  removeTransaction: (transactionId: string) => void;
  addGroup: (group: Groups) => void;
}

type Groups = {
  groupName: string;
  members: Members[];
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [allTransaction, setAllTransaction] = useState<IExpanse[]>(expenses);
  const [groups, setGroups] = useState<Groups[]>([]);

  const leftBalance: number = totalIncome - totalExpense;

  const addIncome = (amount: number) => {
    setTotalIncome((prev) => prev + amount);
  };

  const addExpense = (amount: number) => {
    setTotalExpense((prev) => prev + amount);
  };

  const reset = () => {
    setTotalIncome(0);
    setTotalExpense(0);
  };

  const addGroup = (group: Groups) => {
    setGroups((prev) => [...prev, group]);
  };

  const addTransaction = (transaction: IExpanse) => {
    setAllTransaction((prev) => [...prev, transaction]);
  };

  const removeTransaction = useCallback((transactionId: string) => {
    console.log("Transaction ID: ", transactionId);
    setAllTransaction((prev) =>
      prev.filter((transaction) => transaction.transactionId !== transactionId)
    );
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        totalIncome,
        totalExpense,
        leftBalance,
        addIncome,
        addExpense,
        reset,
        allTransaction,
        addTransaction,
        removeTransaction,
        groups,
        addGroup,
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
