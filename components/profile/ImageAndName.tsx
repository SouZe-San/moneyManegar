import { View, Image, StyleSheet, TouchableOpacity, type ImageSourcePropType } from "react-native";
import { useState, useCallback, useRef, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { ThemedText } from "../ThemedText";
import BottomSheetModal from "@/components/BottomSheetModal";
import { BottomSheetRefProps } from "@/components/BottomSheetView";
import ProfileModal from "./ProfileModal";

import { useExpense } from "@/context/ExpanseContext";

const defaultProfile: ImageSourcePropType = require("@/assets/images/temp/myprofile.jpg");

const ImageAndName = () => {
  const [openedItem, setOpenedItem] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const ref = useRef<BottomSheetRefProps>(null);
  const { userName } = useExpense();

  useEffect(() => {
    (async () => {
      const url = await SecureStore.getItemAsync("profile");

      setImage(url);
    })();
  }, []);

  const onPress = useCallback(() => {
    setOpenedItem(true);
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(20);
    } else {
      ref?.current?.scrollTo(-200);
    }
  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={image ? { uri: image } : defaultProfile}
        style={{
          opacity: 0.5,
          position: "absolute",
          top: 0,
          zIndex: -1,
          objectFit: "cover",
          width: "100%",
          height: "110%",
        }}
      />
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.image]}>
          <Image
            source={image ? { uri: image } : defaultProfile}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </View>
      </TouchableOpacity>
      <ThemedText type="title" style={{ backdropFilter: "invert(1)" }}>
        {userName}
      </ThemedText>

      <BottomSheetModal isOpen={openedItem} setIsOpen={setOpenedItem} ref={ref}>
        <ProfileModal
          setOpenedItem={setOpenedItem}
          selectedImage={image}
          setSelectedImage={setImage}
        />
      </BottomSheetModal>
    </View>
  );
};

export default ImageAndName;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    gap: 10,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 10,
  },
  image: {
    width: 100,
    aspectRatio: 1,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    overflow: "hidden",
  },
});
