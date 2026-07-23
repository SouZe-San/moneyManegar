import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { View } from "react-native";

// components
import AnimatedStackView from "@/components/animation/AnimatedStackView";
import DateView from "@/components/inputs/DateView";
import EasyAlert from "@/components/comp/EasyAlert";
import ExpanseType from "@/components/inputs/ExpanseType";
import { globalStyles } from "@/constants/globalStyles";
import ImageHeader from "@/components/comp/ImageHeader";
import { InputWithIcon } from "@/components/inputs/InputBox";
import SubmitButton from "@/components/inputs/SubmitButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// hooks
import { addData_in_AllTransaction } from "@/hooks/queries/transaction";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

// icons
import { DescIcon, MoneyBagIcon } from "@/assets/icons/SVG/InputIcons";
import { ITransaction, transactionCategory } from "@/types/expanse";
import { showToast, showToastWithMsg } from "@/hooks/useFunc";
import { useHeaderImage } from "@/context/HeaderImageContext";

export function expense() {
  // States
  const [expense, setExpense] = useState<string | undefined>(undefined);
  const [expenseType, setExpenseType] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [date, setDate] = useState(dayjs());

  // Colors
  const iconColor = useThemeColorWithName("inputIcon");
  const backgroundColor = useThemeColorWithName("background");
  const headerImg = useHeaderImage("expense");
  // Routers
  const router = useRouter();
  const sqlDb = useSQLiteContext();

  const insertData = async () => {
    // if noe Data then go back
    if (!expense || !expenseType) {
      return;
    }

    const dbAmount: number = parseFloat(expense || "0");
    const dbData: string = date.format("DD/MM/YY");
    const dbDesc: string = description || "";
    const dbExpenseType: string = expenseType!;

    const newData: ITransaction = {
      amount: dbAmount,
      type: "expense",
      expenseType: dbExpenseType as transactionCategory,
      date: dbData,
      expanseDesc: dbDesc,
    };

    try {
      await addData_in_AllTransaction(sqlDb, newData);
      router.push("/(tabs)");
      showToast("EXPENSE");
      setExpense("");
      setExpenseType(undefined);
      setDescription("");
      setDate(dayjs());
    } catch (error) {
      showToastWithMsg("Expense Adding Failed");
      console.log("Error form Insert : ", error);
    }
  };

  return (
    <ThemedView style={globalStyles.entriesViewContainer}>
      <ImageHeader url={headerImg} />
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
                icon={<DescIcon color={iconColor} />}
                placeholder="Description..."
                value={description}
                setValue={setDescription}
                keyboardType="default"
              />
            </View>
            <View>
              <DateView date={date} setDate={setDate} />
            </View>

            <View>
              <ExpanseType setValue={setExpenseType} value={expenseType} />
            </View>
          </View>
          <View style={globalStyles.submit_btn_container}>
            <SubmitButton button_label="Add Expense" onPress={insertData} />
          </View>
        </AnimatedStackView>
      </View>
    </ThemedView>
  );
}

export default expense;
