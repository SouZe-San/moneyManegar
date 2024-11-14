import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { ExpenseProvider } from "@/context/ExpanseContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const headerColor = useThemeColorWithName("background");
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
            }}
          />
          <Stack.Screen
            name="entries/expense"
            options={{
              title: "",
              headerShadowVisible: false,
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="entries/contribute"
            options={{
              title: "",
              // title: "Contribute: Kon kon paisa dega  ",
              headerShadowVisible: false,
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="entries/payble"
            options={{
              title: "payble: or kitneko paisa doo",
              headerShadowVisible: false,
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="setting"
            options={{
              title: "Settings",
              headerShadowVisible: false,
              headerTransparent: true,
            }}
          />
        </Stack>
      </ExpenseProvider>
    </ThemeProvider>
  );
}
