import { Members } from "@/types/expanse";
import SearchProfileSection from "../comp/SearchProfileSection";
import { ThemedView } from "../ThemedView";
import { useState } from "react";
import { ThemedText } from "../ThemedText";
import SubmitButton from "../inputs/SubmitButton";
import { View, KeyboardAvoidingView, Alert } from "react-native";

const MemberCreate = ({ setModalVisibility }: { setModalVisibility: (value: boolean) => void }) => {
  const [member, setMember] = useState<Members | null>(null);

  const memberCreate = () => {
    if (!member) {
      console.log("No Member Selected");
      return;
    }

    if (!member?.useId) {
      Alert.alert(
        "User Created User",
        "Are you Sure you want to add this User?",
        [
          {
            text: "Yes",
            onPress: () => {
              const newMember = { name: member?.userName, userId: member?.useId };
              console.log("Create Member:", newMember);
              setModalVisibility(false);
            },
          },
          { text: "No" },
        ],
        { cancelable: true }
      );
      console.log("====================================");

      return;
    }

    const newMember = { name: member?.userName, userId: member?.useId };
    console.log("Create Member:", newMember);
    setModalVisibility(false);
  };

  return (
    <ThemedView>
      <KeyboardAvoidingView enabled behavior="padding">
        <ThemedText type="title" style={{ marginTop: 15, marginBottom: 20 }}>
          NewOne ~_~
        </ThemedText>
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
          <SubmitButton button_label="Add New" onPress={memberCreate} />
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default MemberCreate;
