import { type ViewProps } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { useCallback } from "react";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useFocusEffect } from "expo-router";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const AnimateTabView = ({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) => {
  // animate Values
  const scale = useSharedValue(1.2);
  const translateY = useSharedValue(30);

  // colors
  const backgroundColor = useThemeColorWithName("background");

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });

  useFocusEffect(
    useCallback(() => {
      cancelAnimation(scale);
      cancelAnimation(translateY);

      scale.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      });
      translateY.value = withTiming(0, { duration: 300 });

      return () => {
        cancelAnimation(scale);
        cancelAnimation(translateY);
        scale.value = 1.2;
        translateY.value = 30;
      };
    }, []),
  );

  return (
    <Animated.View
      style={[{ backgroundColor }, animatedStyle, style]}
      {...otherProps}
    />
  );
};

export default AnimateTabView;
