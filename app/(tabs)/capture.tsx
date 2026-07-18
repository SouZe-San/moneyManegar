import AnimateTabView from "@/components/animation/AnimateTabView";
import {
  View,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import Svg, { Path, Rect, Circle } from "react-native-svg";

import { ThemedText } from "@/components/ThemedText";
import CategoryIcon, { CategoryName } from "@/components/comp/CategoryIcon";
import BottomSheetModal from "@/components/BottomSheetModal";
import { BottomSheetRefProps } from "@/components/BottomSheetView";
import EditEntrySheet from "@/components/capture/EditEntrySheet";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { ColorMapping } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { showToastWithMsg } from "@/hooks/useFunc";

import {
  addInboxItem,
  fetchInbox,
  deleteInboxItem,
  processPending,
  confirmInboxEntry,
  updateParsedEntry,
  undoConfirm,
  type InboxRow,
} from "@/hooks/useCaptureQueries";
import { ParsedEntry } from "@/hooks/expanseParser";
import { ThemedView } from "@/components/ThemedView";

const I = (p: { d: string; c: string; w?: number; s?: number }) => (
  <Svg
    width={p.s ?? 16}
    height={p.s ?? 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke={p.c}
    strokeWidth={p.w ?? 2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d={p.d} />
  </Svg>
);
const IconBtn = ({
  onPress,
  bg,
  children,
}: {
  onPress: () => void;
  bg: string;
  children: React.ReactNode;
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.iconBtn, { backgroundColor: bg }]}
  >
    {children}
  </Pressable>
);

export default function CaptureScreen() {
  const scheme = useColorScheme() ?? "dark";
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");
  const accent = useThemeColorWithName("button");
  const incomeColor = useThemeColorWithName("income");
  const expenseColor = useThemeColorWithName("expense");

  const db = useSQLiteContext();
  const [text, setText] = useState("");
  const [items, setItems] = useState<InboxRow[]>([]);
  const [busy, setBusy] = useState(false);

  // edit sheet
  const [editRow, setEditRow] = useState<InboxRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<BottomSheetRefProps>(null);

  // undo buffer + a simple timeout to clear it
  const undoBuf = useRef<any[]>([]);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = async () => setItems(await fetchInbox(db));
  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  const submit = async () => {
    if (!text.trim()) return;
    await addInboxItem(db, text, "text");
    setText("");
    load();
  };

  const remove = async (id: number) => {
    await deleteInboxItem(db, id);
    load();
  };

  const processAll = async () => {
    setBusy(true);
    const n = await processPending(db);
    await load();
    setBusy(false);
    showToastWithMsg(`Processed ${n} ${n === 1 ? "item" : "items"} ✨`);
  };

  const runUndo = async () => {
    if (undoBuf.current.length === 0) return;
    await undoConfirm(db, undoBuf.current);
    undoBuf.current = [];
    if (undoTimer.current) clearTimeout(undoTimer.current);
    await load();
    showToastWithMsg("Undone ↩️");
  };

  const armUndo = (undone: any[]) => {
    undoBuf.current = undone;
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => {
      undoBuf.current = [];
      load();
    }, 5000);
  };

  const confirm = async (row: InboxRow) => {
    try {
      const done = await confirmInboxEntry(db, row);
      armUndo([done]);
      await load();
      showToastWithMsg("Added ✅ · tap a new item to undo"); // toast-based undo hint
    } catch {
      showToastWithMsg("Couldn't add ❌");
    }
  };

  const confirmAll = async () => {
    const rows = items.filter((i) => i.status === "parsed" && i.parsed_json);
    if (rows.length === 0) return;
    setBusy(true);
    try {
      const undone = [];
      for (const r of rows) undone.push(await confirmInboxEntry(db, r));
      armUndo(undone);
      await load();
      showToastWithMsg(`Added ${undone.length} entries ✅`);
    } catch {
      showToastWithMsg("Some entries failed ❌");
    }
    setBusy(false);
  };

 const openEdit = useCallback((row: InboxRow) => {
   setEditRow(row);
   setSheetOpen(true);
   const isActive = sheetRef.current?.isActive();
   if (isActive) sheetRef.current?.scrollTo(20);
   else sheetRef.current?.scrollTo(-200); // exactly like the working callers
 }, []);
  const saveEdit = async (p: ParsedEntry) => {
    if (editRow) await updateParsedEntry(db, editRow._id, p);
    setSheetOpen(false);
    setEditRow(null);
    await load();
    showToastWithMsg("Updated ✏️");
  };

  const pending = items.filter((i) => i.status === "pending");
  const parsed = items.filter((i) => i.status === "parsed" && i.parsed_json);
  const parsedTotal = parsed.reduce(
    (s, r) => s + (JSON.parse(r.parsed_json!).amount || 0),
    0,
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <AnimateTabView
        style={{ flex: 1, paddingHorizontal: "5%", paddingTop: 60 }}
      >
        {/* title row + confirm-all */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            <ThemedText type="title">Capture</ThemedText>
            <ThemedText
              style={{ fontSize: 13, color: textMuted, marginBottom: 16 }}
            >
              Jot expenses as you go — process them when ready.
            </ThemedText>
          </View>
          {parsed.length > 0 && (
            <Pressable
              onPress={confirmAll}
              disabled={busy}
              style={[
                styles.confirmAll,
                { backgroundColor: accent, opacity: busy ? 0.6 : 1 },
              ]}
            >
              <I d="M20 6L9 17l-5-5" c="#071311" w={2.5} s={15} />
              <ThemedText
                style={{ color: "#071311", fontWeight: "700", fontSize: 13 }}
              >
                {parsed.length}
              </ThemedText>
            </Pressable>
          )}
        </View>

        {/* input + action row */}
        <View
          style={[
            styles.inputCard,
            { backgroundColor: surface, borderColor: cardBorder },
          ]}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="e.g. lunch swiggy 250"
            placeholderTextColor={textMuted}
            style={{ fontSize: 15, color: "#ECEDEE", paddingVertical: 6 }}
            multiline
            onSubmitEditing={submit}
          />
          <View style={[styles.actionRow, { borderTopColor: cardBorder }]}>
            <IconBtn
              bg={accent + "18"}
              onPress={() => showToastWithMsg("Voice — coming soon 🎙️")}
            >
              <Svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke={accent}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Rect x={9} y={3} width={6} height={11} rx={3} />
                <Path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </Svg>
            </IconBtn>
            <IconBtn
              bg="#38BDF818"
              onPress={() => showToastWithMsg("Scan — coming soon 📷")}
            >
              <Svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#38BDF8"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
                <Circle cx={12} cy={12} r={3} />
              </Svg>
            </IconBtn>
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={submit}
              style={[styles.addBtn, { backgroundColor: accent }]}
            >
              <I d="M12 5v14M5 12h14" c="#071311" w={2.5} s={17} />
              <ThemedText
                style={{ color: "#071311", fontWeight: "700", fontSize: 15 }}
              >
                Add
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {pending.length > 0 && (
          <Pressable
            onPress={processAll}
            disabled={busy}
            style={[styles.processBtn, { borderColor: accent }]}
          >
            <I d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" c={accent} />
            <ThemedText style={{ color: accent, fontWeight: "600" }}>
              {busy ? "Processing…" : `Process ${pending.length} pending`}
            </ThemedText>
          </Pressable>
        )}

        {/* summary header */}
        {parsed.length > 0 && (
          <ThemedText style={{ fontSize: 12, color: textMuted, marginTop: 14 }}>
            {parsed.length} ready · ₹{parsedTotal.toLocaleString("en-IN")} total
          </ThemedText>
        )}

        <ScrollView
          style={{ marginTop: 10 }}
          contentContainerStyle={{ gap: 10, paddingBottom: 140 }}
        >
          {items.length === 0 && (
            <View style={{ alignItems: "center", marginTop: 150 }}>
              <ThemedText
                style={{
                  fontSize: 15,
                  color: textMuted + "70",
                  textAlign: "center",
                }}
              >
                Nothing captured yet 👆
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 13,
                  color: textMuted + "40",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                Jot an expense above and process when ready.
              </ThemedText>
            </View>
          )}

          {items.map((row) => {
            const p: ParsedEntry | null = row.parsed_json
              ? JSON.parse(row.parsed_json)
              : null;

            // parsed row → tap to edit, 2 buttons (confirm, delete)
            if (p && row.status !== "failed") {
              const cat = (p.category ?? "Others") as CategoryName;
              const col =
                (ColorMapping[scheme] as Record<string, string>)[cat]?.trim() ||
                "#6B7280";
              const isIncome = p.type === "income";
              const lowConf = p.confidence < 0.5;
              return (
                <Pressable
                  key={row._id}
                  onPress={() => openEdit(row)}
                  style={[
                    styles.slimRow,
                    { backgroundColor: surface, borderColor: cardBorder },
                  ]}
                >
                  <View style={[styles.chip, { backgroundColor: col + "22" }]}>
                    <CategoryIcon type={cat} color={col} size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {lowConf && (
                        <View
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 4,
                            backgroundColor: "#FBBF24",
                          }}
                        />
                      )}
                      <ThemedText
                        type="defaultSemiBold"
                        numberOfLines={1}
                        style={{ fontSize: 14 }}
                      >
                        {p.description}
                      </ThemedText>
                    </View>
                    <ThemedText style={{ fontSize: 11, color: textMuted }}>
                      {cat} · {isIncome ? "Income" : "Expense"} · tap to edit
                    </ThemedText>
                  </View>
                  <ThemedText
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: isIncome ? incomeColor : expenseColor,
                    }}
                  >₹<Text style={{ fontFamily: "SpaceGroteskBold" }}>{p.amount.toLocaleString("en-IN")}</Text>
                  </ThemedText>
                  <IconBtn bg={accent + "22"} onPress={() => confirm(row)}>
                    <I d="M20 6L9 17l-5-5" c={accent} w={2.5} s={15} />
                  </IconBtn>
                  <IconBtn bg="#FB718518" onPress={() => remove(row._id)}>
                    <I
                      d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"
                      c={expenseColor}
                      s={15}
                    />
                  </IconBtn>
                </Pressable>
              );
            }

            // raw pending / failed → text + single delete (no edit before processing)
            const failed = row.status === "failed";
            return (
              <View
                key={row._id}
                style={[
                  styles.slimRow,
                  {
                    backgroundColor: surface,
                    borderColor: failed ? expenseColor + "44" : cardBorder,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <ThemedText
                    // numberOfLines={2}
                    style={{ fontSize: 14, color: "#C7D0CC" }}
                  >
                    {row.raw_text}
                  </ThemedText>
                  {failed && (
                    <ThemedText
                      style={{
                        fontSize: 11,
                        color: expenseColor,
                        marginTop: 2,
                      }}
                    >
                      Couldn't read an amount — delete & re-add with a number
                    </ThemedText>
                  )}
                </View>
                <IconBtn bg="#FB718518" onPress={() => remove(row._id)}>
                  <I
                    d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"
                    c={expenseColor}
                    s={15}
                  />
                </IconBtn>
              </View>
            );
          })}
        </ScrollView>
        <View style={{ position: "relative" }}>
          <BottomSheetModal
            isOpen={sheetOpen}
            setIsOpen={setSheetOpen}
            ref={sheetRef}
          >
            {editRow?.parsed_json && (
              <EditEntrySheet
                initial={JSON.parse(editRow.parsed_json)}
                onSave={saveEdit}
                onClose={() => setSheetOpen(false)}
              />
            )}
          </BottomSheetModal>
        </View>
      </AnimateTabView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  confirmAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 36,
    marginTop: 4,
  },
  inputCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 6,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 11,
    paddingHorizontal: 18,
    height: 40,
  },
  processBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
  },
  slimRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chip: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
});
