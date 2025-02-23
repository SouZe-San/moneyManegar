import { ScrollView, View, StyleSheet, Pressable, FlatList, ViewToken } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

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
  const borderColor = useThemeColorWithName("borderColor");
  const buttonBgColor = useThemeColorWithName("toggleButton");

  return (
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
          {iconLowMatch[item as "Salary" | "Gift" | "Business" | "Others"]}
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
