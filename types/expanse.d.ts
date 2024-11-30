export interface IExpanse {
  transactionId: string;
  expanseDescription: string;
  expanseData: string;
  expanseAmount: number;
  expanseType: "Food" | "Fuel" | "Shopping" | "Recharge" | "Travels" | "Others" | "Rent" | "Bill";
  type: "debit" | "expense" | "income" | "credit";
  toWhom?: string;
}

export type Members = {
  useName: string;
  useId: string;
};

export type Groups = {
  groupId: string;
  groupName: string;
  groupIcon: string;
  members: Members[];
};
