import { useEffect, useRef, memo, useCallback, useMemo } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import SuggestionChips from "./SuggestionChips";

const ChatMessages = memo(
  ({
    messages,
    streamingMessageId,
    isTyping,
    suggestions,
    helperChips = [],
    isDarkMode,
    onSuggestionClick,
    onRegenerate,
    onRetry,
    onOpenArtifacts,
  }) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const scrollingRef = useRef(false);

    // Optimized scroll to bottom - instant for better performance
    const scrollToBottom = useCallback(() => {
      if (scrollingRef.current) return;
      scrollingRef.current = true;

      requestAnimationFrame(() => {
        if (messagesEndRef.current && containerRef.current) {
          // Use scrollTop for instant, performant scrolling
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
        scrollingRef.current = false;
      });
    }, []);

    // Scroll to bottom on initial mount
    useEffect(() => {
      // Use a slight delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }, [scrollToBottom]);

    // Auto-scroll when messages change
    useEffect(() => {
      scrollToBottom();
    }, [messages.length, isTyping, scrollToBottom]);

    // Continuous auto-scroll during streaming - runs on every animation frame
    useEffect(() => {
      if (!streamingMessageId) return;

      let rafId;
      const keepScrolling = () => {
        if (containerRef.current) {
          // Always scroll to absolute bottom while streaming
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
        rafId = requestAnimationFrame(keepScrolling);
      };

      rafId = requestAnimationFrame(keepScrolling);

      return () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    }, [streamingMessageId]);

    // Also scroll whenever messages array updates (catches text changes)
    useEffect(() => {
      if (streamingMessageId && containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, [messages, streamingMessageId]);

    // Memoize container class to prevent recalculation - Claude-style
    const containerClass = useMemo(
      () =>
        `flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide transition-colors duration-200 ${
          isDarkMode ? "bg-haiintel-darker" : "bg-white"
        }`,
      [isDarkMode]
    );

    // Memoize visible messages - for potential virtualization
    const renderedMessages = useMemo(() => {
      // If too many messages, only render last 50 for performance
      const visibleMessages =
        messages.length > 50 ? messages.slice(-50) : messages;

      return visibleMessages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isStreaming={message.id === streamingMessageId}
          isDarkMode={isDarkMode}
          onRegenerate={
            message.role === "assistant" ? () => onRegenerate(message.id) : null
          }
          onRetry={message.error ? () => onRetry(message.id) : null}
          onOpenArtifacts={
            message.role === "assistant" && onOpenArtifacts
              ? () => onOpenArtifacts(message.text)
              : null
          }
        />
      ));
    }, [messages, streamingMessageId, isDarkMode, onRegenerate, onRetry, onOpenArtifacts]);

    return (
      <div
        ref={containerRef}
        className={containerClass}
        style={{
          overscrollBehavior: "contain",
          contain: "layout style paint",
          willChange: "scroll-position",
          transform: "translateZ(0)", // Force GPU acceleration
        }}
      >
        {/* Claude-style Empty State */}
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full px-6">
            <div className="w-full max-w-2xl mx-auto text-center">
              {/* Logo/Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-haiintel-blue to-haiintel-cyan flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
              </div>

              {/* Welcome Text */}
              <h1
                className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                How can I help you today?
              </h1>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Ask me anything about HaiIntel
              </p>

              {/* Helper Chips - Grid Layout */}
              <div className="grid grid-cols-2 gap-1.5 max-w-xl mx-auto mt-4">
                {helperChips.map((chip, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestionClick(chip.query)}
                    className={`group flex items-start gap-2 p-2.5 rounded-lg text-left transition-all duration-200 ${
                      isDarkMode
                        ? "bg-haiintel-dark/50 border border-haiintel-border hover:border-haiintel-blue hover:bg-haiintel-dark"
                        : "bg-gray-50 border border-gray-200 hover:border-blue-400 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isDarkMode ? "bg-haiintel-blue/20" : "bg-blue-100"
                      }`}
                    >
                      <span className="text-lg">{chip.icon}</span>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <p
                        className={`font-medium text-sm mb-1 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {chip.label}
                      </p>
                      <p
                        className={`text-xs leading-relaxed ${
                          isDarkMode ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        {chip.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Claude-style centered container */}
        <div className="w-full max-w-3xl mx-auto pl-4 pr-4 pt-4">
          {/* Show message if truncated */}
          {messages.length > 50 && (
            <div
              className={`text-center text-xs py-2 mb-2 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Showing last 50 messages
            </div>
          )}

          {/* Message List */}
          {renderedMessages}

          {/* Typing Indicator */}
          {isTyping && <TypingIndicator isDarkMode={isDarkMode} />}

          {/* Follow-up Suggestions - Only show when NOT typing AND NOT streaming AND has messages */}
          {!isTyping &&
            !streamingMessageId &&
            suggestions.length > 0 &&
            messages.length > 0 && (
              <SuggestionChips
                suggestions={suggestions}
                onSuggestionClick={onSuggestionClick}
                isDarkMode={isDarkMode}
              />
            )}

          {/* Scroll Anchor */}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>
      </div>
    );
  }
);

ChatMessages.displayName = "ChatMessages";

export default ChatMessages;
