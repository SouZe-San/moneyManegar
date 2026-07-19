import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import dayjs from "dayjs";
import { useSQLiteContext } from "expo-sqlite";

import { ThemedText } from "@/components/ThemedText";
import { InputWithIcon } from "@/components/inputs/InputBox";
import ExpanseType from "@/components/inputs/ExpanseType";
import EasyAlert from "@/components/comp/EasyAlert";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { showToast } from "@/hooks/useFunc";
import {
  add_udhar,
  addDueAmount_of_Member,
  addOweAmount_of_Member,
  addData_in_AllTransaction,
} from "@/hooks/useQueries";

import { MoneyBagIcon, BagIcon } from "@/assets/icons/SVG/InputIcons";
import { IUdahar, Members, expenseType } from "@/types/expanse";

export type UdharKind = "debt" | "owned";

/**
 * Add a debt / contribution to a member without leaving the sheet.
 * Mirrors the payble (debt) and contribute (owned) screens exactly, so the
 * result is identical to using the full flows.
 */
export default function AddUdharForm({
  member,
  initialKind = "debt",
  onDone,
  onCancel,
}: {
  member: Members;
  initialKind?: UdharKind;
  onDone: () => void;
  onCancel: () => void;
}) {
  const iconColor = useThemeColorWithName("inputIcon");
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const accent = useThemeColorWithName("button");
  const background = useThemeColorWithName("background");
  const textMuted = useThemeColorWithName("textMuted");
  const expenseColor = useThemeColorWithName("expense");
  const incomeColor = useThemeColorWithName("income");

  const [kind, setKind] = useState<UdharKind>(initialKind);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [category, setCategory] = useState("");
  const [busy, setBusy] = useState(false);

  const db = useSQLiteContext();
  const kindColor = kind === "debt" ? expenseColor : incomeColor;

  const submit = async () => {
    if (amount.trim() === "" || Number(amount) === 0) {
      EasyAlert("Amount is empty", "Please enter the amount to continue");
      return;
    }
    if (reason.trim() === "") {
      EasyAlert("Why is empty", "Please enter the Reason to continue");
      return;
    }
    if (category.trim() === "") {
      EasyAlert("Type is Not Selected", "Type should be selected to continue");
      return;
    }
    if (!member.userName || busy) return;

    const amt = parseFloat(amount) || 0;
    const data: IUdahar = {
      amount: amt,
      date: dayjs().format("DD/MM/YY"),
      expanseDesc: reason,
      expenseType: category as expenseType,
      toWhom: member.userName,
      type: kind,
      memberId: member._id!,
    };

    try {
      setBusy(true);
      if (kind === "owned") {
        // Contribution: money left your wallet, so record the expense too
        await addData_in_AllTransaction(db, {
          amount: amt,
          type: "expense",
          expenseType: category as any,
          date: data.date,
          expanseDesc: reason,
        });
        await add_udhar(db, data);
        await addOweAmount_of_Member(db, {
          amount: amt,
          _id: member._id!,
        });
        showToast("CONTRI");
      } else {
        // Debt: you owe them (no wallet movement yet)
        await add_udhar(db, data);
        await addDueAmount_of_Member(db, {
          amount: amt,
          _id: member._id!,
        });
        showToast("DEBT");
      }
      onDone();
    } catch (error) {
      console.log("Quick add udhar error:", error);
      EasyAlert("Failed", "Some Error Occurred, Try Again");
      setBusy(false);
    }
  };

  return (
    <View style={{ marginVertical: 14, gap: 12 }}>
      {/* Which direction — preset by the button you tapped, still switchable */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        {(["debt", "owned"] as UdharKind[]).map((k) => {
          const on = kind === k;
          const c = k === "debt" ? expenseColor : incomeColor;
          return (
            <Pressable
              key={k}
              onPress={() => setKind(k)}
              style={[
                styles.pill,
                {
                  borderColor: on ? c : cardBorder,
                  backgroundColor: on ? c + "1F" : surface,
                },
              ]}
            >
              <ThemedText
                style={{
                  color: on ? c : textMuted,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                {k === "debt" ? "I owe" : "They owe"}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <InputWithIcon
        icon={<MoneyBagIcon color={iconColor} />}
        placeholder="00.0 INR"
        value={amount}
        setValue={setAmount}
      />
      <InputWithIcon
        icon={<BagIcon color={iconColor} />}
        placeholder="For What ?"
        value={reason}
        setValue={setReason}
        keyboardType="default"
      />

      <ExpanseType setValue={setCategory} value={category} />

      <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
        <Pressable
          onPress={onCancel}
          style={[styles.btn, { borderWidth: 1, borderColor: cardBorder }]}
        >
          <ThemedText style={{ color: textMuted }}>Cancel</ThemedText>
        </Pressable>
        <Pressable
          onPress={submit}
          disabled={busy}
          style={[
            styles.btn,
            { backgroundColor: kindColor, opacity: busy ? 0.6 : 1 },
          ]}
        >
          <ThemedText style={{ color: background, fontWeight: "700" }}>
            {busy ? "Saving..." : "Add"}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  btn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 13,
    borderRadius: 12,
  },
});
