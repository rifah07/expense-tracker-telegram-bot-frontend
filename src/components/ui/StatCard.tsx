interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  sub?: string;
  color?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  sub,
  color = "bg-blue-50",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div
          className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center text-xl`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
