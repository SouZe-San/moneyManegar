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

export default function TabTwoScreen() {
  // colors
  const iconColor = useThemeColorWithName("icon");
  const bg = useThemeColorWithName("blurBg");

  // States
  const [modalVisible, setModalVisible] = useState(false);

  // modal Reference
  const ref = useRef<BottomSheetRefProps>(null);

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
            No Mail
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
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{" "}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Something To Say ?" iconName="mailIcon">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{" "}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Help" iconName="helpIcon">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{" "}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>

      {/* // Legal info - Add Some web page link and details */}
      <ThemedText type="subtitle">Legal Information</ThemedText>
      <Collapsible title="Privacy And Policy" iconName="privacyIcon">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{" "}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Terms & Conditions" iconName="termsIcon">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{" "}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
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
    // borderColor & backgroundColor will be set by theme
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
