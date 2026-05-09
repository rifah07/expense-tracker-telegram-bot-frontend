import { ExpenseCategory } from "../types";

export const CATEGORY_CONFIG: Record<
  ExpenseCategory,
  { emoji: string; color: string; bg: string }
> = {
  Food: { emoji: "🍔", color: "#f97316", bg: "bg-orange-100" },
  Transport: { emoji: "🚗", color: "#3b82f6", bg: "bg-blue-100" },
  Shopping: { emoji: "🛍️", color: "#a855f7", bg: "bg-purple-100" },
  Bills: { emoji: "💡", color: "#eab308", bg: "bg-yellow-100" },
  Health: { emoji: "💊", color: "#22c55e", bg: "bg-green-100" },
  Entertainment: { emoji: "🎬", color: "#ec4899", bg: "bg-pink-100" },
  Others: { emoji: "📦", color: "#6b7280", bg: "bg-gray-100" },
};

export const CHART_COLORS = Object.values(CATEGORY_CONFIG).map((c) => c.color);

export const fmt = (n: number) =>
  `৳${n.toLocaleString("en-BD", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
