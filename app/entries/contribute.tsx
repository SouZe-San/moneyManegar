import { MoneyBagIcon, UserIcon, BagIcon, GroupsIcon } from "@/assets/icons/SVG/InputIcons";

import { InputWithIcon } from "@/components/inputs/InputBox";
import SubmitButton from "@/components/inputs/SubmitButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useState } from "react";
import { ScrollView, View, Switch, useColorScheme } from "react-native";

import ExpanseType from "@/components/inputs/ExpanseType";

// ! who are you to ask for money &&& { can take full expense and divide in in some numbers}
export function contribute() {
  // All states
  const [amount, setAmount] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [splitInGroups, setInGroups] = useState(false);

  // Colors
  const iconColor = useThemeColorWithName("inputIcon");
  const horain = useThemeColorWithName("navBg");
  const toggleButton = useThemeColorWithName("button");
  const unSelectedToggleButton = useThemeColorWithName("toggleButton");
  const thumbColor = useColorScheme() === "light" ? "#8c8c8c" : "#ECEDEE";
  const selectedThumbColor = useColorScheme() === "light" ? "#dff169" : "#030f0e";
  return (
    <ThemedView style={globalStyles.mainContainer}>
      <ThemedText type="tabTitle" style={{ textAlign: "center", width: "100%" }}>
        Paisa hee paisa ^_^{" "}
      </ThemedText>
      <View
        style={{
          display: "flex",
          flexGrow: 0,
          marginTop: 50,
          width: "100%",
          gap: 10,
        }}
      >
        {/* // Expanse Amount  */}
        <View>
          <InputWithIcon
            icon={<MoneyBagIcon color={iconColor} />}
            placeholder="00.0 INR"
            value={amount}
            setValue={setAmount}
          />
        </View>
        {/* // Expanse Description  */}
        <View>
          <InputWithIcon
            icon={<BagIcon color={iconColor} />}
            placeholder="Why ?"
            value={amount}
            setValue={setAmount}
          />
        </View>

        {/* // Expanse Type */}
        <View>
          <ExpanseType setValue={setExpenseType} value={expenseType} />
        </View>
        {/* // Split Section  */}
        <View
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedText type="defaultSemiBold">Split in Groups</ThemedText>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 20,
              overflow: "hidden",
              borderBlockColor: "transparent",
            }}
          >
            <Switch
              value={splitInGroups}
              style={{
                padding: 0,
                margin: 0,
                height: 28,
                width: "100%",
                backgroundColor: splitInGroups ? toggleButton : unSelectedToggleButton,
              }}
              thumbColor={splitInGroups ? selectedThumbColor : thumbColor}
              trackColor={{ false: "transparent", true: "transparent" }}
              onValueChange={() => setInGroups((previousState) => !previousState)}
            />
          </View>
        </View>
        {!splitInGroups ? (
          <View>
            <InputWithIcon
              icon={<UserIcon color={iconColor} />}
              placeholder="Solo Name ?"
              value={amount}
              setValue={setAmount}
            />
          </View>
        ) : (
          <View>
            <InputWithIcon
              icon={<GroupsIcon color={iconColor} />}
              placeholder="Group Name?"
              value={amount}
              setValue={setAmount}
            />
            <View>
              <ThemedText>Recent used Groups</ThemedText>
            </View>
          </View>
        )}
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

export default contribute;
