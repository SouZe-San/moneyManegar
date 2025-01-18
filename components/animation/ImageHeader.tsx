import { Image, useWindowDimensions, type ImageURISource } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  ReduceMotion,
} from "react-native-reanimated";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";

interface imageProps {
  title: string;
  imgUrl: ImageURISource | undefined;
}

const ImageHeader = () => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const translateX = useSharedValue(SCREEN_WIDTH / 2);
  const scale = useSharedValue(1);
  const background = useThemeColorWithName("background");

  const easing = Easing.bezier(0.33, -0.01, 0.68, 1.01);
  // const easing = Easing.bezier(0.4, 0, 0.2, 1);

  // useEffect(() => {
  // }, [translateX, scale]);

  useFocusEffect(
    useCallback(() => {
      // translateX.value = withRepeat(
      //   withTiming(SCREEN_WIDTH / 2.6, {
      //     duration: 3500,
      //     easing,
      //   }),
      //   -1,
      //   true,
      //   () => {},
      //   ReduceMotion.System
      // );
      scale.value = withRepeat(
        withTiming(1.3, {
          duration: 10000,
          easing,
        }),
        -1,
        true,
        () => {},
        ReduceMotion.System
      );
    }, [])
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.get() }],
      // transform: [{ translateX: translateX.value }, { scale: scale.value }],
    };
  });

  return (
    <ThemedView
      style={{
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.3,
        display: "flex",
        justifyContent: "flex-end",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LinearGradient
        dither={false}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        colors={["rgb(2, 15, 14)", "rgba(3, 15, 14, 0)"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 100,
          zIndex: 1,
        }}
      />
      <ThemedText
        type="title"
        style={{
          position: "relative",
          bottom: 60,
          paddingLeft: 50,
          // left: 10,
          zIndex: 4,
        }}
      >
        All Wastes ಠ⁠_⁠ಠ
      </ThemedText>
      <Animated.Image
        source={require("@/assets/images/temp/green.jpg")}
        blurRadius={2}
        resizeMethod="resize"
        style={[
          {
            position: "absolute",
            left: 0,
            // left: "-45%",
            top: 0,
            transformOrigin: "0 0 ",
            // transform: `scale(1)`,
            // transform: `translateX(${SCREEN_WIDTH / 2}px) scale(1.07)`,
            opacity: 1,
            objectFit: "cover",
            width: "100%",
            height: "100%",
          },
          animatedStyle,
        ]}
      />
    </ThemedView>
  );
};

export default ImageHeader;
