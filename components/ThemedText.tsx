import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor, useThemeColorWithName } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link" | "tabTitle" | "smallText";
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  colorName = "text",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColorWithName(colorName);
  useThemeColorWithName;
  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "tabTitle" ? styles.tabTitle : undefined,
        type === "smallText" ? styles.smallText : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  smallText: {
    fontSize: 13,
    lineHeight: 24,
    color: "#a3a4a4",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
  tabTitle: {
    fontWeight: "bold",
    fontSize: 40,
  },
});
