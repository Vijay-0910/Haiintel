import { memo, useState } from "react";

const ImageDisplay = memo(({ image, isDarkMode = true }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`my-2 sm:my-3 rounded-lg overflow-hidden border animate-fade-in ${
        isDarkMode ? "border-haiintel-border" : "border-gray-200"
      }`}
    >
      <div className="relative w-full" style={{ aspectRatio: image.width && image.height ? `${image.width} / ${image.height}` : '16 / 9' }}>
        {!isLoaded && (
          <div className={`absolute inset-0 animate-pulse ${
            isDarkMode ? "bg-haiintel-dark" : "bg-gray-200"
          }`} />
        )}
        <img
          src={image.url}
          alt={image.alt}
          width={image.width || 640}
          height={image.height || 360}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
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
  );
});

ImageDisplay.displayName = "ImageDisplay";

export default ImageDisplay;
