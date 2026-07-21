import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";

import { ThemedText } from "@/components/ThemedText";
import { InputWithIcon } from "@/components/inputs/InputBox";
import EasyAlert from "@/components/comp/EasyAlert";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { showToastWithMsg } from "@/hooks/useFunc";
import { useExpense } from "@/context/ExpanseContext";

import { UserIcon } from "@/assets/icons/SVG/InputIcons";
import { MailIcon } from "@/assets/icons/SVG/RandomIcons";

/**
 * Edit the name + email captured at login. Writes to SecureStore (the same
 * keys login uses) then calls firstRefresh() so the context — and the row on
 * the explore tab — reflect the change immediately.
 */
export default function UpdateProfileForm({
  onDone,
  onCancel,
}: {
  onDone: () => void;
  onCancel: () => void;
}) {
  const iconColor = useThemeColorWithName("inputIcon");
  const accent = useThemeColorWithName("button");
  const background = useThemeColorWithName("background");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");

  const { userName, email, firstRefresh } = useExpense();

  const [name, setName] = useState<string | undefined>(userName ?? "");
  const [mail, setMail] = useState<string | undefined>(email ?? "");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!name || name.trim() === "") {
      EasyAlert("Name is empty", "A name is needed to continue");
      return;
    }
    if (busy) return;

    try {
      setBusy(true);
      await SecureStore.setItemAsync("user", name.trim());
      if (mail && mail.trim() !== "") {
        await SecureStore.setItemAsync("email", mail.trim());
      } else {
        // cleared the field -> drop the stored email
        await SecureStore.deleteItemAsync("email");
      }
      await firstRefresh(); // reload context so the row updates
      showToastWithMsg("Profile updated");
      onDone();
    } catch (error) {
      console.log("Update profile error:", error);
      showToastWithMsg("Could not save, try again");
      setBusy(false);
    }
  };

  return (
    <View style={{ marginVertical: 14, gap: 14 }}>
      <ThemedText type="subtitle" style={{ fontSize: 22 }}>
        Edit profile
      </ThemedText>

      <View style={{ gap: 8 }}>
        <ThemedText style={{ fontSize: 13, color: textMuted }}>
          Your name
        </ThemedText>
        <InputWithIcon
          icon={<UserIcon color={iconColor} />}
          placeholder="Your name"
          value={name}
          setValue={setName}
          keyboardType="default"
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={30}
        />
      </View>

      <View style={{ gap: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemedText style={{ fontSize: 13, color: textMuted }}>
            Email
          </ThemedText>
          <ThemedText style={{ fontSize: 11, color: textMuted }}>
            Optional
          </ThemedText>
        </View>
        <InputWithIcon
          icon={<MailIcon color={iconColor} />}
          placeholder="you@mail.com"
          value={mail}
          setValue={setMail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
        <Pressable
          onPress={onCancel}
          style={[styles.btn, { borderWidth: 1, borderColor: cardBorder }]}
        >
          <ThemedText style={{ color: textMuted }}>Cancel</ThemedText>
        </Pressable>
        <Pressable
          onPress={save}
          disabled={busy}
          style={[
            styles.btn,
            { backgroundColor: accent, opacity: busy ? 0.6 : 1 },
          ]}
        >
          <ThemedText style={{ color: background, fontWeight: "700" }}>
            {busy ? "Saving..." : "Save"}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 13,
    borderRadius: 12,
  },
});
