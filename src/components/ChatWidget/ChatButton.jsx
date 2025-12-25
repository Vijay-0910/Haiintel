import { memo, useCallback } from "react";

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
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
      className={`
        fixed bottom-4 right-4 sm:bottom-6 sm:right-6
        z-50 p-3 sm:p-4
        rounded-full
        transition-all duration-300 ease-out
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-haiintel-blue focus:ring-offset-2
        ${
          isDarkMode
            ? "bg-haiintel-blue shadow-intelligence hover:shadow-warm focus:ring-offset-haiintel-dark"
            : "bg-haiintel-blue shadow-lg hover:shadow-xl focus:ring-offset-white"
        }
        ${isOpen ? "rotate-0" : ""}
      `}
    >
      <div className="relative w-6 h-6 sm:w-7 sm:h-7">
        {/* Chat icon */}
        <svg
          className={`absolute inset-0 w-full h-full text-white transition-all duration-300 ${
            isOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          }`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>

        {/* Close icon */}
        <svg
          className={`absolute inset-0 w-full h-full text-white transition-all duration-300 ${
            isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          }`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
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
