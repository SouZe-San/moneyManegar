import { View, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import MoneyText from "@/components/comp/MoneyText";
import BudgetProgress from "./BudgetProgress";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import {
  getBudgetStatus,
  budgetStatusLabel,
  useBudgetStatusColor,
} from "@/hooks/useBudgetStatus";

const monthName = (month: string) =>
  new Date(2020, parseInt(month, 10) - 1, 1).toLocaleString("en-US", {
    month: "long",
  });

/**
 * The current month at a glance: how much is spent, against what,
 * and — the part that was missing — whether that is actually fine.
 */
export default function BudgetSummaryCard({
  month,
  budget_amount,
  total_expense,
  year,
}: {
  month: string;
  budget_amount: number;
  total_expense: number;
  year?: string;
}) {
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");

  const stat = getBudgetStatus(total_expense, budget_amount);
  const statusColor = useBudgetStatusColor(stat.status);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: surface, borderColor: cardBorder },
      ]}
    >
      {/* Month + status */}
      <View style={styles.topRow}>
        <ThemedText style={[styles.monthLabel, { color: textMuted }]}>
          {monthName(month)} {year ?? new Date().getFullYear()}
        </ThemedText>
        <View style={[styles.pill, { backgroundColor: statusColor + "1F" }]}>
          <ThemedText style={[styles.pillText, { color: statusColor }]}>
            {budgetStatusLabel(stat.status)}
          </ThemedText>
        </View>
      </View>

      {/* Spent — the number that actually matters, in the status colour */}
      <View style={{ marginTop: 14 }}>
        <MoneyText
          value={stat.spent}
          size={38}
          color={statusColor}
          decimalColor={statusColor + "8A"}
        />
        <ThemedText style={{ fontSize: 13, color: textMuted, marginTop: 2 }}>
          spent of ₹{stat.budget.toLocaleString("en-IN")} budget
        </ThemedText>
      </View>

      {/* Progress */}
      <View style={{ marginTop: 18, gap: 8 }}>
        <BudgetProgress fill={stat.fill} color={statusColor} />
        <View style={styles.footRow}>
          <ThemedText
            style={{ fontSize: 13, color: statusColor, fontWeight: "600" }}
          >
            {stat.isOver
              ? `Over by ₹${stat.overBy.toLocaleString("en-IN")}`
              : `₹${stat.remaining.toLocaleString("en-IN")} left`}
          </ThemedText>
          <ThemedText style={{ fontSize: 13, color: textMuted }}>
            {stat.percent}% used
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthLabel: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillText: { fontSize: 11, fontWeight: "700" },
  footRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
