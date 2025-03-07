import { View, FlatList } from "react-native";

// components
import AnimatedStackView from "@/components/animation/AnimatedStackView";
import { globalStyles } from "@/constants/globalStyles";
import ImageHeader from "@/components/comp/ImageHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SubmitButton from "@/components/inputs/SubmitButton";
import MemberCreate from "@/components/budget/BudgetCreate";

// hooks
import { openBottomSheetModal } from "@/hooks/useFunc";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useCallback, useRef, useState } from "react";
import { BottomSheetRefProps } from "@/components/BottomSheetView";
import BottomSheetModal from "@/components/BottomSheetModal";

export function budget() {
  // States or Input Variables
  const [modalVisible, setModalVisible] = useState(false);

  // modal Reference
  const ref = useRef<BottomSheetRefProps>(null);

  // Colors
  const backgroundColor = useThemeColorWithName("background");

  const createNew = useCallback(() => {
    openBottomSheetModal(ref, setModalVisible);
  }, []);

  return (
    <ThemedView style={globalStyles.entriesViewContainer}>
      <ImageHeader url={require("@/assets/images/entries/mony.webp")} />
      <ThemedText
        type="tabTitle"
        style={{
          marginTop: 40,
          textAlign: "center",
          width: "100%",
          textShadowColor: backgroundColor,
          textShadowOffset: { width: 1.4, height: 1 },
          textShadowRadius: 4,
        }}
      >
        Tight Life {"(⁠￣⁠ヘ⁠￣⁠)⁠ "}
      </ThemedText>
      <View style={[globalStyles.inputContainer, { backgroundColor }]}>
        <AnimatedStackView style={globalStyles.animated_stackContainer}>
          <View
            style={{
              width: "100%",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-evenly",
              flex: 1,
            }}
          >
            <ThemedText colorName="tabIconDefault" style={{ textAlign: "center" }}>
              Create New Budget{" "}
            </ThemedText>
            <View style={[globalStyles.submit_btn_container]}>
              <SubmitButton button_label="✏️ New BUDGET " onPress={createNew} />
            </View>
          </View>

          <BottomSheetModal isOpen={modalVisible} setIsOpen={setModalVisible} ref={ref}>
            <MemberCreate setModalVisibility={setModalVisible} />
          </BottomSheetModal>
        </AnimatedStackView>
      </View>
    </ThemedView>
  );
}

export default budget;
