import { useThemeColorWithName } from "@/hooks/useThemeColor";

export type BudgetStatus = "safe" | "warning" | "over";

export type BudgetStat = {
  /** spent, clamped at 0 (the query nets income out, so it can go negative) */
  spent: number;
  budget: number;
  /** 0..n ratio of spent/budget (0 when no budget set) */
  ratio: number;
  /** whole-number percent, e.g. 254 */
  percent: number;
  /** ratio clamped to 0..1 — use this for bar widths */
  fill: number;
  status: BudgetStatus;
  isOver: boolean;
  /** money still available (0 when over) */
  remaining: number;
  /** amount past the budget (0 when within) */
  overBy: number;
};

/**
 * Single source of truth for "how is this month doing".
 * Pure + theme-agnostic so both the summary card and the list card agree.
 */
export const getBudgetStatus = (
  totalExpense: number,
  budgetAmount: number,
): BudgetStat => {
  const spent = Math.max(0, Number(totalExpense) || 0);
  const budget = Math.max(0, Number(budgetAmount) || 0);

  const ratio = budget > 0 ? spent / budget : 0;
  const status: BudgetStatus =
    budget > 0 && ratio > 1 ? "over" : ratio >= 0.75 ? "warning" : "safe";

  return {
    spent,
    budget,
    ratio,
    percent: Math.round(ratio * 100),
    fill: Math.min(1, Math.max(0, ratio)),
    status,
    isOver: status === "over",
    remaining: Math.max(0, budget - spent),
    overBy: Math.max(0, spent - budget),
  };
};

/** Short human label for the status pill. */
export const budgetStatusLabel = (status: BudgetStatus) =>
  status === "over"
    ? "Over budget"
    : status === "warning"
      ? "Careful"
      : "On track";

/** Maps a status to a theme colour. Keeps colour choices in one place. */
export const useBudgetStatusColor = (status: BudgetStatus) => {
  const income = useThemeColorWithName("income");
  const expense = useThemeColorWithName("expense");
  // amber sits between the two; matches the Shopping swatch in ColorMapping
  const warning = "#FBBF24";

  return status === "over" ? expense : status === "warning" ? warning : income;
};
