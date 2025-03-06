import GroupInput from "@/components/comp/GroupInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import { useState } from "react";
import { IGroup, Members } from "@/types/expanse";
import { Alert, View, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { addMember_in_Group, fetchGroupId, groupCreate } from "@/hooks/useQueries";
import { useSQLiteContext } from "expo-sqlite";
import EasyAlert from "@/components/comp/EasyAlert";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import * as ImagePicker from "expo-image-picker";
import { ProCamIcon } from "@/assets/icons/SVG/RandomIcons";

export default function create() {
  const [groupName, setGroupName] = useState("");
  const [groupLogo, setGroupLogo] = useState("");
  const [members, setMembers] = useState<Members[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const bg = useThemeColorWithName("blurBg");
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
      // // Find the id of the group in table
      const groupId: {
        _id: number;
      } | null = await fetchGroupId(sqlDb, groupName);

      // Add Members to the Group
      if (!groupId) {
        EasyAlert("Failed", "Some Error Occurred, Tyr Again");
        return;
      }
      for (const member of members) {
        console.log("Adding Member: ", member);

        await addMember_in_Group(sqlDb, {
          groupId: groupId._id,
          memberId: member._id!,
        });
      }
      Alert.alert(
        "Success",
        "Group Created Successfully",
        [
          {
            text: "OK",
            onPress: () => {
              router.push("/(tabs)");
            },
          },
        ],
        {
          cancelable: false,
        }
      );
    } catch (error) {
      EasyAlert("Failed", "Some Error Occurred, Tyr Again");
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

    console.log("====================================");
    console.log("Image Picked : ", result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
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
        <ThemedText type="title">Group Create</ThemedText>
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
