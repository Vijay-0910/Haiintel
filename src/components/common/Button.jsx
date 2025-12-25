import { memo } from "react";
import { cx } from "../../utils/themeUtils";

const variants = {
  primary: {
    dark: "bg-white text-black hover:bg-gray-100",
    light: "bg-haiintel-dark text-white hover:bg-haiintel-darker",
  },
  secondary: {
    dark: "bg-transparent border-2 border-white text-white hover:bg-white/10",
    light: "bg-transparent border-2 border-haiintel-dark text-haiintel-dark hover:bg-gray-100",
  },
  gradient: {
    dark: "bg-gradient-to-r from-haiintel-blue to-haiintel-cyan text-white hover:opacity-90 shadow-intelligence",
    light: "bg-gradient-to-r from-haiintel-blue to-haiintel-cyan text-white hover:opacity-90 shadow-lg",
  },
  outline: {
    dark: "bg-transparent border-2 border-haiintel-cyan text-haiintel-cyan hover:bg-haiintel-cyan/10",
    light: "bg-transparent border-2 border-haiintel-blue text-haiintel-blue hover:bg-haiintel-blue/10",
  },
  ghost: {
    dark: "bg-transparent text-white hover:bg-white/10",
    light: "bg-transparent text-haiintel-dark hover:bg-gray-100",
  },
  danger: {
    dark: "bg-red-500 text-white hover:bg-red-600",
    light: "bg-red-500 text-white hover:bg-red-600",
  },
  success: {
    dark: "bg-green-500 text-white hover:bg-green-600",
    light: "bg-green-500 text-white hover:bg-green-600",
  },
};

const sizes = {
  xs: "px-3 py-1.5 text-xs",
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-4 text-base",
  xl: "px-10 py-4 text-lg",
};

const LoadingSpinner = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const Button = memo(({
  children,
  variant = "primary",
  size = "md",
  rounded = "full",
  className = "",
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "right",
  isDarkMode = true,
  fullWidth = false,
  type = "button",
  ariaLabel,
  ...props
}) => {
  const theme = isDarkMode ? "dark" : "light";
  const isDisabled = disabled || loading;

  const baseClasses = cx(
    "inline-flex items-center justify-center gap-2",
    "font-semibold transition-all duration-150",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-haiintel-blue",
    `rounded-${rounded}`,
    sizes[size],
    variants[variant]?.[theme] || variants.primary[theme],
    isDisabled && "opacity-50 cursor-not-allowed",
    !isDisabled && "hover:scale-105 active:scale-95",
    fullWidth && "w-full",
    className
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={baseClasses}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
