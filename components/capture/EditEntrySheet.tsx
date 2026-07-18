import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import CategoryIcon, { CategoryName } from "@/components/comp/CategoryIcon";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { ColorMapping } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import type { ParsedEntry } from "@/hooks/expanseParser";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CATS: CategoryName[] = [
  "Food",
  "Fuel",
  "Shopping",
  "Recharge",
  "Travels",
  "Bill",
  "Rent",
  "Others",
  "Salary",
  "Gift",
  "Business",
];

export default function EditEntrySheet({
  initial,
  onSave,
  onClose,
}: {
  initial: ParsedEntry;
  onSave: (p: ParsedEntry) => void;
  onClose: () => void;
}) {
  const scheme = useColorScheme() ?? "dark";
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");
  const accent = useThemeColorWithName("button");

  const [amount, setAmount] = useState(String(initial.amount));
  const [desc, setDesc] = useState(initial.description);
  const [type, setType] = useState(initial.type);
  const [cat, setCat] = useState<CategoryName>(
    initial.category as CategoryName,
  );

  const save = () =>
    onSave({
      ...initial,
      amount: parseFloat(amount) || 0,
      description: desc.trim() || cat,
      type,
      category: cat as any,
    });

  return (
    <ScrollView
      style={{ maxHeight: SCREEN_HEIGHT * 0.52 }}
      contentContainerStyle={{ padding: 4, gap: 4, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* <View style={{ padding: 4, gap: 14 }}> */}
        <ThemedText type="subtitle" style={{ fontSize: 24 }}>
          Edit entry
        </ThemedText>

        <View>
          <ThemedText style={styles.lbl}>AMOUNT</ThemedText>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={[
              styles.input,
              { backgroundColor: surface, borderColor: cardBorder },
            ]}
            placeholderTextColor={textMuted}
          />
        </View>

        <View>
          <ThemedText style={styles.lbl}>DESCRIPTION</ThemedText>
          <TextInput
            value={desc}
            onChangeText={setDesc}
            style={[
              styles.input,
              { backgroundColor: surface, borderColor: cardBorder },
            ]}
            placeholderTextColor={textMuted}
          />
        </View>

        <View>
          <ThemedText style={styles.lbl}>TYPE</ThemedText>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {(["expense", "income"] as const).map((t) => (
              <Pressable
                key={t}
                onPress={() => setType(t)}
                style={[
                  styles.pill,
                  {
                    borderColor: type === t ? accent : cardBorder,
                    backgroundColor: type === t ? accent + "22" : surface,
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color: type === t ? accent : textMuted,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {t}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <ThemedText style={styles.lbl}>CATEGORY</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
            keyboardShouldPersistTaps="handled"
          >
            {CATS.map((c) => {
              const col =
                (ColorMapping[scheme] as Record<string, string>)[c]?.trim() ||
                "#6B7280";
              const on = cat === c;
              return (
                <Pressable
                  key={c}
                  onPress={() => setCat(c)}
                  style={{ alignItems: "center", gap: 4 }}
                >
                  <View
                    style={[
                      styles.chip,
                      {
                        backgroundColor: on ? col + "22" : surface,
                        borderColor: on ? col : cardBorder,
                        borderWidth: on ? 1.5 : 1,
                      },
                    ]}
                  >
                    <CategoryIcon
                      type={c}
                      color={on ? col : textMuted}
                      size={22}
                    />
                  </View>
                  <ThemedText
                    style={{ fontSize: 10, color: on ? col : textMuted }}
                  >
                    {c}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
          <Pressable
            onPress={onClose}
            style={[styles.btn, { borderWidth: 1, borderColor: cardBorder }]}
          >
            <ThemedText style={{ color: textMuted }}>Cancel</ThemedText>
          </Pressable>
          <Pressable
            onPress={save}
            style={[styles.btn, { backgroundColor: accent }]}
          >
            <ThemedText style={{ color: "#071311", fontWeight: "700" }}>
              Save
            </ThemedText>
          </Pressable>
        </View>
      {/* </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  lbl: {
    fontSize: 11,
    letterSpacing: 0.6,
    color: "#8A9B96",
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#ECEDEE",
  },
  pill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  chip: {
    width: 54,
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: { flex: 1, alignItems: "center", paddingVertical: 13, borderRadius: 12 },
});
