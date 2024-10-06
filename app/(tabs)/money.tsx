import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { Href, Link } from "expo-router";
import { View, StyleSheet } from "react-native";

const linkBtns: { linkLabel: string; link: Href<string | object> }[] = [
  {
    linkLabel: "Add Incomes",
    link: "/entries/income",
  },
  {
    linkLabel: "Add Expenses",
    link: "/entries/expense",
  },
  {
    linkLabel: "Add Payble",
    link: "/entries/payble",
  },
  {
    linkLabel: "Add Contribute",
    link: "/entries/contribute",
  },
];

export default function MoneyManager() {
  const borderColor = useThemeColorWithName("borderColor");
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingHorizontal: "5%",
        paddingVertical: "15%",
        width: "100%",
      }}
    >
      <View style={styles.headContainer}>
        <ThemedText type="tabTitle" colorName="background">
          Wallet Hub
        </ThemedText>
      </View>
      <View
        style={{
          width: "100%",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "50%",
          marginTop: 20,
        }}
      >
        {linkBtns.map((linkBtn, index) => (
          <View key={index} style={[styles.linkButton, { borderColor }]}>
            <Link href={linkBtn.link}>
              <ThemedText colorName="mountainMeadow" type="subtitle">
                {linkBtn.linkLabel}
              </ThemedText>
            </Link>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headContainer: {
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#00dd12",
    height: "30%",
    borderRadius: 10,
    paddingLeft: 20,
  },
  linkButton: {
    borderWidth: 1,
    padding: 10,
    height: 80,
    marginTop: 10,
    borderRadius: 15,
    paddingLeft: 20,
    flex: 1,
    justifyContent: "center",

    width: "100%",
  },
});
