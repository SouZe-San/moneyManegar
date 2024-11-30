import GroupInput from "@/components/comp/GroupInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import { useState } from "react";
import { Members } from "@/types/expanse";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useExpense } from "@/context/ExpanseContext";

export default function create() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [groupLogo, setGroupLogo] = useState("");
  const [members, setMembers] = useState<Members[]>([]);

  const { addGroup } = useExpense();

  const onSubmit = () => {
    // Save the Group

    const group = {
      groupName,
      members,
    };
    // Clear the input fields
    setGroupName("");
    setMembers([]);

    console.log("====================================");
    console.log("Group Details", group);
    console.log("====================================");

    // Show Success Alert
    Alert.alert(
      "Success",
      "Group Created Successfully",
      [
        {
          text: "OK",
          onPress: () => {
            addGroup(group);
            router.push("/(tabs)");
          },
        },
      ],
      {
        cancelable: false,
      }
    );
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
