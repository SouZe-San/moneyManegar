import {
  StyleSheet,
  View,
  TouchableOpacity,
  Switch,
  useColorScheme,
  Pressable,
} from "react-native";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";

// components
import BottomSheetModal from "@/components/BottomSheetModal";
import { BottomSheetRefProps } from "@/components/BottomSheetView";
import { Collapsible } from "@/components/Collapsible";
import MemberCreate from "@/components/details/MemberCreate";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import ImageAndName from "@/components/profile/ImageAndName";
import SingleBox from "@/components/SingleBox";

// hooks
import { openBottomSheetModal } from "@/hooks/useFunc";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

// icons
import { SettingIcon } from "@/assets/icons/SVG/RandomIcons";
import { UserIcon, GroupsIcon } from "@/assets/icons/SVG/InputIcons";
import { useExpense } from "@/context/ExpanseContext";
import * as SecureStore from "expo-secure-store";

export default function TabTwoScreen() {
  // colors
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");
  const iconColor = useThemeColorWithName("icon");
  const bg = useThemeColorWithName("blurBg");
  const toggleButton = useThemeColorWithName("button");
  const unSelectedToggleButton =
    useColorScheme() === "light" ? bg : useThemeColorWithName("toggleButton");
  const thumbColor = useColorScheme() === "light" ? "#8c8c8c" : "#ECEDEE";
  const selectedThumbColor =
    useColorScheme() === "light" ? "#dff169" : "#030f0e";
  const insetBg = "#0C1A17"; // one notch darker than surface, for the nested panel

  // States
  const [modalVisible, setModalVisible] = useState(false);

  // modal Reference
  const ref = useRef<BottomSheetRefProps>(null);

  const { email, setExpenseInMonth, expenseInMonth } = useExpense();

  const router = useRouter();

  // Open Modal
  const onPress = useCallback(() => {
    openBottomSheetModal(ref, setModalVisible);
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#eaeaea", dark: "transparent" }}
      headerImage={<ImageAndName />}
    >
      {/* Account Info */}

      <ThemedText type="subtitle">Account</ThemedText>
      <Collapsible title="Personal " iconName="userIcon">
        <View style={{ gap: 12 }}>
          <View style={[styles.infoPanel, { backgroundColor: surface + "40" }]}>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel} type="smallText">
                E-mail
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {email ?? "No Mail"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel} type="smallText">
                Status
              </ThemedText>
              <View style={[styles.pill, { backgroundColor: "#8A9B9622" }]}>
                <ThemedText style={[styles.pillText, { color: "#8A9B96" }]}>
                  Offline
                </ThemedText>
              </View>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <ThemedText style={styles.infoLabel} type="smallText">
                Situation
              </ThemedText>
              <View style={[styles.pill, { backgroundColor: "#FB718522" }]}>
                <ThemedText style={[styles.pillText, { color: "#fa894cfd" }]}>
                  Broke
                </ThemedText>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.settingCard,
              { backgroundColor: surface + "40", borderColor: "transparent" },
            ]}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 15 }}>
                View expenses month-wise
              </ThemedText>
              <ThemedText
                type="smallText"
                style={{ fontSize: 10, color: textMuted }}
              >
                Show this month's totals instead of all-time.
              </ThemedText>
            </View>
            <View style={{ borderRadius: 20, overflow: "hidden" }}>
              <Switch
                value={expenseInMonth}
                style={{
                  height: 28,
                  backgroundColor: expenseInMonth
                    ? toggleButton
                    : unSelectedToggleButton,
                }}
                thumbColor={expenseInMonth ? selectedThumbColor : thumbColor}
                trackColor={{ false: "transparent", true: "transparent" }}
                onValueChange={async () => {
                  await SecureStore.setItemAsync(
                    "durationType",
                    !expenseInMonth ? "true" : "false",
                  );
                  setExpenseInMonth((previousState) => !previousState);
                }}
              />
            </View>
          </View>
          <View>
            <ThemedText style={styles.groupLabel} type="defaultSemiBold">
              ADD NEW
            </ThemedText>
            <View
              style={{
                flexGrow: 0,
                marginVertical: 5,
                flexWrap: "wrap",
                flexDirection: "row",
                position: "relative",
              }}
            >
              <SingleBox
                label="Member"
                icon={<UserIcon color={iconColor} />}
                onPress={() => onPress()}
              />
              <SingleBox
                label="Group"
                icon={<GroupsIcon color={iconColor} />}
                onPress={() => router.push("/groups/create")}
              />
            </View>
            <BottomSheetModal
              isOpen={modalVisible}
              setIsOpen={setModalVisible}
              ref={ref}
            >
              <MemberCreate setModalVisibility={setModalVisible} />
            </BottomSheetModal>
          </View>
        </View>
      </Collapsible>

      <Pressable
        android_ripple={{ color: "#38BDF8" + "22" }}
        style={({ pressed }) => [
          styles.settingRow,
          {
            backgroundColor: surface,
            borderColor: cardBorder,
            opacity: pressed ? 0.94 : 1,
          },
        ]}
        onPress={() => router.push("/setting")}
      >
        <View style={[styles.chip, { backgroundColor: "#38BDF822" }]}>
          <SettingIcon color="#38BDF8" />
        </View>
        <ThemedText type="defaultSemiBold" style={{ flex: 1, fontSize: 15 }}>
          Setting
        </ThemedText>
        <Svg
          width={17}
          height={17}
          viewBox="0 0 24 24"
          fill="none"
          stroke={textMuted}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M9 6l6 6-6 6" />
        </Svg>
      </Pressable>

      {/* Support  - Add some instruction And button for instruction */}

      <ThemedText type="subtitle">Support</ThemedText>
      <Collapsible title="How This Works" iconName="serviceIcon">
        <View
          style={[
            {
              paddingHorizontal: 6,
              paddingVertical: 14,
            },
          ]}
        >
          <ThemedText style={{ marginBottom: 10 }}>
            Welcome to MoneyManager! This app is designed to help you track your
            expenses, manage your budget, and split costs with friends or family
            effortlessly.
          </ThemedText>
          <ThemedText type="smallText" style={{ marginBottom: 10 }}>
            <ThemedText type="defaultSemiBold">
              {" "}
              {"\u2022"} Add Expenses:
            </ThemedText>{" "}
            Simply tap on the "Add Expense" button to input your spending. You
            can categorize your expenses for better tracking.
          </ThemedText>
          <ThemedText type="smallText" style={{ marginBottom: 10 }}>
            <ThemedText type="defaultSemiBold">
              {"\u2022"} Split Amounts:
            </ThemedText>{" "}
            When you want to share costs, select the "Split" option. Enter the
            total amount and choose the participants. The app will automatically
            calculate each person's share.
          </ThemedText>
          <ThemedText type="smallText" style={{ marginBottom: 10 }}>
            <ThemedText type="defaultSemiBold">{"\u2022"} Analysis:</ThemedText>{" "}
            Check the "Stats" section to see your spending patterns over time.
            This will help you make informed financial decisions.
          </ThemedText>
        </View>
      </Collapsible>
      <Collapsible title="Something To Say ?" iconName="mailIcon">
        <View
          style={[
            {
              paddingHorizontal: 6,
              paddingVertical: 14,
            },
          ]}
        >
          <ThemedText>
            We value your feedback! If you have any questions, suggestions, or
            need assistance, please reach out to us. You can contact our support
            team through the email us at{" "}
            <ThemedText type="link">soumyajit.codemail@gmail.com</ThemedText> .
            We&#39;re here to help!
          </ThemedText>
        </View>
      </Collapsible>
      <Collapsible title="Help" iconName="helpIcon">
        <View
          style={[
            {
              paddingHorizontal: 6,
              paddingVertical: 14,
            },
          ]}
        >
          <ThemedText>
            Need help using the app? Sorry Bro/Sis Not thi Time.
          </ThemedText>
        </View>
      </Collapsible>

      {/* // Legal info - Add Some web page link and details */}
      <View
        style={[
          {
            paddingHorizontal: 6,
            paddingVertical: 14,
          },
        ]}
      >
        <ThemedText type="subtitle">Legal Information</ThemedText>
      </View>
      <Collapsible title="Privacy And Policy" iconName="privacyIcon">
        <View
          style={[
            {
              paddingHorizontal: 6,
              paddingVertical: 14,
            },
          ]}
        >
          <ThemedText>
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, and protect your information when you use the Expense
            Manager app.
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={{ marginTop: 10 }}>
            {"\u2022"} This is a Offline App, So All data will be stored in ur
            Device, SO we Are not seeing or collecting ur any data.
          </ThemedText>
        </View>
      </Collapsible>

      <Collapsible title="Terms & Conditions" iconName="termsIcon">
            <View
          style={[
            {
              paddingHorizontal: 6,
              paddingVertical: 14,
            },
          ]}>
        <ThemedText>
          Welcome to the MoneyManager app! By using our app, you agree to comply
          with and be bound by the following terms and conditions. Please read
          them carefully.
        </ThemedText>
        <ThemedText style={{ marginTop: 10 }}>
          {"\u2022"} No Need To Worry Their Nothing Serious.
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={{ marginTop: 10 }}>
          <ThemedText type="defaultSemiBold">
            {"\u2022"} Changes to Terms:
          </ThemedText>{" "}
          We reserve the right to modify these Terms & Conditions at any time.
          Your continued use of the app after any changes constitutes your
          acceptance of the new Terms.
        </ThemedText></View>
      </Collapsible>
      <View style={{ height: 50 }} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  titleBox: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
  },
  chip: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  infoPanel: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  infoLabel: { fontSize: 13, color: "#8A9B96" },
  infoValue: { fontSize: 15, fontWeight: "500" },
  pill: { paddingHorizontal: 12, paddingVertical: 2, borderRadius: 16 },
  pillText: { fontSize: 12, fontWeight: "600" },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  groupLabel: {
    fontSize: 11,
    letterSpacing: 0.6,
    color: "#8A9B96",
    marginLeft: 2,
    marginBottom: 8,
  },
  actionCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 13,
    overflow: "hidden",
  },
  actionChip: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
});
