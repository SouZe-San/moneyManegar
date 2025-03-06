import { ThemedText } from "@/components/ThemedText";

import { useLocalSearchParams } from "expo-router";
import { Alert, View, TouchableOpacity, Image } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import { useEffect, useState } from "react";
import GroupInput from "@/components/comp/GroupInput";
import { Members } from "@/types/expanse";
import { groupData } from "@/constants/tempVar";
import { IGroup } from "@/types/expanse";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import * as ImagePicker from "expo-image-picker";
import { ProCamIcon } from "@/assets/icons/SVG/RandomIcons";
import { useSQLiteContext } from "expo-sqlite";
import { fetchAllMember_of_Group, fetchGroupBy_id, fetchMemberBy_id } from "@/hooks/useQueries";

const GroupDetails = () => {
  const { groupId } = useLocalSearchParams();
  const [members, setMembers] = useState<Members[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupLogo, setGroupLogo] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const bg = useThemeColorWithName("blurBg");
  const iconColor = useThemeColorWithName("icon");

  const db = useSQLiteContext();

  // Run one UseEffect and get the members from the group

  useEffect(() => {
    async function fetchData() {
      console.log("from Group Details");
      const grp = await fetchGroupBy_id(db, groupId as string);

      if (!grp) {
        return;
      }
      setGroupName(grp.name);
      setGroupLogo(grp.logo);
      setSelectedImage(grp.imgUrl);
      // get all members
      const memberIds = await fetchAllMember_of_Group(db, Number(groupId));

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
