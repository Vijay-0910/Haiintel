import { memo } from "react";

const ImageDisplay = memo(({ image, isDarkMode = true }) => (
  <div
    className={`my-2 sm:my-3 rounded-lg overflow-hidden border animate-fade-in ${
      isDarkMode ? "border-haiintel-border" : "border-gray-200"
    }`}
  >
    <img
      src={image.url}
      alt={image.alt}
      className="w-full h-auto object-cover"
      loading="lazy"
      decoding="async"
    />
    {image.caption && (
      <div
        className={`px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs ${
          isDarkMode
            ? "bg-haiintel-dark/50 text-gray-400"
            : "bg-gray-50 text-gray-500"
        }`}
      >
        {image.caption}
      </div>
    )}
  </div>
));

ImageDisplay.displayName = "ImageDisplay";

export default ImageDisplay;
