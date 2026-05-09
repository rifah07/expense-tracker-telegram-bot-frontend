import { useEffect, useState } from "react";
import { expenseApi } from "../services/api";
import { Expense, ExpenseSummary } from "../types";
import ExpenseTable from "../components/ui/ExpenseTable";
import CategoryChart from "../components/charts/CategoryChart";
import { fmt } from "../utils/constants";

type Tab = "today" | "week" | "month";

export default function ExpensesPage() {
  const [tab, setTab] = useState<Tab>("month");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(t: Tab) {
    setLoading(true);
    try {
      const fetcher = {
        today: expenseApi.getToday,
        week: expenseApi.getWeek,
        month: expenseApi.getMonth,
      }[t];
      const data = await fetcher();
      setExpenses(data.expenses);
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(tab);
  }, [tab]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await expenseApi.delete(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      setSummary((prev) =>
        prev
          ? {
              ...prev,
              count: prev.count - 1,
              totalAmount:
                prev.totalAmount -
                (expenses.find((e) => e.id === id)?.amount ?? 0),
            }
          : prev,
      );
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <p className="text-gray-500 text-sm mt-1">
          View and manage your spending
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <div className="animate-bounce text-3xl mb-3">💸</div>
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">
                {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
              </h2>
              {summary && (
                <span className="text-lg font-bold text-gray-900">
                  {fmt(summary.totalAmount)}
                </span>
              )}
            </div>
            <ExpenseTable expenses={expenses} onDelete={handleDelete} />
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4">By Category</h2>
            <CategoryChart data={summary?.byCategory ?? []} />
          </div>
        </div>
      )}
    </div>
  );
}
