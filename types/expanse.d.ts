export interface IExpanse {
  transactionId: string;
  expanseDescription: string;
  expanseData: string;
  expanseAmount: number;
  expanseType: "Food" | "Fuel" | "Shopping" | "Recharge" | "Travels" | "Others";
  type: "debit" | "expense" | "income" | "credit";
  toWhom?: string;
}
