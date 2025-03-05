import { ThemedText } from "@/components/ThemedText";

import { useLocalSearchParams } from "expo-router";
import { Alert, View, TouchableOpacity, Image } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import { useState } from "react";
import GroupInput from "@/components/comp/GroupInput";
import { Members } from "@/types/expanse";
import { groupData } from "@/constants/tempVar";
import { IGroup } from "@/types/expanse";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import * as ImagePicker from "expo-image-picker";
import { ProCamIcon } from "@/assets/icons/SVG/RandomIcons";

const GroupDetails = () => {
  const { groupId } = useLocalSearchParams();
  const group = groupData.find((group: IGroup) => group._id?.toString()! === (groupId as string));
  const [groupName, setGroupName] = useState(group?.name || "");
  const [groupLogo, setGroupLogo] = useState(group?.logo || "");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const bg = useThemeColorWithName("blurBg");
  const iconColor = useThemeColorWithName("icon");

  // Run one UseEffect and get the members from the group
  const [members, setMembers] = useState<Members[]>([]);

  //! Image Picking logic
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

  function onSubmit() {}
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
        <ThemedText type="title">{groupName}</ThemedText>
        <TouchableOpacity
          style={{
            borderColor: bg,
            backgroundColor: bg,
            borderRadius: selectedImage ? "50%" : 10,
            padding: selectedImage ? 0 : 15,
            borderWidth: 1,
            width: selectedImage ? 80 : "auto",
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
      </View>
      <GroupInput
        {...{ groupName, groupLogo, setGroupName, members, setMembers, onSubmit, setGroupLogo }}
      />
    </ThemedView>
  );
};

export default GroupDetails;
