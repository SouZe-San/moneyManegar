import { createContext, useState, useContext, useCallback } from "react";
import { IExpanse } from "@/types/expanse";

const expenses: IExpanse[] = [
  {
    transactionId: "1",
    expanseDescription: "Scuty's Fuel",
    expanseData: "10-21-21",
    expanseAmount: 200.0,
    expanseType: "Fuel",
    type: "expense",
  },
  // You can add more expense objects here
  {
    transactionId: "2",
    expanseDescription: "Grocery Shopping",
    expanseData: "10-22-21",
    expanseAmount: 150.0,
    expanseType: "Food",
    type: "income",
    toWhom: "Dada",
  },
  {
    transactionId: "3",
    expanseDescription: "Travel to City",
    expanseData: "10-23-21",
    expanseAmount: 300.0,
    expanseType: "Travels",
    type: "debit",
  },
  {
    transactionId: "4",
    expanseDescription: "Recharge Mobile",
    expanseData: "10-24-21",
    expanseAmount: 50.0,
    expanseType: "Recharge",
    type: "expense",
  },
  {
    transactionId: "5",
    expanseDescription: "Clothing Shopping",
    expanseData: "10-25-21",
    expanseAmount: 120.0,
    expanseType: "Shopping",
    type: "credit",
    toWhom: "Ajay",
  },
  {
    transactionId: "6",
    expanseDescription: "Miscellaneous",
    expanseData: "10-26-21",
    expanseAmount: 80.0,
    expanseType: "Others",
    type: "expense",
    toWhom: "Friend",
  },
];

export interface ExpenseContextType {
  totalIncome: number;
  totalExpense: number;
  leftBalance: number;
  addIncome: (amount: number) => void;
  addExpense: (amount: number) => void;
  reset: () => void;
  allTransaction: IExpanse[];
  addTransaction: (transaction: IExpanse) => void;
  removeTransaction: (transactionId: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [allTransaction, setAllTransaction] = useState<IExpanse[]>(expenses);

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
