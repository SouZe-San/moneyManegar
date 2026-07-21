import { useCallback, useRef, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
 
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

 
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { showToastWithMsg } from "@/hooks/useFunc";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");


const startingEntry = () => {
  const accent = useThemeColorWithName("highLightBackground");
  const background = useThemeColorWithName("background");
  const text = useThemeColorWithName("text");
  const textMuted = useThemeColorWithName("textMuted");

  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const router = useRouter();
  const hasValue = amount.trim() !== "";

  const save = async (value: number) => {
    if (busy) return;
    try {
      setBusy(true);
      await SecureStore.setItemAsync("openingBalance", String(value));
      await SecureStore.setItemAsync("balanceSetup", "True");
      router.replace("/(tabs)");
    } catch (error) {
      console.log("Opening balance save error:", error);
      showToastWithMsg("Could not save, try again");
      setBusy(false);
    }
  };

  const handleStart = () => {
    const parsed = parseFloat(amount.trim());
    if (!hasValue || Number.isNaN(parsed) || parsed < 0) {
      showToastWithMsg("Enter an amount, or start from zero");
      return;
    }
    save(parsed);
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const done = await SecureStore.getItemAsync("balanceSetup");
        if (done) router.replace("/(tabs)");
      })();
    }, []),
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* the number is the whole screen */}
        <Pressable
          style={styles.hero}
          onPress={() => inputRef.current?.focus()}
        >
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top:200,
              left: -20,
              alignItems: "center",
            }}
          >
            <Svg width={SCREEN_WIDTH} height={320}>
              <Defs>
                <RadialGradient id="hello" cx="50%" cy="50%" rx="50%" ry="50%">
                  <Stop
                    offset="0%"
                    stopColor={accent}
                    stopOpacity={hasValue ? 0.28 : 0.2}
                  />
                  <Stop
                    offset="45%"
                    stopColor={accent}
                    stopOpacity={(hasValue ? 0.28 : 0.2) * 0.3}
                  />
                  <Stop offset="100%" stopColor={accent} stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Rect width={SCREEN_WIDTH} height={320} fill={`url(#hello)`} />
            </Svg>
          </View>


          <View style={styles.amountRow}>
            <ThemedText
              style={[styles.currency, { color: hasValue ? text : textMuted }]}
            >
              ₹
            </ThemedText>
            <TextInput
              ref={inputRef}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={textMuted}
              maxLength={12}
              autoFocus
              style={[styles.input, { color: text }]}
            />
          </View>

          <ThemedText style={{ fontSize: 13, color: textMuted, marginTop: 10 }}>
            What you have right now
          </ThemedText>
        </Pressable>

        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleStart}
            disabled={busy}
            style={[
              styles.cta,
              { backgroundColor: accent, opacity: hasValue && !busy ? 1 : 0.4 },
            ]}
          >
            <ThemedText
              type="defaultSemiBold"
              style={{ fontSize: 16, letterSpacing: 1.4, color: background }}
            >
              {busy ? "Saving..." : "Start tracking"}
            </ThemedText>
          </TouchableOpacity>

          <Pressable
            onPress={() => save(0)}
            disabled={busy}
            style={{ paddingVertical: 16, alignItems: "center" }}
          >
            <ThemedText style={{ fontSize: 13, color: textMuted }}>
              Start from zero
            </ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  currency: {
    fontSize: 30,
    fontWeight: "600",
    marginRight: 6,
  },
  input: {
    fontFamily: "SpaceGroteskBold",
    fontSize: 52,
    minWidth: 110,
    padding: 0,
    textAlign: "left",
  },
  footer: {
    width: "100%",
  },
  cta: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default startingEntry;