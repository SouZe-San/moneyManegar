import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
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
  USER = "User added 🧑",
  USER_DELETE = "User Deleted 👾",
  GROUP = "Group added 🫂",
  GROUP_DELETE = "Group Delete 👾",
  DETAILS_UPDATE = "Details Updated 📝",
  BUDGET = "Budget added 📊",
  CLEAR = "Clean 🧹",
}

export const showToast = (type: keyof typeof ToastType) => {
  ToastAndroid.show(ToastType[type], ToastAndroid.SHORT);
};
export const showToastWithMsg = (msg: string) => {
  ToastAndroid.show(msg, ToastAndroid.SHORT);
};

const arrayOfFaces = [
  "🤡",
  "🐲",
  "🤪",
  "🙄",
  "😎",
  "🫠",
  "🥸",
  "🤖",
  "💩",
  "🐺",
  "🐷",
  "🥴",
  "🦄",
  "🐒",
  "🕷️",
  "👶🏻",
  "🧐",
  "👩🏻‍💻",
  "👾",
];
export const getRandomFaces = () => arrayOfFaces[Math.floor(Math.random() * arrayOfFaces.length)];

export const photoUpload = async (URL: string, fileName: string | null | undefined) => {
  const filename = fileName ?? URL.split("/").pop()!;
  const docuDir = FileSystem.documentDirectory + filename;
  await FileSystem.copyAsync({ from: URL, to: docuDir });
  return docuDir;
};
