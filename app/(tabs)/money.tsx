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

  return (
    <AnimateTabView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <View style={[styles.headContainer, {}]}>
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
      </View>
      <ScrollView
        contentContainerStyle={{
          justifyContent: "space-evenly",
          alignItems: "center",
          gap: 10,
        }}
        style={{
          width: "100%",
          paddingHorizontal: "5%",
          marginTop: 30,
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
        <View
          style={{
            paddingBottom: 40,
          }}
        ></View>
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
