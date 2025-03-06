import { View, StyleSheet, Text } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { DownIcon, UpIcon } from "@/assets/icons/SVG/RandomIcons";
import { iconReturn } from "@/constants/expanseIcon";
import { ITransaction } from "@/types/expanse";

const TransactionItem = (data: ITransaction) => {
  const gg = useThemeColorWithName("highLightBackground");
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
        <View style={styles.details}>
          {/* Expanse Icon  */}
          <View>
            <ThemedText style={styles.expanseIcon}>{iconReturn(data.expenseType)}</ThemedText>
          </View>
          {/* Description  */}
          <View style={[styles.description]}>
            <ThemedText type="defaultSemiBold">{data.expanseDesc}</ThemedText>
            <ThemedText style={styles.expanseDate}>
              {data.date} &mdash; {data.toWhom}
            </ThemedText>
          </View>
        </View>
        {/* Amount */}
        <View style={styles.expanseAmount}>
          <ThemedText type="defaultSemiBold">₹{data.amount}</ThemedText>
          <Text style={{ fontSize: 10 }}>
            {data.type === "expense" ? <DownIcon color="red" /> : <UpIcon color={gg} />}
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
