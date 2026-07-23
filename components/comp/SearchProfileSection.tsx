import { View, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { UserIcon } from "@/assets/icons/SVG/InputIcons";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useEffect, useState } from "react";
import { SmallInputBox } from "../inputs/InputBox";
import { Members } from "@/types/expanse";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useExpense } from "@/context/ExpanseContext";
// Retrieve Data from Local Storage

type SearchProfileSectionProps = {
  member: Members | null;
  setMember: (value: Members | null) => void;
};

export default function SearchProfileSection({ member, setMember }: SearchProfileSectionProps) {
  const [searchName, setSearchName] = useState(member ? member.userName : "");
  const [searchResult, setSearchResult] = useState<Members[]>([]);
  const [storeMembers, setStoreMembers] = useState<Members[]>([]);
  const iconColor = useThemeColorWithName("inputIcon");
  const buttonBg = useThemeColorWithName("blurBg");

  const { members } = useExpense();
  useEffect(() => {
    setStoreMembers(members);
  }, []);

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
    const filteredMembers = storeMembers.filter((member) =>
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
      setSearchResult(searchResult.filter((mem) => mem._id === newMember._id));
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
          marginVertical: 10,
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
          <ThemedText
            style={{ marginTop: 5, textAlign: "center", fontSize:14 }}
            colorName="textMuted"
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
    </ThemedView>
  );
}

const MembersRow = ({ member }: { member: Members }) => {
  const iconColor = useThemeColorWithName("icon");
  const bg = useThemeColorWithName("blurBg");
  return (
    <View style={[styles.row, { backgroundColor: bg }]}>
      <UserIcon color={iconColor} />
      <ThemedText colorName="textMuted">{member.userName}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
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
