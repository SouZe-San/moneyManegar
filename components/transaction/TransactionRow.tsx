import { View, StyleSheet, Text, Button, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { ThemedText } from "../ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { DeleteIcon } from "@/assets/icons/SVG/RandomIcons";
import { iconReturn } from "@/constants/expanseIcon";

const LeftActions = () => {
  return (
    <TouchableOpacity>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          width: 70,
          aspectRatio: 1,
        }}
      >
        <Text>
          <DeleteIcon color="red" />
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const RightActions = () => {
  return (
    <TouchableOpacity>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          width: 70,
          aspectRatio: 1,
        }}
      >
        <Text>✅</Text>
      </View>
    </TouchableOpacity>
  );
};

type TransactionProps = {
  expanseType: "Food" | "Fuel" | "Shopping" | "Recharge" | "Travels" | "Others";
  expanseDescription: string;
  expanseData?: string;
  expanseAmount: string;
};

const TransactionRow = ({
  expanseAmount,
  expanseDescription,
  expanseType,
  expanseData,
}: TransactionProps) => {
  const backgroundColor = useThemeColorWithName("background");
  const blurBackgroundColor = useThemeColorWithName("blurBg");
  return (
    <Swipeable renderLeftActions={LeftActions} renderRightActions={RightActions}>
      <View
        style={{
          backgroundColor,
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
              <ThemedText style={styles.expanseDate}>{expanseData}</ThemedText>
            </View>
          </View>
          {/* Amount */}
          <View style={styles.expanseAmount}>
            <ThemedText type="defaultSemiBold">₹{expanseAmount}</ThemedText>
          </View>
        </View>
      </View>
    </Swipeable>
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
  expanseAmount: {},
});
