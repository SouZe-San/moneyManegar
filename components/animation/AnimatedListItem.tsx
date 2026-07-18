import React from "react";
import { ViewToken, type ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
  withDelay,
  SharedValue,
  Easing,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import {Budget, ITransaction, IUdahar } from "@/types/expanse";

const ROW_STAGGER = 45; // ms between neighbouring rows -> the "one by one" feel
const ROWS_PER_SCREEN = 9; // restart the cascade each screenful (so row 130 doesn't wait)

type ListItemProps = ViewProps & {
  viewableItems: SharedValue<ViewToken[]>;
  item: IUdahar | ITransaction | Budget;
  index?: number;
};

const AnimatedListItem = React.memo(
  ({ item, index,style, viewableItems, ...otherProps }: ListItemProps) => {
    const progress = useSharedValue(0); // 0 = below + small + faded, 1 = full
    const started = useSharedValue(false);
    useAnimatedReaction(
      () =>
        viewableItems.value.some(
          (vi) => vi.isViewable && vi.item?._id === item._id,
        ),
      (isVisible) => {
        // fire ONCE, the first time this row enters view -> smooth, no re-trigger jitter
        if (isVisible && !started.value) {
          started.value = true;
          progress.value = withDelay(
            (index! % ROWS_PER_SCREEN) * ROW_STAGGER, // stagger => one after another
            withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) }),
          );
        }
      },
      [item._id, index],
    );

    const rStyle = useAnimatedStyle(() => ({
      opacity: progress.value,
      transform: [
        { translateY: (1 - progress.value) * 40 }, // 40px below -> settles up
        { scale: 0.5 + progress.value * 0.5 }, // little -> full
      ],
    }));

    return (
      <Animated.View
        style={[style, rStyle]}
        {...otherProps}
        // exiting={FadeOut}
        // layout={LinearTransition.easing(Easing.ease)}
      />
    );
  },
);

export default AnimatedListItem;
