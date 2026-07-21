import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { ThemedText } from "@/components/ThemedText";
export function HelloWave() {
  const rotationAnimation = useSharedValue(0);

  // Function to start the animation
  const startAnimation = () => {
    rotationAnimation.value = withRepeat(
      withSequence(withTiming(25, { duration: 150 }), withTiming(0, { duration: 150 })),
      4 // Run the animation 4 times
    );
  };

  // Using useFocusEffect to start the animation when the tab is focused
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
    marginLeft: 5,
  },
});
