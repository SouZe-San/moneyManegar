import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import { useState } from "react";
import GroupInput from "@/components/comp/GroupInput";
import { Members } from "@/types/expanse";
import { groupData } from "@/constants/tempVar";
import { Groups } from "@/types/expanse";

const GroupDetails = () => {
  const { groupId } = useLocalSearchParams();
  const group = groupData.find((group: Groups) => group.groupId === groupId);
  const [groupName, setGroupName] = useState(group?.groupName || "");
  const [groupLogo, setGroupLogo] = useState(group?.groupIcon || "");
  const [members, setMembers] = useState<Members[]>(group?.members || []);

  function onSubmit() {}
  return (
    <ThemedView style={[globalStyles.mainContainer]}>
      <ThemedText type="title">Group Details {groupId}</ThemedText>
      <GroupInput
        {...{ groupName, groupLogo, setGroupName, members, setMembers, onSubmit, setGroupLogo }}
      />
    </ThemedView>
  );
};

export default GroupDetails;
