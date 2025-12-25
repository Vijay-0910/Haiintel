import { memo } from "react";

const SkeletonLoader = memo(({ isDarkMode = true }) => {
  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header Skeleton */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          isDarkMode ? "border-haiintel-border" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full animate-pulse ${
              isDarkMode ? "bg-haiintel-border" : "bg-gray-200"
            }`}
          />
          <div className="space-y-2">
            <div
              className={`h-3 w-24 rounded animate-pulse ${
                isDarkMode ? "bg-haiintel-border" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-2 w-16 rounded animate-pulse ${
                isDarkMode ? "bg-haiintel-border/70" : "bg-gray-200"
              }`}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg animate-pulse ${
              isDarkMode ? "bg-haiintel-border" : "bg-gray-200"
            }`}
          />
          <div
            className={`w-8 h-8 rounded-lg animate-pulse ${
              isDarkMode ? "bg-haiintel-border" : "bg-gray-200"
            }`}
          />
        </div>
      </div>

      {/* Messages Area Skeleton */}
      <div className="flex-1 overflow-hidden px-4 py-6">
        <div className="w-full max-w-3xl mx-auto space-y-6">
          {/* Welcome Message Skeleton */}
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-full animate-pulse flex-shrink-0 ${
                isDarkMode ? "bg-haiintel-border" : "bg-gray-200"
              }`}
            />
            <div className="flex-1 space-y-3">
              <div
                className={`h-4 w-3/4 rounded animate-pulse ${
                  isDarkMode ? "bg-haiintel-border" : "bg-gray-200"
                }`}
              />
              <div
                className={`h-4 w-full rounded animate-pulse ${
                  isDarkMode ? "bg-haiintel-border" : "bg-gray-200"
                }`}
              />
              <div
                className={`h-4 w-2/3 rounded animate-pulse ${
                  isDarkMode ? "bg-haiintel-border" : "bg-gray-200"
                }`}
              />
            </div>
          </div>

          {/* Suggestion Chips Skeleton */}
          <div className="grid grid-cols-2 gap-2 max-w-xl">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-16 rounded-lg animate-pulse ${
                  isDarkMode ? "bg-haiintel-border" : "bg-gray-200"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Input Area Skeleton */}
      <div
        className={`px-4 py-3 border-t ${
          isDarkMode ? "border-haiintel-border" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`flex-1 h-12 rounded-xl animate-pulse ${
              isDarkMode ? "bg-haiintel-border" : "bg-gray-200"
            }`}
          />
          <div
            className={`w-12 h-12 rounded-xl animate-pulse ${
              isDarkMode ? "bg-haiintel-border" : "bg-gray-200"
            }`}
          />
        </div>
      </div>
    </div>
  );
});

SkeletonLoader.displayName = "SkeletonLoader";

export default SkeletonLoader;
