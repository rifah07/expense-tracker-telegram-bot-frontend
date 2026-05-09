import { BudgetStatus } from "../../types";
import { fmt } from "../../utils/constants";

interface Props {
  status: BudgetStatus;
}

export default function BudgetBar({ status }: Props) {
  const pct = Math.min(status.percentUsed, 100);
  const color = status.isExceeded
    ? "bg-red-500"
    : status.isNearLimit
      ? "bg-yellow-400"
      : "bg-green-500";
  const label = status.isExceeded
    ? "🔴 Budget exceeded!"
    : status.isNearLimit
      ? "🟡 Near limit"
      : "🟢 On track";

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Monthly Budget</h3>
        <span className="text-sm text-gray-500">{label}</span>
      </div>

      {/* Bar */}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between mt-3 text-sm">
        <div>
          <p className="text-gray-400 text-xs">Spent</p>
          <p className="font-bold text-gray-800">{fmt(status.spent)}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">Used</p>
          <p className="font-bold text-gray-800">{status.percentUsed}%</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs">Limit</p>
          <p className="font-bold text-gray-800">
            {fmt(status.budget.monthlyLimit)}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between text-sm">
        <span className="text-gray-500">Remaining</span>
        <span
          className={`font-bold ${status.isExceeded ? "text-red-500" : "text-green-600"}`}
        >
          {fmt(Math.max(0, status.remaining))}
        </span>
      </div>
    </div>
  );
}
