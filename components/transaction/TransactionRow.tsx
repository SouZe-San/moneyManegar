import { View, StyleSheet, Text, TouchableOpacity, useColorScheme } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { DeleteIcon, PayIcon } from "@/assets/icons/SVG/RandomIcons";

import { useEffect, useRef } from "react";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import {
  add_Transaction_In_AllTransaction,
  removeDueAmount_of_Member,
  removeOweAmount_of_Member,
} from "@/hooks/useQueries";
import { useSQLiteContext } from "expo-sqlite";
import EasyAlert from "../comp/EasyAlert";
import { ColorMapping } from "@/constants/Colors";
import CategoryIcon from "../comp/CategoryIcon";
import { LinearGradient } from "expo-linear-gradient";

type TransactionProps = {
  transactionId: number;
  expanseAmount: number;
  transactionType: "debt" | "owned";
  expanseType:
    | "Food"
    | "Fuel"
    | "Shopping"
    | "Recharge"
    | "Travels"
    | "Others"
    | "Rent"
    | "Bill";
  expanseDescription: string;
  expanseData: string;
  toWhom?: string;
  onSwipeableWillOpen: (id: string) => void;
  onSwipeableWillClose: (id: string) => void;
  removeTransaction: (transactionId: string) => void;
  openedItem: null | string;
  memberId:number | null;
};

const TransactionRow = ({
  transactionId,
  expanseAmount,
  expanseDescription,
  expanseType,
  expanseData,
  transactionType,
  toWhom = "Own",
  onSwipeableWillOpen,
  onSwipeableWillClose,
  removeTransaction,
  openedItem,
  memberId,
}: TransactionProps) => {
  const scheme = useColorScheme() ?? "dark";
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");
  const income = useThemeColorWithName("income");
  const expense = useThemeColorWithName("expense");

  const isIncome = transactionType === "owned";

  // category color, with a fallback for income categories (Salary/Gift/…) and unknowns
  const categoryColor =
    (ColorMapping[scheme] as Record<string, string>)[expanseType]?.trim() ||
    (isIncome ? income : "#6B7280");

  const amountColor = isIncome ? income : expense;
  const sign = isIncome ? "+" : "−";
  const formatted = Number(expanseAmount).toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(expanseAmount) ? 0 : 2,
    maximumFractionDigits: 2,
  });

  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const sqlite = useSQLiteContext();

  const getToday = () => {
    // Get current date
    const today = new Date();

    // Extract day, month, and year
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    // Add leading zero to day and month if needed
    const Nday = day < 10 ? "0" + day : day;
    const Nmonth = month < 10 ? "0" + month : month;

    // Format the date as dd/mm/yyyy
    return `${Nday}/${Nmonth}/${year.toString().slice(-2)}`;
  };

  const removeData = async (
    amount: number,
    type: "debt" | "owned",
    transactionId: number,
  ) => {
    if (type === "debt") {
      await removeDueAmount_of_Member(sqlite, { amount, _id: memberId! });
    } else {
      await removeOweAmount_of_Member(sqlite, { amount, _id: memberId! });
    }
    removeTransaction(transactionId.toString());
  };
  const addTransactionAmount = async (
    amount: number,
    type: "debt" | "owned",
    transactionId: number,
  ) => {
    try {
      await add_Transaction_In_AllTransaction(sqlite, {
        amount: amount,
        type: type === "debt" ? "expense" : "income",
        date: getToday(),
        expanseDesc: expanseDescription,
        expenseType: expanseType,
        toWhom,
        memberId,
      });

      removeData(amount, type, transactionId);
    } catch (error) {
      EasyAlert("Error", "Some Error Occurred, Try Again");
    }
  };

  useEffect(() => {
    if (openedItem === transactionId.toString()) {
      swipeableRef.current?.openLeft();
    } else {
      swipeableRef.current?.close();
    }
  }, [openedItem]);

  //^ Pay tab
  const RightActions = (
    amount: number,
    type: "debt" | "owned",
    transactionId: number,
  ) => {
    return (
      <TouchableOpacity
        onPress={() => addTransactionAmount(amount, type, transactionId)}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            height: 70,
            aspectRatio: 3 / 2,
          }}
        >
          <Text
            style={{
              shadowColor: income + "50",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.6,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <PayIcon color={income} />
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  //^ Delete tab
  const LeftActions = (
    amount: number,
    type: "debt" | "owned",
    transactionId: number,
  ): React.JSX.Element => {
    return (
      <TouchableOpacity onPress={() => removeData(amount, type, transactionId)}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            height: 70,
            aspectRatio: 3 / 2,
          }}
        >
          <Text
            style={{
              shadowColor: "red",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.6,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <DeleteIcon color={expense} />
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[expense + "20", income + "20"]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      locations={[0.5, 0.5]}
      style={{
        borderRadius: 14,
        marginVertical: 5,
      }}
    >
      <ReanimatedSwipeable
        renderLeftActions={() =>
          LeftActions(expanseAmount, transactionType, transactionId)
        }
        renderRightActions={() =>
          RightActions(expanseAmount, transactionType, transactionId)
        }
        onSwipeableClose={() => onSwipeableWillClose(transactionId.toString())}
        onSwipeableOpen={() => onSwipeableWillOpen(transactionId.toString())}
        ref={swipeableRef}
      >
        <View
          style={[
            styles.row,
            { backgroundColor: surface, borderColor: cardBorder },
          ]}
        >
          <View
            style={[styles.chip, { backgroundColor: categoryColor + "26" }]}
          >
            <CategoryIcon type={expanseType} color={categoryColor} size={22} />
          </View>
          {/* Description  */}
          <View style={styles.middle}>
            <ThemedText
              type="defaultSemiBold"
              numberOfLines={1}
              style={styles.desc}
            >
              {expanseDescription}{" "}
            </ThemedText>
            <ThemedText
              numberOfLines={1}
              style={[styles.meta, { color: textMuted }]}
            >
              {expanseData} {toWhom ? ` · ${toWhom}` : ""}
            </ThemedText>
          </View>

          {/* Amount — color-coded + tabular numerals */}
          <ThemedText style={[styles.amount, { color: amountColor }]}>
            {sign} ₹
            <Text style={{ fontFamily: "SpaceGroteskBold" }}>{formatted}</Text>
          </ThemedText>
        </View>
      </ReanimatedSwipeable>
    </LinearGradient>
  );
};

export default TransactionRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 14,
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

  rowStyle: {
    position: "relative",
    zIndex: 3,
    backfaceVisibility: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  details: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  expanseDate: {
    fontSize: 10,
    lineHeight: 12,
    color: "gray",
  },
  expanseIcon: {
    fontSize: 20,
  },
  description: {
    paddingVertical: 5,
  },
  expanseAmount: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 5,
    gap: 2,
  },
});
