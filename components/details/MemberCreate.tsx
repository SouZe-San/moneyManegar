import { Members } from "@/types/expanse";
import { View, Alert, TouchableOpacity, Image, Text } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import { memberCreate } from "@/hooks/queries/member";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import SearchProfileSection from "../comp/SearchProfileSection";
import SubmitButton from "../inputs/SubmitButton";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { savePickedImage, showToast, showToastWithMsg } from "@/hooks/useFunc";

import { ProCamIcon } from "@/assets/icons/SVG/RandomIcons";

const MemberCreate = ({
  setModalVisibility,
}: {
  setModalVisibility: (value: boolean) => void;
}) => {
  const [member, setMember] = useState<Members | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const sqlDb = useSQLiteContext();
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");

  const memberSubmit = async () => {
    if (!member) {
      showToastWithMsg("Please Select a Member");
      return;
    }

    try {
      if (!member?.userId) {
        Alert.alert(
          "New User Creating",
          `Are you Sure you want to add ${member.userName}?`,
          [
            {
              text: "Yes",
              onPress: async () => {
                const newMember: Members = {
                  userName: member?.userName,
                  userId: member.userId,
                  imgUrl: selectedImage,
                };
                await memberCreate(sqlDb, newMember);
                showToast("USER");
              },
            },
            { text: "No" },
          ],
          { cancelable: true },
        );
      } else {
        await memberCreate(sqlDb, {
          userName: member?.userName,
          userId: member?.userId,
          imgUrl: selectedImage,
        });
        showToast("USER");
      }
    } catch (error) {
      showToast("ERROR");
      console.log("Error From Member Create :", error);
    } finally {
      setModalVisibility(false);
    }
  };

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
      const url = await savePickedImage(result.assets[0].uri, "member");
      setSelectedImage(url);
      return;
    }
    setSelectedImage(null);
  };


  return (
    <ThemedView>
      <ThemedText
        type="subtitle"
        style={{ marginTop: 15, marginBottom: 20, fontSize: 24 }}
      >
        NewOne ~_~
      </ThemedText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          marginBottom: 16,
        }}
      >
        <TouchableOpacity
          style={{
            width: selectedImage ? 100 : "auto",
            aspectRatio: 1,
            borderRadius: 16,
            borderColor: selectedImage ? cardBorder : "rgba(255,255,255,0.15)",
            backgroundColor: surface,
            padding: selectedImage ? 0 : 15,
            borderWidth: 1,
            borderStyle: selectedImage ? "solid" : "dashed",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          ) : (
            <ProCamIcon color={textMuted} />
          )}
        </TouchableOpacity>
        <View>
          <ThemedText type="defaultSemiBold">Profile Photo</ThemedText>
          <Text style={{ fontSize: 12, color: textMuted }}>
            Tap to choose from gallery
          </Text>
        </View>
      </View>
      <SearchProfileSection member={member} setMember={setMember} />

      <View
        style={{
          width: "100%",
          marginTop: 30,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <SubmitButton button_label="Add New" onPress={memberSubmit} />
      </View>
    </ThemedView>
  );
};

export default MemberCreate;
