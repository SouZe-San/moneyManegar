/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    antiFlashWhite: "#f1f2f6",
    background: "#fff",
    tint: tintColorLight,
    mintGreen: "#324225",
    icon: "#687076",
    highLightBackground: "#012918",
    darkGreen: "#032221",
    mountainMeadow: "#114e3c",
    navBg: "#000000",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    antiFlashWhite: "#f1f2f6",
    background: "#030f0e",
    // background: "#021b1a",
    navBg: "#abcbc427",
    mintGreen: "#6b8e4e",
    tint: tintColorDark,
    highLightBackground: "#00df81",
    darkGreen: "#032221",
    mountainMeadow: "#2cc295",
    icon: "#b8ffcd9b",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
