import { SafeAreaView, StyleSheet, View, Text, Image } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useExpense } from "@/context/ExpanseContext";
import { HelloWave } from "@/components/animation/HelloWave";
import AnimateTabView from "@/components/animation/AnimateTabView";

export default function HomeScreen() {
  const borderColor = useThemeColorWithName("borderColor");
  const expanseBg = useThemeColorWithName("expanseBg");
  const darkTextColor = "#030f0e";
  const balanceBg = useThemeColorWithName("highLightBackground");
  const lightTextColor = useThemeColorWithName("mountainMeadow");

  const { totalIncome, totalExpense, leftBalance } = useExpense();

  return (
    <AnimateTabView style={styles.container}>
      <ThemedText
        type="title"
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        Hi,<Text style={{ fontSize: 28 }}>Souze</Text>
        <HelloWave />
      </ThemedText>
      {/* Cost View Section */}
      <View style={styles.costSection}>
        <View>
          <View
            style={[styles.costViewBox, { backgroundColor: balanceBg, borderColor: balanceBg }]}
          >
            <ThemedText type="default" style={{ fontSize: 14, color: darkTextColor }}>
              Left Over
            </ThemedText>
            {/* Balance */}
            <ThemedText type="subtitle" style={{ fontSize: 26, color: darkTextColor }}>
              {leftBalance.toFixed(2)} ₹
            </ThemedText>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={[styles.costViewBox, { width: "49%", backgroundColor: expanseBg }]}>
            <ThemedText type="default" style={{ fontSize: 14 }}>
              Expanse
            </ThemedText>
            <ThemedText type="subtitle" style={{ fontSize: 26 }}>
              {totalExpense.toFixed(2)} ₹
            </ThemedText>
          </View>
          <View style={[styles.costViewBox, { width: "49%", borderColor }]}>
            <ThemedText type="default" style={{ fontSize: 14 }}>
              Income
            </ThemedText>
            <ThemedText type="subtitle" style={{ fontSize: 26 }}>
              {totalIncome.toFixed(2)} ₹
            </ThemedText>
          </View>
        </View>
      </View>

      {/* New User Image */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Image
          source={require("@/assets/images/hero/heroImg.png")}
          style={{ opacity: 0.5, objectFit: "contain", width: "100%", height: "100%" }}
        />
      </View>

      {/* Two Chart */}

      {/* All New Groups */}
    </AnimateTabView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    paddingVertical: "5%",
    width: "100%",
  },
  costSection: {
    marginTop: 20,
    width: "100%",
    gap: 8,
  },
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
