import { View, StyleSheet, Text } from "react-native";
import { ThemedText } from "../ThemedText";

import CategoryIcon from "@/components/comp/CategoryIcon";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { iconReturn } from "@/constants/expanseIcon";
import { ColorMapping } from "@/constants/Colors";
import { ITransaction } from "@/types/expanse";

const TransactionItem = (data: ITransaction) => {
const scheme = useColorScheme() ?? "dark";
const surface = useThemeColorWithName("surface");
const cardBorder = useThemeColorWithName("cardBorder");
const textMuted = useThemeColorWithName("textMuted");
const income = useThemeColorWithName("income");
const expense = useThemeColorWithName("expense");

 const isIncome = data.type === "income";

 // category color, with a fallback for income categories (Salary/Gift/…) and unknowns
 const categoryColor =
   (ColorMapping[scheme] as Record<string, string>)[data.expenseType]?.trim() ||
   (isIncome ? income : "#6B7280");

 const amountColor = isIncome ? income : expense;
 const sign = isIncome ? "+" : "−";
 const formatted = Number(data.amount).toLocaleString("en-IN");
  return (
    <View
      style={[
        styles.row,
        { backgroundColor: surface, borderColor: cardBorder },
      ]}
    >
      {/* Category chip — color from ColorMapping at ~15% alpha */}
      <View style={[styles.chip, { backgroundColor: categoryColor + "26" }]}>
        {/* <ThemedText style={styles.chipIcon}>
          {iconReturn(data.expenseType)}
        </ThemedText> */}
        <CategoryIcon type={data.expenseType} color={categoryColor} size={22} />
      </View>

      {/* Description + meta */}
      <View style={styles.middle}>
        <ThemedText
          type="defaultSemiBold"
          numberOfLines={1}
          style={styles.desc}
        >
          {data.expanseDesc}
        </ThemedText>
        <ThemedText
          numberOfLines={1}
          style={[styles.meta, { color: textMuted }]}
        >
          {data.date}
          {data.toWhom ? ` · ${data.toWhom}` : ""}
        </ThemedText>
      </View>

      {/* Amount — color-coded + tabular numerals */}
      <ThemedText style={[styles.amount, { color: amountColor }]}>
        {sign} ₹{formatted}
      </ThemedText>
    </View>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginVertical: 5,
  },
  chip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  chipIcon: { fontSize: 20, lineHeight: 24 },
  middle: { flex: 1 },
  desc: { fontSize: 15 },
  meta: { fontSize: 12, marginTop: 1 },
  amount: { fontSize: 15, fontWeight: "600", fontVariant: ["tabular-nums"] },
});
