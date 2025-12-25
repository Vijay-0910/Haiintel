import { memo } from "react";

const DetailCard = memo(({ details, isDarkMode = true }) => (
  <div className="my-2 sm:my-3 space-y-1.5 sm:space-y-2">
    {details.map((detail, index) => (
      <div
        key={index}
        className={`rounded-lg p-2 sm:p-2.5 md:p-3 border animate-fade-in ${
          isDarkMode
            ? "bg-haiintel-dark/50 border-haiintel-border"
            : "bg-white border-gray-200 shadow-sm"
        }`}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="flex items-start gap-2 sm:gap-3">
          {detail.icon && (
            <div
              className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${
                isDarkMode ? "bg-haiintel-blue/20" : "bg-haiintel-blue/10"
              }`}
            >
              <span className="text-sm sm:text-base md:text-lg">{detail.icon}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h5 className={`text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1 ${isDarkMode ? "text-haiintel-text" : "text-gray-900"}`}>
              {detail.title}
            </h5>
            <p className={`text-[10px] sm:text-xs leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {detail.description}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
));

DetailCard.displayName = "DetailCard";

export default DetailCard;
