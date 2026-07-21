import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  ReduceMotion,
} from "react-native-reanimated";
import { StyleProp, TextStyle, useWindowDimensions, type ImageURISource } from "react-native";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

import { useThemeColorWithName } from "@/hooks/useThemeColor";

interface imageProps {
  title: string;
  imgUrl: ImageURISource | undefined;
  textStyle?: StyleProp<TextStyle>;
}

const ImageHeader = ({ imgUrl, title, textStyle = {} }: imageProps) => {

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();  
  const scale = useSharedValue(1);
  const background = useThemeColorWithName("background");
  const easing = Easing.bezier(0.33, -0.01, 0.68, 1.01);

  useFocusEffect(
    useCallback(() => {
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
        style={[
          {
            position: "relative",
            bottom: 60,
            paddingLeft: 40,
            zIndex: 4,
            textShadowColor: background,
            textShadowOffset: { width: 1.4, height: 1 },
            textShadowRadius: 4,
          },
          textStyle,
        ]}
      >
        {title}
      </ThemedText>
      <Animated.Image
        source={imgUrl}
        blurRadius={2}
        resizeMethod="resize"
        style={[
          {
            position: "absolute",
            left: 0,
            top: 0,
            transformOrigin: "0 0 ",
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
