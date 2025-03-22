import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { DeleteIcon, PayIcon, DownIcon, UpIcon } from "@/assets/icons/SVG/RandomIcons";
import { iconReturn } from "@/constants/expanseIcon";
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

type TransactionProps = {
  transactionId: number;
  expanseAmount: number;
  transactionType: "debt" | "owned";
  expanseType: "Food" | "Fuel" | "Shopping" | "Recharge" | "Travels" | "Others" | "Rent" | "Bill";
  expanseDescription: string;
  expanseData: string;
  toWhom?: string;
  onSwipeableWillOpen: (id: string) => void;
  onSwipeableWillClose: (id: string) => void;
  removeTransaction: (transactionId: string) => void;
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
  removeTransaction,
  openedItem,
}: TransactionProps) => {
  const payIconColor = useThemeColorWithName("highLightBackground");
  const backgroundColor = useThemeColorWithName("background");
  const blurBackgroundColor = useThemeColorWithName("blurBg");

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

  const removeData = async (amount: number, type: "debt" | "owned", transactionId: number) => {
    if (type === "debt") {
      await removeDueAmount_of_Member(sqlite, { amount, userName: toWhom });
    } else {
      await removeOweAmount_of_Member(sqlite, { amount, userName: toWhom });
    }
    removeTransaction(transactionId.toString());
  };
  const addTransactionAmount = async (
    amount: number,
    type: "debt" | "owned",
    transactionId: number
  ) => {
    try {
      await add_Transaction_In_AllTransaction(sqlite, {
        amount: amount,
        type: type === "debt" ? "expense" : "income",
        date: getToday(),
        expanseDesc: expanseDescription,
        expenseType: expanseType,
        toWhom,
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
  const RightActions = (amount: number, type: "debt" | "owned", transactionId: number) => {
    return (
      <TouchableOpacity onPress={() => addTransactionAmount(amount, type, transactionId)}>
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
  const LeftActions = (
    amount: number,
    type: "debt" | "owned",
    transactionId: number
  ): React.JSX.Element => {
    return (
      <TouchableOpacity onPress={() => removeData(amount, type, transactionId)}>
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
      renderLeftActions={() => LeftActions(expanseAmount, transactionType, transactionId)}
      renderRightActions={() => RightActions(expanseAmount, transactionType, transactionId)}
      onSwipeableClose={() => onSwipeableWillClose(transactionId.toString())}
      onSwipeableOpen={() => onSwipeableWillOpen(transactionId.toString())}
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
              {transactionType === "debt" ? <DownIcon color="red" /> : <UpIcon color="green" />}
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
