import { View, Image, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { USERNAME } from "@/constants/tempVar";
import { ThemedText } from "../ThemedText";
import { BellIcon, RingBellIcon, ProCamIcon } from "@/assets/icons/SVG/RandomIcons";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { ThemedView } from "../ThemedView";
export default function ProfileModal({
  setOpenedItem,
}: {
  setOpenedItem: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const iconColor = useThemeColorWithName("icon");
  const borderColor = useThemeColorWithName("buttonBg");
  const highLightNotify = useThemeColorWithName("highLightBackground");
  const bg = useThemeColorWithName("blurBg");
  return (
    <ThemedView>
      {/* Ist ROw */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>{USERNAME && <Profile userName={USERNAME} />}</View>

        <Pressable
          style={[styles.iconView, { borderColor }]}
          onPress={() => {
            setOpenedItem(false);
            router.push("/notification");
          }}
        >
          <BellIcon color={iconColor} />
          {/* <RingBellIcon color={highLightNotify} /> */}
        </Pressable>
      </View>

      {/*  //! Second Row || photo Selected*/}

      <View style={[styles.titleBox, { borderColor: bg, backgroundColor: bg }]}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          //   onPress={() => router.push("/setting")}
          activeOpacity={0.8}
        >
          <ProCamIcon color={iconColor} />
          <ThemedText type="defaultSemiBold">Profile Photo</ThemedText>
        </TouchableOpacity>
      </View>

      {/* //! 3rd Row || Log In  */}
      <ThemedText type="title" style={{ fontSize: 20, marginBottom: 10 }}>
        Log In / Sign In
      </ThemedText>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Pressable
          style={[styles.button, { borderColor: bg }]}
          onPress={() => {
            // setOpenedItem(false);
            // router.push("/login");
          }}
        >
          <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
            Log In
          </ThemedText>
        </Pressable>
        <Pressable
          style={[styles.button, { borderColor: bg }]}
          onPress={() => {
            // setOpenedItem(false);
            // router.push("/login");
          }}
        >
          <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
            Log In
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const Profile = ({ userName }: { userName: string }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View style={[styles.image]}>
        <Image
          source={require("@/assets/images/temp/myprofile.jpg")}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </View>
      <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>
        {userName}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 70,
    aspectRatio: 1,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    overflow: "hidden",
  },
  iconView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: "50%",
  },
  titleBox: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 20,
  },
  button: {
    width: "45%",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderColor: "#ffffff21",
    borderWidth: 1,
    gap: 6,
    color: "#aaaaaa",
    backgroundColor: "#abcbc427",
    position: "relative",
    overflow: "hidden",
  },
});
