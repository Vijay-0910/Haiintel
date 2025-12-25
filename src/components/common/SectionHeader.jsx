import { memo } from "react";

const badgeColors = {
  cyan: { dark: "text-haiintel-cyan", light: "text-haiintel-blue" },
  accent: { dark: "text-haiintel-accent", light: "text-orange-500" },
  green: { dark: "text-haiintel-green", light: "text-green-600" },
  blue: { dark: "text-haiintel-blue", light: "text-blue-600" },
};

const SectionHeader = memo(({
  badge,
  badgeColor = "cyan",
  title,
  titleHighlight,
  description,
  centered = true,
  className = "",
  isDarkMode = true,
}) => {
  const theme = isDarkMode ? "dark" : "light";

  return (
    <div className={`${centered ? "text-center" : ""} mb-12 sm:mb-16 ${className}`}>
      {badge && (
        <span className={`text-sm font-semibold tracking-wider uppercase mb-4 block ${badgeColors[badgeColor][theme]}`}>
          {badge}
        </span>
      )}

      <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? "text-haiintel-text" : "text-gray-900"}`}>
        {title}
        {titleHighlight && (
          <span className={isDarkMode ? "text-haiintel-cyan" : "text-haiintel-blue"}>
            {" "}{titleHighlight}
          </span>
        )}
      </h2>

      {description && (
        <p className={`text-base sm:text-lg max-w-2xl ${centered ? "mx-auto" : ""} ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {description}
        </p>
      )}
    </div>
  );
});

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
