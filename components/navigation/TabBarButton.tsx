import { Text, StyleSheet, Pressable } from "react-native";
import { navIcons } from "@/constants/navIcons";

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
export default function TabBarButton({
  isFocused,
  label,
  onPress,
  onLongPress,
  routeName,
}: {
  onPress: () => void;
  onLongPress: () => void;
  routeName: string;
  isFocused: boolean;
  label: string;
}) {
  const scale = useSharedValue(0);
  //   Animate

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, {
      duration: 360,
    });
  }, [scale.get(), isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.get(), [0, 1], [1.1, 1.2]);

    const topValue = interpolate(scale.get(), [0, 1], [10, 0]);
    return {
      transform: [{ scale: scaleValue }],
      top: topValue,
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacityValue = interpolate(scale.get(), [0, 1], [0, 1]);

    return {
      opacity: opacityValue,
    };
  });

  const labelColor = useThemeColorWithName("tabIconSelected");

  return (
    <Pressable
      role="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
    >
      {/* Use Icons */}

      <Animated.View style={[animatedIconStyle, styles.tabIcon]}>
        {navIcons(routeName, isFocused)}
      </Animated.View>

      <Animated.Text style={[{ color: labelColor }, animatedTextStyle, styles.tabLabel]}>
        {label as string}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  tabLabel: {
    fontSize: 13,
    transform: [{ scale: 0.8 }],
    paddingVertical: 0,
  },
  tabIcon: {
    top: 10,
  },
});
