import { View, StyleSheet, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { globalStyles } from "@/constants/globalStyles";
import { useEffect, useState } from "react";
import { fetchMemberBy_id } from "@/hooks/useQueries";
import { useSQLiteContext } from "expo-sqlite";
import { Members } from "@/types/expanse";

const memberCost = {
  expanse: 0,
  income: 0,
};
const MemberDetails = ({ id }: { id: string | null }) => {
  const borderColor = useThemeColorWithName("borderColor");
  const darkTextColor = "#030f0e";
  const balanceBg = useThemeColorWithName("highLightBackground");

  const [member, setMember] = useState<Members | null>(null);

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
          {member?.imgUrl ? (
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
            {memberCost.expanse.toFixed(2)} ₹
          </ThemedText>
        </View>
        {/* He/She will get the money */}
        <View style={[styles.costViewBox, { borderColor }]}>
          <ThemedText type="default" style={{ fontSize: 14 }}>
            Deu Payment
          </ThemedText>
          <ThemedText type="subtitle" style={{ fontSize: 26 }}>
            {memberCost.income.toFixed(2)} ₹
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
    // justifyContent: "flex-end",
    paddingBottom: 15,
    height: 100,
    padding: 10,
  },
});
