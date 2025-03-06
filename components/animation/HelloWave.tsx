import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
export function HelloWave() {
  const rotationAnimation = useSharedValue(0);

  // // Function to start the animation
  const startAnimation = () => {
    rotationAnimation.value = withRepeat(
      withSequence(withTiming(25, { duration: 150 }), withTiming(0, { duration: 150 })),
      4 // Run the animation 4 times
    );
  };

  // Use useFocusEffect to start the animation when the tab is focused
  useFocusEffect(
    useCallback(() => {
      startAnimation(); // Start the animation when focused
    }, [])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.get()}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ThemedText style={styles.text}>👋</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    // lineHeight: 30,

    marginLeft: 5,
  },
});
