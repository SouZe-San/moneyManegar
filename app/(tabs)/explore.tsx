import { StyleSheet, View, TouchableOpacity } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";

import ImageAndName from "@/components/profile/ImageAndName";
import { SettingIcon } from "@/assets/icons/SVG/RandomIcons";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import SingleBox from "@/components/SingleBox";
import { groupData } from "@/constants/tempVar";

export default function TabTwoScreen() {
  const iconColor = useThemeColorWithName("icon");
  const bg = useThemeColorWithName("blurBg");

  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#eaeaea", dark: "transparent" }}
      headerImage={<ImageAndName />}
    >
      {/* Account Info */}

      <ThemedText type="subtitle">Account</ThemedText>
      <Collapsible title="Personal Info" iconName="userIcon">
        <View>
          <ThemedText>
            <ThemedText type="defaultSemiBold">Name: </ThemedText>
            Soumyajit Mondal
          </ThemedText>

          <ThemedText>
            <ThemedText type="defaultSemiBold">Email: </ThemedText>
            No Mail
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={{ marginTop: 10 }}>
            My Groups{" "}
          </ThemedText>
          <View
            style={{
              flexGrow: 0,
              marginVertical: 5,
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            {groupData.map((group) => (
              <SingleBox
                key={group.groupId}
                label={group.groupName}
                icon={group.groupIcon}
                onPress={() => router.push(`/groups/${group.groupId}`)}
              />
            ))}
            <SingleBox label="Add" icon="➕" onPress={() => router.push("/groups/create")} />
          </View>
        </View>
      </Collapsible>
      {/* <Collapsible title="Setting" iconName="settingIcon">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{" "}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible> */}

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

      {/* Legal info - Add Some web page link and details */}
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
