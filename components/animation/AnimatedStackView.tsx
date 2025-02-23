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

const AnimatedStackView = ({ style, ...otherProps }: ViewProps) => {
  const scale = useSharedValue(0);

  //   const translateY = useSharedValue(30);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      zIndex: 1,
    };
  });
  const backgroundColor = useThemeColorWithName("background");

  useFocusEffect(
    useCallback(() => {
      scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) });

      //   translateY.value = withTiming(0, { duration: 300 });

      return () => {
        scale.value = withTiming(0, { duration: 600 });
        // translateY.value = withTiming(30, { duration: 300 });
      };
    }, [])
  );
  return <Animated.View style={[{ backgroundColor }, animatedStyle, style]} {...otherProps} />;
};

export default AnimatedStackView;
