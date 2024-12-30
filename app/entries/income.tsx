import dayjs from "dayjs";
import { useState } from "react";
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
import ImageHeader from "@/components/comp/ImageHeader";

export function income() {
  // !States or Input Variables
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dayjs());
  const [description, setDescription] = useState("");

  // Colors
  const backgroundColor = useThemeColorWithName("background");
  const iconColor = useThemeColorWithName("inputIcon");

  // !Hooks
  const { addIncome } = useExpense();

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
        Hee Paisa Paisa {">_<"}
      </ThemedText>
      <View style={[globalStyles.inputContainer, { backgroundColor }]}>
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
      </View>
    </ThemedView>
  );
}

export default income;
