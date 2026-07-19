import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  type SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import SlideArt, { type SlideVariant } from "@/components/onboarding/SlideArt";

const { width: WIDTH } = Dimensions.get("window");

type Slide = {
  title: string;
  description: string;
  variant: SlideVariant;
};

const ONBOARDING_DATA: Slide[] = [
  {
    title: "Track every rupee",
    description:
      "Log what comes in and what goes out, sorted into categories you actually use.",
    variant: "track",
  },
  {
    title: "See where it went",
    description:
      "Charts and monthly breakdowns turn a pile of entries into something you can read.",
    variant: "stats",
  },
  {
    title: "Keep the month honest",
    description:
      "Set a budget and watch it fill up as you spend, so nothing sneaks past you.",
    variant: "budget",
  },
];

const Dot = ({
  index,
  scrollX,
  color,
}: {
  index: number;
  scrollX: SharedValue<number>;
  color: string;
}) => {
  const style = useAnimatedStyle(() => {
    const range = [(index - 1) * WIDTH, index * WIDTH, (index + 1) * WIDTH];
    return {
      width: interpolate(scrollX.value, range, [8, 22, 8], Extrapolation.CLAMP),
      opacity: interpolate(
        scrollX.value,
        range,
        [0.3, 1, 0.3],
        Extrapolation.CLAMP,
      ),
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 8,
          borderRadius: 4,
          marginHorizontal: 4,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
};

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();

  const accent = useThemeColorWithName("highLightBackground");
  const background = useThemeColorWithName("background");
  const textMuted = useThemeColorWithName("textMuted");

  const listRef = useRef<FlatList<Slide>>(null);
  const scrollX = useSharedValue(0);
  // lets our own navigation through the beforeRemove guard below
  const leaving = useRef(false);

  const isLast = currentIndex === ONBOARDING_DATA.length - 1;

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const finish = useCallback(() => {
    leaving.current = true;
    router.replace("/login");
  }, [router]);

  const handleNext = () => {
    if (isLast) {
      finish();
      return;
    }
    listRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
  };

  // Block the hardware/gesture back out of onboarding, but allow our own exit.
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      if (leaving.current) return;
      e.preventDefault();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <Animated.FlatList
        ref={listRef as any}
        data={ONBOARDING_DATA}
        keyExtractor={(item) => (item as Slide).title}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) =>
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / WIDTH))
        }
        renderItem={({ item }) => {
          const slide = item as Slide;
          return (
            <View style={{ width: WIDTH, flex: 1, justifyContent: "center" }}>
              <SlideArt variant={slide.variant} />
              <View style={{ paddingHorizontal: 26, marginTop: 34 }}>
                <ThemedText
                  type="title"
                  style={{ fontSize: 30, lineHeight: 38 }}
                >
                  {slide.title}
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 15,
                    lineHeight: 23,
                    color: textMuted,
                    marginTop: 10,
                  }}
                >
                  {slide.description}
                </ThemedText>
              </View>
            </View>
          );
        }}
      />

      {/* Skip — keeps its slot on the last slide so nothing shifts */}
      <View
        style={[
          styles.header,
          { top: insets.top + 6, opacity: isLast ? 0 : 1 },
        ]}
        pointerEvents={isLast ? "none" : "auto"}
      >
        <TouchableOpacity onPress={finish} hitSlop={12}>
          <ThemedText
            type="defaultSemiBold"
            style={{ letterSpacing: 1.4, color: accent }}
          >
            Skip
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 28 }]}>
        <View style={styles.pagination}>
          {ONBOARDING_DATA.map((_, index) => (
            <Dot key={index} index={index} scrollX={scrollX} color={accent} />
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.nextButton, { backgroundColor: accent }]}
          onPress={handleNext}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.nextButtonText, { color: background }]}
          >
            {isLast ? "Get started" : "Next"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    right: 20,
    zIndex: 5,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  nextButton: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    fontSize: 16,
    letterSpacing: 1.4,
  },
});
