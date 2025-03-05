import { View, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { UserIcon } from "@/assets/icons/SVG/InputIcons";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useState } from "react";
import { SmallInputBox } from "../inputs/InputBox";
import { Members } from "@/types/expanse";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

// Retrieve Data from Local Storage
const mem = [
  { userName: "JohnDoe1", userId: "1", imgUrl: null },
  { userName: "JaneDoe2", userId: "2", imgUrl: null },
  { userName: "SamSmith1", userId: "411", imgUrl: null },
  { userName: "JaneDoe3", userId: "33", imgUrl: null },
  { userName: "Hekk", userId: "61", imgUrl: null },
];

type SearchProfileSectionProps = {
  member: Members | null;
  setMember: (value: Members | null) => void;
};

export default function SearchProfileSection({ member, setMember }: SearchProfileSectionProps) {
  const [searchName, setSearchName] = useState(member ? member.userName : "");
  const [searchResult, setSearchResult] = useState<Members[]>([]);

  const iconColor = useThemeColorWithName("inputIcon");
  const buttonBg = useThemeColorWithName("blurBg");

  // !Searching the members from Api
  const searchMembers = () => {
    // Check Network Connection

    // Check if searchName is empty
    if (searchName.trim() === "") {
      setMember(null); // Clear the member if no input is given
      setSearchResult([]); // Clear the search result if no input is given
      return;
    }
    // Filter members based on searchName
    const filteredMembers = mem.filter((member) =>
      member.userName.toLowerCase().includes(searchName.trim().toLowerCase())
    );

    // Update the search result with the filtered members
    setSearchResult(filteredMembers);
    setMember({ userName: searchName, userId: null, imgUrl: null });
  };

  //! Search Member Component
  const SearchMember = ({ member }: { member: Members }) => {
    //  Add Members
    const addMembers = (newMember: Members) => {
      // Check if the member is already in the group based on userName
      setSearchName(newMember.userName);
      setMember(newMember);
    };
    return (
      <TouchableOpacity onPress={() => addMembers(member)}>
        <MembersRow member={member} />
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 15,
        }}
      >
        <SmallInputBox
          icon={<UserIcon color={iconColor} />}
          keyboardType="default"
          placeholder="search user"
          value={searchName}
          setValue={setSearchName}
        />

        <TouchableOpacity
          style={[
            {
              backgroundColor: buttonBg,
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 25,
            },
          ]}
          onPress={searchMembers}
        >
          <ThemedText>Search</ThemedText>
        </TouchableOpacity>
      </View>

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
    </ThemedView>
  );
}

const MembersRow = ({ member }: { member: Members }) => {
  const iconColor = useThemeColorWithName("icon");
  const bg = useThemeColorWithName("blurBg");
  return (
    <View style={[styles.row, { backgroundColor: bg }]}>
      <UserIcon color={iconColor} />
      <ThemedText type="defaultSemiBold">
        {member.userName} - {member.userId}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
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
});
