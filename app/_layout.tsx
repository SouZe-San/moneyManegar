import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { ExpenseProvider } from "@/context/ExpanseContext";

import { NavigationContainer } from "@react-navigation/native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const headerColor = useThemeColorWithName("background");
  const headerTextColor = useThemeColorWithName("text");
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ExpenseProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="entries/income"
            options={{
              title: "Income: Add Money",
              headerShadowVisible: false,
              headerTransparent: true,
              headerTitleAlign: "center",
              headerTintColor: headerTextColor,
            }}
          />
          <Stack.Screen
            name="entries/expense"
            options={{
              title: "",
              headerShadowVisible: false,
              headerTransparent: true,
              headerTintColor: headerTextColor,
            }}
          />
          <Stack.Screen
            name="entries/contribute"
            options={{
              title: "",
              // title: "Contribute: Kon kon paisa dega  ",
              headerShadowVisible: false,
              headerTransparent: true,
              headerTintColor: headerTextColor,
            }}
          />
          <Stack.Screen
            name="entries/payble"
            options={{
              title: "payble: or kitneko paisa doo",
              headerShadowVisible: false,
              headerTransparent: true,
              headerTintColor: headerTextColor,
            }}
          />
          <Stack.Screen
            name="setting"
            options={{
              title: "Settings",
              headerShadowVisible: false,
              headerTransparent: true,
              headerTintColor: headerTextColor,
            }}
          />
          <Stack.Screen
            name="groups/[groupId]"
            options={{
              title: "gggg",
              headerShadowVisible: false,
              headerTransparent: true,
              headerTintColor: headerTextColor,
            }}
          />
          <Stack.Screen
            name="groups/create"
            options={{
              title: "",
              headerShadowVisible: false,
              headerTransparent: true,
              headerTintColor: headerTextColor,
            }}
          />
        </Stack>
      </ExpenseProvider>
    </ThemeProvider>
  );
}
