import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { CategorySummary } from "../../types";
import { CATEGORY_CONFIG, fmt } from "../../utils/constants";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: CategorySummary[];
}

export default function CategoryChart({ data }: Props) {
  if (!data.length)
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No data yet
      </div>
    );

  const chartData = {
    labels: data.map(
      (d) => `${CATEGORY_CONFIG[d.category]?.emoji} ${d.category}`,
    ),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: data.map((d) => CATEGORY_CONFIG[d.category]?.color),
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  return (
    <div>
      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          cutout: "65%",
          plugins: {
            legend: {
              position: "bottom",
              labels: { boxWidth: 12, padding: 16, font: { size: 12 } },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${fmt(ctx.raw as number)}`,
              },
            },
          },
        }}
      />
      {/* Legend with amounts */}
      <div className="mt-4 space-y-2">
        {data.map((d) => {
          const cfg = CATEGORY_CONFIG[d.category];
          return (
            <div
              key={d.category}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full`}
                  style={{ background: cfg?.color }}
                />
                <span className="text-gray-600">
                  {cfg?.emoji} {d.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xs">{d.count} items</span>
                <span className="font-semibold text-gray-800">
                  {fmt(d.total)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
