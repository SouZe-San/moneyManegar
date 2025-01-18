import { MoneyBagIcon, UserIcon, BagIcon } from "@/assets/icons/SVG/InputIcons";
import ExpanseType from "@/components/inputs/ExpanseType";
import dayjs from "dayjs";
import { InputWithIcon } from "@/components/inputs/InputBox";
import SubmitButton from "@/components/inputs/SubmitButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useState } from "react";
import { ScrollView, Alert, View } from "react-native";
import DateView from "@/components/inputs/DateView";
import ImageHeader from "@/components/comp/ImageHeader";
import { useRouter } from "expo-router";
import EasyAlert from "@/components/comp/EasyAlert";
import AnimatedStackView from "@/components/animation/AnimatedStackView";

//! TO whom I have to pay
export function payble() {
  // States
  const [amount, setAmount] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [toWhom, setToWhom] = useState("");
  const [expanseReason, setExpanseReason] = useState("");
  const [date, setDate] = useState(dayjs());

  // Colors
  const backgroundColor = useThemeColorWithName("background");
  const horain = useThemeColorWithName("navBg");
  const iconColor = useThemeColorWithName("inputIcon");
  // Routes
  const router = useRouter();

  // FUNCTIONS

  // Final Submit
  function finalSubmit() {
    // Check if the amount is empty

    if (amount.trim() === "" || amount === "0") {
      // Show an alert or feedback to the user
      console.log("Amount is empty");
      EasyAlert("Amount is empty", "Please enter the amount to continue");
      return;
    }
    // Check if the expanseReason is empty
    if (expanseReason.trim() === "") {
      // Show an alert or feedback to the user
      console.log("Expanse Reason is empty");
      EasyAlert("Why is empty", "Please enter the Reason to continue");
      return;
    }
    // Check if the expenseType is empty
    if (expenseType.trim() === "") {
      // Show an alert or feedback to the user
      console.log("Expense Type is empty");
      EasyAlert("Type is Not Selected", "Type should be selected to continue");
      return;
    }
    // Check if the Debt Person Name is empty
    if (toWhom.trim() === "") {
      // Show an alert or feedback to the user
      console.log("Person's is empty");
      EasyAlert("Name Missing", "Owned Person's Name should be selected to continue");
      return;
    }

    // All Checks Pass
    // Submit the data to the serve
    const data = {
      amount,
      date,
      expanseReason,
      expenseType,
      toWhom,
    };
    console.log("====================================");
    console.log(" Data", data);
    console.log("====================================");

    Alert.alert(
      "Success",
      "Your Udhary Successfully Added",
      [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)"),
        },
      ],
      {
        cancelable: false,
      }
    );
  }

  return (
    <ThemedView style={globalStyles.entriesViewContainer}>
      <ImageHeader url={require("@/assets/images/entries/debt.webp")} />
      <ThemedText
        type="tabTitle"
        style={{
          width: "100%",
          paddingHorizontal: 15,
          marginTop: 40,
          textShadowColor: backgroundColor,
          textShadowOffset: { width: 1.4, height: 1 },
          textShadowRadius: 4,
        }}
      >
        I owe Others ರ⁠╭⁠╮⁠ರ
        {/* I owe Others &#59;&#41; */}
      </ThemedText>

      <View style={[globalStyles.inputContainer, { backgroundColor }]}>
        <AnimatedStackView style={globalStyles.animated_stackContainer}>
          <View
            style={[
              {
                display: "flex",
                flexGrow: 0,
                width: "100%",
                gap: 10,
              },
            ]}
          >
            <View>
              <InputWithIcon
                icon={<MoneyBagIcon color={iconColor} />}
                placeholder="00.0 INR"
                value={amount}
                setValue={setAmount}
              />
            </View>
            <View>
              <InputWithIcon
                icon={<UserIcon color={iconColor} />}
                placeholder="To Whom"
                value={toWhom}
                setValue={setToWhom}
                keyboardType="default"
              />
            </View>
            <View>
              <InputWithIcon
                icon={<BagIcon color={iconColor} />}
                placeholder="For What ?"
                value={expanseReason}
                setValue={setExpanseReason}
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

          <View
            style={{
              width: "90%",
              marginHorizontal: 10,
              marginTop: 30,
              height: 1,
              backgroundColor: horain,
            }}
          ></View>
          {/* All Debt */}
          <ScrollView
            style={{
              marginTop: 10,
              paddingVertical: 10,
              flex: 1,

              width: "100%",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemedText type="subtitle">Debt Listed {".⁠·⁠´⁠¯⁠⁠(⁠>⁠▂⁠<⁠)⁠´⁠¯⁠⁠·⁠."}</ThemedText>
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View style={globalStyles.submit_btn_container}>
            <SubmitButton button_label="Add Debt" onPress={() => finalSubmit()} />
          </View>
        </AnimatedStackView>
      </View>
    </ThemedView>
  );
}

export default payble;
