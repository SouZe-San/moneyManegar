import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { UserIcon, GroupsIcon } from "@/assets/icons/SVG/InputIcons";

import { InputWithIcon } from "../inputs/InputBox";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useState } from "react";

interface GroupInputProps {
  groupName: string;
  setGroupName: (name: string) => void;
}

const GroupInput = () => {
  const iconColor = useThemeColorWithName("inputIcon");
  const [groupName, setGroupName] = useState("");
  return (
    <View>
      <ThemedText type="title">Group Create</ThemedText>
      <View>
        <View>
          <InputWithIcon
            icon={<GroupsIcon color={iconColor} />}
            keyboardType="default"
            placeholder="Group Name?"
            value={groupName}
            setValue={setGroupName}
          />
        </View>
        <ThemedText type="subtitle">Member's Name</ThemedText>

        <View>
          <InputWithIcon
            icon={<UserIcon color={iconColor} />}
            keyboardType="default"
            placeholder="Name"
            value={groupName}
            setValue={setGroupName}
          />
        </View>
      </View>
    </View>
  );
};

export default GroupInput;
