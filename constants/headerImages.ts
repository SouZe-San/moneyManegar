import { ImageSourcePropType } from "react-native";

/**
 * Every screen whose banner the user can swap out.
 *
 * `fallback` holds the bundled asset via require() — it is the ONLY reference
 * to these files, which is what makes "reset to default" always possible.
 * A require() returns a number (asset id); a user image is { uri: string }.
 * Both are valid `ImageSourcePropType`, so <Image source> takes either.
 */
export type HeaderKey =
  | "expense"
  | "income"
  | "payble"
  | "contribute"
  | "budget"
  | "allTransaction"
  | "allStats"
  | "money";

export type HeaderMeta = {
  key: HeaderKey;
  label: string;
  hint: string;
  fallback: ImageSourcePropType;
};

export const HEADER_IMAGES: HeaderMeta[] = [
  {
    key: "money",
    label: "Wallet Hub",
    hint: "The Money tab banner",
    fallback: require("@/assets/images/hero/bg.jpg"),
  },
  {
    key: "allTransaction",
    label: "All Transactions",
    hint: "Your full transaction list",
    fallback: require("@/assets/images/temp/green.jpg"),
  },
  {
    key: "allStats",
    label: "Statistics",
    hint: "Charts and analysis",
    fallback: require("@/assets/images/temp/s2.webp"),
  },
  {
    key: "expense",
    label: "Add Expense",
    hint: "Money going out",
    fallback: require("@/assets/images/entries/expanse.gif"),
  },
  {
    key: "income",
    label: "Add Income",
    hint: "Money coming in",
    fallback: require("@/assets/images/entries/income.webp"),
  },
  {
    key: "payble",
    label: "Add Payable",
    hint: "What you owe",
    fallback: require("@/assets/images/entries/debt.webp"),
  },
  {
    key: "contribute",
    label: "Add Contribution",
    hint: "Group chip-ins",
    fallback: require("@/assets/images/entries/moneyGive.webp"),
  },
  {
    key: "budget",
    label: "Budget",
    hint: "Plan the month",
    fallback: require("@/assets/images/entries/mony.webp"),
  },
];

export const HEADER_FALLBACK: Record<HeaderKey, ImageSourcePropType> =
  HEADER_IMAGES.reduce(
    (acc, h) => {
      acc[h.key] = h.fallback;
      return acc;
    },
    {} as Record<HeaderKey, ImageSourcePropType>,
  );
