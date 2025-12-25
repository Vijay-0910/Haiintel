import {
  lazy,
  Suspense,
  memo,
  useMemo,
  useState,
  useCallback,
  useRef,
  Fragment,
} from "react";
import { useStreamingText } from "../../hooks/useStreamingText";
import { extractArtifacts } from "../../utils/extractCodeBlocks";
import ThinkingBlock from "./ThinkingBlock";
import AIIcon from "../common/AIIcon";
import LazyMarkdown from "./LazyMarkdown";

// Lazy load rich content components
const StatsCard = lazy(() => import("./RichContent/StatsCard"));
const ImageDisplay = lazy(() => import("./RichContent/ImageDisplay"));
const BarChart = lazy(() => import("./RichContent/BarChart"));
const DetailCard = lazy(() => import("./RichContent/DetailCard"));
const ListDisplay = lazy(() => import("./RichContent/ListDisplay"));

// Loading placeholder
const RichContentLoader = memo(() => (
  <div className="my-2 h-20 rounded-lg bg-haiintel-border/30 animate-pulse" />
));
RichContentLoader.displayName = "RichContentLoader";

// AI Avatar - Memoized with AI brain icon (same container size as user, but bigger icon inside)
const AIAvatar = memo(() => (
  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-haiintel-blue to-haiintel-cyan flex items-center justify-center shadow-lg">
    <AIIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black" />
  </div>
));
AIAvatar.displayName = "AIAvatar";

// User Avatar - Memoized
const UserAvatar = memo(() => (
  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-lg">
    <svg
      className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  </div>
));
UserAvatar.displayName = "UserAvatar";

// Streaming Cursor - CSS animation
const StreamingCursor = memo(() => (
  <span className="inline-block ml-1 animate-pulse">▊</span>
));
StreamingCursor.displayName = "StreamingCursor";

// Copy Button
const CopyButton = memo(({ text, isDarkMode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded transition-colors duration-150 ${
        isDarkMode
          ? "hover:bg-haiintel-border text-gray-500 hover:text-gray-300"
          : "hover:bg-gray-200 text-gray-400 hover:text-gray-600"
      }`}
      title={copied ? "Copied!" : "Copy message"}
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {copied ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        )}
      </svg>
    </button>
  );
});
CopyButton.displayName = "CopyButton";

// Speak Button
const SpeakButton = memo(({ text, isDarkMode }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const handleSpeak = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    } else {
      // Reuse utterance object for better performance
      if (!utteranceRef.current || utteranceRef.current.text !== text) {
        utteranceRef.current = new SpeechSynthesisUtterance(text);
        utteranceRef.current.onend = () => setIsSpeaking(false);
        utteranceRef.current.onerror = () => setIsSpeaking(false);
      }
      window.speechSynthesis.speak(utteranceRef.current);
      setIsSpeaking(true);
    }
  }, [text, isSpeaking]);

  return (
    <button
      onClick={handleSpeak}
      className={`p-1.5 rounded transition-colors duration-150 ${
        isDarkMode
          ? "hover:bg-haiintel-border text-gray-500 hover:text-gray-300"
          : "hover:bg-gray-200 text-gray-400 hover:text-gray-600"
      } ${isSpeaking ? "text-haiintel-accent" : ""}`}
      title={isSpeaking ? "Stop speaking" : "Read aloud"}
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
        />
      </svg>
    </button>
  );
});
SpeakButton.displayName = "SpeakButton";

// Rich Content Renderer
const RichContentRenderer = memo(({ message, isDarkMode }) => (
  <>
    {message.stats && (
      <StatsCard stats={message.stats} isDarkMode={isDarkMode} />
    )}
    {message.image && (
      <ImageDisplay image={message.image} isDarkMode={isDarkMode} />
    )}
    {message.chart && <BarChart data={message.chart} isDarkMode={isDarkMode} />}
    {message.details && (
      <DetailCard details={message.details} isDarkMode={isDarkMode} />
    )}
    {message.list && (
      <ListDisplay
        items={message.list}
        ordered={message.listOrdered}
        isDarkMode={isDarkMode}
      />
    )}
  </>
));
RichContentRenderer.displayName = "RichContentRenderer";

// Open Artifacts Button
const OpenArtifactsButton = memo(({ onOpenArtifacts, isDarkMode }) => {
  return (
    <button
      onClick={onOpenArtifacts}
      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors duration-150 ${
        isDarkMode
          ? "bg-haiintel-blue/10 text-haiintel-blue hover:bg-haiintel-blue/20"
          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
      }`}
      title="Open in Artifacts panel"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
      <span>Artifacts</span>
    </button>
  );
});
OpenArtifactsButton.displayName = "OpenArtifactsButton";

// Retry Button (for failed messages)
const RetryButton = memo(({ onRetry, isDarkMode }) => {
  return (
    <button
      onClick={onRetry}
      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors duration-150 ${
        isDarkMode
          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
          : "bg-red-50 text-red-600 hover:bg-red-100"
      }`}
      title="Retry sending message"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span>Retry</span>
    </button>
  );
});
RetryButton.displayName = "RetryButton";

// Message Actions
const MessageActions = memo(
  ({
    text,
    isUser,
    isDarkMode,
    onRegenerate,
    hasError,
    onRetry,
    onOpenArtifacts,
    hasArtifacts,
  }) => (
    <div className={`flex items-center gap-1.5`}>
      {hasError ? (
        <RetryButton onRetry={onRetry} isDarkMode={isDarkMode} />
      ) : (
        <>
          <CopyButton text={text} isDarkMode={isDarkMode} />
          {!isUser && (
            <>
              <SpeakButton text={text} isDarkMode={isDarkMode} />
              {hasArtifacts && onOpenArtifacts && (
                <OpenArtifactsButton
                  onOpenArtifacts={onOpenArtifacts}
                  isDarkMode={isDarkMode}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
);
MessageActions.displayName = "MessageActions";

const MessageBubble = memo(
  ({
    message,
    isStreaming = false,
    isDarkMode = true,
    onRegenerate,
    onRetry,
    onOpenArtifacts,
  }) => {
    const isUser = message.role === "user";
    const hasError = message.error === true;
    const { displayedText, isComplete } = useStreamingText(
      message.text,
      80,
      isStreaming
    );
    const textToShow = isStreaming ? displayedText : message.text;

    const [lightboxImage, setLightboxImage] = useState(null);

    const hasRichContent = useMemo(
      () =>
        message.stats ||
        message.image ||
        message.chart ||
        message.details ||
        message.list,
      [
        message.stats,
        message.image,
        message.chart,
        message.details,
        message.list,
      ]
    );

    const hasImages = useMemo(
      () => message.images && message.images.length > 0,
      [message.images]
    );

    const hasArtifacts = useMemo(() => {
      if (isUser) return false;
      const artifacts = extractArtifacts(message);
      return artifacts.length > 0;
    }, [message, isUser]);

    // Format timestamp
    const formattedTime = useMemo(() => {
      if (!message.timestamp) return "";
      const date = new Date(message.timestamp);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        // Today: show time only
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (diffInHours < 48) {
        // Yesterday
        return `Yesterday ${date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      } else {
        // Older: show date and time
        return date.toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }, [message.timestamp]);

    // Message bubbles with background
    const bubbleClassName = useMemo(
      () =>
        hasError
          ? isDarkMode
            ? "bg-red-500/10 text-red-400 border border-red-500/30 rounded-2xl px-4 py-3"
            : "bg-red-50 text-red-600 border border-red-200 rounded-2xl px-4 py-3"
          : isUser
            ? "bg-haiintel-blue text-white rounded-2xl px-4 py-3"
            : isDarkMode
              ? "bg-haiintel-dark text-gray-200 rounded-2xl px-4 py-3"
              : "bg-gray-100 text-gray-900 rounded-2xl px-4 py-3",
      [isUser, isDarkMode, hasError]
    );

    return (
      <div
        className={`group flex items-start gap-3 mb-6 w-full animate-fade-in ${
          isUser ? "justify-end" : "justify-start"
        }`}
        style={{ contentVisibility: "auto", containIntrinsicSize: "0 100px" }}
      >
        {!isUser && <AIAvatar />}
        {isUser && (
          <div className="order-2">
            <UserAvatar />
          </div>
        )}

        <div
          className={`flex flex-col gap-2 ${
            isUser ? "items-end max-w-[85%]" : "items-start flex-1"
          } min-w-0`}
        >
          {/* Thinking Block - for AI messages only */}
          {!isUser && message.thinking && (
            <ThinkingBlock
              thinking={message.thinking}
              isThinking={isStreaming && !message.text}
              isDarkMode={isDarkMode}
            />
          )}

          <div className={bubbleClassName}>
            {/* Images */}
            {hasImages && (
              <div
                className={`grid gap-1.5 sm:gap-2 ${
                  message.images.length === 1
                    ? "grid-cols-1"
                    : message.images.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-2"
                } ${message.text ? "mb-2" : ""}`}
              >
                {message.images.map((image, index) => (
                  <div
                    key={image.id || index}
                    className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxImage(image)}
                    style={{
                      maxWidth: message.images.length === 1 ? "300px" : "150px",
                    }}
                  >
                    <img
                      src={image.data}
                      alt={image.name || `Image ${index + 1}`}
                      className="w-full h-auto object-cover rounded-lg"
                      style={{
                        maxHeight:
                          message.images.length === 1 ? "300px" : "150px",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Text - Claude-style typography */}
            {message.text && (
              <>
                {isUser ? (
                  // User messages: plain text
                  <p className="text-[15px] leading-[1.7] whitespace-pre-wrap break-words">
                    {textToShow}
                  </p>
                ) : (
                  // AI messages: Markdown with syntax highlighting
                  <div className="text-[15px] leading-[1.7]">
                    {isStreaming && !isComplete ? (
                      <p className="whitespace-pre-wrap break-words">
                        {textToShow}
                        <StreamingCursor />
                      </p>
                    ) : (
                      <LazyMarkdown
                        content={textToShow}
                        isDarkMode={isDarkMode}
                        isStreaming={isStreaming}
                        onOpenArtifacts={hasArtifacts ? () => onOpenArtifacts(message) : null}
                      />
                    )}
                  </div>
                )}
              </>
            )}

            {(!isStreaming || isComplete) && hasRichContent && (
              <Suspense fallback={<RichContentLoader />}>
                <RichContentRenderer
                  message={message}
                  isDarkMode={isDarkMode}
                />
              </Suspense>
            )}
          </div>

          {/* Timestamp and Actions - side by side */}
          {(!isStreaming || isComplete) && (formattedTime || message.text) && (
            <div
              className={`flex items-center gap-2 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {formattedTime && (
                <div
                  className={`text-[9px] sm:text-[10px] ${
                    isDarkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {formattedTime}
                </div>
              )}
              {message.text && (
                <MessageActions
                  text={message.text}
                  isUser={isUser}
                  isDarkMode={isDarkMode}
                  hasError={hasError}
                  onRegenerate={!isUser ? onRegenerate : null}
                  onRetry={hasError ? onRetry : null}
                  onOpenArtifacts={!isUser ? onOpenArtifacts : null}
                  hasArtifacts={hasArtifacts}
                />
              )}
            </div>
          )}
        </div>

        {/* Image Lightbox */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <img
                src={lightboxImage.data}
                alt={lightboxImage.name || "Image"}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
                title="Close"
              >
                ×
              </button>
              {lightboxImage.name && (
                <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-sm px-3 py-2 rounded">
                  {lightboxImage.name}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;
