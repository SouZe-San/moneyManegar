import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { InputWithIcon } from "@/components/inputs/InputBox";
import { globalStyles } from "@/constants/globalStyles";
import { useState } from "react";
import { View } from "react-native";
import { BagIcon, MoneyBagIcon, CalenderIcon } from "@/assets/icons/SVG/InputIcons";
import SubmitButton from "@/components/inputs/SubmitButton";
import ExpanseType from "@/components/inputs/ExpanseType";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

export function expense() {
  const [expense, setExpense] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const iconColor = useThemeColorWithName("inputIcon");

  return (
    <ThemedView style={globalStyles.mainContainer}>
      <ThemedText type="title"> WHat U brought NOw !! </ThemedText>
      <View
        style={{
          flex: 1,
          marginTop: 50,
          width: "100%",
          gap: 10,
        }}
      >
        <View>
          <InputWithIcon
            icon={<MoneyBagIcon color={iconColor} />}
            placeholder="00.0 INR"
            value={expense}
            setValue={setExpense}
          />
        </View>
        <View>
          <InputWithIcon
            icon={<BagIcon color={iconColor} />}
            placeholder="Description..."
            value={expense}
            setValue={setExpense}
            keyboardType="default"
          />
        </View>
        <View>
          <InputWithIcon
            icon={<CalenderIcon color={iconColor} />}
            placeholder={new Date().toLocaleDateString()}
            value={expense}
            setValue={setExpense}
            keyboardType="numeric"
          />
        </View>

        <View>
          {/* <ThemedText>Expanse Type</ThemedText> */}
          <ExpanseType setValue={setExpenseType} value={expenseType} />
        </View>
      </View>
      <View
        style={{
          marginBottom: 40,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SubmitButton button_label="Add Expense" onPress={() => console.log("submit")} />
      </View>
    </ThemedView>
  );
}

export default expense;
