import { ScrollView, View, StyleSheet, Pressable, FlatList, ViewToken } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { iconReturn } from "@/constants/expanseIcon";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SharedValue,
  Easing,
  withSpring,
  ReduceMotion,
} from "react-native-reanimated";
type ExpanseTypeProps = {
  value: string | undefined;
  setValue: (value: string) => void;
};

const expanseTypes = ["Food", "Fuel", "Shopping", "Recharge", "Bill", "Rent", "Travels", "Others"];

const ExpanseButton = ({
  item,
  value,
  setValue,
  viewableItems,
}: { item: string; viewableItems: SharedValue<ViewToken[]> } & ExpanseTypeProps) => {
  const borderColor = useThemeColorWithName("borderColor");
  const buttonBgColor = useThemeColorWithName("toggleButton");

  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value
        .filter((item) => item.isViewable)
        .find((viewableItem) => viewableItem.item === item)
    );
    // const isVisible = true;
    return {
      opacity: withTiming(isVisible ? 1 : 0, {
        duration: 300, // Adjust duration for smoother transition
        easing: Easing.out(Easing.exp), // Use an easing function for smoother transitions
      }),

      transform: [
        {
          scale: withSpring(isVisible ? 1 : 0.3, {
            duration: 300,
            stiffness: 75,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 2,
            reduceMotion: ReduceMotion.System,
          }),
          // scale: withTiming(isVisible ? 1 : 0.2, {
          //   duration: 300, // Match duration with opacity for synchronization
          //   easing: Easing.bounce, // Use an easing function for smoother transitions
          // }),
        },
      ],
    };
  }, [viewableItems.value]); // Add dependencies to ensure it updates correctly

  return (
    <Animated.View style={[rStyle]}>
      <View style={[styles.expenseTypeButton]}>
        <Pressable
          style={[
            styles.expenseTypeButton_btn,
            {
              borderColor,
              backgroundColor: value === item ? buttonBgColor : "transparent",
            },
          ]}
          onPress={() => setValue(item)}
        >
          <ThemedText style={styles.buttonLabel}>
            {iconReturn(
              item as
                | "Food"
                | "Fuel"
                | "Shopping"
                | "Recharge"
                | "Travels"
                | "Others"
                | "Rent"
                | "Bill"
            )}
          </ThemedText>
        </Pressable>
        <ThemedText style={styles.buttonSubLabel} colorName="buttonBg">
          {item}
        </ThemedText>
      </View>
    </Animated.View>
  );
};

export default function ExpanseType(props: ExpanseTypeProps) {
  const viewableItems = useSharedValue<ViewToken[]>([]);

  return (
    <FlatList
      horizontal
      style={styles.expanseTypeContainer}
      showsHorizontalScrollIndicator={false}
      data={expanseTypes}
      keyExtractor={(item) => item}
      onViewableItemsChanged={({ viewableItems: vItems }) => {
        viewableItems.value = vItems;
      }}
      renderItem={({ item, index: numbers }) => {
        return (
          <ExpanseButton
            item={item}
            value={props.value}
            setValue={props.setValue}
            viewableItems={viewableItems}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  expanseTypeContainer: {
    // gap: 10,
    flexGrow: 0,
    marginVertical: 5,
  },
  expenseTypeButton: {
    // width: 60,
    height: 90,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  expenseTypeButton_btn: {
    width: 60,
    aspectRatio: 1,
    display: "flex",
    borderWidth: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonLabel: {
    fontSize: 20,
  },
  buttonSubLabel: {
    fontSize: 12,
  },
});
