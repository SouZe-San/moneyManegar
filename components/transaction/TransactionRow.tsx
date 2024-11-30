import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
// import { Swipeable } from "react-native-gesture-handler";
import { ThemedText } from "../ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { DeleteIcon, PayIcon, DownIcon, UpIcon } from "@/assets/icons/SVG/RandomIcons";
import { iconReturn } from "@/constants/expanseIcon";
import { useExpense } from "@/context/ExpanseContext";
import { useEffect, useRef } from "react";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

type TransactionProps = {
  transactionId: string;
  expanseType: "Food" | "Fuel" | "Shopping" | "Recharge" | "Travels" | "Others" | "Rent" | "Bill";
  expanseDescription: string;
  expanseData?: string;
  expanseAmount: number;
  transactionType: "debit" | "expense" | "income" | "credit";
  toWhom?: string;
  onSwipeableWillOpen: (id: string) => void;
  onSwipeableWillClose: (id: string) => void;
  openedItem: null | string;
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
  openedItem,
}: TransactionProps) => {
  const payIconColor = useThemeColorWithName("highLightBackground");
  const backgroundColor = useThemeColorWithName("background");
  const blurBackgroundColor = useThemeColorWithName("blurBg");

  const { removeTransaction, addExpense, addIncome } = useExpense();

  const swipeableRef = useRef<SwipeableMethods | null>(null);

  const addTransactionAmount = (
    amount: number,
    expanseType: "debit" | "expense" | "income" | "credit",
    transactionId: string
  ) => {
    if (expanseType === "debit" || expanseType === "expense") {
      addExpense(amount);
    } else {
      addIncome(amount);
    }
    removeTransaction(transactionId);
  };

  useEffect(() => {
    if (openedItem === transactionId) {
      swipeableRef.current?.openLeft();
    } else {
      swipeableRef.current?.close();
    }
  }, [openedItem]);

  //^ Pay tab
  const RightActions = (
    amount: number,
    expanseType: "debit" | "expense" | "income" | "credit",
    transactionId: string
  ) => {
    return (
      <TouchableOpacity onPress={() => addTransactionAmount(amount, expanseType, transactionId)}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            width: 70,
            aspectRatio: 1,
          }}
        >
          <Text
            style={{
              shadowColor: payIconColor,
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.6,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <PayIcon color={payIconColor} />
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  //^ Delete tab
  const LeftActions = (transactionId: string): React.JSX.Element => {
    return (
      <TouchableOpacity onPress={() => removeTransaction(transactionId)}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            width: 70,
            aspectRatio: 1,
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
            <DeleteIcon color="red" />
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ReanimatedSwipeable
      renderLeftActions={() => LeftActions(transactionId)}
      renderRightActions={() => RightActions(expanseAmount, transactionType, transactionId)}
      onSwipeableClose={() => onSwipeableWillClose(transactionId)}
      onSwipeableOpen={() => onSwipeableWillOpen(transactionId)}
      ref={swipeableRef}
    >
      <View
        style={{
          backgroundColor,
          marginVertical: 5,
        }}
      >
        <View
          style={[
            styles.rowStyle,
            {
              backgroundColor: blurBackgroundColor,
            },
          ]}
        >
          {/*  transactionType === "debit" || transactionType === "expense"
                  ? "#f7323227"
                  : "#35f73227", */}
          <View style={styles.details}>
            {/* Expanse Icon  */}
            <View>
              <ThemedText style={styles.expanseIcon}>{iconReturn(expanseType)}</ThemedText>
            </View>
            {/* Description  */}
            <View style={[styles.description]}>
              <ThemedText type="defaultSemiBold">{expanseDescription}</ThemedText>
              <ThemedText style={styles.expanseDate}>
                {expanseData} &mdash; {toWhom}
              </ThemedText>
            </View>
          </View>
          {/* Amount */}
          <View style={styles.expanseAmount}>
            <ThemedText type="defaultSemiBold">₹{expanseAmount}</ThemedText>
            <Text style={{ fontSize: 10 }}>
              {transactionType === "debit" || transactionType === "expense" ? (
                <UpIcon color="red" />
              ) : (
                <DownIcon color="green" />
              )}
            </Text>
          </View>
        </View>
      </View>
    </ReanimatedSwipeable>
  );
};

export default TransactionRow;

const styles = StyleSheet.create({
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
