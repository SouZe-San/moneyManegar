import { Groups, IExpanse, expanseType } from "@/types/expanse";

export const USERNAME = "souze";

const expanseTypes = ["Food", "Fuel", "Shopping", "Recharge", "Travels", "Others", "Rent", "Bill"];

const getRandomDate = () => {
  const start = new Date(2021, 0, 1); // Start date: January 1, 2021
  const end = new Date(); // End date: today
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toLocaleDateString(); // Format date as MM/DD/YYYY
};

const getRandomElement = (arr: any) => arr[Math.floor(Math.random() * arr.length)];

const getRandomAmount = () => (Math.random() * 1000).toFixed(2); // Random amount between 0 and 1000
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
  // ...new Array(10).fill(0).map(
  //   (_, index) =>
  //     ({
  //       transactionId: (index + 12).toString(),
  //       expanseDescription: "Scuty's Fuel",
  //       expanseData: "10-21-21",
  //       expanseAmount: 200.0,
  //       expanseType: expanseTypes(index),
  //       type: "expense",
  //     } as const)
  // ),
  ...new Array(10).fill(0).map(
    (_, index) =>
      ({
        transactionId: (index + 12).toString(),
        expanseDescription: "Scuty's Fuel",
        expanseData: getRandomDate(),
        expanseAmount: parseFloat(getRandomAmount()),
        expanseType: getRandomElement(expanseTypes),
        type: Math.random() < 0.5 ? "expense" : "income", // Randomly choose between "expense" and "income"
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
  {
    groupId: "3",
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
  {
    groupId: "4",
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

type AllTransaction = {
  transactionId: number;
  expanseDescription: string;
  expanseData: string;
  expanseAmount: number;
  expanseType: "Food" | "Fuel" | "Shopping" | "Recharge" | "Travels" | "Others" | "Rent" | "Bill";
  type: "debit" | "expense" | "income" | "credit";
  toWhom: "own" | string;
};

const transactionTypes = ["debit", "expense", "income", "credit"];
const toWhomOptions = ["own", "friend", "family", "business", "charity"];

export const allTransactions: AllTransaction[] = new Array(30).fill(0).map((_, index) => ({
  transactionId: index + 1, // Transaction ID starting from 1
  expanseDescription: "Scuty's Fuel", // Static description
  expanseData: getRandomDate(), // Random date
  expanseAmount: parseFloat(getRandomAmount()), // Random amount
  expanseType: getRandomElement(expanseTypes), // Random expense type
  type: getRandomElement(transactionTypes), // Random transaction type
  toWhom: Math.random() < 0.5 ? "own" : getRandomElement(toWhomOptions), // Randomly choose "own" or another option
}));
const aggregatedData = allTransactions.reduce(
  (acc, transaction) => {
    if (transaction.type === "income") {
      acc.income += transaction.expanseAmount;
    } else if (transaction.type === "expense") {
      acc.expense += transaction.expanseAmount;
    }
    return acc;
  },
  { income: 0, expense: 0 }
);
export const totalBudget = [
  {
    text: "Income",
    value: aggregatedData.income,
    color: "#b3df43",
  },
  {
    text: "Expense",
    value: aggregatedData.expense,
    color: "#f33933",
  },
  {
    text: "Savings",
    value:
      aggregatedData.income - aggregatedData.expense < 0
        ? 0
        : aggregatedData.income - aggregatedData.expense,
    color: "#f3a333",
  },
];

// const colorMapping = {
//   Food: "#fd3a7b", // Adjusted color for Food
//   Fuel: "#2377ff", // Adjusted color for Fuel
//   Shopping: "#ffe056", // Color for Shopping
//   Recharge: "#20bcbc", // Color for Recharge
//   Travels: "#952efb", // Color for Travels
//   Others: "#bbb9b7", // Color for Others
//   Rent: "#33ffda", // Added color for Rent
//   Bill: "#4c00c7", // Added color for Bill
// };
const colorMapping = {
  Food: "#FF6B6B", // Vibrant Red - great for Food category
  Fuel: "#3B82F6", // Calm Blue - Fuel
  Shopping: "#FBBF24", // Golden Yellow - Shopping
  Recharge: "#34D399", // Fresh Green - Recharge
  Travels: "#A855F7", // Purple - Travels
  Others: "#9CA3AF", // Muted Grey - Others
  Rent: "#2DD4BF", // Aqua Cyan - Rent
  Bill: "#6366F1", // Soft Indigo - Bill
};

const aggregateExpenses = (transactions: AllTransaction[]) => {
  const aggregatedData = transactions.reduce(
    (acc: { [key in expanseType]?: number }, transaction) => {
      if (transaction.type === "expense") {
        acc[transaction.expanseType] =
          (acc[transaction.expanseType] || 0) + transaction.expanseAmount;
      }
      return acc;
    },
    {}
  );

  // Convert aggregated data to the format required for the pie chart
  return Object.entries(aggregatedData).map(([text, value]) => ({
    text,
    value,
    color: colorMapping[text as keyof typeof colorMapping],
  }));
};

export const expanseTypeData = aggregateExpenses(allTransactions);
