import React from "react";
import { ViewToken, type ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
  withDelay,
  withSpring,
  SharedValue,
  Easing,
  ReduceMotion,
} from "react-native-reanimated";
import { Budget, ITransaction, IUdahar } from "@/types/expanse";

/**
 * Vertical version of the FolioBox reveal:
 * fade (timing) + pop (spring) that REVERSES when the row leaves view,
 * so rows re-reveal every time they scroll back in.
 */

// How small a row starts. 0.3 is the FolioBox value — dramatic "pop".
// Raise toward 0.85 if it feels too busy while scrolling a long list.
const FROM_SCALE = 0.3;

const ROW_STAGGER = 22; // ms between neighbouring rows, first reveal only
// Set ROW_STAGGER = 0 to remove the cascade entirely (fastest, still reveals)
const ROWS_PER_SCREEN = 9; // caps worst-case delay at 5 * ROW_STAGGER

const SPRING = {
  duration: 260,
  dampingRatio: 0.8, // <1 = slight overshoot; higher = snappier, less bounce
  reduceMotion: ReduceMotion.System,
};

type ListItemProps = ViewProps & {
  viewableItems: SharedValue<ViewToken[]>;
  item: IUdahar | ITransaction | Budget;
  index?: number;
};

const AnimatedListItem = React.memo(
  ({ item, index = 0, style, viewableItems, ...otherProps }: ListItemProps) => {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(FROM_SCALE);
    const appeared = useSharedValue(false); // stagger only the very first entry

    useAnimatedReaction(
      () =>
        viewableItems.value.some(
          (vi) => vi.isViewable && vi.item?._id === item._id,
        ),
      (isVisible, wasVisible) => {
        // only act on an actual enter/leave, not every viewability write
        if (isVisible === wasVisible) return;

        // first reveal cascades; afterwards it reacts instantly
        const delay =
          isVisible && !appeared.value
            ? (index % ROWS_PER_SCREEN) * ROW_STAGGER
            : 0;
        if (isVisible) appeared.value = true;

        opacity.value = withDelay(
          delay,
          withTiming(isVisible ? 1 : 0, {
            duration: isVisible ? 170 : 130,
            easing: Easing.out(Easing.exp),
          }),
        );
        scale.value = withDelay(
          delay,
          withSpring(isVisible ? 1 : FROM_SCALE, SPRING),
        );
      },
      [item._id, index],
    );

    const rStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    }));

    return <Animated.View style={[style, rStyle]} {...otherProps} />;
  },
);

export default AnimatedListItem;
