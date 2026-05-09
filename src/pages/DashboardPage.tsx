import { useEffect, useState } from "react";
import { expenseApi, budgetApi } from "../services/api";
import { ExpenseSummary, BudgetStatus, Expense } from "../types";
import { useAuthStore } from "../store/auth.store";
import StatCard from "../components/ui/StatCard";
import CategoryChart from "../components/charts/CategoryChart";
import BudgetBar from "../components/charts/BudgetBar";
import ExpenseTable from "../components/ui/ExpenseTable";
import { fmt } from "../utils/constants";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [month, setMonth] = useState<ExpenseSummary | null>(null);
  const [today, setToday] = useState<ExpenseSummary | null>(null);
  const [budget, setBudget] = useState<BudgetStatus | null>(null);
  const [recent, setRecent] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [monthData, todayData, budgetData, recentData] =
          await Promise.all([
            expenseApi.getMonth(),
            expenseApi.getToday(),
            budgetApi.getStatus(),
            expenseApi.getRecent(5),
          ]);
        setMonth(monthData.summary);
        setToday(todayData.summary);
        setBudget(budgetData);
        setRecent(recentData);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-3 animate-bounce">💸</div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Good {getGreeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's your spending overview
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Today's Spending"
          value={fmt(today?.totalAmount ?? 0)}
          icon="📅"
          sub={`${today?.count ?? 0} transactions`}
          color="bg-blue-50"
        />
        <StatCard
          label="This Month"
          value={fmt(month?.totalAmount ?? 0)}
          icon="📆"
          sub={`${month?.count ?? 0} transactions`}
          color="bg-purple-50"
        />
        <StatCard
          label="Budget Remaining"
          value={budget ? fmt(Math.max(0, budget.remaining)) : "—"}
          icon="💰"
          sub={budget ? `${budget.percentUsed}% used` : "No budget set"}
          color={budget?.isExceeded ? "bg-red-50" : "bg-green-50"}
        />
        <StatCard
          label="Top Category"
          value={month?.byCategory[0]?.category ?? "—"}
          icon={month?.byCategory[0] ? "🏆" : "📊"}
          sub={
            month?.byCategory[0] ? fmt(month.byCategory[0].total) : "No data"
          }
          color="bg-orange-50"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Category breakdown */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">
            This Month by Category
          </h2>
          <CategoryChart data={month?.byCategory ?? []} />
        </div>

        {/* Budget + recent */}
        <div className="space-y-4">
          {budget ? (
            <BudgetBar status={budget} />
          ) : (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <p className="text-gray-400 text-sm">No budget set</p>
              <p className="text-xs text-gray-300 mt-1">
                Go to Budget page or send /setbudget 10000 to your bot
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent expenses */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Recent Expenses</h2>
        </div>
        <ExpenseTable expenses={recent} />
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
