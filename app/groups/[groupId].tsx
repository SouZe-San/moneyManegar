import { Alert, View, TouchableOpacity, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

// components
import EasyAlert from "@/components/comp/EasyAlert";
import { globalStyles } from "@/constants/globalStyles";
import GroupInput from "@/components/comp/GroupInput";
import { ThemedView } from "@/components/ThemedView";

// icons
import { DeleteIcon, ProCamIcon } from "@/assets/icons/SVG/RandomIcons";

// hooks
import {
  deleteGroup,
  fetchAllMember_of_Group,
  fetchGroupBy_id,
  fetchMemberBy_id,
  updateGroup,
  updateGroupMember3,
} from "@/hooks/useQueries";
import { showToast, showToastWithMsg } from "@/hooks/useFunc";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

import { Members } from "@/types/expanse";

const GroupDetails = () => {
  const { groupId } = useLocalSearchParams();
  const [members, setMembers] = useState<Members[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupLogo, setGroupLogo] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [existMembers, setExistMembers] = useState<
    {
      memberId: number;
    }[]
  >([]);
  const bg = useThemeColorWithName("blurBg");
  const iconColor = useThemeColorWithName("icon");

  const db = useSQLiteContext();
  const router = useRouter();
  // Run one UseEffect and get the members from the group

  useEffect(() => {
    async function fetchData() {
      const grp = await fetchGroupBy_id(db, groupId as string);

      if (!grp) {
        return;
      }
      setGroupName(grp.name);
      setGroupLogo(grp.logo);
      setSelectedImage(grp.imgUrl);
      // get all members
      const memberIds = await fetchAllMember_of_Group(db, Number(groupId));
      setExistMembers(memberIds);
      // Find members
      const members: Members[] = [];
      const promises = memberIds.map(async (member) => {
        const mem = await fetchMemberBy_id(db, member.memberId);
        if (!mem) return;
        members.push(mem);
      });
      await Promise.all(promises);
      setMembers(members);
    }

    fetchData();
  }, []);

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
      setSelectedImage(result.assets[0].uri);
      return;
    }
    setSelectedImage(null);
  };

  async function onSubmit() {
    if (!groupName) {
      EasyAlert("Invalid Input", "Group Name is Required");
      return;
    }

    if (members.length === 0) {
      EasyAlert("Invalid Input", "Add Members to the Group");
      return;
    }

    const haveToDelete = existMembers.filter(
      (member) => !members.some((m) => m._id === member.memberId)
    );

    // Find elements present in array1 but not in array2
    const haveToADD = members.filter(
      (member) => !existMembers.some((m) => m.memberId === member._id)
    );

    try {
      await updateGroup(db, {
        _id: Number(groupId as string),
        name: groupName,
        logo: groupLogo,
        imgUrl: selectedImage,
      });

      for (const member of haveToDelete) {
        await updateGroupMember3(db, {
          groupId: Number(groupId as string),
          memberId: member.memberId,
          action: "remove",
        });
      }
      for (const member of haveToADD) {
        await updateGroupMember3(db, {
          groupId: Number(groupId as string),
          memberId: member._id!,
          action: "add",
        });
      }

      showToast("DETAILS_UPDATE");
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error : ", error);
      showToastWithMsg("Error: Some problem occurred");
    }
  }

  const deleteGroupHandler = async () => {
    try {
      await deleteGroup(db, Number(groupId));
      showToast("GROUP_DELETE");
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error : ", error);
      showToastWithMsg("Error: Some problem occurred");
    }
  };

  const deleteHandler = () => {
    Alert.alert("Delete Group", "Are you sure you want to delete the group?", [
      {
        text: "Yes",
        onPress: async () => {
          await deleteGroupHandler();
        },
      },
      {
        text: "No",
        onPress: () => {},
      },
    ]);
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <ThemedText type="title">{groupName}</ThemedText>

          <View
            style={{
              height: 40,
              width: 3,
              backgroundColor: bg,
              marginLeft: 10,
              borderRadius: 10,
            }}
          ></View>

          <TouchableOpacity
            style={{
              padding: 10,
            }}
            onPress={deleteHandler}
          >
            <DeleteIcon color="#de0000ce" />
          </TouchableOpacity>
        </View>
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
