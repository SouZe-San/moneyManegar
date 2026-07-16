import { ThemedView } from "../ThemedView";
import { useState } from "react";
import { ThemedText } from "../ThemedText";
import { View, TouchableOpacity, Image, Text } from "react-native";
import {
  updateImage_of_Member,
  updateMember,
  updateName_of_Member,
} from "@/hooks/useQueries";
import { useSQLiteContext } from "expo-sqlite";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import * as ImagePicker from "expo-image-picker";
import { ProCamIcon } from "@/assets/icons/SVG/RandomIcons";
import { showToastWithMsg, showToast, photoUpload } from "@/hooks/useFunc";
import { InputWithIcon } from "../inputs/InputBox";
import { UserIcon } from "@/assets/icons/SVG/InputIcons";

const UpdateDetails = ({
  setIsUpdate,
  _id,
}: {
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  _id: number;
}) => {
  const [name, setName] = useState<string | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const sqlDb = useSQLiteContext();

  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");
  const iconColor = useThemeColorWithName("icon");
  const accent = useThemeColorWithName("highLightBackground");

  const update = async () => {
    try {
      if (!name && !selectedImage) {
        showToastWithMsg("No Input Is Not GIven");
        return;
      } else if (name && !selectedImage) {
        await updateName_of_Member(sqlDb, {
          _id,
          userName: name,
        });
        showToast("DETAILS_UPDATE");
        setIsUpdate(false);
      } else if (!name && selectedImage) {
        await updateImage_of_Member(sqlDb, {
          _id,
          imgUrl: selectedImage,
        });
        showToast("DETAILS_UPDATE");
        setIsUpdate(false);
      } else {
        if (name && selectedImage) {
          await updateMember(sqlDb, {
            _id,
            userName: name,
            imgUrl: selectedImage,
          });
          showToast("DETAILS_UPDATE");
          setIsUpdate(false);
        }
      }
    } catch (error) {
      console.log("Error From Member Create :", error);
      showToast("ERROR");
    }
  };

  // Image Picking logic
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const url = await photoUpload(
        result.assets[0].uri,
        result.assets[0].fileName,
      );
      setSelectedImage(url);

      return;
    }
    setSelectedImage(null);
  };
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
          // marginTop: 10,
          marginBottom: 16,
        }}
      >
        <TouchableOpacity
          style={{
            width: selectedImage ? 100 : "auto",
            aspectRatio: 1,
            borderRadius: 16,
            borderColor: selectedImage ? cardBorder : "rgba(255,255,255,0.15)",
            backgroundColor: surface,
            padding: selectedImage ? 0 : 15,
            borderWidth: 1,
            borderStyle: selectedImage ? "solid" : "dashed",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
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
          style={[
            {
              flex: 1,
              alignItems: "center",
              paddingVertical: 13,
              borderRadius: 12,
            },
            { backgroundColor: accent },
          ]}
        >
          <ThemedText style={{ color: "#071311", fontWeight: "700" }}>
            Update
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export default UpdateDetails;
