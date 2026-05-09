import { useEffect, useState } from "react";
import { budgetApi } from "../services/api";
import { BudgetStatus } from "../types";
import BudgetBar from "../components/charts/BudgetBar";
import { fmt } from "../utils/constants";

export default function BudgetPage() {
  const [status, setStatus] = useState<BudgetStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [limit, setLimit] = useState("");
  const [alert, setAlert] = useState("80");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    budgetApi
      .getStatus()
      .then((data) => {
        setStatus(data);
        if (data) {
          setLimit(String(data.budget.monthlyLimit));
          setAlert(String(data.budget.alertPercent));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const l = parseFloat(limit);
    const a = parseInt(alert);
    if (isNaN(l) || l <= 0) {
      setMsg("Please enter a valid amount");
      return;
    }
    if (isNaN(a) || a < 1 || a > 100) {
      setMsg("Alert percent must be 1–100");
      return;
    }

    setSaving(true);
    setMsg("");
    try {
      const updated = await budgetApi.setBudget(l, a);
      setStatus(updated as unknown as BudgetStatus);
      setMsg("✅ Budget saved!");
      // Reload status
      const fresh = await budgetApi.getStatus();
      setStatus(fresh);
    } catch {
      setMsg("❌ Failed to save budget. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        <div className="animate-bounce text-3xl">💰</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
        <p className="text-gray-500 text-sm mt-1">
          Set your monthly spending limit
        </p>
      </div>

      {/* Current status */}
      {status && (
        <div className="mb-6">
          <BudgetBar status={status} />
        </div>
      )}

      {/* Set budget form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-5">
          {status ? "Update Budget" : "Set Your Budget"}
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Monthly Limit (৳)
            </label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="e.g. 10000"
              min="1"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Alert at (%)
            </label>
            <input
              type="number"
              value={alert}
              onChange={(e) => setAlert(e.target.value)}
              placeholder="80"
              min="1"
              max="100"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">
              You'll get a Telegram alert when you reach this % of your budget
            </p>
          </div>

          {msg && (
            <div
              className={`text-sm px-4 py-3 rounded-xl ${
                msg.startsWith("✅")
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-600 border border-red-100"
              }`}
            >
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {saving ? "Saving..." : status ? "Update Budget" : "Set Budget"}
          </button>
        </form>
      </div>

      {/* Info box */}
      <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
        <p className="font-medium mb-1">💡 Tip</p>
        <p className="text-blue-600 text-xs leading-relaxed">
          You can also set your budget directly in Telegram by sending{" "}
          <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">
            /setbudget {limit || "10000"}
          </span>{" "}
          to the bot.
        </p>
      </div>

      {/* Monthly quick stats */}
      {status && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            {
              label: "Daily avg needed",
              value: fmt(
                Math.max(0, status.remaining) / Math.max(1, daysLeft()),
              ),
            },
            { label: "Days left", value: String(daysLeft()) },
            {
              label: "Avg per day so far",
              value: fmt(status.spent / Math.max(1, daysPassed())),
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center"
            >
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="font-bold text-gray-800 mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function daysLeft() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return end.getDate() - now.getDate();
}

function daysPassed() {
  return new Date().getDate();
}
