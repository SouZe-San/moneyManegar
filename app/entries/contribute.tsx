import { MoneyBagIcon, UserIcon, BagIcon } from "@/assets/icons/SVG/InputIcons";
import dayjs from "dayjs";
import { InputWithIcon } from "@/components/inputs/InputBox";
import SubmitButton from "@/components/inputs/SubmitButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useState } from "react";
import {
  ScrollView,
  View,
  Switch,
  useColorScheme,
  FlatList,
  Alert,
  useWindowDimensions,
} from "react-native";
import { Groups } from "@/types/expanse";
import ExpanseType from "@/components/inputs/ExpanseType";
import { groupData } from "@/constants/tempVar";
import SingleBox from "@/components/SingleBox";
import EasyAlert from "@/components/comp/EasyAlert";
import DateView from "@/components/inputs/DateView";
import { useRouter } from "expo-router";
import ImageHeader from "@/components/comp/ImageHeader";

// ! who are you to ask for money &&& { can take full expense and divide in in some numbers}
export function contribute() {
  const { width: SCREEN_WEIGHT, height: SCREEN_HEIGHT } = useWindowDimensions();
  // All states
  const [amount, setAmount] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [expanseReason, setExpanseReason] = useState("");
  const [singlePersonName, setSinglePersonName] = useState("");
  const [selectedGroup, setGroup] = useState<Groups | null>(null);
  const [splitInGroups, setInGroups] = useState(false);
  const [date, setDate] = useState(dayjs());

  // Colors
  const iconColor = useThemeColorWithName("inputIcon");
  const horain = useThemeColorWithName("navBg");
  const toggleButton = useThemeColorWithName("button");
  const unSelectedToggleButton = useThemeColorWithName("toggleButton");
  const thumbColor = useColorScheme() === "light" ? "#8c8c8c" : "#ECEDEE";
  const selectedThumbColor = useColorScheme() === "light" ? "#dff169" : "#030f0e";
  const backgroundColor = useThemeColorWithName("background");

  const router = useRouter();

  // Add Group
  const groupSelection = (item: Groups) => {
    if (!selectedGroup) {
      setGroup(item);
    } else {
      if (selectedGroup.groupId === item.groupId) {
        setGroup(null);
      } else {
        setGroup(item);
      }
    }
  };
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
    // Check if the splitInGroups is false
    if (!splitInGroups) {
      // Check if the singlePersonName is empty
      if (singlePersonName.trim() === "") {
        // Show an alert or feedback to the user
        console.log("Single Person Name is empty");
        EasyAlert("Person's Name is empty", "Please enter the Reason to continue");
        return;
      }
    } else {
      // Check if the selectedGroup is null
      if (selectedGroup === null) {
        // Show an alert or feedback to the user
        console.log("Group is not selected");
        EasyAlert("Group is Not Selected", "Type should be selected to continue");
        return;
      }
    }

    // All Checks Pass
    // Submit the data to the server
    if (!splitInGroups) {
      // Submit the data for single person
      const data = {
        amount,
        expanseReason,
        date,
        expenseType,
        singlePersonName,
      };
      console.log(" Data", data);
    } else {
      // Submit the data for group
      if (selectedGroup === null) return;
      const memberCount = selectedGroup?.members.length;
      const data = {
        amount,
        expanseReason,
        date,
        expenseType,
        selectedGroup,
      };
      console.log("Group Data", data);

      const eachContri = Number(amount) / memberCount;
      const allList: any = [];
      selectedGroup.members.forEach((member) => {
        allList.push({
          useName: member.useName,
          Amount: eachContri,
          Date: date,
          expanseReason,
          expenseType,
        });
      });
      console.log("====================================");
      console.log("All List", allList);

      console.log("====================================");

      //
    }
    Alert.alert(
      "Success",
      "Debt Added Successfully",
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
    <ThemedView style={[globalStyles.entriesViewContainer, { position: "relative" }]}>
      <ImageHeader url={require("@/assets/images/entries/moneyGive.webp")} />

      <ThemedText
        type="tabTitle"
        style={{
          textAlign: "center",
          width: "100%",
          marginTop: 40,
          textShadowColor: backgroundColor,
          textShadowOffset: { width: 1.4, height: 1 },
          textShadowRadius: 4,
        }}
      >
        Paisa hee paisa ^_^{" "}
      </ThemedText>

      <View style={[globalStyles.inputContainer, { backgroundColor }]}>
        <View
          style={{
            display: "flex",
            flexGrow: 0,
            // marginTop: 50,
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
              value={expanseReason}
              setValue={setExpanseReason}
              keyboardType="default"
            />
          </View>

          {/* Data  */}

          <View>
            <DateView date={date} setDate={setDate} />
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
                value={singlePersonName}
                setValue={setSinglePersonName}
                keyboardType="default"
              />
            </View>
          ) : (
            <View>
              {
                <FlatList
                  data={groupData}
                  horizontal
                  renderItem={({ item }) => (
                    <SingleBox
                      label={item.groupName}
                      icon={item.groupIcon}
                      isSelected={selectedGroup?.groupId === item.groupId}
                      onPress={() => groupSelection(item)}
                    />
                  )}
                  keyExtractor={(item) => item.groupId}
                />
              }
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
          <SubmitButton button_label="Add Request" onPress={() => finalSubmit()} />
        </View>
      </View>
    </ThemedView>
  );
}

export default contribute;
