import { getInfoAsync } from "expo-file-system";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Text,
  Dimensions,
  Pressable,
} from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

// components
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import UpdateDetails from "./UpdateDetails";
import AddUdharForm, { type UdharKind } from "./AddUdharForm";
import CategoryIcon from "@/components/comp/CategoryIcon";

//Hooks
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  deleteGroupMember_ON_memDelete,
  deleteMember,
  fetchMemberBy_id,
  fetchUdharBy_MemberUserId,
} from "@/hooks/useQueries";
import { showToast } from "@/hooks/useFunc";
import { useExpense } from "@/context/ExpanseContext";

// types
import { Members, IUdahar } from "@/types/expanse";
import { ColorMapping } from "@/constants/Colors";
import { PenIcon } from "@/assets/icons/SVG/InputIcons";
import { DeleteIcon } from "@/assets/icons/SVG/RandomIcons";
import React from "react";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const money = (n: number) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

const MemberDetails = ({ id }: { id: string | null }) => {
  // Colors
  const scheme = useColorScheme() ?? "dark";
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const accent = useThemeColorWithName("button");
  const textMuted = useThemeColorWithName("textMuted");
  const expenseColor = useThemeColorWithName("expense");
  const incomeColor = useThemeColorWithName("income");
    const text = useThemeColorWithName("text");

  const [member, setMember] = useState<Members | null>(null);
  const [history, setHistory] = useState<IUdahar[]>([]);
  const [isFile, setIsFile] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [addKind, setAddKind] = useState<UdharKind | null>(null);

  const sqlDb = useSQLiteContext();
  const { onRefresh } = useExpense();

  async function memberFetch() {
    try {
      const member = await fetchMemberBy_id(sqlDb, Number(id));
      setMember(member);
      // history is keyed by userId, so it has to come after the member load
      const rows = await fetchUdharBy_MemberUserId(sqlDb, member?._id);
      
      setHistory(rows);
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
    }, []),
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
    Alert.alert(
      "Delete member",
      `Remove ${member?.userName ?? "this member"}? Their balances will be lost.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteMemberHandler();
          },
        },
      ],
    );
  };

  const handleAddDone = () => {
    setAddKind(null);
    memberFetch(); // refresh balances + history
    onRefresh(); // a contribution also writes an expense
  };

  // dueAmount = money YOU owe them · owedAmount = money THEY owe you
  const due = member?.dueAmount ?? 0;
  const owed = member?.owedAmount ?? 0;
  const net = owed - due;
  const netColor = net > 0 ? incomeColor : net < 0 ? expenseColor : textMuted;
  const netLabel =
    net > 0
      ? `Owes you ₹${money(net)}`
      : net < 0
        ? `You owe ₹${money(Math.abs(net))}`
        : "All settled";

  return (
    <ThemedView>
      <ScrollView
        style={{ maxHeight: SCREEN_HEIGHT * 0.62 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
            {/* the settle-up number, first thing you read */}
            <Text style={{ fontSize: 12, color: netColor, marginTop: 2 }}>
              {netLabel}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={[
                styles.actionChip,
                { backgroundColor: incomeColor + "20" },
              ]}
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
        ) : addKind && member ? (
          <AddUdharForm
            member={member}
            initialKind={addKind}
            onDone={handleAddDone}
            onCancel={() => setAddKind(null)}
          />
        ) : (
          <View style={{ marginVertical: 14 }}>
            {/* Gross figures — nothing hidden by the net above */}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View
                style={[
                  styles.balanceCard,
                  { backgroundColor: surface, borderColor: cardBorder },
                ]}
              >
                <Text style={{ fontSize: 14, color: text }}>
                  Pending Payment
                </Text>
                <Text style={{ fontSize: 10, color: textMuted }}>You owe</Text>
                <ThemedText
                  type="subtitle"
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: expenseColor,
                    marginTop: 4,
                  }}
                >
                  ₹
                  <Text style={{ fontFamily: "SpaceGroteskBold" }}>
                    {money(due)}
                  </Text>
                </ThemedText>
              </View>

              <View
                style={[
                  styles.balanceCard,
                  { backgroundColor: surface, borderColor: cardBorder },
                ]}
              >
                <Text style={{ fontSize: 14, color: text }}>Due Payment</Text>
                <Text style={{ fontSize: 10, color: textMuted }}>
                  Owes you
                </Text>
                <ThemedText
                  type="subtitle"
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: incomeColor,
                    marginTop: 4,
                  }}
                >
                  ₹
                  <Text style={{ fontFamily: "SpaceGroteskBold" }}>
                    {money(owed)}
                  </Text>
                </ThemedText>
              </View>
            </View>

            {/* Two buttons so the direction is chosen before the form opens */}
            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              <Pressable
                onPress={() => setAddKind("debt")}
                disabled={!member}
                style={[
                  styles.addBtn,
                  {
                    borderColor: expenseColor + "55",
                    backgroundColor: expenseColor + "12",
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color: expenseColor,
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  ＋Debt
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setAddKind("owned")}
                disabled={!member}
                style={[
                  styles.addBtn,
                  {
                    borderColor: incomeColor + "55",
                    backgroundColor: incomeColor + "12",
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color: incomeColor,
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  ＋Contri
                </ThemedText>
              </Pressable>
            </View>

            {/* History — the data existed on memberId, it was just never read */}
            <View style={styles.historyHead}>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 14 }}>
                History
              </ThemedText>
              <ThemedText style={{ fontSize: 11, color: textMuted }}>
                {history.length === 0
                  ? "nothing yet"
                  : `${history.length} ${history.length === 1 ? "entry" : "entries"}`}
              </ThemedText>
            </View>

            {history.length === 0 ? (
              <ThemedText
                style={{ fontSize: 12, color: textMuted, paddingVertical: 14 }}
              >
                Nothing recorded with {member?.userName ?? "this member"} yet.
              </ThemedText>
            ) : (
              history.map((item, index) => {
                const isOwed = item.type === "owned";
                const amountColor = isOwed ? incomeColor : expenseColor;
                const catColor =
                  (ColorMapping[scheme] as Record<string, string>)[
                    item.expenseType
                  ]?.trim() || textMuted;

                return (
                  <View key={item._id ?? index} style={styles.historyRow}>
                    <View
                      style={[
                        styles.historyChip,
                        { backgroundColor: catColor + "26" },
                      ]}
                    >
                      <CategoryIcon
                        type={item.expenseType}
                        color={catColor}
                        size={16}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText style={{ fontSize: 13 }} numberOfLines={1}>
                        {item.expanseDesc}
                      </ThemedText>
                      <ThemedText style={{ fontSize: 10, color: textMuted }}>
                        {item.date} · {isOwed ? "they owe" : "you owe"}
                      </ThemedText>
                    </View>
                    <ThemedText
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: amountColor,
                      }}
                    >
                      ₹
                      <Text style={{ fontFamily: "SpaceGroteskBold" }}>
                        {money(item.amount)}
                      </Text>
                    </ThemedText>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default MemberDetails;

const styles = StyleSheet.create({
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
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  historyHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 6,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  historyChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
