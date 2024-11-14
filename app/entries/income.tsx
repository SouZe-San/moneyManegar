import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { InputWithIcon } from "@/components/inputs/InputBox";
import { MoneyBagIcon, BagIcon } from "@/assets/icons/SVG/InputIcons";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import SubmitButton from "@/components/inputs/SubmitButton";

import dayjs from "dayjs";
import DateView from "@/components/inputs/DateView";
import { globalStyles } from "@/constants/globalStyles";
export function income() {
  const [date, setDate] = useState(dayjs());

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const iconColor = useThemeColorWithName("inputIcon");
  return (
    <ThemedView style={styles.mainContainer}>
      <View
        style={{
          marginTop: 150,
          flex: 1,
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
        <View style={globalStyles.dateRpw}>
          {/* <ThemedText>{date.format("DD-MM-YYYY")}</ThemedText> */}
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
        <SubmitButton button_label="Add Income" onPress={() => console.log("submit")} />
      </View>
    </ThemedView>
  );
}

export default income;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  dateBox: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    justifyContent: "flex-start",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    width: "100%",
    height: 50,
  },
});
