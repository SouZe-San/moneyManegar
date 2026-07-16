import { View, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

// style
import { globalStyles } from "@/constants/globalStyles";

// components
import EasyAlert from "@/components/comp/EasyAlert";
import GroupInput from "@/components/comp/GroupInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// hooks
import { addMember_in_Group, fetchGroupId, groupCreate } from "@/hooks/useQueries";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

import { IGroup, Members } from "@/types/expanse";
// icons
import { ProCamIcon } from "@/assets/icons/SVG/RandomIcons";
import { photoUpload, showToast } from "@/hooks/useFunc";

export default function create() {
  // States
  const [groupName, setGroupName] = useState("");
  const [groupLogo, setGroupLogo] = useState("");
  const [members, setMembers] = useState<Members[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // colors
  const bg = useThemeColorWithName("blurBg");
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");
  const iconColor = useThemeColorWithName("icon");

  const router = useRouter();
  const sqlDb = useSQLiteContext();

  const onSubmit = async () => {
    // Save the Group

    const group: IGroup = {
      name: groupName,
      logo: groupLogo,
      imgUrl: selectedImage,
    };
    // Clear the input fields

    try {
      // Create Group
      await groupCreate(sqlDb, group);
      // Find the id of the group in table
      const groupId: {
        _id: number;
      } | null = await fetchGroupId(sqlDb, groupName);

      // Add Members to the Group
      if (!groupId) {
        EasyAlert("Failed", "Some Error Occurred, Tyr Again");
        return;
      }
      for (const member of members) {
        await addMember_in_Group(sqlDb, {
          groupId: groupId._id,
          memberId: member._id!,
        });
      }
      router.push("/(tabs)");
      showToast("GROUP");
    } catch (error) {
      showToast("ERROR");
      console.log("Error From group/create : ", error);
    }

    setGroupName("");
    setMembers([]);

    // Show Success Alert
  };

  //! Image Picking logic
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const url = await photoUpload(result.assets[0].uri, result.assets[0].fileName);
      setSelectedImage(url);
      return;
    }
    setSelectedImage(null);
  };

  return (
    <ThemedView style={[globalStyles.mainContainer]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 20,
        }}
      >
        <ThemedText type="title">Create Group</ThemedText>
        <TouchableOpacity
          style={{
            width: selectedImage ? 80 : "auto",
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
            <ProCamIcon color={iconColor} />
          )}
        </TouchableOpacity>
      </View>
      <GroupInput
        {...{
          groupName,
          groupLogo,
          setGroupName,
          members,
          setMembers,
          onSubmit,
          setGroupLogo,
          setSelectedImage,
          selectedImage,
        }}
      />
    </ThemedView>
  );
}
