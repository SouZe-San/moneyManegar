import { View, StyleSheet, ScrollView } from "react-native";
import { Href, Link } from "expo-router";

// hooks
import { ThemedText } from "@/components/ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

// components
import AnimateTabView from "@/components/animation/AnimateTabView";
import ImageHeader from "@/components/animation/ImageHeader";

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
  {
    linkLabel: "Budget",
    link: "/entries/budget",
  },
];

export default function MoneyManager() {
  const borderColor = useThemeColorWithName("borderColor");
  const bg = useThemeColorWithName("blurBg");
  const headerBg = useThemeColorWithName("highLightBackground");
  const backgroundColor = useThemeColorWithName("background");

  return (
    <AnimateTabView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",

        // paddingVertical: "15%",
        width: "100%",
      }}
    >
      <View style={[styles.headContainer, {}]}>
        {/* <View style={[styles.headContainer, { backgroundColor: headerBg }]}> */}
        <ImageHeader
          imgUrl={require("@/assets/images/hero/bg.jpg")}
          title="Wallet Hub"
          textStyle={{
            bottom: 50,
            paddingLeft: 60,

            left: 50,
            transform: [{ scale: 1.5 }],
          }}
        />
        {/* <ThemedText
          type="tabTitle"
          style={{
            // color: "#030f0e",
            marginTop: 40,

            width: "100%",
            textShadowColor: backgroundColor,
            textShadowOffset: { width: 1.4, height: 1 },
            textShadowRadius: 4,
          }}
        >
          Wallet Hub
        </ThemedText> */}
      </View>
      <ScrollView>
        <View
          style={{
            width: "100%",
            justifyContent: "space-evenly",
            alignItems: "center",
            paddingHorizontal: "5%",
            // height: "50%",
            marginTop: 30,
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
    // height: "20%",
    borderRadius: 10,
    // paddingLeft: 20,
  },
  linkButton: {
    height: 97,
    marginTop: 10,
    borderRadius: 15,
    paddingLeft: 20,
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});
