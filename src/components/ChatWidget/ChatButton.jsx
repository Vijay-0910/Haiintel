import { memo, useCallback } from "react";
import AIIcon from "../common/AIIcon";

// Preload ChatWindow when user hovers over button
const preloadChatWindow = () => {
  import("./ChatWindow");
};

const ChatButton = memo(({ onClick, isOpen, isDarkMode = true }) => {
  const handleMouseEnter = useCallback(() => {
    preloadChatWindow();
  }, []);

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      aria-expanded={isOpen}
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "translateZ(0)",
      }}
      className={`
        fixed bottom-4 right-4 sm:bottom-6 sm:right-6
        z-[9999] p-3 sm:p-4
        rounded-full
        transition-all duration-300 ease-out
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
          isDarkMode
            ? "bg-transparent border-2 border-white hover:bg-white/10 focus:ring-white focus:ring-offset-haiintel-dark shadow-2xl"
            : "bg-black hover:bg-gray-900 focus:ring-black focus:ring-offset-white shadow-2xl"
        }
        ${isOpen ? "rotate-0" : ""}
      `}
    >
      <div className="relative w-10 h-10 sm:w-11 sm:h-11">
        {/* AI Chat icon */}
        <AIIcon
          className={`absolute inset-0 w-full h-full text-white transition-all duration-300 ${
            isOpen
              ? "opacity-0 rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
          aria-hidden="true"
        />

        {/* Close icon */}
        <svg
          className={`absolute inset-0 w-full h-full text-white transition-all duration-300 ${
            isOpen
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0"
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </button>
  );
});

ChatButton.displayName = "ChatButton";

export default ChatButton;
