import { Tabs, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CustomTabBar } from "@/components/navigation/TabBar";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useExpense } from "@/context/ExpanseContext";
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { firstRefresh } = useExpense();
  useEffect(() => {
    (async () => {
      const result = await SecureStore.getItemAsync("onboarding");
      if (result === null) {
        router.push("/onboarding");
      } else {
        firstRefresh();
      }
    })();
  }, []);

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      safeAreaInsets={{ top: -10, bottom: 0 }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: "Scan",
        }}
      />
      <Tabs.Screen
        name="money"
        options={{
          title: "Money",
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: "Udhari",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
        }}
      />
    </Tabs>
  );
}
