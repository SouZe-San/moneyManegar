import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import { useState } from "react";

import { ThemedText } from "../ThemedText";
import SubmitButton from "../inputs/SubmitButton";

import { DeleteIcon } from "@/assets/icons/SVG/RandomIcons";
import { UserIcon, GroupsIcon } from "@/assets/icons/SVG/InputIcons";
import { InputWithIcon, SmallInputBox } from "../inputs/InputBox";

import { useThemeColorWithName } from "@/hooks/useThemeColor";

import { useExpense } from "@/context/ExpanseContext";

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
  // states
  const [storedMember, _setStoredMember] = useState<Members[]>(
    useExpense().members,
  );
  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState<Members[]>([]);

  // colors
  const iconColor = useThemeColorWithName("inputIcon");
  const buttonBg = useThemeColorWithName("blurBg");
  const placeTextColor = useThemeColorWithName("textMuted");
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");

  //! Search Member Component
  const SearchMember = ({ member }: { member: Members }) => {
    //  Add Members
    const addMembers = (newMember: Members) => {
      // Check if the member is already in the group based on userName
      if (
        !members.some((existingMember) => existingMember._id === newMember._id)
      ) {
        // If the member is not already in the list, add them
        setMembers([...members, newMember]);
      } else {
        // Optionally, show an alert or feedback for duplicate member
        Alert.alert(
          "Member already added",
          `${newMember.userName} is already in the group.`,
        );
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
      member.userName.toLowerCase().includes(searchName.trim().toLowerCase()),
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
        <View style={{ flex: 1 }}>
          <MembersRow member={member} />
        </View>
        <TouchableOpacity
          onPress={() => {
            // Remove the member from the list
            setMembers(
              members.filter(
                (existingMember) => existingMember._id !== member._id,
              ),
            );
          }}
          style={[
            styles.deleteBtn,
            { backgroundColor: "#FB718518", position: "absolute", right: 8 },
          ]}
        >
          <DeleteIcon color="#FB7185" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 30 }} />
      <InputWithIcon
        icon={<GroupsIcon color={iconColor} />}
        keyboardType="default"
        placeholder="Group Name?"
        value={groupName}
        setValue={setGroupName}
      />
      <View style={{ marginTop: 8 }}></View>
      <View
        style={[
          styles.iconInputBox,
          {
            borderColor: cardBorder,
            paddingHorizontal: 10,
            backgroundColor: surface,
          },
        ]}
      >
        <ThemedText colorName="text">{"(?)"}</ThemedText>
        <TextInput
          placeholder="Logo (1 letter or emoji)"
          keyboardType="default"
          value={groupLogo}
          placeholderTextColor={placeTextColor}
          onChangeText={setGroupLogo}
          maxLength={2}
          style={[
            styles.input,
            { marginLeft: 14, marginVertical: 10, color: "#ECEDEE" },
          ]}
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
            alignItems: "center", gap:10
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
            <ThemedText type="defaultSemiBold" >
              Search
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Search Members */}

        <View style={[styles.searchMemberView]}>
          {searchResult.length === 0 ? (
            <ThemedText
              style={{ marginVertical: 10, textAlign: "center" }}
              colorName="blurBg"
            >
              Nonnnnnn
            </ThemedText>
          ) : (
            <FlatList
              scrollEnabled={true}
              scrollsToTop={true}
              data={searchResult}
              contentContainerStyle={{ gap: 8 }}
              renderItem={({ item }) => <SearchMember member={item} />}
              keyExtractor={(member) => member.userId ?? member.userName}
            />
          )}
        </View>

        {/* Members */}

        <ThemedText type="defaultSemiBold">Included Members</ThemedText>

        {members.length === 0 ? (
          <ThemedText
            style={{ marginVertical: 10, textAlign: "center" }}
            colorName="blurBg"
          >
            Non
          </ThemedText>
        ) : (
          <FlatList
            scrollEnabled={true}
            scrollsToTop={true}
            data={members}
            contentContainerStyle={{ gap: 8 }}
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
  const surface = useThemeColorWithName("surface");

  const cardBorder = useThemeColorWithName("cardBorder");

  return (
    <View
      style={[
        styles.row,
        {
          borderColor: cardBorder,
          backgroundColor: surface,
          borderWidth: 0.7,
          paddingVertical: 5,
        },
      ]}
    >
      {member.imgUrl ? (
        <View
          style={{
            width: 50,
            aspectRatio: 1,
            borderRadius: "50%",
            overflow: "hidden",
            borderColor: cardBorder,
            backgroundColor: surface,
          }}
        >
          <Image
            source={{ uri: member.imgUrl }}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </View>
      ) : (
        <View
          style={{
            width: 50,
            aspectRatio: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            overflow: "hidden",
            borderColor: cardBorder,
            backgroundColor: "#94A3B823",
          }}
        >
          <UserIcon color={iconColor} />
        </View>
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
    borderRadius: 10,flex:1,
    paddingVertical: 12,
    justifyContent:"center",
    alignItems:"center"
  },
  row: {
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
    paddingHorizontal: 14,
  },
  input: {
    height: 40,
    fontSize: 15,
    color: "white",
    paddingHorizontal: 5,
    flex: 1,
  },
  deleteBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
