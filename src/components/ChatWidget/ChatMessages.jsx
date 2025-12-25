import { useEffect, useRef, memo, useCallback, useMemo } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import SuggestionChips from "./SuggestionChips";
import AIIcon from "../common/AIIcon";

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
    const isUserScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef(null);

    // Check if user is scrolled near the bottom (within 100px)
    const isNearBottom = useCallback(() => {
      if (!containerRef.current) return true;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      return scrollHeight - scrollTop - clientHeight < 100;
    }, []);

    // Smooth scroll to bottom with animation - always keeps latest message visible
    const scrollToBottom = useCallback((behavior = "smooth") => {
      requestAnimationFrame(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({
            behavior,
            block: "end",
            inline: "nearest",
          });
        }
      });
    }, []);

    // Detect user manual scrolling
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleScroll = () => {
        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Mark as user scrolling
        isUserScrollingRef.current = true;

        // Reset after 150ms of no scrolling
        scrollTimeoutRef.current = setTimeout(() => {
          isUserScrollingRef.current = false;
        }, 150);
      };

      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        container.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, []);

    // Scroll to bottom on initial mount - instant (after window animation completes)
    useEffect(() => {
      const timer = setTimeout(() => {
        scrollToBottom("auto");
      }, 300); // Increased delay to account for ChatWindow animation (250ms)
      return () => clearTimeout(timer);
    }, [scrollToBottom]);

    // Auto-scroll when new messages arrive or typing state changes
    useEffect(() => {
      // Only auto-scroll if user hasn't manually scrolled up
      if (!isUserScrollingRef.current || isNearBottom()) {
        scrollToBottom("smooth");
      }
    }, [messages.length, isTyping, scrollToBottom, isNearBottom]);

    // Auto-scroll when suggestions appear (after AI response completes)
    useEffect(() => {
      if (suggestions.length > 0 && !streamingMessageId && !isTyping) {
        // Small delay to let suggestions render
        const timer = setTimeout(() => {
          if (!isUserScrollingRef.current || isNearBottom()) {
            scrollToBottom("smooth");
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [
      suggestions.length,
      streamingMessageId,
      isTyping,
      scrollToBottom,
      isNearBottom,
    ]);

    // Continuous auto-scroll during streaming - keeps latest content visible
    useEffect(() => {
      if (!streamingMessageId) return;

      let rafId;
      let lastScrollHeight = 0;

      const keepScrolling = () => {
        if (containerRef.current && messagesEndRef.current) {
          const currentScrollHeight = containerRef.current.scrollHeight;

          // Scroll if content changed AND (user is near bottom OR hasn't manually scrolled)
          if (currentScrollHeight !== lastScrollHeight) {
            if (!isUserScrollingRef.current || isNearBottom()) {
              messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
              });
            }
            lastScrollHeight = currentScrollHeight;
          }
        }
        rafId = requestAnimationFrame(keepScrolling);
      };

      rafId = requestAnimationFrame(keepScrolling);

      return () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    }, [streamingMessageId, isNearBottom]);

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
              ? () => onOpenArtifacts(message)
              : null
          }
        />
      ));
    }, [
      messages,
      streamingMessageId,
      isDarkMode,
      onRegenerate,
      onRetry,
      onOpenArtifacts,
    ]);

    return (
      <div
        ref={containerRef}
        className={containerClass}
        style={{
          overscrollBehavior: "contain",
          contain: "layout style paint",
          willChange: "scroll-position",
          transform: "translateZ(0)", // Force GPU acceleration
          scrollBehavior: "smooth", // Enable smooth scrolling
        }}
      >
        {/* Claude-style Empty State */}
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full px-6">
            <div className="w-full max-w-2xl mx-auto text-center">
              {/* Logo/Icon */}
              <div className="mb-4">
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center shadow-lg ${
                    isDarkMode
                      ? "bg-gradient-to-br from-gray-700 to-gray-800"
                      : "bg-gradient-to-br from-gray-200 to-gray-300"
                  }`}
                >
                  <AIIcon
                    className={`w-9 h-9 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  />
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
