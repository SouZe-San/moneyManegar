import AnimatedStackView from "@/components/animation/AnimatedStackView";
import dayjs from "dayjs";
import { ScrollView, View, Image } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

// components
import DateView from "@/components/inputs/DateView";
import EasyAlert from "@/components/comp/EasyAlert";
import ExpanseType from "@/components/inputs/ExpanseType";
import { globalStyles } from "@/constants/globalStyles";
import ImageHeader from "@/components/comp/ImageHeader";
import { InputWithIcon } from "@/components/inputs/InputBox";
import SubmitButton from "@/components/inputs/SubmitButton";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

// hooks
import { add_udhar, addDueAmount_of_Member } from "@/hooks/useQueries";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

// icons
import { MoneyBagIcon, UserIcon, BagIcon } from "@/assets/icons/SVG/InputIcons";

import { expenseType, IUdahar, Members } from "@/types/expanse";
import SearchProfileSection from "@/components/comp/SearchProfileSection";
import { getInfoAsync } from "expo-file-system";
import { showToast, showToastWithMsg } from "@/hooks/useFunc";

//! TO whom I have to pay
export function payble() {
  // States
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dayjs());
  const [expenseType, setExpenseType] = useState("");
  const [expanseReason, setExpanseReason] = useState("");
  const [isImgFile, setIsImgPresent] = useState(false);
  const [member, setMember] = useState<Members | null>(null);
  const [toWhom, setToWhom] = useState<string | null>(null);

  // Colors
  const backgroundColor = useThemeColorWithName("background");
  const horain = useThemeColorWithName("navBg");
  const iconColor = useThemeColorWithName("inputIcon");
  const borderColor = useThemeColorWithName("borderColor");

  // Routes
  const router = useRouter();
  const sqlDb = useSQLiteContext();

  // FUNCTIONS
  useEffect(() => {
    if (member?._id) {
      setToWhom(member.userName);
      if (member.imgUrl) {
        try {
          getInfoAsync(member.imgUrl).then((res) => {
            setIsImgPresent(res.exists);
          });
        } catch (error) {
          console.log("Error Reading File", error);
        }
      }
    }
  }, [member]);

  // Final Submit
  async function finalSubmit() {
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
    if (toWhom && toWhom.trim() === "") {
      // Show an alert or feedback to the user
      console.log("Person's is empty");
      EasyAlert("Name Missing", "Owned Person's Name should be selected to continue");
      return;
    }

    // All Checks Pass
    // Submit the data to the serve
    const data: IUdahar = {
      amount: parseInt(amount),
      date: date.format("DD/MM/YY"),
      expanseDesc: expanseReason,
      expenseType: expenseType as expenseType,
      toWhom: toWhom!,
      type: "debt",
      memberId: member?.userId!,
    };
    try {
      if (!member?.userName) {
        showToastWithMsg("User Not Found, Try Again");
        return;
      }
      await add_udhar(sqlDb, data);
      await addDueAmount_of_Member(sqlDb, {
        amount: parseInt(amount),
        userName: member?.userName,
      });
      router.push("/(tabs)");
      showToast("DEBT");
    } catch (error) {
      showToastWithMsg("Failed: Some Error Occurred, Tyr Again");
      console.log("Error form DEBT insert : ", error);
    }
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
              <View style={[globalStyles.iconInputBox, { borderColor, borderWidth: 0.4 }]}>
                {isImgFile && member?.imgUrl ? (
                  <View
                    style={{
                      width: 50,
                      aspectRatio: 1,
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={{ uri: member.imgUrl }}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </View>
                ) : (
                  <UserIcon color={iconColor} />
                )}
                <View style={[globalStyles.input, { justifyContent: "center" }]}>
                  <ThemedText colorName="tabIconDefault" style={{ fontSize: 17 }}>
                    {toWhom ?? "To whom"}
                  </ThemedText>
                </View>
              </View>
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

            <View>
              <SearchProfileSection member={member} setMember={setMember} />
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
          <ThemedText type="subtitle" style={{ marginTop: 20 }}>
            Debt Listed {".⁠·⁠´⁠¯⁠⁠(⁠>⁠▂⁠<⁠)⁠´⁠¯⁠⁠·⁠."}
          </ThemedText>
          <ScrollView
            style={{
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
            ></View>
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
