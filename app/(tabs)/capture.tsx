import BottomSheetModal from "@/components/BottomSheetModal";
import BottomSheetView, { BottomSheetRefProps } from "@/components/BottomSheetView";
import GroupInput from "@/components/comp/GroupInput";
import { openBottomSheetModal } from "@/hooks/useFunc";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCallback, useRef, useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function CaptureScreen() {
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
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText type="title" onPress={onPress}>
        Capture You $_${" "}
      </ThemedText>

      <BottomSheetModal ref={ref} isOpen={openedItem} setIsOpen={setOpenedItem}>
        <GroupInput />
      </BottomSheetModal>
    </ThemedView>
  );
}
