import { ScrollView, View, StyleSheet, Pressable, FlatList, ViewToken, useColorScheme } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import CategoryIcon from "./CategoryIcon";
import { ColorMapping } from "@/constants/Colors";

type ExpanseTypeProps = {
  value: string | undefined;
  setValue: (value: string) => void;
  item: string;
};

const iconLowMatch = {
  Salary: "💰",
  Gift: "🎁",
  Business: "👤",
  Others: "🧻",
};

const ExpenseTypeButton = ({ value, setValue, item }: ExpanseTypeProps) => {

   const scheme = useColorScheme() ?? "dark";
   const categoryColor =
     (ColorMapping[scheme] as Record<string, string>)[item]?.trim();

  return (
    <View style={[styles.expenseTypeButton]}>
      <Pressable
        style={[
          styles.expenseTypeButton_btn,
          {
            borderColor: value === item ? categoryColor + "60" : "transparent",
            backgroundColor:
              value === item ? categoryColor + "26" : categoryColor + "15",
          },
        ]}
        onPress={() => setValue(item)}
      >
        <ThemedText style={styles.buttonLabel}>
          {/* {iconLowMatch[item as "Salary" | "Gift" | "Business" | "Others"]} */}
          <CategoryIcon
            type={item as "Salary" | "Gift" | "Business" | "Others"}
            color={categoryColor}
            size={22}
          />
        </ThemedText>
      </Pressable>
      <ThemedText style={styles.buttonSubLabel} colorName="buttonBg">
        {item}
      </ThemedText>
    </View>
  );
};

export default ExpenseTypeButton;

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
