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
import { ScrollView, Text, View } from "react-native";
import DateView from "@/components/inputs/DateView";

//! TO whom I have to pay
export function payble() {
  const [amount, setAmount] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const iconColor = useThemeColorWithName("inputIcon");
  const [date, setDate] = useState(dayjs());

  const horain = useThemeColorWithName("navBg");
  return (
    <ThemedView style={globalStyles.mainContainer}>
      <ThemedText type="tabTitle"> I Owned Others &#59;&#41;</ThemedText>
      <View
        style={{
          display: "flex",
          flexGrow: 0,
          marginTop: 50,
          width: "100%",
          gap: 10,
        }}
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
            value={amount}
            setValue={setAmount}
            keyboardType="default"
          />
        </View>
        <View>
          <InputWithIcon
            icon={<BagIcon color={iconColor} />}
            placeholder="For What ?"
            value={amount}
            setValue={setAmount}
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
          <ThemedText type="subtitle">All Debt Listed @_@</ThemedText>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View
        style={{
          position: "absolute",
          bottom: 30,
          width: "100%",
          left: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SubmitButton button_label="Add Debt" onPress={() => console.log("submit")} />
      </View>
    </ThemedView>
  );
}

export default payble;
