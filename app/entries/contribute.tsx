import dayjs from "dayjs";
import { getInfoAsync } from "expo-file-system";
import {
  ScrollView,
  View,
  Switch,
  useColorScheme,
  FlatList,
  Alert,
  ViewToken,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { useSharedValue } from "react-native-reanimated";

// components
import AnimatedStackView from "@/components/animation/AnimatedStackView";
import DateView from "@/components/inputs/DateView";
import EasyAlert from "@/components/comp/EasyAlert";
import ExpanseType from "@/components/inputs/ExpanseType";
import { globalStyles } from "@/constants/globalStyles";
import GrpSelector from "@/components/comp/GrpSelector";
import ImageHeader from "@/components/comp/ImageHeader";
import { InputWithIcon } from "@/components/inputs/InputBox";
import SearchProfileSection from "@/components/comp/SearchProfileSection";
import SubmitButton from "@/components/inputs/SubmitButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// icons
import { MoneyBagIcon, BagIcon, UserIcon } from "@/assets/icons/SVG/InputIcons";
import {
  expenseType,
  IGroup,
  IUdahar,
  Members,
  transactionCategory,
} from "@/types/expanse";

// hooks
import {
  add_udhar,
  fetchAllMember_of_Group,
  fetchMemberBy_id,
  addOweAmount_of_Member,
  addData_in_AllTransaction,
} from "@/hooks/useQueries";
import { showToast } from "@/hooks/useFunc";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

import { useExpense } from "@/context/ExpanseContext";

// ! who are you to ask for money &&& { can take full expense and divide in in some numbers}
export function contribute() {
  // All states
  const [amount, setAmount] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [expanseReason, setExpanseReason] = useState("");
  const [singlePersonName, setSinglePersonName] = useState<Members | null>(
    null,
  );
  const [selectedGroup, setGroup] = useState<IGroup | null>(null);
  const [splitInGroups, setInGroups] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [toWhom, setToWhom] = useState<string | null>(null);
  const [isImgFile, setIsImgPresent] = useState(false);

  // Colors
  const iconColor = useThemeColorWithName("inputIcon");
  const horain = useThemeColorWithName("navBg");
  const toggleButton = useThemeColorWithName("button");
  const unSelectedToggleButton =
    useColorScheme() === "light"
      ? useThemeColorWithName("blurBg")
      : useThemeColorWithName("toggleButton");
  const thumbColor = useColorScheme() === "light" ? "#8c8c8c" : "#ECEDEE";
  const selectedThumbColor =
    useColorScheme() === "light" ? "#dff169" : "#030f0e";
  const backgroundColor = useThemeColorWithName("background");
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");

  const viewableItems = useSharedValue<ViewToken[]>([]);

  const router = useRouter();
  const sqlDb = useSQLiteContext();

  const { groups } = useExpense();

  useEffect(() => {
    if (singlePersonName?._id) {
      setToWhom(singlePersonName.userName);
      if (singlePersonName.imgUrl) {
        try {
          getInfoAsync(singlePersonName.imgUrl).then((res) => {
            setIsImgPresent(res.exists);
          });
        } catch (error) {
          console.log("Error Reading File", error);
        }
      }
    }
  }, [singlePersonName]);

  // Add Group
  const groupSelection = (item: IGroup) => {
    if (!selectedGroup) {
      setGroup(item);
    } else {
      if (selectedGroup._id === item._id) {
        setGroup(null);
      } else {
        setGroup(item);
      }
    }
  };
  // Final Submit
  async function finalSubmit() {
    // Check if the amount is empty

    if (amount.trim() === "" || amount === "0") {
      // Show an alert or feedback to the user
      console.warn("Amount is empty");
      EasyAlert("Amount is empty", "Please enter the amount to continue");
      return;
    }
    // Check if the expanseReason is empty
    if (expanseReason.trim() === "") {
      // Show an alert or feedback to the user
      console.warn("Expanse Reason is empty");
      EasyAlert("Why is empty", "Please enter the Reason to continue");
      return;
    }
    // Check if the expenseType is empty
    if (expenseType.trim() === "") {
      // Show an alert or feedback to the user
      console.warn("Expense Type is empty");
      EasyAlert("Type is Not Selected", "Type should be selected to continue");
      return;
    }
    // Check if the splitInGroups is false
    if (!splitInGroups) {
      // Check if the singlePersonName is empty
      if (!singlePersonName) {
        // Show an alert or feedback to the user
        console.warn("Single Person Name is empty");
        EasyAlert(
          "Person's Name is empty",
          "Please enter the Reason to continue",
        );
        return;
      }
    } else {
      // Check if the selectedGroup is null
      if (selectedGroup === null) {
        // Show an alert or feedback to the user
        console.warn("Group is not selected");
        EasyAlert(
          "Group is Not Selected",
          "Type should be selected to continue",
        );
        return;
      }
    }

    // All Checks Pass
    // Submit the data to the server

    // It out from wallet so money reduce -- add on OWN name
    await addData_in_AllTransaction(sqlDb, {
      amount: parseFloat(amount),
      type: "expense",
      expenseType: expenseType as transactionCategory,
      date: date.format("DD/MM/YY"),
      expanseDesc: expanseReason,
    });

    if (!splitInGroups) {
      // Submit the data for single person
      const data: IUdahar = {
        amount: parseFloat(amount),
        date: date.format("DD/MM/YY"),
        expanseDesc: expanseReason,
        expenseType: expenseType as expenseType,
        toWhom: singlePersonName?.userName!,
        type: "owned",
        memberId: singlePersonName?._id!,
      };

      try {
        await add_udhar(sqlDb, data);
        await addOweAmount_of_Member(sqlDb, {
          amount: data.amount,
          _id: data.memberId!,
        });
        Alert.alert(
          "Success",
          "Contri Successfully Added",
          [
            {
              text: "OK",
              onPress: () => router.push("/(tabs)"),
            },
          ],
          {
            cancelable: false,
          },
        );
      } catch (error) {
        EasyAlert("Failed", "Some Error Occurred, Tyr Again");
        console.log("Error  From SINGLE insert Contri : ", error);
      }
    } else {
      // Submit the data for group
      if (selectedGroup === null || selectedGroup._id === undefined) return;
      // ! Have to call Function for get all members of this group

      try {
        // @ Need - member's Id
        const memberIds = await fetchAllMember_of_Group(
          sqlDb,
          selectedGroup._id,
        );
        const memberCount = memberIds.length;
        const eachContri = Number(amount) / (memberCount + 1);
        const allList: IUdahar[] = [];
        const members: Members[] = [];
        const promises = memberIds.map(async (member) => {
          const mem = await fetchMemberBy_id(sqlDb, member.memberId);
          if (!mem) return;
          members.push(mem);
        });
        await Promise.all(promises);

        members.forEach((member) => {
          allList.push({
            amount: eachContri,
            date: date.format("DD/MM/YY"),
            expanseDesc: expanseReason,
            expenseType: expenseType as expenseType,
            toWhom: member.userName,
            type: "owned",
            memberId: member._id!,
          });
        });
        await Promise.all(allList.map((item) => add_udhar(sqlDb, item)));
        await Promise.all(
          members.map(async (item) => {
            await addOweAmount_of_Member(sqlDb, {
              amount: eachContri,
              _id:item._id!
            });
          }),
        );

        showToast("CONTRI");
        router.push("/(tabs)");
      } catch (error) {
        EasyAlert("Failed", "Some Error Occurred, Tyr Again");
        console.log("Error From Multi insert Contri: ", error);
      }
      //
    }
  }

  return (
    <ThemedView
      style={[globalStyles.entriesViewContainer, { position: "relative" }]}
    >
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
        Paisa paisa┌(⁠~⁠‾⁠▿⁠‾⁠)⁠~
      </ThemedText>

      <View style={[globalStyles.inputContainer, { backgroundColor }]}>
        <AnimatedStackView style={globalStyles.animated_stackContainer}>
          {/* Inputs */}
          <View
            style={{
              display: "flex",
              flexGrow: 0,

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

            <View>
              <View
                style={[
                  globalStyles.iconInputBox,
                  {
                    borderColor: cardBorder,
                    backgroundColor: surface,
                  },
                ]}
              >
                {isImgFile && singlePersonName?.imgUrl ? (
                  <View
                    style={{
                      width: 50,
                      aspectRatio: 1,
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={{ uri: singlePersonName.imgUrl }}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </View>
                ) : (
                  <UserIcon color={iconColor} />
                )}
                <View
                  style={[globalStyles.input, { justifyContent: "center" }]}
                >
                  <ThemedText colorName="textMuted" style={{ fontSize: 17 }}>
                    {toWhom ?? "select people!!"}
                  </ThemedText>
                </View>
              </View>
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
              <ThemedText type="defaultSemiBold">Split in Groups ?</ThemedText>
              <View
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <Switch
                  value={splitInGroups}
                  style={{
                    height: 28,
                    // width: "100%",
                    backgroundColor: splitInGroups
                      ? toggleButton
                      : unSelectedToggleButton,
                  }}
                  thumbColor={splitInGroups ? selectedThumbColor : thumbColor}
                  trackColor={{ false: "transparent", true: "transparent" }}
                  onValueChange={() =>
                    setInGroups((previousState) => !previousState)
                  }
                />
              </View>
            </View>
            {!splitInGroups ? (
              <View>
                <SearchProfileSection
                  member={singlePersonName}
                  setMember={setSinglePersonName}
                />
              </View>
            ) : (
              <View>
                {
                  <FlatList
                    data={groups}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={({ viewableItems: vItems }) => {
                      viewableItems.value = vItems;
                    }}
                    renderItem={({ item }) => (
                      <GrpSelector
                        label={item.name}
                        icon={item.logo}
                        imgUrl={item.imgUrl}
                        item={item}
                        viewableItems={viewableItems}
                        isSelected={selectedGroup?._id === item._id}
                        onPress={() => groupSelection(item)}
                      />
                    )}
                    keyExtractor={(item) => item._id?.toString()!}
                  />
                }
              </View>
            )}
          </View>

          {/* Horizontal line */}
          <View
            style={{
              width: "90%",
              marginHorizontal: 10,
              marginTop: 30,
              height: 1,
              backgroundColor: horain,
            }}
          ></View>
          {/* List of transaction where user will get money */}
          <ThemedText type="subtitle" style={{ marginTop: 10 }}>
            Coming Paisa @_@
          </ThemedText>
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
            ></View>
          </ScrollView>

          {/* Submit Button */}
          <View style={globalStyles.submit_btn_container}>
            <SubmitButton
              button_label="Add Request"
              onPress={() => finalSubmit()}
            />
          </View>
        </AnimatedStackView>
      </View>
    </ThemedView>
  );
}

export default contribute;
