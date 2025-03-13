import { ThemedView } from "../ThemedView";
import { useState } from "react";
import { ThemedText } from "../ThemedText";
import SubmitButton from "../inputs/SubmitButton";
import { View, TouchableOpacity, Image } from "react-native";
import { updateImage_of_Member, updateMember, updateName_of_Member } from "@/hooks/useQueries";
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
  const bg = useThemeColorWithName("blurBg");
  const iconColor = useThemeColorWithName("icon");
  const borderColor = useThemeColorWithName("highLightBackground");

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
      const url = await photoUpload(result.assets[0].uri, result.assets[0].fileName);
      setSelectedImage(url);

      return;
    }
    setSelectedImage(null);
  };
  return (
    <ThemedView>
      <ThemedText type="subtitle" style={{ marginTop: 15, marginBottom: 20 }}>
        Identity Update
      </ThemedText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 10,
          marginBottom: 15,
        }}
      >
        <TouchableOpacity
          style={{
            borderColor: bg,
            backgroundColor: bg,
            borderRadius: 10,
            padding: selectedImage ? 0 : 15,
            borderWidth: 1,
            width: selectedImage ? 100 : "auto",
            aspectRatio: 1,
            overflow: "hidden",
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
            <ProCamIcon color={iconColor} />
          )}
        </TouchableOpacity>
        <ThemedText type="defaultSemiBold">Profile Photo</ThemedText>
      </View>

      <View>
        <InputWithIcon
          icon={<UserIcon color={iconColor} />}
          placeholder="Name..."
          value={name}
          setValue={setName}
          keyboardType="default"
        />
      </View>

      <View
        style={{
          width: "100%",
          left: 10,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => setIsUpdate(false)}
          style={{
            width: "90%",
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            borderWidth: 1,
            borderColor,
            alignSelf: "center",
            marginTop: 40,
            marginBottom: 20,
          }}
        >
          <ThemedText style={{ fontWeight: 600, letterSpacing: 1.5 }}>Cancel</ThemedText>
        </TouchableOpacity>
        <SubmitButton button_label="Update Details" onPress={update} />
      </View>
    </ThemedView>
  );
};

export default UpdateDetails;
