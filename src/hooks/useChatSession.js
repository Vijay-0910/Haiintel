import { useState, useEffect, useCallback, useMemo } from "react";

const STORAGE_KEY = "haiintel_chat_session";
const MAX_MESSAGES = 100; // Limit stored messages for performance

// Utility to safely parse JSON
const safeJSONParse = (str, fallback = []) => {
  try {
    return JSON.parse(str) || fallback;
  } catch {
    return fallback;
  }
};

// Utility to generate unique ID
const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useChatSession = () => {
  const [messages, setMessages] = useState(() => {
    // Initialize from sessionStorage (lazy initial state)
    if (typeof window === "undefined") return [];
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? safeJSONParse(saved, []) : [];
  });

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      // Only keep last MAX_MESSAGES for performance
      const messagesToSave = messages.slice(-MAX_MESSAGES);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
      } catch (error) {
        // Handle quota exceeded error
        console.warn("Failed to save chat session:", error);
        // Try clearing old messages
        try {
          const reducedMessages = messagesToSave.slice(-50);
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(reducedMessages));
        } catch {
          // Give up if still failing
          console.error("Unable to save chat session");
        }
      }
    }
  }, [messages]);

  // Memoized add message function
  const addMessage = useCallback((message) => {
    const newMessage = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      ...message,
    };

    setMessages((prev) => {
      // Limit messages in memory
      const newMessages = [...prev, newMessage];
      return newMessages.length > MAX_MESSAGES
        ? newMessages.slice(-MAX_MESSAGES)
        : newMessages;
    });

    return newMessage;
  }, []);

  // Memoized clear chat function
  const clearChat = useCallback(() => {
    setMessages([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear chat session:", error);
    }
  }, []);

  // Memoized return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      messages,
      addMessage,
      clearChat,
      setMessages, // Expose setMessages for loading history
    }),
    [messages, addMessage, clearChat]
  );
};

export default useChatSession;
