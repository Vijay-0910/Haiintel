/**
 * Theme utility functions for consistent styling
 * Use these instead of inline ternary operators
 */

/**
 * Get background classes based on theme
 * @param {boolean} isDarkMode - Current theme state
 * @param {object} options - Customization options
 * @returns {string} Tailwind classes
 */
export const getBgClasses = (isDarkMode, options = {}) => {
  const {
    dark = "bg-haiintel-darker",
    light = "bg-white",
    darkBorder = "border-haiintel-border",
    lightBorder = "border-gray-200",
  } = options;

  return isDarkMode ? `${dark} ${darkBorder}` : `${light} ${lightBorder}`;
};

/**
 * Get text color classes based on theme
 */
export const getTextClasses = (isDarkMode, options = {}) => {
  const { dark = "text-haiintel-text", light = "text-gray-900" } = options;

  return isDarkMode ? dark : light;
};

/**
 * Get muted text color classes
 */
export const getMutedTextClasses = (isDarkMode) => {
  return isDarkMode ? "text-gray-500" : "text-gray-400";
};

/**
 * Get input/field classes based on theme
 */
export const getInputClasses = (isDarkMode, focused = false) => {
  const baseClasses = isDarkMode
    ? "bg-haiintel-dark/80 border-haiintel-border text-haiintel-text placeholder-gray-500"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400";

  const focusClasses = focused
    ? "border-haiintel-blue/50 ring-1 ring-haiintel-blue/20"
    : "";

  return `${baseClasses} ${focusClasses}`;
};

/**
 * Get button variant classes based on theme
 */
export const getButtonClasses = (isDarkMode, variant = "primary") => {
  const variants = {
    primary: isDarkMode
      ? "bg-haiintel-blue text-white hover:bg-haiintel-blue/90"
      : "bg-haiintel-blue text-white hover:bg-haiintel-blue/90",

    secondary: isDarkMode
      ? "bg-haiintel-border text-haiintel-text hover:bg-haiintel-border/80"
      : "bg-gray-200 text-gray-900 hover:bg-gray-300",

    ghost: isDarkMode
      ? "text-haiintel-text hover:bg-haiintel-border/50"
      : "text-gray-700 hover:bg-gray-100",

    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return variants[variant] || variants.primary;
};

/**
 * Get card/container classes
 */
export const getCardClasses = (isDarkMode, options = {}) => {
  const { padding = "p-4", rounded = "rounded-xl", shadow = true } = options;

  const baseClasses = getBgClasses(isDarkMode, {
    dark: "bg-haiintel-dark/50",
    light: "bg-white",
  });

  const shadowClass = shadow ? (isDarkMode ? "" : "shadow-sm") : "";

  return `${baseClasses} ${padding} ${rounded} ${shadowClass} border`;
};

/**
 * Get hover classes based on theme
 */
export const getHoverClasses = (isDarkMode) => {
  return isDarkMode ? "hover:bg-haiintel-border/50" : "hover:bg-gray-100";
};

/**
 * Combine theme-aware classes with custom classes
 */
export const cx = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Get common theme classes for a component type
 */
export const getComponentTheme = (isDarkMode, component) => {
  const themes = {
    modal: {
      bg: isDarkMode ? "bg-haiintel-darker" : "bg-white",
      border: isDarkMode ? "border-haiintel-border" : "border-gray-200",
      text: getTextClasses(isDarkMode),
    },
    dropdown: {
      bg: isDarkMode ? "bg-haiintel-dark" : "bg-white",
      border: isDarkMode ? "border-haiintel-border" : "border-gray-200",
      hover: getHoverClasses(isDarkMode),
    },
    message: {
      user: "bg-haiintel-blue text-white",
      ai: isDarkMode
        ? "bg-haiintel-ai-msg text-haiintel-text"
        : "bg-gray-100 text-gray-900",
    },
  };

  return themes[component] || {};
};

export default {
  getBgClasses,
  getTextClasses,
  getMutedTextClasses,
  getInputClasses,
  getButtonClasses,
  getCardClasses,
  getHoverClasses,
  getComponentTheme,
  cx,
};
