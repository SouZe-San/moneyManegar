import { View } from "react-native";

/**
 * Thin progress track used by both the month summary card and the
 * All-Budgets list rows. `fill` is already clamped 0..1 by getBudgetStatus.
 */
export default function BudgetProgress({
  fill,
  color,
  height = 8,
}: {
  fill: number;
  color: string;
  height?: number;
}) {
  return (
    <View
      style={{
        width: "100%",
        height,
        borderRadius: height / 2,
        backgroundColor: color + "1F",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${Math.min(100, Math.max(0, fill * 100))}%`,
          height: "100%",
          borderRadius: height / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
