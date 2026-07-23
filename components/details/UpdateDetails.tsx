import { ThemedView } from "../ThemedView";
import { useState } from "react";
import { ThemedText } from "../ThemedText";
import { View, TouchableOpacity, Image, Text } from "react-native";
import {
  updateImage_of_Member,
  updateMember,
  updateName_of_Member,
} from "@/hooks/queries/member";
import { useSQLiteContext } from "expo-sqlite";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import * as ImagePicker from "expo-image-picker";
import { ProCamIcon } from "@/assets/icons/SVG/RandomIcons";
import { showToastWithMsg, showToast, savePickedImage } from "@/hooks/useFunc";
import { InputWithIcon } from "../inputs/InputBox";
import { UserIcon } from "@/assets/icons/SVG/InputIcons";

const UpdateDetails = ({
  setIsUpdate,
  _id,
  currentImgUrl,
}: {
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  _id: number;
  /** the member's existing photo — deleted once a new one is saved */
  currentImgUrl?: string | null;
}) => {
  const [name, setName] = useState<string | undefined>(undefined);
  // NOTE: this is the PICKER CACHE uri, not a saved file. Nothing is written
  // to app storage until Update is pressed, so cancelling leaves no orphan.
  const [pickedUri, setPickedUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sqlDb = useSQLiteContext();

  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");
  const iconColor = useThemeColorWithName("icon");
  const accent = useThemeColorWithName("highLightBackground");
  const background = useThemeColorWithName("background");

  const update = async () => {
    if (busy) return;
    if (!name && !pickedUri) {
      showToastWithMsg("Nothing to update");
      return;
    }

    try {
      setBusy(true);

      // copy into app storage only now, and drop the old photo in the same step
      let savedImage: string | null = null;
      if (pickedUri) {
        savedImage = await savePickedImage(pickedUri, "member", currentImgUrl);
      }

      if (name && savedImage) {
        await updateMember(sqlDb, { _id, userName: name, imgUrl: savedImage });
      } else if (name) {
        await updateName_of_Member(sqlDb, { _id, userName: name });
      } else if (savedImage) {
        await updateImage_of_Member(sqlDb, { _id, imgUrl: savedImage });
      }

      showToast("DETAILS_UPDATE");
      setIsUpdate(false);
    } catch (error) {
      console.log("Error From Member Update :", error);
      showToast("ERROR");
      setBusy(false);
    }
  };

  // Image Picking logic — preview only, no file is written yet
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      // keep the existing selection if the user backs out
      if (result.canceled) return;
      setPickedUri(result.assets[0].uri);
    } catch (error) {
      console.log("Member photo pick error:", error);
      showToastWithMsg("Could not open gallery");
    }
  };

  const preview = pickedUri ?? currentImgUrl ?? null;

  return (
    <ThemedView>
      <ThemedText type="subtitle" style={{ fontSize: 16, marginTop: 12 }}>
        Identity Update
      </ThemedText>
      <ThemedText
        style={{
          fontSize: 10,
          color: textMuted,
          marginBottom: 16,
        }}
      >
        Change this member's name or photo. Leave a field blank to keep it.
      </ThemedText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          marginBottom: 16,
        }}
      >
        <TouchableOpacity
          style={{
            width: preview ? 100 : "auto",
            aspectRatio: 1,
            borderRadius: 16,
            borderColor: preview ? cardBorder : "rgba(255,255,255,0.15)",
            backgroundColor: surface,
            padding: preview ? 0 : 15,
            borderWidth: 1,
            borderStyle: preview ? "solid" : "dashed",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {preview ? (
            <Image
              source={{ uri: preview }}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          ) : (
            <ProCamIcon color={textMuted} />
          )}
        </TouchableOpacity>
        <View>
          <ThemedText type="defaultSemiBold">Profile Photo</ThemedText>
          <Text style={{ fontSize: 12, color: textMuted }}>
            Tap to choose from gallery
          </Text>
        </View>
      </View>

      <View>
        <InputWithIcon
          icon={<UserIcon color={iconColor} />}
          placeholder="Update Name"
          value={name}
          setValue={setName}
          keyboardType="default"
        />
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
        <TouchableOpacity
          onPress={() => setIsUpdate(false)}
          style={{
            borderWidth: 1,
            borderColor: cardBorder,
            flex: 1,
            alignItems: "center",
            paddingVertical: 13,
            borderRadius: 12,
          }}
        >
          <ThemedText style={{ color: textMuted }}>Cancel</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={update}
          disabled={busy}
          style={[
            {
              flex: 1,
              alignItems: "center",
              paddingVertical: 13,
              borderRadius: 12,
            },
            { backgroundColor: accent, opacity: busy ? 0.6 : 1 },
          ]}
        >
          <ThemedText style={{ color: background, fontWeight: "700" }}>
            {busy ? "Saving..." : "Update"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export default UpdateDetails;
