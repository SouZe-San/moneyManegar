import { ScrollView, View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { iconReturn } from "@/constants/expanseIcon";

import {
  FoodIcon,
  BusIcon,
  FuelIcon,
  MobileIcon,
  ShoppingIcon,
  WarBonnetIcon,
} from "@/assets/icons/SVG/ExpanseIcons";

type ExpanseTypeProps = {
  value: string | undefined;
  setValue: (value: string) => void;
};

const expanseTypes = ["Food", "Fuel", "Shopping", "Recharge", "Bill", "Rent", "Travels", "Others"];

// const iconReturn = (icon: string, color: string) => {
//   const icons = {
//     Food: <FoodIcon color={color} />,
//     Fuel: <FuelIcon color={color} />,
//     Shopping: <ShoppingIcon color={color} />,
//     Recharge: <MobileIcon color={color} />,
//     Travels: <BusIcon color={color} />,
//     Others: <WarBonnetIcon color={color} />,
//   };
//   return icons[icon as keyof typeof icons];
// };

export default function ExpanseType(props: ExpanseTypeProps) {
  const borderColor = useThemeColorWithName("borderColor");
  const buttonBgColor = useThemeColorWithName("button");
  const buttonTextColor = useThemeColorWithName("background");
  return (
    <ScrollView
      horizontal
      style={styles.expanseTypeContainer}
      showsHorizontalScrollIndicator={false}
    >
      {expanseTypes.map((type, index) => (
        <View style={[styles.expenseTypeButton]} key={index}>
          <Pressable
            style={[
              styles.expenseTypeButton_btn,
              {
                borderColor,
                backgroundColor: props.value === type ? buttonBgColor : "transparent",
              },
            ]}
            onPress={() => props.setValue(type)}
          >
            <ThemedText style={styles.buttonLabel}>
              {iconReturn(
                type as
                  | "Food"
                  | "Fuel"
                  | "Shopping"
                  | "Recharge"
                  | "Travels"
                  | "Others"
                  | "Rent"
                  | "Bill"
              )}
              {/* {iconReturn(type.label, props.value === type.label ? buttonTextColor : buttonBgColor)} */}
            </ThemedText>
          </Pressable>
          <ThemedText style={styles.buttonSubLabel} colorName="buttonBg">
            {type}
          </ThemedText>
        </View>
      ))}
    </ScrollView>
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
