import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "expo-router";

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

export default function TabTwoScreen() {
  // colors
  const iconColor = useThemeColorWithName("icon");
  const bg = useThemeColorWithName("blurBg");

  // States
  const [modalVisible, setModalVisible] = useState(false);

  // modal Reference
  const ref = useRef<BottomSheetRefProps>(null);

  const { email } = useExpense();

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
        <View>
          <ThemedText>
            <ThemedText style={{ fontSize: 15 }} type="smallText">
              E-mail :{" "}
            </ThemedText>
            {email ?? "No Mail"}
          </ThemedText>
          <ThemedText>
            <ThemedText style={{ fontSize: 15 }} type="smallText">
              Status :{" "}
            </ThemedText>
            Offline
          </ThemedText>

          <ThemedText>
            <ThemedText style={{ fontSize: 15 }} type="smallText">
              Situation :{" "}
            </ThemedText>
            Broke
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={{ marginTop: 10 }}>
            Add New
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

            <BottomSheetModal isOpen={modalVisible} setIsOpen={setModalVisible} ref={ref}>
              <MemberCreate setModalVisibility={setModalVisible} />
            </BottomSheetModal>
          </View>
        </View>
      </Collapsible>

      <View style={[styles.titleBox, { borderColor: bg, backgroundColor: bg }]}>
        <TouchableOpacity
          style={styles.heading}
          onPress={() => router.push("/setting")}
          activeOpacity={0.8}
        >
          <SettingIcon color={iconColor} />
          <ThemedText type="defaultSemiBold">Setting</ThemedText>
        </TouchableOpacity>
      </View>
      {/* Support  - Add some instruction And button for instruction */}

      <ThemedText type="subtitle">Support</ThemedText>
      <Collapsible title="How This Works" iconName="serviceIcon">
        <ThemedText style={{ marginBottom: 10 }}>
          Welcome to MoneyManager! This app is designed to help you track your expenses, manage your
          budget, and split costs with friends or family effortlessly.
        </ThemedText>
        <ThemedText type="smallText" style={{ marginBottom: 10 }}>
          <ThemedText type="defaultSemiBold"> {"\u2022"} Add Expenses:</ThemedText> Simply tap on
          the "Add Expense" button to input your spending. You can categorize your expenses for
          better tracking.
        </ThemedText>
        <ThemedText type="smallText" style={{ marginBottom: 10 }}>
          <ThemedText type="defaultSemiBold">{"\u2022"} Split Amounts:</ThemedText> When you want to
          share costs, select the "Split" option. Enter the total amount and choose the
          participants. The app will automatically calculate each person's share.
        </ThemedText>
        <ThemedText type="smallText" style={{ marginBottom: 10 }}>
          <ThemedText type="defaultSemiBold">{"\u2022"} Analysis:</ThemedText> Check the "Stats"
          section to see your spending patterns over time. This will help you make informed
          financial decisions.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Something To Say ?" iconName="mailIcon">
        <ThemedText>
          We value your feedback! If you have any questions, suggestions, or need assistance, please
          reach out to us. You can contact our support team through the email us at{" "}
          <ThemedText type="link">soumyajit.codemail@gmail.com</ThemedText> . We&#39;re here to
          help!
        </ThemedText>
      </Collapsible>
      <Collapsible title="Help" iconName="helpIcon">
        <ThemedText>Need help using the app? Sorry Bro/Sis Not thi Time.</ThemedText>
      </Collapsible>

      {/* // Legal info - Add Some web page link and details */}
      <ThemedText type="subtitle">Legal Information</ThemedText>
      <Collapsible title="Privacy And Policy" iconName="privacyIcon">
        <ThemedText>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and
          protect your information when you use the Expense Manager app.
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={{ marginTop: 10 }}>
          {"\u2022"} This is a Offline App, So All data will be stored in ur Device, SO we Are not
          seeing or collecting ur any data.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Terms & Conditions" iconName="termsIcon">
        <ThemedText>
          Welcome to the MoneyManager app! By using our app, you agree to comply with and be bound
          by the following terms and conditions. Please read them carefully.
        </ThemedText>
        <ThemedText style={{ marginTop: 10 }}>
          {"\u2022"} No Need To Worry Their Nothing Serious.
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={{ marginTop: 10 }}>
          <ThemedText type="defaultSemiBold">{"\u2022"} Changes to Terms:</ThemedText> We reserve
          the right to modify these Terms & Conditions at any time. Your continued use of the app
          after any changes constitutes your acceptance of the new Terms.
        </ThemedText>
      </Collapsible>
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
});
