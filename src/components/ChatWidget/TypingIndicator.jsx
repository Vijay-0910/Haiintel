import { memo } from "react";

// CSS-only animation - no Framer Motion for better performance
const TypingIndicator = memo(({ isDarkMode = true }) => {
  return (
    <div
      className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4 animate-fade-in"
      role="status"
      aria-label="AI is typing"
    >
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-haiintel-blue to-haiintel-accent flex items-center justify-center shadow-intelligence">
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Typing dots - CSS animation */}
      <div
        className={`rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 transition-colors duration-200 ${
          isDarkMode ? "bg-haiintel-ai-msg" : "bg-gray-100"
        }`}
      >
        <div className="flex gap-1 sm:gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-bounce ${
                isDarkMode ? "bg-haiintel-text" : "bg-gray-500"
              }`}
              style={{ animationDelay: `${i * 0.15}s` }}
              aria-hidden="true"
            />
          ))}
        </div>
        <span className="sr-only">AI is typing a response</span>
      </div>
    </div>
  );
});

TypingIndicator.displayName = "TypingIndicator";

export default TypingIndicator;
