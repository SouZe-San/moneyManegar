import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import { ThemedText } from "../ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { DeleteIcon, PayIcon, DownIcon, UpIcon } from "@/assets/icons/SVG/RandomIcons";
import { iconReturn } from "@/constants/expanseIcon";
const TransactionItem = ({
  expanseType,
  expanseAmount,
  expanseDescription,
  expanseData,
  toWhom,
  transactionType,
}: {
  expanseType: "Food" | "Fuel" | "Shopping" | "Recharge" | "Travels" | "Others" | "Rent" | "Bill";
  expanseDescription: string;
  expanseData?: string;
  expanseAmount: number;
  transactionType: "debit" | "expense" | "income" | "credit";
  toWhom?: string;
}) => {
  const payIconColor = useThemeColorWithName("highLightBackground");
  const backgroundColor = useThemeColorWithName("background");
  const blurBackgroundColor = useThemeColorWithName("blurBg");
  return (
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
  );
};

export default TransactionItem;

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
