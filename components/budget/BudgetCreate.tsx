import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { MoneyBagIcon } from "@/assets/icons/SVG/InputIcons";
import { InputWithIcon } from "../inputs/InputBox";
import { useState } from "react";
import SubmitButton from "../inputs/SubmitButton";
import { showToast, showToastWithMsg } from "@/hooks/useFunc";
import { addBudget } from "@/hooks/queries/budget";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";

const BudgetCreate = ({
  setModalVisibility,
}: {
  setModalVisibility: (value: boolean) => void;
}) => {
  const iconColor = useThemeColorWithName("inputIcon");
  const bageBgColor = useThemeColorWithName("toggleButton");
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");

  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<string | null>(null);

  // Hooks
  const db = useSQLiteContext();
  const router = useRouter();

  const budgetMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function getFirstDayOfMonth(monthNumber: number) {
    const currentYear = new Date().getFullYear();

    const firstDayDate = new Date(currentYear, monthNumber, 1);

    const year = firstDayDate.getFullYear();

    const month = String(firstDayDate.getMonth() + 1).padStart(2, "0");
    const day = String(firstDayDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const budgetSubmit = async () => {
    try {
      if (!amount || !date) {
        showToastWithMsg("Enter Details");
        return;
      }

      const data = {
        amount: parseInt(amount || "0"),
        date: getFirstDayOfMonth(budgetMonths.indexOf(date)),
      };

      await addBudget(db, data);
      showToast("BUDGET");
      setAmount(undefined);
      setDate(null);
    } catch (error) {
      showToast("ERROR");
      console.log("Error From Budget Create :", error);
    } finally {
      setModalVisibility(false);
    }
  };

  return (
    <ThemedView style={{ gap: 4, paddingBottom: 24 }}>
      <ThemedText
        type="subtitle"
        style={{ fontSize: 24, marginTop: 15, marginBottom: 20 }}
      >
        Budget of Month
      </ThemedText>
      <View style={{ zIndex: 3, position: "relative" }}>
        <InputWithIcon
          icon={<MoneyBagIcon color={iconColor} />}
          placeholder="00.0 INR"
          value={amount}
          setValue={setAmount}
        />
      </View>
      <View>
        <FlatList
          horizontal
          style={{
            flexGrow: 0,
            marginVertical: 10,
          }}
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          data={budgetMonths}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            return (
              <View style={[styles.expenseTypeButton]}>
                <Pressable
                  style={[
                    styles.expenseTypeButton_btn,
                    {
                      borderColor: cardBorder,
                      backgroundColor: date === item ? bageBgColor : surface,
                    },
                  ]}
                  android_ripple={{ color: bageBgColor + "22" }}
                  onPress={() => setDate(item)}
                >
                  <ThemedText
                    style={styles.buttonLabel}
                    colorName={date === item ? "text" : "textMuted"}
                  >
                    {item}
                  </ThemedText>
                </Pressable>
              </View>
            );
          }}
        />
      </View>
      <Pressable
        android_ripple={{ color: bageBgColor + "22" }}
        onPress={() => setModalVisibility(false)}
        style={{
          width: "100%",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: cardBorder,
          alignSelf: "center",
          marginTop: 40,
          marginBottom: 5,
        }}
      >
        <ThemedText
          colorName="textMuted"
          style={{ fontWeight: 400, letterSpacing: 1.5 }}
        >
          Cancel
        </ThemedText>
      </Pressable>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <SubmitButton button_label="Add New" onPress={budgetSubmit} />
      </View>
    </ThemedView>
  );
};

export default BudgetCreate;

const styles = StyleSheet.create({
  expanseTypeContainer: {
    flexGrow: 0,
    marginVertical: 5,
  },
  expenseTypeButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  expenseTypeButton_btn: {
    width: 60,
    aspectRatio: 4 / 3,
    display: "flex",
    borderWidth: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "black",
  },
});
