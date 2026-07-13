import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import {
  MailIcon,
  HelpIcon,
  PrivacyIcon,
  ServiceIcon,
  TermsIcon,
} from "@/assets/icons/SVG/RandomIcons";
import { UserIcon } from "@/assets/icons/SVG/NavIcon";
const ICON_COLORS = {
  userIcon: "#34D399",
  serviceIcon: "#FBBF24",
  mailIcon: "#A855F7",
  helpIcon: "#FB7185",
  privacyIcon: "#2DD4BF",
  termsIcon: "#94A3B8",
} as const;

export function Collapsible({
  children,
  title,
  iconName,
}: PropsWithChildren & {
  title: string;
  iconName: keyof typeof ICON_COLORS;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");

  const color = ICON_COLORS[iconName];

  const collapseIcons = {
    mailIcon: <MailIcon color={color} isFocused={isOpen} />,
    helpIcon: <HelpIcon color={color} isFocused={isOpen} />,
    privacyIcon: <PrivacyIcon color={color} isFocused={isOpen} />,
    serviceIcon: <ServiceIcon color={color} isFocused={isOpen} />,
    termsIcon: <TermsIcon color={color} isFocused={isOpen} />,
    userIcon: <UserIcon color={color} isFocused={isOpen} />,
  };

  const rotation = useSharedValue(0);
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  const toggle = () => {
    rotation.value = withTiming(isOpen ? 0 : 90, { duration: 200 });
    setIsOpen((v) => !v);
  };
  return (
    <ThemedView>
      <TouchableOpacity
        style={[
          styles.row,
          {
            backgroundColor: surface,
            borderColor: isOpen ? color + "25" : cardBorder,
          },
        ]}
        onPress={toggle}
        activeOpacity={0.8}
      >
        <View style={[styles.chip ,{ backgroundColor: color + "22" }]}>{collapseIcons[iconName]}</View>
        <ThemedText type="defaultSemiBold" style={{ flex: 1, fontSize: 15 }}>
          {title}
        </ThemedText>
        <Animated.View style={chevronStyle}>
          <Svg
            width={17}
            height={17}
            viewBox="0 0 24 24"
            fill="none"
            stroke={textMuted}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M9 6l6 6-6 6" />
          </Svg>
        </Animated.View>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
  },
  chip: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 12,
    paddingHorizontal: 4,
  },
});
