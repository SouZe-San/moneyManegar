import { useCallback } from "react";
import { BottomSheetRefProps } from "@/components/BottomSheetView";
export const openBottomSheetModal = (
  ref: React.RefObject<BottomSheetRefProps>,
  setOpenedItem: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setOpenedItem(true);
  const isActive = ref?.current?.isActive();
  if (isActive) {
    ref?.current?.scrollTo(20);
  } else {
    ref?.current?.scrollTo(-200);
  }
};
