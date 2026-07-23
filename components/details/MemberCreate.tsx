import { Members } from "@/types/expanse";
import { View, Alert, TouchableOpacity, Image, Text } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import SubmitButton from "@/components/inputs/SubmitButton";

import { countMember_byName, memberCreate } from "@/hooks/queries/member";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { savePickedImage, showToast, showToastWithMsg } from "@/hooks/useFunc";

import { ProCamIcon } from "@/assets/icons/SVG/RandomIcons";
import { UserIcon } from "@/assets/icons/SVG/InputIcons";
import { InputWithIcon } from "@/components/inputs/InputBox";

const MemberCreate = ({
  setModalVisibility,
}: {
  setModalVisibility: (value: boolean) => void;
}) => {
  const [member, setMember] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const sqlDb = useSQLiteContext();
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");
  const iconColor = useThemeColorWithName("inputIcon");

  // New User Creation
  const memberSubmit = async () => {
    if (!member || member.trim() === "") {
      showToastWithMsg("Please Select a Member");
      return;
    }
    try {
      const userCount = await countMember_byName(sqlDb, member.trim());
      if (userCount && userCount > 0) {
        showToastWithMsg("Already have this user");
        return;
      }
    } catch (error) {
      showToast("ERROR");
      console.log("Error From User finding :", error);
    }

    try {
      Alert.alert(
        "New User Creating",
        `Are you Sure you want to add ${member}?`,
        [
          {
            text: "Yes",
            onPress: async () => {
              const newMember: Members = {
                userName: member.trim(),
                userId: null,
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
        style={{ marginTop: 15, marginBottom: 30, fontSize: 24 }}
      >
        NewOne ~_~
      </ThemedText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          marginBottom: 12,
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
      <View>
        <InputWithIcon
          icon={<UserIcon color={iconColor} />}
          placeholder="UserName ...."
          value={member}
          setValue={setMember}
          keyboardType="default"
        />
      </View>
      <View
        style={{
          width: "100%",
          marginTop: 12,
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
