import { Groups, IExpanse } from "@/types/expanse";

export const USERNAME = "souze";

const expanseTypes = (
  ind: number
): "Food" | "Fuel" | "Shopping" | "Recharge" | "Travels" | "Others" | "Rent" | "Bill" =>
  ["Food", "Fuel", "Shopping", "Recharge", "Travels", "Others", "Rent", "Bill"][ind % 8] as
    | "Food"
    | "Fuel"
    | "Shopping"
    | "Recharge"
    | "Travels"
    | "Others"
    | "Rent"
    | "Bill";

export const expenses: IExpanse[] = [
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
  {
    transactionId: "7",
    expanseDescription: "Grocery Shopping",
    expanseData: "10-22-21",
    expanseAmount: 150.0,
    expanseType: "Food",
    type: "income",
    toWhom: "Dada",
  },
  {
    transactionId: "8",
    expanseDescription: "Travel to City",
    expanseData: "10-23-21",
    expanseAmount: 300.0,
    expanseType: "Travels",
    type: "debit",
  },
  {
    transactionId: "9",
    expanseDescription: "Recharge Mobile",
    expanseData: "10-24-21",
    expanseAmount: 50.0,
    expanseType: "Recharge",
    type: "expense",
  },
  {
    transactionId: "10",
    expanseDescription: "Clothing Shopping",
    expanseData: "10-25-21",
    expanseAmount: 120.0,
    expanseType: "Shopping",
    type: "credit",
    toWhom: "Ajay",
  },
  {
    transactionId: "11",
    expanseDescription: "Miscellaneous",
    expanseData: "10-26-21",
    expanseAmount: 80.0,
    expanseType: "Others",
    type: "expense",
    toWhom: "Friend",
  },
  ...new Array(10).fill(0).map(
    (_, index) =>
      ({
        transactionId: (index + 12).toString(),
        expanseDescription: "Scuty's Fuel",
        expanseData: "10-21-21",
        expanseAmount: 200.0,
        expanseType: expanseTypes(index),
        type: "expense",
      } as const)
  ),
];

export const groupData: Groups[] = [
  {
    groupId: "1",
    groupName: "Family",
    members: [
      {
        useName: "Dada",
        useId: "lkf",
      },
      {
        useName: "baba",
        useId: "lk34",
      },
    ],
    groupIcon: "F1",
  },
  {
    groupId: "2",
    groupName: "Friends",
    members: [
      {
        useName: "Ajay",
        useId: "4234",
      },
      {
        useName: "Vijay",
        useId: "234",
      },
    ],
    groupIcon: "🤪",
  },
];
