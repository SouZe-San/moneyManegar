import { View, StyleSheet, Pressable, FlatList, ViewToken, useColorScheme } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SharedValue,
  Easing,
  withSpring,
  ReduceMotion,
} from "react-native-reanimated";
import CategoryIcon from "../comp/CategoryIcon";
import { expenseType } from "@/types/expanse";
import { ColorMapping } from "@/constants/Colors";
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
 const surface = useThemeColorWithName("surface");
 const cardBorder = useThemeColorWithName("cardBorder");
 const textMuted = useThemeColorWithName("textMuted");
  const scheme = useColorScheme() ?? "dark";
  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value
        .filter((item) => item.isViewable)
        .find((viewableItem) => viewableItem.item === item)
    );
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
        },
      ],
    };
  }, [viewableItems.value]);

   const categoryColor =
     (ColorMapping[scheme] as Record<string, string>)[item]?.trim();

  return (
    <Animated.View style={[rStyle]}>
      <View style={[styles.expenseTypeButton]}>
        <Pressable
          style={[
            styles.expenseTypeButton_btn,
            {
              borderColor: value === item ? categoryColor : cardBorder,
              backgroundColor: value === item ? categoryColor + "26" : surface,
            },
          ]}
          onPress={() => setValue(item)}
        >
          <ThemedText style={styles.buttonLabel}>
            <CategoryIcon
              type={item as "Salary" | "Gift" | "Business" | expenseType}
              color={ value === item ? categoryColor: textMuted}
              size={22}
            />
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
    paddingVertical: 5,
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
