import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { useState, useCallback, useRef } from "react";
import BottomSheetModal from "@/components/BottomSheetModal";
import { BottomSheetRefProps } from "@/components/BottomSheetView";
import ProfileModal from "./ProfileModal";

const ImageAndName = () => {
  const [openedItem, setOpenedItem] = useState<boolean>(false);
  const ref = useRef<BottomSheetRefProps>(null);

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
        source={require("@/assets/images/temp/myprofile.jpg")}
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
            source={require("@/assets/images/temp/myprofile.jpg")}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </View>
      </TouchableOpacity>
      <ThemedText type="title" style={{ backdropFilter: "invert(1)" }}>
        Souze
      </ThemedText>

      <BottomSheetModal isOpen={openedItem} setIsOpen={setOpenedItem} ref={ref}>
        <ProfileModal setOpenedItem={setOpenedItem} />
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
