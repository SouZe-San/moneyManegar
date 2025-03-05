import { Members } from "@/types/expanse";
import SearchProfileSection from "../comp/SearchProfileSection";
import { ThemedView } from "../ThemedView";
import { useState } from "react";
import { ThemedText } from "../ThemedText";
import SubmitButton from "../inputs/SubmitButton";
import { View, Alert, TouchableOpacity, Image } from "react-native";
import { memberCreate } from "@/hooks/useQueries";
import { useSQLiteContext } from "expo-sqlite";
import EasyAlert from "../comp/EasyAlert";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import * as ImagePicker from "expo-image-picker";
import { ProCamIcon } from "@/assets/icons/SVG/RandomIcons";

const MemberCreate = ({ setModalVisibility }: { setModalVisibility: (value: boolean) => void }) => {
  const [member, setMember] = useState<Members | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const sqlDb = useSQLiteContext();
  const bg = useThemeColorWithName("blurBg");
  const iconColor = useThemeColorWithName("icon");

  const memberSubmit = async () => {
    if (!member) {
      console.log("No Member Selected");
      return;
    }

    if (!member?.userId) {
      Alert.alert(
        "New User Added",
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
              try {
                await memberCreate(sqlDb, newMember);
                setModalVisibility(false);
              } catch (error) {
                console.log("Error From Member Create 1 :", error);
              }
            },
          },
          { text: "No" },
        ],
        { cancelable: true }
      );
      console.log("====================================");

      return;
    }

    try {
      await memberCreate(sqlDb, { userName: member?.userName, userId: member?.userId });
      EasyAlert("New User Added", `${member.userName} added to the group`);
    } catch (error) {
      console.log("Error From Member Create 2 :", error);
    }
    setModalVisibility(false);
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

    console.log("====================================");
    console.log("Image Picked : ", result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      return;
    }
    setSelectedImage(null);
  };

  return (
    <ThemedView>
      <ThemedText type="title" style={{ marginTop: 15, marginBottom: 20 }}>
        NewOne ~_~
      </ThemedText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          // paddingHorizontal: 10,
          marginTop: 10,
          marginBottom: 5,
          // paddingVertical: 15,
        }}
      >
        <TouchableOpacity
          style={{
            borderColor: bg,
            backgroundColor: bg,
            borderRadius: 10,
            padding: selectedImage ? 0 : 15,
            borderWidth: 1,
            width: selectedImage ? 100 : "auto",
            aspectRatio: 1,
            overflow: "hidden",
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
            <ProCamIcon color={iconColor} />
          )}
        </TouchableOpacity>
        <ThemedText type="defaultSemiBold">Profile Photo</ThemedText>
      </View>
      <SearchProfileSection member={member} setMember={setMember} />

      <View
        style={{
          width: "100%",
          left: 10,
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
