import { View, Image, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { useExpense } from "@/context/ExpanseContext";
import { useRouter } from "expo-router";

import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

import { BellIcon, RingBellIcon, ProCamIcon } from "@/assets/icons/SVG/RandomIcons";

import { photoUpload, savePickedImage, showToastWithMsg } from "@/hooks/useFunc";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

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
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (result.canceled) return;

      const url = await savePickedImage(
        result.assets[0].uri,
        "profile",
        selectedImage,
      );
      setSelectedImage(url);
      await SecureStore.setItemAsync("profile", url);
    } catch (error) {
      console.log("Profile photo error:", error);
      showToastWithMsg("Could not set that photo");
    }
  };

  const router = useRouter();
  const { userName } = useExpense();

  // Colors
  const iconColor = useThemeColorWithName("icon");
  const borderColor = useThemeColorWithName("buttonBg");
  const highLightNotify = useThemeColorWithName("highLightBackground");
  const bg = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder")

  //
  return (
    <ThemedView>
      {/* Ist ROw */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          {userName && (
            <Profile userName={userName} selectedImage={selectedImage} />
          )}
        </View>


        <Pressable
          style={[
            styles.iconView,
            { borderColor: cardBorder, backgroundColor: borderColor + "22" },
          ]}
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
        <View
          style={{
            backgroundColor: highLightNotify + "22",
            width: 42,
            aspectRatio: 1,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ProCamIcon color={highLightNotify} />
        </View>
        <ThemedText type="defaultSemiBold" colorName="textMuted">
          Profile Photo
        </ThemedText>
      </TouchableOpacity>

      {/* //! 3rd Row || Log In  */}
      <ThemedText
        style={{
          fontSize: 14,
          marginBottom: 10,
          color: "#8A9B96",
          letterSpacing: 0.6,
          textTransform: "uppercase",
        }}
      >
        Log In / Sign In
      </ThemedText>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable
          style={[
            styles.button,
            { borderColor: cardBorder, backgroundColor: bg },
          ]}
          android_ripple={{ color: "#828282" + "22" }}
        >
          <ThemedText
            type="defaultSemiBold"
            colorName="textMuted"
            style={{ textAlign: "center" }}
          >
            Log In
          </ThemedText>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            { borderColor: cardBorder, backgroundColor: bg },
          ]}
          android_ripple={{ color: "#969696" + "22" }}
        >
          <ThemedText
            type="defaultSemiBold"
            colorName="textMuted"
            style={{ textAlign: "center" }}
          >
            sign In
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
    <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
      <View style={[styles.image]}>
        <Image
          source={
            selectedImage ? { uri: selectedImage } : require("@/assets/images/temp/myprofile.jpg")
          }
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </View>
      <ThemedText type="defaultSemiBold" style={{ fontSize: 24 }}>
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
    paddingVertical: 8,
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
    position: "relative",
    overflow: "hidden",
  },
});
