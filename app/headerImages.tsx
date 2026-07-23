import { useState } from "react";
import {
  View,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { globalStyles } from "@/constants/globalStyles";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { photoUpload, showToastWithMsg } from "@/hooks/useFunc";
import { useHeaderImages } from "@/context/HeaderImageContext";
import { HEADER_IMAGES, type HeaderKey } from "@/constants/headerImages";

export default function HeaderImagesScreen() {
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");
  const accent = useThemeColorWithName("button");
  const expenseColor = useThemeColorWithName("expense");

  const { getSource, isCustom, setImage, resetImage, resetAll } =
    useHeaderImages();
  const [busyKey, setBusyKey] = useState<HeaderKey | null>(null);

  const anyCustom = HEADER_IMAGES.some((h) => isCustom(h.key));

  const pick = async (key: HeaderKey) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });
      if (result.canceled) return;

      setBusyKey(key);
      const asset = result.assets[0];
      const stored = await photoUpload(
        asset.uri,
        `header_${key}_${Date.now()}.jpg`,
      );
      await setImage(key, stored);
      showToastWithMsg("Banner updated");
    } catch (error) {
      console.log("Header image pick error:", error);
      showToastWithMsg("Could not set that image");
    } finally {
      setBusyKey(null);
    }
  };

  const confirmResetAll = () => {
    Alert.alert(
      "Reset all banners?",
      "Every screen goes back to its original image.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset all",
          style: "destructive",
          onPress: async () => {
            await resetAll();
            showToastWithMsg("All banners restored");
          },
        },
      ],
    );
  };

  return (
    <ThemedView style={globalStyles.mainContainer}>
      <ThemedText type="title" style={{ marginTop: 10 }}>
        Banners
      </ThemedText>
      <ThemedText style={{ fontSize: 13, color: textMuted, marginTop: 4 }}>
        Pick your own image for any screen. Originals are always kept, so you
        can go back anytime.
      </ThemedText>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 50, paddingBottom: 50, gap: 14,  }}
        style={{ width: "100%", alignSelf: "stretch" }}
      >
        {HEADER_IMAGES.map((item) => {
          const custom = isCustom(item.key);
          const busy = busyKey === item.key;

          return (
            <View
              key={item.key}
              style={[
                styles.card,
                { backgroundColor: surface, borderColor: cardBorder },
              ]}
            >
              {/* live preview — exactly what the screen will show */}
              <View style={styles.previewWrap}>
                <Image
                  source={getSource(item.key)}
                  style={styles.preview}
                  resizeMode="cover"
                />
                {custom && (
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: accent + "70",
                        borderColor: accent +"80",
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <ThemedText
                      style={{
                        lineHeight:12,
                        fontSize: 10,
                        color: "#04231a",
                        fontFamily: "SpaceGroteskBold",
                      }}
                    >
                      Custom
                    </ThemedText>
                  </View>
                )}
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <ThemedText type="defaultSemiBold" style={{ fontSize: 15 }}>
                    {item.label}
                  </ThemedText>
                  <Text style={{ fontSize: 11, color: textMuted }}>
                    {item.hint}
                  </Text>
                </View>

                {custom && (
                  <Pressable
                    onPress={() => resetImage(item.key)}
                    style={[styles.btn, { borderColor: cardBorder }]}
                  >
                    <ThemedText style={{ fontSize: 12 }} colorName="textMuted">
                      Reset
                    </ThemedText>
                  </Pressable>
                )}

                <Pressable
                  onPress={() => pick(item.key)}
                  disabled={busy}
                  style={[
                    styles.btn,
                    {
                      borderColor: accent + "55",
                      backgroundColor: accent + "14",
                      opacity: busy ? 0.6 : 1,
                    },
                  ]}
                >
                  <ThemedText
                    style={{ fontSize: 12, color: accent, fontWeight: "600" }}
                  >
                    {busy ? "..." : custom ? "Change" : "Choose"}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          );
        })}

        {anyCustom && (
          <Pressable
            onPress={confirmResetAll}
            style={[
              styles.resetAll,
              {
                borderColor: expenseColor + "55",
                backgroundColor: expenseColor + "12",
              },
            ]}
          >
            <ThemedText
              style={{ color: expenseColor, fontWeight: "600", fontSize: 13 }}
            >
              Reset all to default
            </ThemedText>
          </Pressable>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  previewWrap: {
    width: "100%",
    height: 110,
    position: "relative",
  },
  preview: { width: "100%", height: "100%" },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  btn: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 11,
  
  },
  resetAll: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
});
