import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";

const ColorLabeling = ({
  color,
  label,
  amount,
  totalAmt,
}: {
  color: string;
  label: string;
  amount: number;
  totalAmt: number;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 10,
          aspectRatio: 1,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      ></View>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <ThemedText type="smallText" style={{ fontSize: 14 }}>
          {label}
        </ThemedText>
        <ThemedText type="smallText" style={{ fontSize: 15, fontWeight: "600" }}>
          {Math.round((amount / totalAmt) * 100)}%
        </ThemedText>
      </View>
    </View>
  );
};

export default ColorLabeling;
