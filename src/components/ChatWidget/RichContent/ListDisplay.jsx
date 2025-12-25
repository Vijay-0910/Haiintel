import { memo } from "react";

const ListDisplay = memo(({ items, ordered = false, isDarkMode = true }) => {
  const ListWrapper = ordered ? "ol" : "ul";

  return (
    <div className="my-2 sm:my-3">
      <ListWrapper className="space-y-1.5 sm:space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className={`text-[11px] sm:text-xs md:text-sm flex gap-1.5 sm:gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            <span className="text-haiintel-blue font-semibold flex-shrink-0">
              {ordered ? `${index + 1}.` : "•"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ListWrapper>
    </div>
  );
});

ListDisplay.displayName = "ListDisplay";

export default ListDisplay;
