import { getInfoAsync } from "expo-file-system";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
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
  const borderColor = useThemeColorWithName("borderColor");
  const darkTextColor = "#030f0e";
  const balanceBg = useThemeColorWithName("highLightBackground");
  const icon = useThemeColorWithName("icon");
  const bg = useThemeColorWithName("blurBg");

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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <ThemedText type="title">{member?.userName}</ThemedText>
          <View
            style={{
              height: 40,
              width: 3,
              backgroundColor: bg,
              marginLeft: 10,
              borderRadius: 10,
            }}
          ></View>
          <TouchableOpacity
            style={{
              padding: 10,
            }}
            onPress={() => setIsUpdate(true)}
          >
            <PenIcon color={balanceBg} outline={icon} />
          </TouchableOpacity>
          <View
            style={{
              height: 40,
              width: 3,
              backgroundColor: bg,
              marginLeft: 10,
              borderRadius: 10,
            }}
          ></View>
          <TouchableOpacity
            style={{
              padding: 10,
            }}
            onPress={deleteHandler}
          >
            <DeleteIcon color="#de0000ce" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            borderRadius: "50%",
            padding: 0,
            borderWidth: 1,
            width: 80,
            aspectRatio: 1,
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: balanceBg,
          }}
        >
          {member?.imgUrl && isFile ? (
            <Image
              source={{ uri: member.imgUrl }}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          ) : (
            <ThemedText
              type="title"
              style={{
                textAlign: "center",
              }}
            >
              🤡
            </ThemedText>
          )}
        </View>
      </View>
      {isUpdate ? (
        <UpdateDetails setIsUpdate={setIsUpdate} _id={Number(id)} />
      ) : (
        <View style={{ marginVertical: 20, width: "100%", gap: 8 }}>
          <View
            style={[styles.costViewBox, { backgroundColor: balanceBg, borderColor: balanceBg }]}
          >
            <ThemedText type="defaultSemiBold" style={{ fontSize: 14, color: darkTextColor }}>
              Pending Payment
            </ThemedText>
            <ThemedText type="subtitle" style={{ fontSize: 26, color: darkTextColor }}>
              {member?.ownedAmount?.toFixed(2) || 0} ₹
            </ThemedText>
          </View>
          <View style={[styles.costViewBox, { borderColor }]}>
            <ThemedText type="default" style={{ fontSize: 14 }}>
              Deu Payment
            </ThemedText>
            <ThemedText type="subtitle" style={{ fontSize: 26 }}>
              {member?.dueAmount?.toFixed(2) ?? 0} ₹
            </ThemedText>
          </View>
        </View>
      )}
      {!isUpdate && <ThemedText type="subtitle">All Transactions</ThemedText>}
      <ScrollView></ScrollView>
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
});
