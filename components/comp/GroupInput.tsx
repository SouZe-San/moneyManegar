import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { InputWithIcon, SmallInputBox } from "../inputs/InputBox";
import SubmitButton from "../inputs/SubmitButton";
import { ThemedText } from "../ThemedText";

import { useThemeColorWithName } from "@/hooks/useThemeColor";

import { useExpense } from "@/context/ExpanseContext";

import { DeleteIcon } from "@/assets/icons/SVG/RandomIcons";
import { UserIcon, GroupsIcon } from "@/assets/icons/SVG/InputIcons";

import { Members } from "@/types/expanse";
interface GroupInputProps {
  // Props Here
  groupName: string;
  groupLogo: string;
  setGroupName: (value: string) => void;
  setGroupLogo: (value: string) => void;
  members: Members[];
  setMembers: (value: Members[]) => void;
  onSubmit: () => void;
}

// Retrieve Data from Local Storage
// Temporary Data

function GroupInput({
  groupName,
  groupLogo,
  setGroupName,
  members,
  setMembers,
  onSubmit,
  setGroupLogo,
}: GroupInputProps) {
  const iconColor = useThemeColorWithName("inputIcon");
  const buttonBg = useThemeColorWithName("blurBg");
  const [storedMember, setStoredMember] = useState<Members[]>(useExpense().members);

  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState<Members[]>([]);

  const borderColor = useThemeColorWithName("borderColor");
  const placeTextColor = useThemeColorWithName("tabIconDefault");
  const inputTextColor = useThemeColorWithName("text");

  //! Search Member Component
  const SearchMember = ({ member }: { member: Members }) => {
    //  Add Members
    const addMembers = (newMember: Members) => {
      // Check if the member is already in the group based on userName
      if (!members.some((existingMember) => existingMember._id === newMember._id)) {
        // If the member is not already in the list, add them
        setMembers([...members, newMember]);
      } else {
        // Optionally, show an alert or feedback for duplicate member
        Alert.alert("Member already added", `${newMember.userName} is already in the group.`);
      }
    };
    return (
      <TouchableOpacity onPress={() => addMembers(member)}>
        <MembersRow member={member} />
      </TouchableOpacity>
    );
  };

  //Searching the members from Api
  const searchMembers = () => {
    // Check Network Connection

    // Check if searchName is empty
    if (searchName.trim() === "") {
      setSearchResult([]); // Clear the search result if no input is given
      return;
    }
    // Filter members based on searchName
    const filteredMembers = storedMember.filter((member) =>
      member.userName.toLowerCase().includes(searchName.trim().toLowerCase())
    );

    // Update the search result with the filtered members
    setSearchResult(filteredMembers);
  };

  // ! Selected Members Component
  const SelectedMember = ({ member }: { member: Members }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ width: "80%" }}>
          <MembersRow member={member} />
        </View>
        <TouchableOpacity
          onPress={() => {
            // Remove the member from the list
            setMembers(members.filter((existingMember) => existingMember.userId !== member.userId));
          }}
        >
          <View style={[styles.deleteBtn, { backgroundColor: buttonBg }]}>
            <DeleteIcon color="red" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 30 }}>
        <InputWithIcon
          icon={<GroupsIcon color={iconColor} />}
          keyboardType="default"
          placeholder="Group Name?"
          value={groupName}
          setValue={setGroupName}
        />
      </View>
      {/* placeholder="Enter logo (one character or emoji)" */}
      <View style={{ marginTop: 10 }}></View>
      <View style={[styles.iconInputBox, { borderColor, borderWidth: 0.6, paddingHorizontal: 10 }]}>
        <ThemedText>{"(?)"}</ThemedText>
        <TextInput
          placeholder="Logo (1 letter or emoji)"
          keyboardType="default"
          value={groupLogo}
          placeholderTextColor={placeTextColor}
          onChangeText={setGroupLogo}
          maxLength={2}
          style={[styles.input, { marginLeft: 5, marginVertical: 10, color: inputTextColor }]}
        />
      </View>
      <View
        style={{
          flex: 1,
          marginTop: 30,
          width: "100%",
          gap: 10,
        }}
      >
        <ThemedText type="defaultSemiBold">Name of Members</ThemedText>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SmallInputBox
            icon={<UserIcon color={iconColor} />}
            keyboardType="default"
            placeholder="search members"
            value={searchName}
            setValue={setSearchName}
          />

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: buttonBg }]}
            onPress={searchMembers}
          >
            <ThemedText>Search</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Search Members */}

        <View style={[styles.searchMemberView]}>
          {searchResult.length === 0 ? (
            <ThemedText style={{ marginVertical: 10, textAlign: "center" }} colorName="blurBg">
              Nonnnnnn
            </ThemedText>
          ) : (
            <FlatList
              scrollEnabled={true}
              scrollsToTop={true}
              data={searchResult}
              renderItem={({ item }) => <SearchMember member={item} />}
              keyExtractor={(member) => member.userId ?? member.userName}
            />
          )}
        </View>

        {/* Members */}

        <ThemedText type="defaultSemiBold">Included Members</ThemedText>

        {members.length === 0 ? (
          <ThemedText style={{ marginVertical: 10, textAlign: "center" }} colorName="blurBg">
            Non
          </ThemedText>
        ) : (
          <FlatList
            scrollEnabled={true}
            scrollsToTop={true}
            data={members}
            renderItem={({ item }) => <SelectedMember member={item} />}
            keyExtractor={(member) => member.userName}
          />
        )}
      </View>
      <View
        style={{
          marginBottom: 40,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SubmitButton button_label="Group Save" onPress={onSubmit} />
      </View>
    </View>
  );
}

export default GroupInput;

const MembersRow = ({ member }: { member: Members }) => {
  const iconColor = useThemeColorWithName("icon");
  const bg = useThemeColorWithName("blurBg");
  return (
    <View
      style={[
        styles.row,
        { borderColor: bg, borderWidth: 0.7, paddingVertical: member.imgUrl ? 5 : 15 },
      ]}
    >
      {member.imgUrl ? (
        <View
          style={{
            width: 50,
            aspectRatio: 1,
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <Image
            source={{ uri: member.imgUrl }}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </View>
      ) : (
        <UserIcon color={iconColor} />
      )}
      <ThemedText type="defaultSemiBold">{member.userName}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  btn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  row: {
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchMemberView: {},
  memberView: {
    flex: 0.5,
    maxHeight: 300,
    overflow: "scroll",
  },
  iconInputBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
  },
  input: {
    height: 40,
    fontSize: 15,

    color: "white",
    paddingHorizontal: 5,
    width: "80%",
  },
  deleteBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
  },
});
