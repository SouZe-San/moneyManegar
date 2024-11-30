import { type ViewProps } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { useCallback } from "react";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useFocusEffect } from "expo-router";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const AnimateTabView = ({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) => {
  const scale = useSharedValue(1.2);

  const translateY = useSharedValue(30);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });

  const backgroundColor = useThemeColorWithName("background");

  useFocusEffect(
    useCallback(() => {
      scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.exp) });

      translateY.value = withTiming(0, { duration: 300 });

      return () => {
        scale.value = withTiming(1.2, { duration: 300 });
        translateY.value = withTiming(30, { duration: 300 });
      };
    }, [])
  );

  return <Animated.View style={[{ backgroundColor }, animatedStyle, style]} {...otherProps} />;
};

export default AnimateTabView;
