export const iconReturn = (
  icon: "Food" | "Fuel" | "Shopping" | "Recharge" | "Travels" | "Others"
) => {
  const icons = {
    Food: "🍔",
    Fuel: "⛽",
    Shopping: "🛍️",
    Recharge: "📱",
    Travels: "🚌",
    Others: "🧻",
  };
  return icons[icon as keyof typeof icons];
};
