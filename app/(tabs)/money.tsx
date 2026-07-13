import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Href, Link, useRouter } from "expo-router";
import Svg, { Path, Circle } from "react-native-svg";
// hooks
import { ThemedText } from "@/components/ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

// components
import AnimateTabView from "@/components/animation/AnimateTabView";
import ImageHeader from "@/components/animation/ImageHeader";

type LinkBtn = {
  linkLabel: string;
  sub: string;
  link: Href;
  color: string;
  icon: React.JSX.Element;
};
const Icon = ({
  color,
  d,
  extra,
}: {
  color: string;
  d?: string;
  extra?: React.JSX.Element;
}) => (
  <Svg
    width={23}
    height={23}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.1}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {d ? <Path d={d} /> : null}
    {extra}
  </Svg>
);
const linkBtns: LinkBtn[] = [
  {
    linkLabel: "Add Incomes",
    sub: "Money coming in",
    link: "/entries/income",
    color: "#34D399",
    icon: <Icon color="#34D399" d="M6 15l6-6 6 6" />,
  },
  {
    linkLabel: "Add Expenses",
    sub: "Money going out",
    link: "/entries/expense",
    color: "#FB7185",
    icon: <Icon color="#FB7185" d="M6 9l6 6 6-6" />,
  },
  {
    linkLabel: "Add Payble (debt)",
    sub: "What I owe",
    link: "/entries/payble",
    color: "#edfb24",
    icon: (
      <Icon
        color="#edfb24"
        d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 18V6"
      />
    ),
  },
  {
    linkLabel: "Add Contribute",
    sub: "Group chip-ins",
    link: "/entries/contribute",
    color: "#A855F7",
    icon: (
      <Icon
        color="#A855F7"
        extra={
          <>
            <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87" />
            <Circle cx={9} cy={7} r={4} />
          </>
        }
      />
    ),
  },
  {
    linkLabel: "Budget",
    sub: "Plan the month",
    link: "/entries/budget",
    color: "#38BDF8",
    icon: <Icon color="#38BDF8" d="M5 21v-6M12 21V3M19 21V9" />,
  },
];

export default function MoneyManager() {
  const borderColor = useThemeColorWithName("borderColor");
  const bg = useThemeColorWithName("blurBg");
    const surface = useThemeColorWithName("surface");
    const cardBorder = useThemeColorWithName("cardBorder");
    const textMuted = useThemeColorWithName("textMuted");
    const router = useRouter();

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
        contentContainerStyle={{ gap: 12 }}
        style={{ width: "100%", paddingHorizontal: "5%", marginTop: 60 }}
      >
        {linkBtns.map((linkBtn, index) => {
          return (
            <Pressable
              key={index}
              onPress={() => router.push(linkBtn.link)}
              android_ripple={{ color: linkBtn.color + "22" }}
              style={({ pressed }) => [
                styles.linkButton,
                {
                  backgroundColor: surface,
                  borderColor: pressed ? linkBtn.color + "55" : cardBorder,
                  opacity: pressed ? 0.94 : 1,
                },
              ]}
            >
              <View style={[styles.chip, { backgroundColor: linkBtn.color + "22" }]}>
                {linkBtn.icon}
              </View>

              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>
                  {linkBtn.linkLabel}
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 12, color: textMuted, marginTop: 1 }}
                >
                  {linkBtn.sub}
                </ThemedText>
              </View>

              <Svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke={textMuted}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M9 6l6 6-6 6" />
              </Svg>
            </Pressable>
          );
        })}
        <View
          style={{
            paddingBottom: 130,
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
    borderRadius: 10,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 76,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: "100%",
    overflow: "hidden",
  },
  chip: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
});
