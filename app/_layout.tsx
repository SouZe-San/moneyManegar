import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, Suspense } from "react";
import { SQLiteProvider } from "expo-sqlite";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { ExpenseProvider } from "@/context/ExpanseContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { migrateDbIfNeeded } from "@/hooks/useStorage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

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
      <Suspense
        fallback={
          <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ThemedText>Loading... </ThemedText>
          </ThemedView>
        }
      >
        <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded} useSuspense>
          <ExpenseProvider>
            <StatusBar
              translucent
              hideTransitionAnimation="fade"
              hidden={true}
              backgroundColor="transparent"
              // hidden
              networkActivityIndicatorVisible
            />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen
                name="entries/income"
                options={{
                  title: "",
                  headerShadowVisible: false,
                  headerTransparent: true,
                  headerBackVisible: false,
                  headerTintColor: headerTextColor,
                }}
              />
              <Stack.Screen
                name="entries/expense"
                options={{
                  title: "",
                  headerShadowVisible: false,
                  headerTransparent: true,
                  headerBackVisible: false,
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
                  headerBackVisible: false,
                  headerTintColor: headerTextColor,
                }}
              />
              <Stack.Screen
                name="entries/payble"
                options={{
                  title: "",
                  headerShadowVisible: false,
                  headerTransparent: true,
                  headerBackVisible: false,
                  headerTintColor: headerTextColor,
                }}
              />
              <Stack.Screen
                name="setting"
                options={{
                  title: "",
                  headerShadowVisible: false,
                  headerLargeTitle: true,
                  headerTransparent: true,
                  headerBackVisible: false,
                  headerTintColor: headerTextColor,
                }}
              />
              <Stack.Screen
                name="allStats"
                options={{
                  title: "",
                  headerShadowVisible: false,
                  headerLargeTitle: true,
                  headerTransparent: true,
                  headerBackVisible: false,
                  headerTintColor: headerTextColor,
                }}
              />
              <Stack.Screen
                name="allTransaction"
                options={{
                  title: "",
                  headerShadowVisible: false,
                  headerLargeTitle: true,
                  headerTransparent: true,
                  headerBackVisible: false,
                  headerTintColor: headerTextColor,
                }}
              />
              <Stack.Screen
                name="groups/[groupId]"
                options={{
                  title: "",
                  headerShadowVisible: false,
                  headerLargeTitle: true,
                  headerTransparent: true,
                  headerBackVisible: false,
                  headerTintColor: headerTextColor,
                }}
              />
              <Stack.Screen
                name="groups/create"
                options={{
                  title: "",
                  headerShadowVisible: false,
                  headerLargeTitle: true,
                  headerTransparent: true,
                  headerBackVisible: false,
                  headerTintColor: headerTextColor,
                }}
              />
              <Stack.Screen
                name="notification"
                options={{
                  title: "",
                  headerShadowVisible: false,
                  headerTransparent: true,
                  headerTintColor: headerTextColor,
                }}
              />
            </Stack>
          </ExpenseProvider>
        </SQLiteProvider>
      </Suspense>
    </ThemeProvider>
  );
}
