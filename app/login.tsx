import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { UserIcon } from "@/assets/icons/SVG/InputIcons";
import { MailIcon } from "@/assets/icons/SVG/RandomIcons";
import * as SecureStore from "expo-secure-store";
import { showToastWithMsg } from "@/hooks/useFunc";
import { globalStyles } from "@/constants/globalStyles";
import { useCallback, useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { InputWithIcon } from "@/components/inputs/InputBox";
import { ThemedText } from "@/components/ThemedText";
import { TouchableOpacity, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
const login = () => {
  const iconColor = useThemeColorWithName("tabIconSelected");
  const bg = useThemeColorWithName("highLightBackground");
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);

  const router = useRouter();
  const handleLog = async () => {
    if (!username || username?.trim() === "") {
      showToastWithMsg("Username Must given");
      return;
    }

    await SecureStore.setItemAsync("user", username);
    if (email && email.trim() !== "") {
      await SecureStore.setItemAsync("email", email);
    }

    await SecureStore.setItemAsync("onboarding", "True");
    router.navigate("/(tabs)");
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const result = await SecureStore.getItemAsync("onboarding");
        if (result) {
          router.push("/(tabs)");
        }
      })();
    }, [])
  );

  return (
    <ThemedView style={globalStyles.animated_stackContainer}>
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", gap: 10 }}
      >
        <ThemedText type="title">Log-In</ThemedText>
        <View>
          <InputWithIcon
            icon={<UserIcon color={iconColor} />}
            placeholder="UserName..."
            value={username}
            setValue={setUsername}
            keyboardType="default"
          />
        </View>
        <View>
          <InputWithIcon
            icon={<MailIcon color={iconColor} />}
            placeholder="Email..."
            value={email}
            setValue={setEmail}
            keyboardType="default"
          />
        </View>
        <TouchableOpacity
          style={{
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            backgroundColor: bg,
            width: "80%",
            marginTop: 50,
          }}
          onPress={handleLog}
        >
          <ThemedText
            style={{ fontSize: 16, letterSpacing: 1.6, color: "#030f0e" }}
            colorName="button"
          >
            Chakke De
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export default login;
