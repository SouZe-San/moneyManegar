import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { InputWithIcon } from "@/components/inputs/InputBox";
import { globalStyles } from "@/constants/globalStyles";
import { useState } from "react";
import { View } from "react-native";
import { BagIcon, MoneyBagIcon } from "@/assets/icons/SVG/InputIcons";
import dayjs from "dayjs";
import SubmitButton from "@/components/inputs/SubmitButton";
import ExpanseType from "@/components/inputs/ExpanseType";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import DateView from "@/components/inputs/DateView";
import { useExpense } from "@/context/ExpanseContext";
import ImageHeader from "@/components/comp/ImageHeader";
import AnimatedStackView from "@/components/animation/AnimatedStackView";

export function expense() {
  // States
  const [expense, setExpense] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [date, setDate] = useState(dayjs());

  // Colors
  const iconColor = useThemeColorWithName("inputIcon");
  const backgroundColor = useThemeColorWithName("background");
  // const shadowColor = useThemeColorWithName("antiFlash");
  // Routers

  const { addExpense } = useExpense();
  return (
    <ThemedView style={globalStyles.entriesViewContainer}>
      <ImageHeader url={require("@/assets/images/entries/expanse.gif")} />
      <ThemedText
        type="title"
        style={{
          marginTop: 40,
          textAlign: "center",
          width: "100%",
          textShadowColor: backgroundColor,
          textShadowOffset: { width: 1.4, height: 1 },
          textShadowRadius: 4,
        }}
      >
        WHat U brought NOw !!
      </ThemedText>
      <View style={[globalStyles.inputContainer, { backgroundColor }]}>
        <AnimatedStackView style={globalStyles.animated_stackContainer}>
          <View
            style={{
              flex: 1,
              // marginTop: 50,
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
              <DateView date={date} setDate={setDate} />
            </View>

            <View>
              {/* <ThemedText>Expanse Type</ThemedText> */}
              <ExpanseType setValue={setExpenseType} value={expenseType} />
            </View>
          </View>
          <View style={globalStyles.submit_btn_container}>
            <SubmitButton
              button_label="Add Expense"
              onPress={() => {
                addExpense(Number(expense));
                setExpense("");
                setDate(dayjs());
                setExpenseType("");
              }}
            />
          </View>
        </AnimatedStackView>
      </View>
    </ThemedView>
  );
}

export default expense;
