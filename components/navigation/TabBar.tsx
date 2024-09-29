import { View, StyleSheet, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import TabBarButton from "./TabBarButton";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const backgroundColor = useThemeColorWithName("navBg");
  return (
    <View style={[tabBarStyle.tabBar, { backgroundColor }]}>
      {state.routes.map((route, index) => {
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
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: Platform.OS === "web" ? 0 : 40,
    left: Platform.OS === "web" ? "50%" : 0,
    transform: [{ translateX: Platform.OS === "web" ? "-50%" : 0 }],
    borderRadius: 10,
    // paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#abcbc49b",
    shadowColor: "#ecedee",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 25,
  },
});
