import { memo } from "react";

const BarChart = memo(({ data, isDarkMode = true }) => {
  const maxValue = Math.max(...data.values);

  return (
    <div
      className={`my-2 sm:my-3 rounded-lg p-2.5 sm:p-3 md:p-4 border ${
        isDarkMode
          ? "bg-haiintel-dark/50 border-haiintel-border"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <h4 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${isDarkMode ? "text-haiintel-text" : "text-gray-900"}`}>
        {data.title}
      </h4>
      <div className="space-y-2 sm:space-y-3">
        {data.labels.map((label, index) => {
          const value = data.values[index];
          const percentage = (value / maxValue) * 100;

          return (
            <div key={index}>
              <div className={`flex justify-between text-[10px] sm:text-xs mb-0.5 sm:mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                <span className="truncate mr-2">{label}</span>
                <span className="font-semibold text-haiintel-blue flex-shrink-0">{value}</span>
              </div>
              <div className="h-1.5 sm:h-2 bg-haiintel-border/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-haiintel-blue to-haiintel-accent rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

BarChart.displayName = "BarChart";

export default BarChart;
