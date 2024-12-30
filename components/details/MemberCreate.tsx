import { Members } from "@/types/expanse";
import SearchProfileSection from "../comp/SearchProfileSection";
import { ThemedView } from "../ThemedView";
import { useState } from "react";
import { ThemedText } from "../ThemedText";
import SubmitButton from "../inputs/SubmitButton";
import { View } from "react-native";

const MemberCreate = () => {
  const [member, setMember] = useState<Members | null>(null);
  return (
    <ThemedView>
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
        <SubmitButton
          button_label="Add New"
          onPress={() => {
            console.log("Member:", member);
          }}
        />
      </View>
    </ThemedView>
  );
};

export default MemberCreate;
