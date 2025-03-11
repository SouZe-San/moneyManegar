// ! Used in Development && can use for development

import { Groups, IExpanse, ITransaction, IUdahar, expenseType, IGroup } from "@/types/expanse";

export const USERNAME = "souze";

const expenseTypes = ["Food", "Fuel", "Shopping", "Recharge", "Travels", "Others", "Rent", "Bill"];
const toWhomOptions = ["own", "friend", "family", "business", "charity"];

const getRandomDate = () => {
  const start = new Date(2021, 0, 1); // Start date: January 1, 2021
  const end = new Date(); // End date: today
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toLocaleDateString(); // Format date as MM/DD/YYYY
};

const getRandomElement = (arrayOfEle: string[]) =>
  arrayOfEle[Math.floor(Math.random() * arrayOfEle.length)];

const getRandomAmount = () => (Math.random() * 1000).toFixed(2); // Random amount between 0 and 1000
export const udharArray: IUdahar[] = [
  {
    expanseDesc: "Scuty's Fuel",
    date: "10-21-21",
    amount: 200.0,
    expenseType: "Fuel",
    type: "debt",
    memberId: null,
    toWhom: "Ajay",
  },
  // You can add more expense objects here
  {
    expanseDesc: "Grocery Shopping",
    date: "10-22-21",
    amount: 150.0,
    expenseType: "Food",
    type: "owned",
    toWhom: "Dada",
    memberId: null,
  },
  {
    expanseDesc: "Travel to City",
    date: "10-23-21",
    amount: 300.0,
    expenseType: "Travels",
    type: "debt",
    memberId: null,
    toWhom: "Ajay",
  },
  {
    expanseDesc: "Recharge Mobile",
    date: "10-24-21",
    amount: 50.0,
    expenseType: "Recharge",
    type: "debt",
    memberId: null,
    toWhom: "suro",
  },
  {
    expanseDesc: "Clothing Shopping",
    date: "10-25-21",
    amount: 120.0,
    expenseType: "Shopping",
    type: "owned",
    toWhom: "Ajay",
    memberId: null,
  },
  {
    expanseDesc: "Miscellaneous",
    date: "10-26-21",
    amount: 80.0,
    expenseType: "Others",
    type: "debt",
    toWhom: "Friend",
    memberId: null,
  },
  {
    expanseDesc: "Grocery Shopping",
    date: "10-22-21",
    amount: 150.0,
    expenseType: "Food",
    type: "owned",
    toWhom: "Dada",
    memberId: null,
  },
  {
    expanseDesc: "Travel to City",
    date: "10-23-21",
    amount: 300.0,
    expenseType: "Travels",
    type: "debt",
    memberId: null,
    toWhom: "Ajay",
  },
  {
    expanseDesc: "Recharge Mobile",
    date: "10-24-21",
    amount: 50.0,
    expenseType: "Recharge",
    type: "debt",
    memberId: null,
    toWhom: "Ajay",
  },
  {
    expanseDesc: "Clothing Shopping",
    date: "10-25-21",
    amount: 120.0,
    expenseType: "Shopping",
    type: "owned",
    memberId: null,
    toWhom: "Ajay",
  },
  {
    expanseDesc: "Miscellaneous",
    date: "10-26-21",
    amount: 80.0,
    expenseType: "Others",
    type: "debt",
    toWhom: "Friend",
    memberId: null,
  },
  ...new Array(10).fill(0).map(
    (_, index) =>
      ({
        amount: parseFloat(getRandomAmount()),
        type: Math.random() < 0.5 ? "debt" : "owned",
        expenseType: getRandomElement(expenseTypes) as expenseType,
        date: getRandomDate(),
        expanseDesc: "Scuty's Fuel",
        memberId: null,
        toWhom: Math.random() < 0.5 ? "future" : getRandomElement(toWhomOptions),
      } as const)
  ),
];

export const groupData: IGroup[] = [
  {
    _id: 1,
    name: "Family",
    logo: "F1",
    imgUrl: null,
  },
  {
    _id: 2,
    name: "Friends",
    logo: "🤪",
    imgUrl: null,
  },
  {
    _id: 3,
    name: "Friends",
    logo: "🧐",
    imgUrl: null,
  },
  {
    _id: 4,
    name: "Friends",
    logo: "🚀",
    imgUrl: null,
  },
  {
    _id: 5,
    name: "Faly",
    logo: "F3",
    imgUrl: null,
  },
];

export const allTransactions: ITransaction[] = new Array(30).fill(0).map((_, index) => ({
  _id: index + 1, // Transaction ID starting from 1
  expanseDesc: "Scuty's Fuel", // Static description
  date: getRandomDate(), // Random date
  amount: parseFloat(getRandomAmount()), // Random amount
  expenseType: getRandomElement(expenseTypes) as expenseType, // Random expense type
  type: Math.random() < 0.5 ? "expense" : "income", // Random transaction type
  toWhom: Math.random() < 0.5 ? "own" : getRandomElement(toWhomOptions), // Randomly choose "own" or another option
}));
const aggregatedData = allTransactions.reduce(
  (acc, transaction) => {
    if (transaction.type === "income") {
      acc.income += transaction.amount;
    } else if (transaction.type === "expense") {
      acc.expense += transaction.amount;
    }
    return acc;
  },
  { income: 0, expense: 0 }
);
export const totalBudget = [
  {
    label: "Income",
    value: aggregatedData.income,
    frontColor: "#b3df43",
  },
  {
    label: "Expense",
    value: aggregatedData.expense,
    frontColor: "#f33933",
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
const vibrantLightColorMapping = {
  Food: "#D94F4F", // Dark Red - Food category
  Fuel: "#1976D2", // Dark Blue - Fuel
  Shopping: "#FBC02D", // Bright Yellow - Shopping
  Recharge: "#388E3C", // Dark Green - Recharge
  Travels: "#7B1FA2", // Dark Purple - Travels
  Others: "#757575", // Dark Grey - Others
  Rent: "#009688", // Teal - Rent
  Bill: "#5C6BC0", // Medium Indigo - Bill, // Soft Indigo (Distinct but not overwhelming)
};

const aggregateExpenses = (transactions: ITransaction[]) => {
  const aggregatedData = transactions.reduce(
    (acc: { [key in expenseType]: number }, transaction) => {
      if (transaction.type === "expense") {
        acc[transaction.expenseType as expenseType] += transaction.amount;
      }
      return acc;
    },
    {
      Food: 0,
      Fuel: 0,
      Shopping: 0,
      Recharge: 0,
      Travels: 0,
      Others: 0,
      Rent: 0,
      Bill: 0,
    }
  );

  // Convert aggregated data to the format required for the pie chart
  return Object.entries(aggregatedData).map(([text, value]) => ({
    text,
    value,
    color: vibrantLightColorMapping[text as keyof typeof colorMapping],
  }));
};

export const expenseTypeData = aggregateExpenses(allTransactions);
export const onlyExpenseData = allTransactions
  .filter((transaction) => transaction.type === "expense")
  .map((transaction) => {
    return { value: transaction.amount };
  });
export const onlyIncomeData = allTransactions
  .filter((transaction) => transaction.type === "income")
  .map((transaction) => {
    return { value: transaction.amount };
  });
