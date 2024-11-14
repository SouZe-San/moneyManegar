export const iconReturn = (
  icon: "Food" | "Fuel" | "Shopping" | "Recharge" | "Travels" | "Others" | "Rent" | "Bill"
) => {
  const icons = {
    Food: "🍔",
    Fuel: "⛽",
    Shopping: "🛍️",
    Recharge: "📱",
    Travels: "🚌",
    Others: "🧻",
    Rent: "🏠",
    Bill: "📜",
  };
  return icons[icon as keyof typeof icons];
};
