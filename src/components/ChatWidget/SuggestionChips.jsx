import { memo, useCallback, useMemo } from "react";

// Memoized individual suggestion button
const SuggestionButton = memo(({ suggestion, isDarkMode, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(suggestion);
  }, [onClick, suggestion]);

  const buttonClass = useMemo(
    () =>
      `px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs md:text-sm rounded-full transition-all duration-150 border active:scale-95 hover:scale-[1.02] ${
        isDarkMode
          ? "text-haiintel-text bg-transparent border-haiintel-border hover:border-haiintel-blue hover:bg-haiintel-blue/10 active:bg-haiintel-blue/20"
          : "text-gray-700 bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100"
      }`,
    [isDarkMode]
  );

  return (
    <button onClick={handleClick} className={buttonClass}>
      {suggestion}
    </button>
  );
});
SuggestionButton.displayName = "SuggestionButton";

const SuggestionChips = memo(
  ({ suggestions, onSuggestionClick, isDarkMode = true }) => {
    if (!suggestions || suggestions.length === 0) return null;

    return (
      <div
        className="flex flex-wrap gap-1.5 sm:gap-2  ml-8 sm:ml-10 md:ml-11 pr-2 animate-fade-in"
        role="group"
        aria-label="Suggested questions"
      >
        {suggestions.map((suggestion, index) => (
          <SuggestionButton
            key={`${suggestion}-${index}`}
            suggestion={suggestion}
            isDarkMode={isDarkMode}
            onClick={onSuggestionClick}
          />
        ))}
      </div>
    );
  }
);

SuggestionChips.displayName = "SuggestionChips";

export default SuggestionChips;
