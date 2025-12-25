import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ThinkingBlock = memo(
  ({ thinking, isThinking = false, isDarkMode = true }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = useCallback(() => {
      setIsExpanded((prev) => !prev);
    }, []);

    if (!thinking && !isThinking) return null;

    return (
      <div
        className={`mb-4 rounded-lg border overflow-hidden ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        {/* Header */}
        <button
          onClick={toggleExpanded}
          className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
            isDarkMode ? "hover:bg-gray-800/70" : "hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-2">
            {isThinking ? (
              // Animated thinking indicator
              <div className="flex items-center gap-1.5">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-haiintel-blue"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Thinking...
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-haiintel-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Thinking
                </span>
              </div>
            )}
          </div>

          <svg
            className={`w-4 h-4 transition-transform ${
              isExpanded ? "rotate-180" : ""
            } ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className={`px-4 py-3 text-sm border-t ${
                  isDarkMode
                    ? "text-gray-400 border-gray-700"
                    : "text-gray-600 border-gray-200"
                }`}
              >
                {isThinking ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse">
                      Analyzing your request...
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {thinking}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ThinkingBlock.displayName = "ThinkingBlock";

export default ThinkingBlock;
