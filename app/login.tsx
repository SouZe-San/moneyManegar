import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { UserIcon } from "@/assets/icons/SVG/InputIcons";
import { MailIcon } from "@/assets/icons/SVG/RandomIcons";
import * as SecureStore from "expo-secure-store";
import { showToastWithMsg } from "@/hooks/useFunc";
import { useCallback, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { InputWithIcon } from "@/components/inputs/InputBox";
import { ThemedText } from "@/components/ThemedText";
import { TouchableOpacity, View, ScrollView } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import ImageHeader from "@/components/comp/ImageHeader";
import { globalStyles } from "@/constants/globalStyles";

const login = () => {
  const iconColor = useThemeColorWithName("inputIcon");
  const accent = useThemeColorWithName("highLightBackground");
  const background = useThemeColorWithName("background");
  const textMuted = useThemeColorWithName("textMuted");
  const cardBorder = useThemeColorWithName("cardBorder");

  const [username, setUsername] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  const router = useRouter();

  const canSubmit = !!username && username.trim() !== "";

  const handleLog = async () => {
    if (!canSubmit) {
      showToastWithMsg("Please enter a name to continue");
      return;
    }
    if (busy) return; // guard against a double tap writing twice

    try {
      setBusy(true);
      await SecureStore.setItemAsync("user", username!.trim());
      if (email && email.trim() !== "") {
        await SecureStore.setItemAsync("email", email.trim());
      }
      await SecureStore.setItemAsync("onboarding", "True");
      // replace, not push — otherwise back returns to this screen
      router.replace("/startingEntry");
    } catch (error) {
      console.log("Login save error:", error);
      showToastWithMsg("Could not save, try again");
      setBusy(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const result = await SecureStore.getItemAsync("onboarding");
                if (result) {
                  const balanceDone = await SecureStore.getItemAsync("balanceSetup");
                  router.replace(balanceDone ? "/(tabs)" : "/startingEntry");
                }

      })();
    }, []),
  );

  return (
    <ThemedView style={globalStyles.entriesViewContainer}>
      <ImageHeader url={require("@/assets/images/temp/stats.png")} />
      <ThemedText
        style={{
          marginTop: 40,
          textAlign: "left",
          width: "100%",
          paddingLeft:16,
          textShadowColor: background,
          textShadowOffset: { width: 1.4, height: 1 },
          textShadowRadius: 4,
        }}
        type="tabTitle"
      >
        Chalo Shuru
      </ThemedText>
      <View
        style={[
          globalStyles.inputContainer,
          {
            // justifyContent: "",
            paddingHorizontal: 20,
            paddingVertical: 40,
            borderColor: cardBorder,
            borderWidth: 1,
            backgroundColor: background,
          },
        ]}
      >
        {/* Heading */}
        <View style={{ marginBottom: 28 }}>
          <ThemedText
            type="title"
            style={{
              fontSize: 18,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              color: "#c6c7c7",
              fontWeight:700,
            }}
          >
            Log In
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 14,
              color: textMuted,
              marginTop: 8,
              lineHeight: 20,
            }}
          >
            Just a name to get going. Everything you track stays on this device
            — no account, no cloud.
          </ThemedText>
        </View>

        {/* Name */}
        <View style={{ marginBottom: 18 }}>
          <ThemedText
            style={{ fontSize: 13, color: textMuted, marginBottom: 8 }}
          >
            Your name
          </ThemedText>
          <InputWithIcon
            icon={<UserIcon color={iconColor} />}
            placeholder="UzerNam"
            value={username}
            setValue={setUsername}
            keyboardType="default"
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={30}
          />
        </View>

        {/* Email */}
        <View style={{ marginBottom: 34 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
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
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLog}
          disabled={busy}
          style={{
            height: 52,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: accent,
            opacity: canSubmit && !busy ? 1 : 0.45,
          }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{ fontSize: 16, letterSpacing: 1.4, color: background }}
          >
            {busy ? "Saving..." : "Chakke De"}
          </ThemedText>
        </TouchableOpacity>

        <ThemedText
          style={{
            fontSize: 11,
            color: textMuted,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          You can change this later in Settings.
        </ThemedText>
      </View>
    </ThemedView>
  );
};

export default login;
