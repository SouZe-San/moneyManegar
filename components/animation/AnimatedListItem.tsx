import React from "react";
import { ViewToken, type ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  SharedValue,
  Easing,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { IUdahar } from "@/types/expanse";

type ListItemProps = ViewProps & {
  viewableItems: SharedValue<ViewToken[]>;
  item: IUdahar;
};

const AnimatedListItem = React.memo(
  ({ item, style, viewableItems, ...otherProps }: ListItemProps) => {
    const rStyle = useAnimatedStyle(() => {
      const isVisible = Boolean(
        viewableItems.value
          .filter((item) => item.isViewable)
          .find((viewableItem) => viewableItem.item._id === item._id)
      );

      return {
        transform: [
          {
            scale: withTiming(isVisible ? 1 : 0.2, {
              duration: 300, // Match duration with opacity for synchronization
              easing: Easing.out(Easing.exp), // Use an easing function for smoother transitions
            }),
          },
        ],
      };
    }, [viewableItems.value]); // Add dependencies to ensure it updates correctly

    return (
      <Animated.View
        style={[style, rStyle]}
        {...otherProps}
        exiting={FadeOut}
        layout={LinearTransition.easing(Easing.ease)}
      />
    );
  }
);

export default AnimatedListItem;
