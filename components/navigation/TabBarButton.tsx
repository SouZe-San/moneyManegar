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
  //   const scale = useSharedValue(isFocused ? 1 : 0);

  //   Animate

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, {
      duration: 360,
    });
  }, [scale.value, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1.1, 1.2]);
    const topValue = interpolate(scale.value, [0, 1], [10, 0]);
    return {
      transform: [{ scale: scaleValue }],
      top: topValue,
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacityValue = interpolate(scale.value, [0, 1], [0, 1]);

    return {
      opacity: opacityValue,
    };
  });

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
        {navIcons[routeName as keyof typeof navIcons] ? (
          navIcons[routeName as keyof typeof navIcons](isFocused)
        ) : (
          <Ionicons name="home" size={24} color={"#00df81"} />
        )}
      </Animated.View>

      <Animated.Text
        style={[{ color: isFocused ? "#00df81" : "#030f0e" }, animatedTextStyle, styles.tabLabel]}
      >
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
    transform: [{ scale: 0.8 }],
    paddingVertical: 0,
  },
  tabIcon: {
    top: 10,
  },
});
