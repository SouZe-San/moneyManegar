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

const FROM_SCALE = 0.5;
const FROM_OPACITY = 0;


const AnimatedStackView = ({ style, ...otherProps }: ViewProps) => {
  const scale = useSharedValue(FROM_SCALE);
  const opacity = useSharedValue(FROM_OPACITY);

  const backgroundColor = useThemeColorWithName("background");

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  useFocusEffect(
    useCallback(() => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = FROM_SCALE;
      opacity.value = FROM_OPACITY;

      scale.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      });
      opacity.value = withTiming(1, {
        duration: 350,
        easing: Easing.out(Easing.quad),
      });

      return () => {
        cancelAnimation(scale);
        cancelAnimation(opacity);
        scale.value = FROM_SCALE;
        opacity.value = FROM_OPACITY;
      };
    }, [scale, opacity]),
  );
  return (
    <Animated.View
      style={[{ backgroundColor, zIndex: 1 }, animatedStyle, style]}
      {...otherProps}
    />
  );
};

export default AnimatedStackView;
