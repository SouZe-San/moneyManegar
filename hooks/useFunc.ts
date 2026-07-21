import * as FileSystem from "expo-file-system";
import { BottomSheetRefProps } from "@/components/BottomSheetView";
import * as Sharing from "expo-sharing";
import { type SQLiteDatabase } from "expo-sqlite";
import * as DocumentPicker from "expo-document-picker";
import JSZip from "jszip";

export const openBottomSheetModal = (
  ref: React.RefObject<BottomSheetRefProps>,
  setOpenedItem: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setOpenedItem(true);
};

import { ToastAndroid } from "react-native";
import {
  fetchAllGroup,
  fetchAllMember,
  fetchAllTransaction,
  fetchAllUnPaidTransaction,
  fetchAllBudgetsRaw,
  fetchAll_Group_Member,
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
  BUDGET_DELETE = "Budget Deleted ❌",
  CLEAR = "Clean 🧹",
}

export const showToast = (type: keyof typeof ToastType) => {
  ToastAndroid.show(ToastType[type], ToastAndroid.SHORT);
};
export const showToastWithMsg = (msg: string) => {
  ToastAndroid.show(msg, ToastAndroid.SHORT);
};

const arrayOfFaces = [
  "🐻",
  "🐲",
  "🐱",
  "🦊",
  "🐶",
  "🐞",
  "🐬",
  "🤖",
  "💩",
  "🐺",
  "🐷",
  "🐼",
  "🦄",
  "🐒",
  "🕷️",
  "🐯",
  "🐮",
  "🐸",
  "🦢",
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
    const allBudgets = await fetchAllBudgetsRaw(db);
    const allGroupMembers = await fetchAll_Group_Member(db);
    if (
      allExpenses.length === 0 &&
      allUdhar.length === 0 &&
      allMember.length === 0 &&
      allGroups.length === 0 &&
      allBudgets.length === 0 &&
      allGroupMembers.length === 0
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
    const csvString_allBudgets = convertToCSV(allBudgets);
    const csvString_allGroupMembers = convertToCSV(allGroupMembers);

    setProgress(40);

    // C. Initialize JSZip and add the CSV strings as files
    const zip = new JSZip();

    // You can name the files inside the zip whatever you like
    if (csvString_allExpense) zip.file("MM_Expenses.csv", csvString_allExpense);
    if (csvString_allUdhar) zip.file("MM_Udhar.csv", csvString_allUdhar);
    if (csvString_allMember) zip.file("MM_Members.csv", csvString_allMember);
    if (csvString_allGroups) zip.file("MM_Groups.csv", csvString_allGroups);
    if (csvString_allBudgets) zip.file("MM_Budgets.csv", csvString_allBudgets);
    if (csvString_allGroupMembers)
      zip.file("MM_GroupMembers.csv", csvString_allGroupMembers);

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

// ---- CSV parsing (reverses convertToCSV) ----
const parseCSV = (text: string): Record<string, string>[] => {
  const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } // escaped ""
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  if (rows.length === 0) return [];

  const headers = rows[0];
  return rows
    .slice(1)
    .filter((r) => r.length === headers.length && r.some((v) => v !== ""))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
};

const num = (v?: string) => {
  const n = parseFloat(v ?? "");
  return isNaN(n) ? 0 : n;
};
const orNull = (v?: string) => (v == null || v === "" ? null : v);

export type ImportSummary = {
  expenses: number;
  udhar: number;
  members: number;
  groups: number;
  budgets: number;
  groupMembers: number;
  skipped: number;
};

// ---- Main import function ----
export const importDataFromZip = async (
  db: SQLiteDatabase,
  setProgress: (n: number) => void,
): Promise<ImportSummary | null> => {
  setProgress(0);

  // A. Pick the backup zip
  const picked = await DocumentPicker.getDocumentAsync({
    // some Android file providers report zips as octet-stream, so allow a fallback
    type: ["application/zip", "application/octet-stream", "*/*"],
    copyToCacheDirectory: true, // required so FileSystem can read a content:// uri
    multiple: false,
  });
  if (picked.canceled || !picked.assets?.length) return null; // user cancelled

  // B. Read + unzip
  const base64 = await FileSystem.readAsStringAsync(picked.assets[0].uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const zip = await JSZip.loadAsync(base64, { base64: true });
  setProgress(35);

  const readCsv = async (name: string) => {
    const f = zip.file(name);
    return f ? parseCSV(await f.async("string")) : [];
  };

  const expenses = await readCsv("MM_Expenses.csv");
  const udhar = await readCsv("MM_Udhar.csv");
  const members = await readCsv("MM_Members.csv");
  const groups = await readCsv("MM_Groups.csv");
  const budgets = await readCsv("MM_Budgets.csv");
  const groupMembers = await readCsv("MM_GroupMembers.csv");
  setProgress(55);

  const summary: ImportSummary = {
    expenses: 0,
    udhar: 0,
    members: 0,
    groups: 0,
    budgets: 0,
    groupMembers: 0,
    skipped: 0,
  };

  // Group_Member stores real _id values, but OR IGNORE means rows get NEW ids
  // on this device (or match an existing row). Without remapping, restored
  // groups would point at the wrong people. old _id -> id on this device.
  const memberIdMap = new Map<string, number>();
  const groupIdMap = new Map<string, number>();

  // C. Insert. One transaction = fast + safe. Per-row try/catch so one bad
  //    row (constraint violation) is skipped instead of aborting everything.
  await db.withTransactionAsync(async () => {
    for (const m of members) {
      try {
        // UNIQUE(userName) -> OR IGNORE skips members you already have
        const r = await db.runAsync(
          "INSERT OR IGNORE INTO MemberTable (userName, owedAmount, dueAmount, userId, imgUrl) VALUES (?,?,?,?,?)",
          [
            orNull(m.userName),
            num(m.owedAmount),
            num(m.dueAmount),
            orNull(m.userId),
            orNull(m.imgUrl),
          ],
        );
        let newId: number | null = null;
        if (r.changes > 0) {
          newId = r.lastInsertRowId;
          summary.members++;
        } else {
          // already present (UNIQUE userName) — reuse the existing row's id
          const found = await db.getFirstAsync<{ _id: number }>(
            "SELECT _id FROM MemberTable WHERE userName = ?",
            [orNull(m.userName)],
          );
          newId = found?._id ?? null;
          summary.skipped++;
        }
        if (m._id && newId) memberIdMap.set(String(m._id), newId);
      } catch {
        summary.skipped++;
      }
    }

    for (const g of groups) {
      try {
        // UNIQUE(name) -> OR IGNORE
        const r = await db.runAsync(
          "INSERT OR IGNORE INTO GroupTable (name, logo, imgUrl) VALUES (?,?,?)",
          [orNull(g.name), orNull(g.logo), orNull(g.imgUrl)],
        );
        let newId: number | null = null;
        if (r.changes > 0) {
          newId = r.lastInsertRowId;
          summary.groups++;
        } else {
          const found = await db.getFirstAsync<{ _id: number }>(
            "SELECT _id FROM GroupTable WHERE name = ?",
            [orNull(g.name)],
          );
          newId = found?._id ?? null;
          summary.skipped++;
        }
        if (g._id && newId) groupIdMap.set(String(g._id), newId);
      } catch {
        summary.skipped++;
      }
    }

    // group <-> member links, using the remapped ids
    for (const gm of groupMembers) {
      try {
        const gid = groupIdMap.get(String(gm.groupId));
        const mid = memberIdMap.get(String(gm.memberId));
        if (!gid || !mid) {
          summary.skipped++;
          continue;
        }
        const r = await db.runAsync(
          "INSERT OR IGNORE INTO Group_Member (groupId, memberId) VALUES (?,?)",
          [gid, mid],
        );
        r.changes > 0 ? summary.groupMembers++ : summary.skipped++;
      } catch {
        summary.skipped++;
      }
    }

    // budgets — no UNIQUE on date, so de-dupe by month or a re-import doubles them
    for (const b of budgets) {
      try {
        const exists = await db.getFirstAsync<{ _id: number }>(
          "SELECT _id FROM BudgetTable WHERE date = ?",
          [orNull(b.date)],
        );
        if (exists) {
          summary.skipped++;
          continue;
        }
        await db.runAsync(
          "INSERT INTO BudgetTable (amount, date) VALUES (?,?)",
          [num(b.amount), orNull(b.date)],
        );
        summary.budgets++;
      } catch {
        summary.skipped++;
      }
    }

    for (const t of expenses) {
      try {
        await db.runAsync(
          "INSERT INTO AllTransactions (amount, type, expenseType, date, toWhom, expanseDesc, memberId) VALUES (?,?,?,?,?,?,?)",
          [
            num(t.amount),
            orNull(t.type),
            orNull(t.expenseType) ?? "Others",
            orNull(t.date),
            orNull(t.toWhom) ?? "Own",
            orNull(t.expanseDesc) ?? "",
            orNull(t.memberId),
          ],
        );
        summary.expenses++;
      } catch {
        summary.skipped++;
      }
    }

    for (const u of udhar) {
      try {
        await db.runAsync(
          "INSERT INTO UdharTransactions (amount, type, expenseType, date, toWhom, expanseDesc, memberId) VALUES (?,?,?,?,?,?,?)",
          [
            num(u.amount),
            orNull(u.type),
            orNull(u.expenseType),
            orNull(u.date),
            orNull(u.toWhom),
            orNull(u.expanseDesc) ?? "",
            orNull(u.memberId),
          ],
        );
        summary.udhar++;
      } catch {
        summary.skipped++;
      }
    }
  });

  setProgress(100);
  return summary;
};
