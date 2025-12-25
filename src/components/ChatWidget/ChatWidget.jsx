import { useState, lazy, Suspense, useCallback, memo } from "react";
import { AnimatePresence } from "framer-motion";
import ChatButton from "./ChatButton";
import ChatSkeleton from "./ChatSkeleton";
import { ErrorBoundary } from "../common";

// Lazy load ChatWindow
const ChatWindow = lazy(() =>
  import(/* webpackChunkName: "chat-window" */ "./ChatWindow")
);

// Error fallback component
const ChatErrorFallback = memo(({ isDarkMode, onClose }) => (
  <div
    className={`
      fixed z-[9999] flex flex-col items-center justify-center
      inset-0
      sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[380px] sm:h-[400px] sm:rounded-2xl
      border shadow-2xl animate-fade-in
      ${isDarkMode
        ? "bg-haiintel-darker border-haiintel-border"
        : "bg-white border-gray-200"
      }
    `}
  >
    <svg className="w-16 h-16 mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    <p className={`text-lg font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
      Chat unavailable
    </p>
    <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
      Something went wrong. Please try again.
    </p>
    <button
      onClick={onClose}
      className="px-6 py-2 bg-haiintel-blue text-white rounded-lg hover:bg-haiintel-blue/90 transition-colors duration-150"
    >
      Close
    </button>
  </div>
));
ChatErrorFallback.displayName = "ChatErrorFallback";

const ChatWidget = memo(({ isDarkMode = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <ChatButton onClick={toggleChat} isOpen={isOpen} isDarkMode={isDarkMode} />
      <AnimatePresence>
        {isOpen && (
          <ErrorBoundary
            isDarkMode={isDarkMode}
            fallback={<ChatErrorFallback isDarkMode={isDarkMode} onClose={closeChat} />}
          >
            <Suspense fallback={<ChatSkeleton isDarkMode={isDarkMode} />}>
              <ChatWindow onClose={closeChat} isDarkMode={isDarkMode} />
            </Suspense>
          </ErrorBoundary>
        )}
      </AnimatePresence>
    </>
  );
});

ChatWidget.displayName = "ChatWidget";

export default ChatWidget;
