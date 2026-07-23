import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { Dimensions, StyleSheet, View } from "react-native";
import React, { useCallback, useImperativeHandle } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  Extrapolation,
  interpolate,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT,width:SCREEN_WIDTH } = Dimensions.get("window");

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

type BottomSheetProps = {
  children?: React.ReactNode;
};
export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const BottomSheetView = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children }, ref) => {
    const translateY = useSharedValue(-SCREEN_HEIGHT / 2);
    const active = useSharedValue(false);

    const scrollTo = useCallback((destination: number) => {
      "worklet";
      active.value = destination !== 0;
      translateY.value = withSpring(destination, { damping: 50 });
    }, []);

    const isActive = useCallback(() => {
      return active.get();
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [scrollTo, isActive]);

    const context = useSharedValue({ y: 0 });
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.get() };
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.get(), MAX_TRANSLATE_Y);
      })
      .onEnd(() => {
        if (translateY.get() > -SCREEN_HEIGHT / 4) {
          scrollTo(0);
        } else if (translateY.get() < -SCREEN_HEIGHT / 2) {
          scrollTo(MAX_TRANSLATE_Y);
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.get(),
        [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
        [25, 5],
        Extrapolation.CLAMP,
      );
      return {
        borderRadius,
        transform: [{ translateY: translateY.get() }],
      };
    });
    const bg = useThemeColorWithName("background");
    const barColor = useThemeColorWithName("text");
    return (
      <Animated.View style={[styles.container, rBottomSheetStyle, { backgroundColor: bg }]}>
        <GestureDetector gesture={gesture}>
          <View style={styles.topContainer}>
            <View style={[styles.bar, { backgroundColor: barColor }]} />
          </View>
        </GestureDetector>
        {children}
      </Animated.View>
    );
  }
);

export default BottomSheetView;

const styles = StyleSheet.create({
  topContainer: {
    paddingVertical: 10,
    width: "100%",
  },
  bar: {
    width: 60,
    height: 5,
    borderRadius: 5,
    alignSelf: "center",
    marginVertical: 10,
  },
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    top: SCREEN_HEIGHT,
    position: "absolute",
    left: 0,
    zIndex:3,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});
