import { View, Image, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";
import { BellIcon, RingBellIcon, ProCamIcon } from "@/assets/icons/SVG/RandomIcons";

// userName
import { USERNAME } from "@/constants/tempVar";
const NOTIFICATION_COUNT = 0;

export default function ProfileModal({
  setOpenedItem,
  selectedImage,
  setSelectedImage,
}: {
  setOpenedItem: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
  selectedImage: string | null;
}) {
  // Image Picking logic
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      return;
    }
    setSelectedImage(null);
  };

  const router = useRouter();

  // Colors
  const iconColor = useThemeColorWithName("icon");
  const borderColor = useThemeColorWithName("buttonBg");
  const highLightNotify = useThemeColorWithName("highLightBackground");
  const bg = useThemeColorWithName("blurBg");

  //
  return (
    <ThemedView>
      {/* Ist ROw */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>{USERNAME && <Profile userName={USERNAME} selectedImage={selectedImage} />}</View>

        <Pressable
          style={[styles.iconView, { borderColor }]}
          onPress={() => {
            setOpenedItem(false);
            router.push("/notification");
          }}
        >
          {NOTIFICATION_COUNT > 0 ? (
            <RingBellIcon color={highLightNotify} />
          ) : (
            <BellIcon color={iconColor} />
          )}
        </Pressable>
      </View>

      {/*  //! Second Row || photo Selected*/}

      <TouchableOpacity
        style={[
          styles.titleBox,
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderColor: bg,
            backgroundColor: bg,
          },
        ]}
        onPress={pickImage}
        activeOpacity={0.8}
      >
        <ProCamIcon color={iconColor} />
        <ThemedText type="defaultSemiBold">Profile Photo</ThemedText>
      </TouchableOpacity>

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

const Profile = ({
  userName,
  selectedImage,
}: {
  userName: string;
  selectedImage: string | null;
}) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View style={[styles.image]}>
        <Image
          source={
            selectedImage ? { uri: selectedImage } : require("@/assets/images/temp/myprofile.jpg")
          }
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
