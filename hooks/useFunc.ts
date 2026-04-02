import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import { BottomSheetRefProps } from "@/components/BottomSheetView";
import * as Sharing from "expo-sharing";
import { type SQLiteDatabase } from "expo-sqlite";

import JSZip from "jszip";

export const openBottomSheetModal = (
  ref: React.RefObject<BottomSheetRefProps>,
  setOpenedItem: React.Dispatch<React.SetStateAction<boolean>>,
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
import {
  fetchAllGroup,
  fetchAllMember,
  fetchAllTransaction,
  fetchAllUnPaidTransaction,
} from "./useQueries";

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
export const getRandomFaces = () =>
  arrayOfFaces[Math.floor(Math.random() * arrayOfFaces.length)];

export const photoUpload = async (
  URL: string,
  fileName: string | null | undefined,
) => {
  const filename = fileName ?? URL.split("/").pop()!;
  const docuDir = FileSystem.documentDirectory + filename;
  await FileSystem.copyAsync({ from: URL, to: docuDir });
  return docuDir;
};

// 1. Helper function to convert JSON/Array data to CSV format
const convertToCSV = (data: any) => {
  if (!data || data.length === 0) return "";

  // Get the headers (keys of the first object)
  const headers = Object.keys(data[0]).join(",");

  // Map over the rows
  const rows = data.map((row: any) => {
    return Object.values(row)
      .map((val) => {
        // Handle null/undefined
        if (val === null || val === undefined) return '""';

        // Convert to string and escape any existing double quotes
        const stringVal = String(val).replace(/"/g, '""');

        // Wrap every value in quotes to handle commas safely (e.g., an expense note like "Groceries, Milk")
        return `"${stringVal}"`;
      })
      .join(",");
  });

  // Combine headers and rows with newlines
  return [headers, ...rows].join("\n");
};

// 2. Main Export Function
export const exportExpensesToCSV = async (
  db: SQLiteDatabase,
  setProgress: (num: number) => void,
) => {
  try {
    setProgress(5);
    // A. Fetch your data from SQLite (Replace this with your actual DB query)
    const allExpenses = await fetchAllTransaction(db);
    const allUdhar = await fetchAllUnPaidTransaction(db);
    const allMember = await fetchAllMember(db);
    const allGroups = await fetchAllGroup(db);
    if (
      allExpenses.length === 0 &&
      allUdhar.length === 0 &&
      allMember.length === 0 &&
      allGroups.length === 0
    ) {
      alert("No data found to export!");
      return;
    }

    setProgress(20);
    // B. Convert data to CSV string
    const csvString_allExpense = convertToCSV(allExpenses);
    const csvString_allUdhar = convertToCSV(allUdhar);
    const csvString_allMember = convertToCSV(allMember);
    const csvString_allGroups = convertToCSV(allGroups);

    setProgress(40);

    // C. Initialize JSZip and add the CSV strings as files
    const zip = new JSZip();

    // You can name the files inside the zip whatever you like
    if (csvString_allExpense) zip.file("MM_Expenses.csv", csvString_allExpense);
    if (csvString_allUdhar) zip.file("MM_Udhar.csv", csvString_allUdhar);
    if (csvString_allMember) zip.file("MM_Members.csv", csvString_allMember);
    if (csvString_allGroups) zip.file("MM_Groups.csv", csvString_allGroups);

    setProgress(60);
    // D. Generate the zip file as a Base64 string
    const zipBase64 = await zip.generateAsync({ type: "base64" });

    setProgress(80);

    // E. Define the zip file path in the app's local document directory
    const zipFileName = `MM_Backup_${new Date().getTime()}.zip`;
    const fileUri = `${FileSystem.documentDirectory}${zipFileName}`;

    // F. Write the Base64 zip string to the device file system
    await FileSystem.writeAsStringAsync(fileUri, zipBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    setProgress(100);

    // G. Share the ZIP file
    const isSharingAvailable = await Sharing.isAvailableAsync();

    if (isSharingAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/zip",
        dialogTitle: "Export Database Archive",
        UTI: "public.zip-archive", // iOS specific
      });
    } else {
      alert("Sharing is not available on this device.");
    }
  } catch (error) {
    console.error("Error exporting data:", error);
    alert("An error occurred while exporting data.");
  }
};
