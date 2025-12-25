/**
 * Application-wide constants for consistency and reusability
 */

export const CHAT_CONFIG = {
  // Streaming & Typing
  STREAMING_SPEED: 80, // milliseconds per character
  TYPING_DELAY: 1000, // delay before AI starts responding
  MAX_STREAMING_DURATION: 8000, // maximum time for streaming animation
  STREAMING_DURATION_BUFFER: 300, // buffer time added to calculated duration

  // Scroll
  SCROLL_INTERVAL: 50, // milliseconds between scroll updates during streaming
  INITIAL_SCROLL_DELAY: 100, // delay before initial scroll on mount

  // Messages
  MAX_VISIBLE_MESSAGES: 50, // maximum messages to render at once
  MAX_STORED_MESSAGES: 100, // maximum messages in localStorage
  MIN_TEXT_LENGTH_FOR_ANIMATION: 10, // skip animation for short text

  // Input
  MIN_TEXTAREA_HEIGHT: 22, // pixels
  MAX_TEXTAREA_HEIGHT: 100, // pixels
  DEFAULT_PLACEHOLDER: "Message HaiIntel...",

  // Timeouts
  COPY_FEEDBACK_DURATION: 2000, // how long to show "Copied!" message
  PASSWORD_MIN_LENGTH: 6,
};

export const ANIMATION_CONFIG = {
  // Chat Widget
  CHAT_OPEN_DURATION: 300, // milliseconds
  CHAT_CLOSE_DURATION: 300,

  // Transitions
  TRANSITION_FAST: 150,
  TRANSITION_NORMAL: 200,
  TRANSITION_SLOW: 300,

  // Delays
  STAGGER_DELAY: 150, // delay between animated items
  BOUNCE_DOTS_DELAY: 150, // delay between bounce dots animation
};

export const UI_CONFIG = {
  // Z-Index layers
  Z_INDEX: {
    MODAL: 9999,
    OVERLAY: 9998,
    DROPDOWN: 100,
    STICKY: 50,
    DEFAULT: 1,
  },

  // Breakpoints (matches Tailwind defaults)
  BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },

  // Common sizes
  SIZES: {
    ICON_SM: 16,
    ICON_MD: 20,
    ICON_LG: 24,
    ICON_XL: 32,
  },
};

export const THEME_CONFIG = {
  STORAGE_KEY: "haiintel-theme",
  DEFAULT_THEME: "dark",
  THEMES: {
    DARK: "dark",
    LIGHT: "light",
  },
};

export const API_CONFIG = {
  BASE_URL: "/api",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// Export all at once for convenience
export default {
  CHAT_CONFIG,
  ANIMATION_CONFIG,
  UI_CONFIG,
  THEME_CONFIG,
  API_CONFIG,
};
