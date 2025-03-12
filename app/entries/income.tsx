import dayjs from "dayjs";
import { View, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { ITransaction, expenseType } from "@/types/expanse";

// components
import AnimatedStackView from "@/components/animation/AnimatedStackView";
import DateView from "@/components/inputs/DateView";
import ExpenseTypeButton from "@/components/comp/ExpanseTypeButton";
import { globalStyles } from "@/constants/globalStyles";
import ImageHeader from "@/components/comp/ImageHeader";
import { InputWithIcon } from "@/components/inputs/InputBox";
import SubmitButton from "@/components/inputs/SubmitButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// hooks
import { addData_in_AllTransaction } from "@/hooks/useQueries";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

// icons
import { MoneyBagIcon, BagIcon } from "@/assets/icons/SVG/InputIcons";
import { showToast, showToastWithMsg } from "@/hooks/useFunc";

const incomeExpanseType = ["Salary", "Business", "Gift", "Others"];

export function income() {
  // States or Input Variables
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [date, setDate] = useState(dayjs());
  const [description, setDescription] = useState<string | undefined>("");
  const [expenseType, setExpenseType] = useState<string | undefined>(undefined);

  // Colors
  const backgroundColor = useThemeColorWithName("background");
  const iconColor = useThemeColorWithName("inputIcon");

  // Hooks
  const db = useSQLiteContext();
  const router = useRouter();

  //  Data Insert Function
  const insertData = async () => {
    const dbAmount: number = parseInt(amount || "0");
    const dbData: string = date.format("DD/MM/YY");
    const dbDesc: string = description || "";
    const dbExpenseType: string = expenseType!;

    const newData: ITransaction = {
      amount: dbAmount,
      type: "income",
      expenseType: dbExpenseType as expenseType | "Salary" | "Gift" | "Business",
      date: dbData,
      expanseDesc: dbDesc,
    };

    try {
      await addData_in_AllTransaction(db, newData);
      router.push("/(tabs)");
      setAmount("");
      setDescription("");
      setDate(dayjs());
      showToast("INCOME");
    } catch (error) {
      showToastWithMsg("Income Adding Failed");
      console.log("Error form Insert : ", error);
    }
  };

  // Button Submit Fun
  const submitData = async () => {
    if (!amount || !description || !expenseType) {
      return;
    }

    try {
      await insertData();
    } catch (e) {
      console.log("Error form Income data Entries : ", e);
    }
  };

  return (
    <ThemedView style={globalStyles.entriesViewContainer}>
      <ImageHeader url={require("@/assets/images/entries/income.webp")} />
      <ThemedText
        type="tabTitle"
        style={{
          marginTop: 40,
          textAlign: "center",
          width: "100%",
          textShadowColor: backgroundColor,
          textShadowOffset: { width: 1.4, height: 1 },
          textShadowRadius: 4,
        }}
      >
        Paisa Hee Paisa {">_<"}
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
            <View style={{ zIndex: 3, position: "relative" }}>
              <InputWithIcon
                icon={<MoneyBagIcon color={iconColor} />}
                placeholder="00.0 INR"
                value={amount}
                setValue={setAmount}
              />
            </View>
            <View>
              <InputWithIcon
                icon={<BagIcon color={iconColor} />}
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
              <FlatList
                horizontal
                style={{
                  flexGrow: 0,
                  marginVertical: 5,
                }}
                showsHorizontalScrollIndicator={false}
                data={incomeExpanseType}
                keyExtractor={(item) => item}
                renderItem={({ item, index: numbers }) => {
                  return (
                    <ExpenseTypeButton value={expenseType} setValue={setExpenseType} item={item} />
                  );
                }}
              />
            </View>
          </View>
          <View style={globalStyles.submit_btn_container}>
            <SubmitButton button_label="Add Income" onPress={submitData} />
          </View>
        </AnimatedStackView>
      </View>
    </ThemedView>
  );
}

export default income;
