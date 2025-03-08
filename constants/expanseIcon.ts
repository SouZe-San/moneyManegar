export const iconReturn = (
  icon:
    | "Food"
    | "Fuel"
    | "Shopping"
    | "Recharge"
    | "Travels"
    | "Others"
    | "Rent"
    | "Bill"
    | "Salary"
    | "Gift"
    | "Business"
) => {
  const icons = {
    Bill: "📜",
    Business: "👤",
    Food: "🍔",
    Fuel: "⛽",
    Gift: "🎁",
    Others: "🧻",
    Recharge: "📱",
    Rent: "🏠",
    Salary: "💰",
    Shopping: "🛍️",
    Travels: "🚌",
  };
  return icons[icon as keyof typeof icons];
};
