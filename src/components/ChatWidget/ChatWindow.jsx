import { useEffect, useRef, useState, useCallback, useMemo, memo, lazy, Suspense } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ConfirmModal from "./ConfirmModal";

// Lazy load ArtifactsPanel - only loads when user opens artifacts
const ArtifactsPanel = lazy(() => import("./ArtifactsPanel"));
import SkeletonLoader from "./SkeletonLoader";
import ChatContentSkeleton from "./ChatContentSkeleton";
import { useChatSession } from "../../hooks/useChatSession";
import { getResponseAsync } from "../../data/responsesCore";
import { extractArtifacts } from "../../utils/extractCodeBlocks";

const ChatWindow = memo(({ onClose, isDarkMode = true }) => {
  const { messages, addMessage, clearChat, setMessages } = useChatSession();
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [helperChips, setHelperChips] = useState([]);
  const [isArtifactsPanelOpen, setIsArtifactsPanelOpen] = useState(false);
  const [currentArtifacts, setCurrentArtifacts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const shownSuggestionsRef = useRef(new Set()); // Track shown suggestions
  const typingTimeoutRef = useRef(null);
  const streamingTimeoutRef = useRef(null);

  // Show loading skeleton for 2 seconds on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingContent(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Initialize helper chips with 4 random HaiIntel questions
  // These are shown ONLY on the initial empty state before any conversation
  // Each time the chat loads, different questions are shown
  // Lazy load chips data only when needed
  useEffect(() => {
    import("./chipsData").then(({ HAIINTEL_CHIPS_POOL }) => {
      const shuffled = [...HAIINTEL_CHIPS_POOL].sort(() => Math.random() - 0.5);
      const selectedChips = shuffled.slice(0, 4);
      setHelperChips(selectedChips);
    });
  }, []);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (streamingTimeoutRef.current)
        clearTimeout(streamingTimeoutRef.current);
    };
  }, []);

  // Function to get exactly 3 shuffled, non-repeating suggestions
  // These are shown AFTER AI responses as follow-up suggestions
  const getShuffledSuggestions = useCallback((availableSuggestions) => {
    if (!availableSuggestions || availableSuggestions.length === 0) {
      return [];
    }

    // Filter out previously shown suggestions
    let filteredSuggestions = availableSuggestions.filter(
      (suggestion) => !shownSuggestionsRef.current.has(suggestion)
    );

    // If we've shown all suggestions, reset and use all available
    if (filteredSuggestions.length < 3) {
      shownSuggestionsRef.current.clear();
      filteredSuggestions = [...availableSuggestions];
    }

    // Shuffle the filtered suggestions
    const shuffled = [...filteredSuggestions].sort(() => Math.random() - 0.5);

    // Take exactly 3 suggestions
    const selected = shuffled.slice(0, 3);

    // Add selected suggestions to shown set
    selected.forEach((suggestion) =>
      shownSuggestionsRef.current.add(suggestion)
    );

    return selected;
  }, []);

  const handleSendMessage = useCallback(
    (userMessage) => {
      setSuggestions([]);

      // Handle both string and object formats
      const messageData =
        typeof userMessage === "string" ? { text: userMessage } : userMessage;

      addMessage({
        role: "user",
        text: messageData.text || "",
        images: messageData.images,
      });
      setIsTyping(true);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (streamingTimeoutRef.current)
        clearTimeout(streamingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(async () => {
        try {
          let response;

          // Check if user uploaded images
          if (messageData.images && messageData.images.length > 0) {
            const imageCount = messageData.images.length;
            const imageWord = imageCount === 1 ? "image" : "images";

            response = {
              text: `Thank you for sharing ${
                imageCount === 1 ? "the" : "those"
              } ${imageWord}! I can see you've uploaded **${imageCount} ${imageWord}**.

While I'm currently a demo chatbot and can't process images yet, in a production version powered by a vision AI model like GPT-4 Vision or Claude 3, I would be able to:

- 📷 **Analyze image content** - Identify objects, people, text, and scenes
- 🔍 **Extract information** - Read text, recognize logos, detect colors
- 💬 **Answer questions** - Respond to your queries about the images
- 📝 **Provide descriptions** - Generate detailed descriptions of what's shown

${
  messageData.text
    ? `\n\nRegarding your message: "${messageData.text}"\n\nI'd love to help with that once image processing is connected to a real AI backend!`
    : ""
}`,
              suggestions: [
                "What is HaiIntel?",
                "What services do you offer?",
                "What's your tech stack?",
                "How do I integrate this?",
                "Show me code examples",
                "What are the open positions?",
              ],
            };
          } else {
            // Normal text response - lazy load on demand
            response = await getResponseAsync(messageData.text);
          }

          const aiMessage = addMessage({
            role: "assistant",
            text: response.text,
            stats: response.stats,
            chart: response.chart,
            details: response.details,
            image: response.image,
            list: response.list,
            listOrdered: response.listOrdered,
          });
          setStreamingMessageId(aiMessage.id);
          setIsTyping(false);

          // Get exactly 3 shuffled, non-repeating suggestions
          const shuffledSuggestions = getShuffledSuggestions(
            response.suggestions || []
          );
          setSuggestions(shuffledSuggestions);

          const duration = Math.min(
            (response.text?.length || 0) * 80 + 300,
            8000
          );
          streamingTimeoutRef.current = setTimeout(() => {
            setStreamingMessageId(null);
          }, duration);
        } catch (error) {
          console.error("Failed to get response:", error);
          addMessage({
            role: "assistant",
            text: "Sorry, I encountered an error. Please try again.",
            error: true,
          });
          setIsTyping(false);
        }
      }, 1000);
    },
    [addMessage, getShuffledSuggestions]
  );

  const handleSuggestionClick = useCallback(
    (suggestion) => handleSendMessage(suggestion),
    [handleSendMessage]
  );

  const handleOpenArtifacts = useCallback((message) => {
    const artifacts = extractArtifacts(message);
    if (artifacts.length > 0) {
      setCurrentArtifacts(artifacts);
      setIsArtifactsPanelOpen(true);
    }
  }, []);

  const handleCloseArtifacts = useCallback(() => {
    setIsArtifactsPanelOpen(false);
  }, []);

  const handleStopGeneration = useCallback(() => {
    if (streamingTimeoutRef.current) {
      clearTimeout(streamingTimeoutRef.current);
      streamingTimeoutRef.current = null;
    }
    setStreamingMessageId(null);
    setIsTyping(false);
  }, []);

  const handleRegenerate = useCallback(
    (aiMessageId) => {
      // Find the AI message being regenerated
      const aiMessageIndex = messages.findIndex(
        (msg) => msg.id === aiMessageId
      );
      if (aiMessageIndex === -1) return;

      // Find the user message that came before it
      let userMessage = null;
      for (let i = aiMessageIndex - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
          userMessage = messages[i];
          break;
        }
      }

      if (!userMessage) return;

      // Remove the old AI message
      setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId));

      // Clear any ongoing operations
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (streamingTimeoutRef.current)
        clearTimeout(streamingTimeoutRef.current);

      // Regenerate the response
      setIsTyping(true);
      setSuggestions([]);

      typingTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await getResponseAsync(userMessage.text);
          const newAiMessage = addMessage({
            role: "assistant",
            text: response.text,
            stats: response.stats,
            chart: response.chart,
            details: response.details,
            image: response.image,
            list: response.list,
            listOrdered: response.listOrdered,
          });
          setStreamingMessageId(newAiMessage.id);
          setIsTyping(false);

          // Get exactly 3 shuffled, non-repeating suggestions
          const shuffledSuggestions = getShuffledSuggestions(
            response.suggestions || []
          );
          setSuggestions(shuffledSuggestions);

          const duration = Math.min(
            (response.text?.length || 0) * 80 + 300,
            8000
          );
          streamingTimeoutRef.current = setTimeout(() => {
            setStreamingMessageId(null);
          }, duration);
        } catch (error) {
          console.error("Failed to regenerate response:", error);
          addMessage({
            role: "assistant",
            text: "Sorry, I encountered an error while regenerating. Please try again.",
            error: true,
          });
          setIsTyping(false);
        }
      }, 1000);
    },
    [messages, setMessages, addMessage, getShuffledSuggestions]
  );

  const handleRetry = useCallback(
    (messageId) => {
      // Find the failed message
      const failedMessage = messages.find((msg) => msg.id === messageId);
      if (!failedMessage) return;

      // Remove the failed message
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

      // Find the user message that triggered this
      if (failedMessage.role === "assistant") {
        // This is a failed AI response - find the user message before it
        const messageIndex = messages.findIndex((msg) => msg.id === messageId);
        let userMessage = null;
        for (let i = messageIndex - 1; i >= 0; i--) {
          if (messages[i].role === "user") {
            userMessage = messages[i];
            break;
          }
        }
        if (userMessage) {
          // Retry getting the response
          handleSendMessage(userMessage.text);
        }
      } else if (failedMessage.role === "user") {
        // This is a failed user message - resend it
        handleSendMessage(failedMessage.text);
      }
    },
    [messages, setMessages, handleSendMessage]
  );

  const handleClearChat = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    clearChat();
    setStreamingMessageId(null);
    setSuggestions([]);
    shownSuggestionsRef.current.clear(); // Reset shown suggestions
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      setIsTyping(false);
    }
    if (streamingTimeoutRef.current) {
      clearTimeout(streamingTimeoutRef.current);
    }
    setShowDeleteModal(false);
  }, [clearChat]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const windowClassName = useMemo(
    () =>
      `fixed z-[9999] flex flex-col shadow-2xl inset-0 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[min(90vw,380px)] sm:h-[min(85vh,600px)] sm:rounded-2xl md:w-[min(85vw,440px)] md:h-[min(80vh,650px)] lg:w-[500px] lg:h-[min(80vh,700px)] xl:w-[550px] xl:max-h-[750px] border overflow-hidden ${
        isDarkMode
          ? "bg-haiintel-darker border-haiintel-border"
          : "bg-white border-gray-200"
      }`,
    [isDarkMode]
  );

  return (
    <>
      {/* Backdrop - Click outside to close */}
      <div
        className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Chat Window */}
      <div
        className={`${windowClassName} animate-slide-up`}
        style={{
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
        }}
        role="dialog"
        aria-label="Chat with HaiIntel Assistant"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <ChatHeader
          isDarkMode={isDarkMode}
          onClearChat={handleClearChat}
          onClose={onClose}
        />
        {isLoadingContent ? (
          <ChatContentSkeleton isDarkMode={isDarkMode} />
        ) : (
          <ChatMessages
            messages={messages}
            streamingMessageId={streamingMessageId}
            isTyping={isTyping}
            suggestions={suggestions}
            helperChips={helperChips}
            isDarkMode={isDarkMode}
            onSuggestionClick={handleSuggestionClick}
            onRegenerate={handleRegenerate}
            onRetry={handleRetry}
            onOpenArtifacts={handleOpenArtifacts}
          />
        )}
        <ChatInput
          onSend={handleSendMessage}
          onStop={handleStopGeneration}
          disabled={isTyping || streamingMessageId !== null}
          isStreaming={streamingMessageId !== null}
          isDarkMode={isDarkMode}
        />
        {isArtifactsPanelOpen && (
          <Suspense fallback={null}>
            <ArtifactsPanel
              artifacts={currentArtifacts}
              isOpen={isArtifactsPanelOpen}
              onClose={handleCloseArtifacts}
              isDarkMode={isDarkMode}
            />
          </Suspense>
        )}
        <ConfirmModal
          isOpen={showDeleteModal}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          title="Delete Chat History"
          message="Are you sure you want to delete the entire chat history? This action cannot be undone."
          isDarkMode={isDarkMode}
        />
      </div>
    </>
  );
});

ChatWindow.displayName = "ChatWindow";

export default ChatWindow;
