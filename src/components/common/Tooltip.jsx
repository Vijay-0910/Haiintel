import { memo, useState, useRef, useEffect, useCallback } from "react";

const Tooltip = memo(
  ({ children, text, position = "top", isDarkMode = true }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const timeoutRef = useRef(null);

    const updatePosition = useCallback(() => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case "bottom":
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case "left":
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case "right":
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + 8;
          break;
        default:
          break;
      }

      // Keep tooltip within viewport
      const padding = 8;
      if (left < padding) left = padding;
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
      }
      if (top < padding) top = padding;
      if (top + tooltipRect.height > window.innerHeight - padding) {
        top = window.innerHeight - tooltipRect.height - padding;
      }

      setCoords({ top, left });
    }, [position]);

    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 300); // Small delay before showing
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    useEffect(() => {
      if (isVisible) {
        updatePosition();
      }
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [isVisible, updatePosition]);

    useEffect(() => {
      if (isVisible) {
        const handleScroll = () => updatePosition();
        const handleResize = () => updatePosition();

        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("scroll", handleScroll, true);
          window.removeEventListener("resize", handleResize);
        };
      }
    }, [isVisible, updatePosition]);

    if (!text) return children;

    return (
      <>
        <span
          ref={triggerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
          className="inline-block"
        >
          {children}
        </span>

        {isVisible && (
          <div
            ref={tooltipRef}
            className={`fixed z-[10001] px-2.5 py-1.5 rounded-lg text-xs font-medium shadow-lg pointer-events-none animate-fade-in ${
              isDarkMode
                ? "bg-gray-900 text-white border border-gray-700"
                : "bg-gray-800 text-white border border-gray-700"
            }`}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
          >
            {text}

            {/* Arrow */}
            <div
              className={`absolute w-2 h-2 rotate-45 ${
                isDarkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-gray-800 border-gray-700"
              } ${
                position === "top"
                  ? "bottom-[-5px] left-1/2 -translate-x-1/2 border-r border-b"
                  : position === "bottom"
                    ? "top-[-5px] left-1/2 -translate-x-1/2 border-l border-t"
                    : position === "left"
                      ? "right-[-5px] top-1/2 -translate-y-1/2 border-r border-t"
                      : "left-[-5px] top-1/2 -translate-y-1/2 border-l border-b"
              }`}
            />
          </div>
        )}
      </>
    );
  }
);

Tooltip.displayName = "Tooltip";

export default Tooltip;
