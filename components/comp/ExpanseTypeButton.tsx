import {
  View,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import CategoryIcon from "./CategoryIcon";
import { ColorMapping } from "@/constants/Colors";

type ExpanseTypeProps = {
  value: string | undefined;
  setValue: (value: string) => void;
  item: string;
};

const ExpenseTypeButton = ({ value, setValue, item }: ExpanseTypeProps) => {
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");
  const scheme = useColorScheme() ?? "dark";
  const categoryColor = (ColorMapping[scheme] as Record<string, string>)[
    item
  ]?.trim();

  return (
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
            type={item as "Salary" | "Gift" | "Business" | "Others"}
            color={value === item ? categoryColor : textMuted}
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
    flexGrow: 0,
    marginVertical: 5,
  },
  expenseTypeButton: {
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
