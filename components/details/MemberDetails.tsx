import { View, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { globalStyles } from "@/constants/globalStyles";

const memberCost = {
  expanse: 0,
  income: 0,
};
const MemberDetails = ({ id }: { id: string | null }) => {
  const borderColor = useThemeColorWithName("borderColor");
  const darkTextColor = "#030f0e";
  const balanceBg = useThemeColorWithName("highLightBackground");

  return (
    <ThemedView>
      <ThemedText type="title">Member: {id}</ThemedText>
      <View style={{ marginVertical: 20, width: "100%", gap: 8 }}>
        {/* I will get the money */}
        <View style={[styles.costViewBox, { backgroundColor: balanceBg, borderColor: balanceBg }]}>
          <ThemedText type="defaultSemiBold" style={{ fontSize: 14, color: darkTextColor }}>
            Pending Payment
          </ThemedText>
          <ThemedText type="subtitle" style={{ fontSize: 26, color: darkTextColor }}>
            {memberCost.expanse.toFixed(2)} ₹
          </ThemedText>
        </View>
        {/* He/She will get the money */}
        <View style={[styles.costViewBox, { borderColor }]}>
          <ThemedText type="default" style={{ fontSize: 14 }}>
            Deu Payment
          </ThemedText>
          <ThemedText type="subtitle" style={{ fontSize: 26 }}>
            {memberCost.income.toFixed(2)} ₹
          </ThemedText>
        </View>
      </View>

      {/* All Transaction */}
      <ThemedText type="subtitle">All Transactions</ThemedText>
      <ScrollView></ScrollView>
    </ThemedView>
  );
};

export default MemberDetails;
const styles = StyleSheet.create({
  costViewBox: {
    width: "auto",
    borderWidth: 1,
    display: "flex",
    borderRadius: 10,
    borderColor: "transparent",
    justifyContent: "space-between",
    // justifyContent: "flex-end",
    paddingBottom: 15,
    height: 100,
    padding: 10,
  },
});
