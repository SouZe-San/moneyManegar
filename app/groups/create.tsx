import GroupInput from "@/components/comp/GroupInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import { useState } from "react";
import { IGroup, Members } from "@/types/expanse";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { addMember_in_Group, fetchGroupId, groupCreate } from "@/hooks/useQueries";
import { useSQLiteContext } from "expo-sqlite";
import EasyAlert from "@/components/comp/EasyAlert";

export default function create() {
  const [groupName, setGroupName] = useState("");
  const [groupLogo, setGroupLogo] = useState("");
  const [members, setMembers] = useState<Members[]>([]);

  const router = useRouter();
  const sqlDb = useSQLiteContext();

  const onSubmit = async () => {
    // Save the Group

    const group: IGroup = {
      name: groupName,
      logo: groupLogo,
      imgUrl: null,
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
          groupId: String(groupId._id),
          memberId: String(member._id),
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
  return (
    <ThemedView style={[globalStyles.mainContainer]}>
      <ThemedText type="title">Group Create</ThemedText>
      <GroupInput
        {...{ groupName, groupLogo, setGroupName, members, setMembers, onSubmit, setGroupLogo }}
      />
    </ThemedView>
  );
}
