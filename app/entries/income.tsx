import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { View, Alert } from "react-native";
import DateView from "@/components/inputs/DateView";
import { globalStyles } from "@/constants/globalStyles";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { InputWithIcon } from "@/components/inputs/InputBox";
import { MoneyBagIcon, BagIcon } from "@/assets/icons/SVG/InputIcons";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useExpense } from "@/context/ExpanseContext";
import SubmitButton from "@/components/inputs/SubmitButton";
import { useFocusEffect } from "expo-router";

export function income() {
  // !States or Input Variables
  const [date, setDate] = useState(dayjs());
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // !Hooks
  const { addIncome } = useExpense();
  const iconColor = useThemeColorWithName("inputIcon");

  useFocusEffect(
    useCallback(() => {
      alert("Screen was focused");
      // Do something when the screen is focused
      return () => {
        alert("Screen was unfocused");
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return (
    <ThemedView style={globalStyles.mainContainer}>
      <ThemedText type="title"> HeHe $_$ Paisa paisa </ThemedText>
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
      </View>
      <View
        style={{
          marginBottom: 40,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SubmitButton
          button_label="Add Income"
          onPress={() => {
            addIncome(Number(amount));
            setAmount("");
            setDescription("");
            setDate(dayjs());
            Alert.alert(
              "Income Added",
              "Your income has been added successfully",
              [{ text: "OK" }],
              { cancelable: false }
            );
          }}
        />
      </View>
    </ThemedView>
  );
}

export default income;
