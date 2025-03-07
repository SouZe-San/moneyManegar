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

import { ToastAndroid } from "react-native";

enum ToastType {
  EXPENSE = "Expense added 💸",
  INCOME = "Income added 💰",
  DELETE = "Transaction Deleted ❌",
  UPDATE = "Transaction Updated ✅",
  ERROR = "Error Occurred 🚫",
  CONTRI = "Contri added 🎉",
  DEBT = "Debt added 💸",
}

export const showToast = (type: keyof typeof ToastType) => {
  ToastAndroid.show(ToastType[type], ToastAndroid.SHORT);
};
