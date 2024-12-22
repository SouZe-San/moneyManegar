import { ThemedText } from "@/components/ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { Href, Link } from "expo-router";
import { View, StyleSheet, ScrollView } from "react-native";
import AnimateTabView from "@/components/animation/AnimateTabView";

const linkBtns: { linkLabel: string; link: Href }[] = [
  {
    linkLabel: "Add Incomes",
    link: "/entries/income",
  },
  {
    linkLabel: "Add Expenses",
    link: "/entries/expense",
  },
  {
    linkLabel: "Add Payble(Debt)",
    link: "/entries/payble",
  },
  {
    linkLabel: "Add Contribute",
    link: "/entries/contribute",
  },
];

export default function MoneyManager() {
  const borderColor = useThemeColorWithName("borderColor");
  const bg = useThemeColorWithName("blurBg");
  const headerBg = useThemeColorWithName("highLightBackground");

  return (
    <AnimateTabView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingHorizontal: "5%",
        paddingVertical: "15%",
        width: "100%",
      }}
    >
      <View style={[styles.headContainer, { backgroundColor: headerBg }]}>
        <ThemedText type="tabTitle" style={{ color: "#030f0e" }}>
          Wallet Hub
        </ThemedText>
      </View>
      <ScrollView>
        <View
          style={{
            width: "100%",
            justifyContent: "space-evenly",
            alignItems: "center",
            // height: "50%",
            marginTop: 20,
            gap: 10,
          }}
        >
          {linkBtns.map((linkBtn, index) => {
            return (
              <Link href={linkBtn.link} key={index}>
                <View style={[styles.linkButton, { borderColor, backgroundColor: bg }]}>
                  <ThemedText type="subtitle">{linkBtn.linkLabel}</ThemedText>
                </View>
              </Link>
            );
          })}
        </View>
      </ScrollView>
    </AnimateTabView>
  );
}

const styles = StyleSheet.create({
  headContainer: {
    width: "100%",
    justifyContent: "center",
    height: "30%",
    borderRadius: 10,
    paddingLeft: 20,
  },
  linkButton: {
    height: 100,
    marginTop: 10,
    borderRadius: 15,
    paddingLeft: 20,
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});
