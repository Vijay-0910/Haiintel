import { memo } from "react";

const ChatContentSkeleton = memo(({ isDarkMode = true }) => {
  return (
    <div
      className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide p-4 ${
        isDarkMode ? "bg-haiintel-darker" : "bg-white"
      }`}
    >
      <div className="w-full max-w-3xl mx-auto space-y-4 animate-pulse">
        {/* User message skeleton 1 */}
        <div className="flex justify-end gap-2">
          <div className="space-y-2 max-w-[80%]">
            <div
              className={`h-16 w-64 rounded-2xl ${
                isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
              }`}
            />
          </div>
          <div
            className={`w-8 h-8 rounded-full flex-shrink-0 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
          />
        </div>

        {/* AI message skeleton 1 */}
        <div className="flex justify-start gap-2">
          <div
            className={`w-8 h-8 rounded-full flex-shrink-0 ${
              isDarkMode ? "bg-blue-600/40" : "bg-blue-200"
            }`}
          />
          <div className="space-y-2 flex-1 max-w-[85%]">
            <div
              className={`h-20 w-full rounded-2xl ${
                isDarkMode ? "bg-gray-700/50" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-16 w-5/6 rounded-2xl ${
                isDarkMode ? "bg-gray-700/50" : "bg-gray-200"
              }`}
            />
          </div>
        </div>

        {/* User message skeleton 2 */}
        <div className="flex justify-end gap-2">
          <div className="space-y-2 max-w-[80%]">
            <div
              className={`h-12 w-48 rounded-2xl ${
                isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
              }`}
            />
          </div>
          <div
            className={`w-8 h-8 rounded-full flex-shrink-0 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
          />
        </div>

        {/* AI message skeleton 2 */}
        <div className="flex justify-start gap-2">
          <div
            className={`w-8 h-8 rounded-full flex-shrink-0 ${
              isDarkMode ? "bg-blue-600/40" : "bg-blue-200"
            }`}
          />
          <div className="space-y-2 flex-1 max-w-[85%]">
            <div
              className={`h-24 w-full rounded-2xl ${
                isDarkMode ? "bg-gray-700/50" : "bg-gray-200"
              }`}
            />
          </div>
        </div>

        {/* User message skeleton 3 */}
        <div className="flex justify-end gap-2">
          <div className="space-y-2 max-w-[80%]">
            <div
              className={`h-14 w-56 rounded-2xl ${
                isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
              }`}
            />
          </div>
          <div
            className={`w-8 h-8 rounded-full flex-shrink-0 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
          />
        </div>

        {/* AI message skeleton 3 (typing) */}
        <div className="flex justify-start gap-2">
          <div
            className={`w-8 h-8 rounded-full flex-shrink-0 ${
              isDarkMode ? "bg-blue-600/40" : "bg-blue-200"
            }`}
          />
          <div className="space-y-2 flex-1 max-w-[85%]">
            <div
              className={`h-16 w-3/4 rounded-2xl ${
                isDarkMode ? "bg-gray-700/50" : "bg-gray-200"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

ChatContentSkeleton.displayName = "ChatContentSkeleton";

export default ChatContentSkeleton;
