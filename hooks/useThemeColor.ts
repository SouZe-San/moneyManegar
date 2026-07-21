/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from "react-native";

import { Colors, ColorMapping } from "@/constants/Colors";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
export function useThemeColorWithName(
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";

  return Colors[theme][colorName];
}
export function getThemeColorMapping(
  theme: "light" | "dark",
  colorName: keyof typeof ColorMapping.light & keyof typeof ColorMapping.dark,
) {
  return ColorMapping[theme][colorName];
}
