import { memo, useMemo } from "react";

// Memoized Icons
const TrashIcon = memo(() => (
  <svg
    className="w-full h-full"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
));
TrashIcon.displayName = "TrashIcon";

const CloseIcon = memo(() => (
  <svg
    className="w-full h-full"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
));
CloseIcon.displayName = "CloseIcon";

// Header Button Component - Memoized
const HeaderButton = memo(({ children, onClick, isDarkMode, title }) => {
  const buttonClassName = useMemo(
    () => `
    p-1.5 sm:p-2 rounded-lg transition-colors active:scale-95
    ${
      isDarkMode
        ? "hover:bg-haiintel-border active:bg-haiintel-border"
        : "hover:bg-gray-200 active:bg-gray-300"
    }
  `,
    [isDarkMode]
  );

  const iconClassName = useMemo(
    () => `
    w-4 h-4 sm:w-5 sm:h-5 block transition-colors duration-300
    ${isDarkMode ? "text-gray-400" : "text-gray-500"}
  `,
    [isDarkMode]
  );

  return (
    <button onClick={onClick} className={buttonClassName} title={title}>
      <span className={iconClassName}>{children}</span>
    </button>
  );
});
HeaderButton.displayName = "HeaderButton";

const ChatHeader = memo(({ isDarkMode, onClearChat, onClose }) => {
  // Memoized class names
  const containerClassName = useMemo(
    () => `
    flex items-center justify-between px-3 py-2.5 
    sm:px-4 sm:py-3 
    border-b backdrop-blur-sm transition-colors duration-300 flex-shrink-0
    ${
      isDarkMode
        ? "border-haiintel-border bg-haiintel-dark/50"
        : "border-gray-200 bg-gray-50/80"
    }
  `,
    [isDarkMode]
  );

  const logoClassName = useMemo(
    () => `
    w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 object-contain flex-shrink-0
    ${!isDarkMode ? "invert" : ""}
  `,
    [isDarkMode]
  );

  const titleClassName = useMemo(
    () => `
    font-semibold text-sm sm:text-base truncate transition-colors duration-300
    ${isDarkMode ? "text-haiintel-text" : "text-gray-900"}
  `,
    [isDarkMode]
  );

  const subtitleClassName = useMemo(
    () => `
    text-[10px] sm:text-xs transition-colors duration-300
    ${isDarkMode ? "text-gray-400" : "text-gray-500"}
  `,
    [isDarkMode]
  );

  return (
    <div className={containerClassName}>
      {/* Logo & Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <img
          src="/logo.svg"
          alt="HaiIntel Logo"
          className={logoClassName}
          loading="eager"
        />
        <div className="min-w-0">
          <h3 className={titleClassName}>HaiIntel Assistant</h3>
          <p className={subtitleClassName}>Always here to help</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <HeaderButton
          onClick={onClearChat}
          isDarkMode={isDarkMode}
          title="Clear chat"
        >
          <TrashIcon />
        </HeaderButton>
        <HeaderButton onClick={onClose} isDarkMode={isDarkMode}>
          <CloseIcon />
        </HeaderButton>
      </div>
    </div>
  );
});

ChatHeader.displayName = "ChatHeader";

export default ChatHeader;
