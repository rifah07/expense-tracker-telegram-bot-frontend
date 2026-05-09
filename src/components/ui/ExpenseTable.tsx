import { Expense } from "../../types";
import { CATEGORY_CONFIG, fmt, fmtDate } from "../../utils/constants";

interface Props {
  expenses: Expense[];
  onDelete?: (id: string) => void;
}

export default function ExpenseTable({ expenses, onDelete }: Props) {
  if (!expenses.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-3">💸</p>
        <p className="font-medium">No expenses yet</p>
        <p className="text-sm mt-1">
          Send a message to your Telegram bot to add one
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">
              Category
            </th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">
              Note
            </th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">
              Date
            </th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">
              Amount
            </th>
            {onDelete && <th className="py-3 px-4" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {expenses.map((e) => {
            const cfg = CATEGORY_CONFIG[e.category];
            return (
              <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg?.bg ?? "bg-gray-100"}`}
                    style={{ color: cfg?.color }}
                  >
                    {cfg?.emoji} {e.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">{e.note}</td>
                <td className="py-3 px-4 text-gray-400">{fmtDate(e.date)}</td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900">
                  {fmt(e.amount)}
                </td>
                {onDelete && (
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDelete(e.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors text-base leading-none"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
