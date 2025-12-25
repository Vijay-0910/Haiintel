import { memo } from "react";

const Card = memo(({
  children,
  className = "",
  hover = true,
  gradient,
  border,
  padding = "p-6",
  isDarkMode = true,
  ...props
}) => {
  const baseClasses = `
    ${padding} rounded-2xl backdrop-blur-sm border transition-all duration-150
    ${gradient ? `bg-gradient-to-br ${gradient}` : ""}
    ${border ? border : ""}
    ${!gradient && !border
      ? isDarkMode
        ? "bg-haiintel-dark/50 border-haiintel-border hover:border-haiintel-cyan/30"
        : "bg-white border-gray-200 hover:border-haiintel-blue/30 shadow-sm"
      : ""}
    ${hover ? "hover:-translate-y-1 hover:scale-[1.02]" : ""}
    ${className}
  `;

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;
