/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#beed11";
const tintColorDark = "#00df81";

export const Colors = {
  light: {
    text: "#11181C",
    antiFlashWhite: "#f1f2f6",
    inputIcon: "#101111",
    background: "#f1f2f6",
    tint: tintColorLight,
    mintGreen: "#324225",
    icon: "#687076",
    highLightBackground: "#dff169",
    button: "#012918",
    expanseBg: "#aebdc2",
    darkGreen: "#032221",
    mountainMeadow: "#114e3c",
    navBg: "#021e15f3",
    blurBg: "#4c4e4d33",
    // blurBg: "#4c4e4d33",
    tabIconDefault: "#6b8e4e",
    tabIconSelected: tintColorLight,
    buttonBg: "#05281d",
    borderColor: "#498428",
    // borderColor: "#3c8600",
    toggleButton: "#7dbe15d5",
    surface: "#ffffff",
    cardBorder: "rgba(0,0,0,0.06)",
    textMuted: "#5B6B66",
    income: "#0F9D6E",
    expense: "#E24B4A",
  },
  dark: {
    text: "#ECEDEE",
    antiFlashWhite: "#f1f2f6",
    inputIcon: "#f1f2f6",
    background: "#030f0e",
    // background: "#021b1a",
    navBg: "#172a299c",
    blurBg: "#abcbc427",
    mintGreen: "#6b8e4e",
    tint: tintColorDark,
    buttonBg: "#aacbc4",
    button: "#00df81",
    highLightBackground: "#00df81",
    darkGreen: "#032221",
    mountainMeadow: "#2cc295",
    bottomSheetBg: "#005e42",
    expanseBg: "#03624c",
    icon: "#b8ffcd9b",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    borderColor: "#00dd1266",
    inputBg: "#00df8230",
    // borderColor: "#00840b3e",
    toggleButton: "#00df8230",
    surface: "#10201C",
    cardBorder: "rgba(255,255,255,0.06)",
    textMuted: "#8A9B96",
    income: "#34D399",
    expense: "#FB7185",
  },
};

export const ColorMapping = {
  light: {
    Food: "#D94F4F",
    Fuel: "#3B82F6",
    Shopping: "#F59E0B",
    Recharge: "#10B981",
    Travels: "#8B5CF6",
    Others: "#6B7280",
    Rent: "#14B8A6",
    Bill: "#4F46E5",
    Salary: "#1d9e75",
    Gift: "#f472b6",
    Business: "#38bdf8",
  },
  dark: {
    Food: "#ff6900", // Vibrant Red - great for Food category
    Fuel: "#3B82F6", // Calm Blue - Fuel
    Shopping: "#FBBF24", // Golden Yellow - Shopping
    Recharge: "#34D399", // Fresh Green - Recharge
    Travels: "#A855F7", // Purple - Travels
    Others: "#b6bfcd", // Muted Grey - Others
    Rent: "#22d3ee", // Aqua Cyan - Rent
    Bill: "#6366F1", // Soft Indigo - Bill
    Salary: "#a3e635",
    Gift: "#f472b6",
    Business: "#38bdf8",
  },
};
