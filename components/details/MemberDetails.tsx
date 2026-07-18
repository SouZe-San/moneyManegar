import { getInfoAsync } from "expo-file-system";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Text } from "react-native";
import { useCallback, useState } from "react";
import {  useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

// components
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import UpdateDetails from "./UpdateDetails";

//Hooks
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { deleteGroupMember_ON_memDelete, deleteMember, fetchMemberBy_id } from "@/hooks/useQueries";
import { showToast } from "@/hooks/useFunc";

// types
import { Members } from "@/types/expanse";
import { PenIcon } from "@/assets/icons/SVG/InputIcons";
import { DeleteIcon } from "@/assets/icons/SVG/RandomIcons";
import React from "react";

const MemberDetails = ({ id }: { id: string | null }) => {
  // Colors
  const surface = useThemeColorWithName("surface");
  const accent = useThemeColorWithName("button");
  const textMuted = useThemeColorWithName("textMuted");
  const expenseColor = useThemeColorWithName("expense");
  const incomeColor = useThemeColorWithName("income");


  const [member, setMember] = useState<Members | null>(null);
  const [isFile, setIsFile] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const sqlDb = useSQLiteContext();

  async function memberFetch() {
    try {
      const member = await fetchMemberBy_id(sqlDb, Number(id));
      setMember(member);
      if (member && member.imgUrl) {
        try {
          getInfoAsync(member.imgUrl).then((res) => {
            setIsFile(res.exists);
          });
        } catch (error) {
          console.log("Error Reading File", error);
        }
      }
    } catch (error) {
      console.error("ERROR: ", error);
      showToast("ERROR");
    }
  }
  useFocusEffect(
    useCallback(() => {
      memberFetch();
    }, [])
  );

  const deleteMemberHandler = async () => {
    try {
      await deleteGroupMember_ON_memDelete(sqlDb, Number(id));
      await deleteMember(sqlDb, Number(id));
      showToast("USER_DELETE");
    } catch (error) {
      console.error("ERROR: ", error);
      showToast("ERROR");
    }
  };

  const deleteHandler = () => {
    Alert.alert("Delete Group", "Are you sure you want to delete the group?", [
      {
        text: "Yes",
        onPress: async () => {
          await deleteMemberHandler();
        },
      },
      {
        text: "No",
        onPress: () => {},
      },
    ]);
  };
  return (
    <ThemedView>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: "#34D39922" }]}>
          {member?.imgUrl && isFile ? (
            <Image
              source={{ uri: member.imgUrl }}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <ThemedText type="title" style={{ textAlign: "center" }}>
              🐸
            </ThemedText>
          )}
        </View>

        <View style={{ flex: 1, justifyContent: "center" }}>
          <ThemedText type="title" numberOfLines={1}>
            {member?.userName}
          </ThemedText>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={[styles.actionChip, { backgroundColor: incomeColor + "20" }]}
            onPress={() => setIsUpdate(true)}
          >
            <PenIcon color={incomeColor + "20"} outline={accent} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionChip, { backgroundColor: "#FB718522" }]}
            onPress={deleteHandler}
          >
            <DeleteIcon color="#FB7185" />
          </TouchableOpacity>
        </View>
      </View>
      {isUpdate ? (
        <UpdateDetails setIsUpdate={setIsUpdate} _id={Number(id)} />
      ) : (
        <View style={{ marginVertical: 16, gap: 10 }}>
          <View
            style={[
              styles.balanceCard,
              { backgroundColor: surface, borderColor: expenseColor + "44" },
            ]}
          >
            <View>
              <ThemedText style={{ fontSize: 14 }}>Pending Payment</ThemedText>
              <ThemedText style={{ fontSize: 11, color: textMuted }}>
                you owe
              </ThemedText>
            </View>
            <ThemedText
              type="subtitle"
              style={[{ fontSize: 20, fontWeight: "600", color: expenseColor }]}
            >
              ₹<Text style={{ fontFamily: "SpaceGroteskBold" }}>{member?.dueAmount?.toFixed(2) ?? 0.0}</Text>
            </ThemedText>
          </View>

          <View
            style={[
              styles.balanceCard,
              { backgroundColor: surface, borderColor: incomeColor + "44" },
            ]}
          >
            <View>
              <ThemedText style={{ fontSize: 14 }}>Due Payment</ThemedText>
              <ThemedText style={{ fontSize: 11, color: textMuted }}>
                owed to you
              </ThemedText>
            </View>
            <ThemedText
              type="subtitle"
              style={[{ fontSize: 20, fontWeight: "600", color: incomeColor }]}
            >
              ₹<Text style={{ fontFamily: "SpaceGroteskBold" }}>{member?.owedAmount?.toFixed(2) ?? 0.0}</Text>
            </ThemedText>
          </View>
        </View>
      )}
    </ThemedView>
  );
};

export default MemberDetails;
const styles = StyleSheet.create({
  costViewBox: {
    width: "auto",
    borderWidth: 1,
    display: "flex",
    borderRadius: 10,
    borderColor: "transparent",
    justifyContent: "space-between",
    paddingBottom: 15,
    height: 100,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginVertical: 18,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  actionChip: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
});
