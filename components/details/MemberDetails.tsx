import { getInfoAsync } from "expo-file-system";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

// components
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

//Hooks
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { fetchMemberBy_id } from "@/hooks/useQueries";

// types
import { Members } from "@/types/expanse";

const MemberDetails = ({ id }: { id: string | null }) => {
  // Colors
  const borderColor = useThemeColorWithName("borderColor");
  const darkTextColor = "#030f0e";
  const balanceBg = useThemeColorWithName("highLightBackground");

  const [member, setMember] = useState<Members | null>(null);
  const [isFile, setIsFile] = useState(false);

  const sqlDb = useSQLiteContext();

  useEffect(() => {
    async function memberFetch() {
      try {
        const member = await fetchMemberBy_id(sqlDb, Number(id));
        setMember(member);
      } catch (error) {}
    }
    memberFetch();
  });

  useEffect(() => {
    if (member && member.imgUrl) {
      try {
        getInfoAsync(member.imgUrl).then((res) => {
          setIsFile(res.exists);
        });
      } catch (error) {
        console.log("Error Reading File", error);
      }
    }
  }, []);

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
        <ThemedText type="title">{member?.userName}</ThemedText>

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
      <View style={{ marginVertical: 20, width: "100%", gap: 8 }}>
        {/* I will get the money */}
        <View style={[styles.costViewBox, { backgroundColor: balanceBg, borderColor: balanceBg }]}>
          <ThemedText type="defaultSemiBold" style={{ fontSize: 14, color: darkTextColor }}>
            Pending Payment
          </ThemedText>
          <ThemedText type="subtitle" style={{ fontSize: 26, color: darkTextColor }}>
            {member?.ownedAmount?.toFixed(2) || 0} ₹
          </ThemedText>
        </View>
        {/* He/She will get the money */}
        <View style={[styles.costViewBox, { borderColor }]}>
          <ThemedText type="default" style={{ fontSize: 14 }}>
            Deu Payment
          </ThemedText>
          <ThemedText type="subtitle" style={{ fontSize: 26 }}>
            {member?.dueAmount?.toFixed(2) ?? 0} ₹
          </ThemedText>
        </View>
      </View>

      {/* All Transaction */}
      <ThemedText type="subtitle">All Transactions</ThemedText>
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
