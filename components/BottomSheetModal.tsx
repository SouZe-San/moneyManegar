import BottomSheetView, { BottomSheetRefProps } from "@/components/BottomSheetView";

import React, { useCallback } from "react";
import { Modal, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type PropsInterface = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
};

const BottomSheetModal = React.forwardRef<BottomSheetRefProps, PropsInterface>(
  ({ children, isOpen, setIsOpen }, ref) => {
    return (
      <Modal
        visible={isOpen}
        animationType="slide"
        statusBarTranslucent={true}
        transparent={true}
        onRequestClose={() => {
          setIsOpen(false);
        }}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
              flex: 1,
              position: "relative",
              alignItems: "center",
            }}
          >
            <BottomSheetView ref={ref}>{children}</BottomSheetView>
          </View>
        </GestureHandlerRootView>
      </Modal>
    );
  }
);

export default BottomSheetModal;
