export interface IExpanse {
  transactionId: string;
  expanseDescription: string;
  expanseData: string;
  expanseAmount: number;
  expanseType: "Food" | "Fuel" | "Shopping" | "Recharge" | "Travels" | "Others" | "Rent" | "Bill";
  type: "debit" | "expense" | "income" | "credit" | "debt" | "owned";
  toWhom?: string;
}
export interface IUdahar {
  _id?: number;
  amount: number;
  type: "debt" | "owned";
  expenseType: "Food" | "Fuel" | "Shopping" | "Recharge" | "Travels" | "Others" | "Rent" | "Bill";
  date: string;
  toWhom: string;
  expanseDesc: string;
  memberId: number | null;
}
export type mainTransactionType = "income" | "expense";

export interface ITransaction {
  amount: number;
  type: mainTransactionType;
  expenseType: expanseType;
  date: string;
  expanseDesc: string;
  toWhom?: string;
  memberId?: string;
}

export type Members = {
  userName: string;
  useId: string | null;
};

export type Groups = {
  groupId: string;
  groupName: string;
  groupIcon: string;
  members: Members[];
};

export type expenseType =
  | "Food"
  | "Fuel"
  | "Shopping"
  | "Recharge"
  | "Travels"
  | "Others"
  | "Rent"
  | "Bill";
