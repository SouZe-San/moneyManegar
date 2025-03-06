export type expenseType =
  | "Food"
  | "Fuel"
  | "Shopping"
  | "Recharge"
  | "Travels"
  | "Others"
  | "Rent"
  | "Bill";

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
  expenseType: expenseType;
  date: string;
  toWhom: string;
  expanseDesc: string;
  memberId: string | null;
}
export type mainTransactionType = "income" | "expense";

export interface ITransaction {
  _id?: number;
  amount: number;
  type: mainTransactionType;
  expenseType: expenseType | "Salary" | "Gift" | "Business";
  date: string;
  expanseDesc: string;
  toWhom?: string;
  memberId?: string;
}

export type Members = {
  _id?: number;
  userName: string;
  userId: string | null;
  ownedAmount?: number;
  dueAmount?: number;
  imgUrl: string | null;
};

export type Groups = {
  _id?: number;
  groupId: string;
  groupName: string;
  groupIcon: string;
  members: Members[];
};

export interface IGroup {
  _id?: number;
  name: string;
  logo: string;
  imgUrl: string | null;
}
export interface IGroupMember {
  _id?: number;
  groupId: number;
  memberId: number;
}
export interface IMember {
  _id?: number;
  name: string;
  imgUrl: string;
  userId: string | null;
}
