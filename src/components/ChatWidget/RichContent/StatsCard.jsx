import { memo } from "react";

const StatsCard = memo(({ stats, isDarkMode = true }) => (
  <div className="grid grid-cols-2 gap-2 sm:gap-3 my-2 sm:my-3">
    {stats.map((stat, index) => (
      <div
        key={index}
        className={`rounded-lg p-2.5 sm:p-3 md:p-4 border animate-fade-in ${
          isDarkMode
            ? "bg-haiintel-dark/50 border-haiintel-border"
            : "bg-white border-gray-200 shadow-sm"
        }`}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-haiintel-blue mb-0.5 sm:mb-1">
          {stat.value}
        </div>
        <div
          className={`text-[10px] sm:text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {stat.label}
        </div>
      </div>
    ))}
  </div>
));

StatsCard.displayName = "StatsCard";

export default StatsCard;
