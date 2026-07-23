import { ActivityIndicator } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, Suspense, useState } from "react";
import { SQLiteProvider } from "expo-sqlite";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { ExpenseProvider } from "@/context/ExpanseContext";
import { HeaderImageProvider } from "@/context/HeaderImageContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { migrateDbIfNeeded } from "@/hooks/useStorage";
import { ThemedView } from "@/components/ThemedView";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const high = useThemeColorWithName("highLightBackground");
  const headerTextColor = useThemeColorWithName("text");

  const [loaded] = useFonts({
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
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
            <ActivityIndicator size="large" color={high} />
          </ThemedView>
        }
      >
        <SQLiteProvider
          databaseName="test.db"
          onInit={migrateDbIfNeeded}
          useSuspense
        >
          <HeaderImageProvider>
            <ExpenseProvider>
              <StatusBar
                translucent
                hideTransitionAnimation="fade"
                hidden={true}
                backgroundColor="transparent"
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
                  name="entries/budget"
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
                  name="headerImages"
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
                  name="allBudgets"
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
                <Stack.Screen
                  name="login"
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
                  name="startingEntry"
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
                  name="onboarding"
                  options={{
                    title: "",
                    headerShadowVisible: false,
                    headerLargeTitle: true,
                    headerTransparent: true,
                    headerBackVisible: false,
                    headerTintColor: headerTextColor,
                  }}
                />
              </Stack>
            </ExpenseProvider>
          </HeaderImageProvider>
        </SQLiteProvider>
      </Suspense>
    </ThemeProvider>
  );
}
