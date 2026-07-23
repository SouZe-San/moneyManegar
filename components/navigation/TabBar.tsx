import { View, StyleSheet, Platform } from "react-native";

import TabBarButton from "./TabBarButton";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CustomTabBar({ state, descriptors, navigation }: any) {
  const backgroundColor = useThemeColorWithName("navBg");
  const insets = useSafeAreaInsets(); 
  return (
    <View
      style={[
        tabBarStyle.tabBar,
        {
          backgroundColor,
          borderColor: "#abcbc433",
          bottom: insets.bottom + 12,
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            isFocused={isFocused}
            label={label as string}
            onLongPress={onLongPress}
            onPress={onPress}
            routeName={route.name}
            key={route.name}
          />
        );
      })}
    </View>
  );
}

const tabBarStyle = StyleSheet.create({
  tabBar: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: Platform.OS === "web" ? 0 : 30,
    left: Platform.OS === "web" ? "50%" : 0,
    transform: [{ translateX: Platform.OS === "web" ? "-50%" : 0 }],
    borderRadius: 16,
    paddingVertical: 5,
    borderWidth: 1,
  },
});
