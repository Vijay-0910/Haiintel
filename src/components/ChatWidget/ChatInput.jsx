import { useState, useCallback, useRef, memo, useEffect } from "react";

const ChatInput = memo(
  ({
    onSend,
    onStop,
    disabled = false,
    isStreaming = false,
    isDarkMode = true,
  }) => {
    const [message, setMessage] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);
    const textareaRef = useRef(null);
    const recognitionRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleSubmit = useCallback(
      (e) => {
        e.preventDefault();
        const trimmedMessage = message.trim();
        if ((trimmedMessage || uploadedImages.length > 0) && !disabled) {
          onSend({
            text: trimmedMessage,
            images: uploadedImages.length > 0 ? uploadedImages : undefined,
          });
          setMessage("");
          setUploadedImages([]);
          if (textareaRef.current) {
            textareaRef.current.style.height = "22px";
          }
        }
      },
      [message, uploadedImages, disabled, onSend]
    );

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e);
        }
      },
      [handleSubmit]
    );

    const handleChange = useCallback((e) => setMessage(e.target.value), []);

    const handleInput = useCallback((e) => {
      const target = e.target;
      target.style.height = "22px";
      target.style.height = `${Math.min(target.scrollHeight, 100)}px`;
    }, []);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    // Initialize speech recognition
    useEffect(() => {
      if (typeof window !== "undefined") {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = true;

          recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
              .map((result) => result[0].transcript)
              .join("");
            setMessage(transcript);
          };

          recognitionRef.current.onend = () => setIsListening(false);
          recognitionRef.current.onerror = () => setIsListening(false);
        }
      }

      return () => {
        if (recognitionRef.current) recognitionRef.current.stop();
      };
    }, []);

    const handleVoiceInput = useCallback(() => {
      if (!recognitionRef.current) {
        alert("Voice input is not supported in your browser");
        return;
      }

      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }, [isListening]);

    const handleFileSelect = useCallback(
      (e) => {
        console.log("File select triggered", {
          filesCount: e.target.files?.length,
        });
        const files = Array.from(e.target.files || []);
        const imageFiles = files.filter((file) =>
          file.type.startsWith("image/")
        );

        console.log("Image files found:", imageFiles.length);

        if (imageFiles.length === 0) {
          alert("Please select image files only");
          return;
        }

        // Limit to 5 images
        if (uploadedImages.length + imageFiles.length > 5) {
          alert("Maximum 5 images allowed");
          return;
        }

        // Convert images to base64
        imageFiles.forEach((file) => {
          console.log("Processing file:", file.name, file.size);

          // Check file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            alert(`${file.name} is too large. Maximum size is 5MB`);
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            console.log("File loaded:", file.name);
            setUploadedImages((prev) => {
              const newImages = [
                ...prev,
                {
                  id: `${Date.now()}-${Math.random()}`,
                  name: file.name,
                  data: event.target.result,
                  size: file.size,
                },
              ];
              console.log("Updated images:", newImages.length);
              return newImages;
            });
          };
          reader.onerror = (error) => {
            console.error("FileReader error:", error);
            alert(`Failed to read ${file.name}`);
          };
          reader.readAsDataURL(file);
        });

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      [uploadedImages.length]
    );

    const handleRemoveImage = useCallback((imageId) => {
      setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
    }, []);

    const handleImageClick = useCallback(() => {
      console.log("Image button clicked", {
        disabled,
        hasRef: !!fileInputRef.current,
      });
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, [disabled]);

    return (
      <div
        className={`px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 flex-shrink-0 ${
          isDarkMode ? "bg-haiintel-darker" : "bg-gray-50"
        }`}
      >
        {/* Image previews */}
        {uploadedImages.length > 0 && (
          <div className="flex gap-2 mb-2 flex-wrap px-1">
            {uploadedImages.map((image) => (
              <div
                key={image.id}
                className={`relative group rounded-lg overflow-hidden border ${
                  isDarkMode ? "border-haiintel-border" : "border-gray-300"
                }`}
                style={{ width: "60px", height: "60px" }}
              >
                <img
                  src={image.data}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs leading-none"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            className={`relative flex items-end gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border transition-all duration-150 px-2 py-1.5 sm:px-3 sm:py-2 ${
              isDarkMode
                ? `bg-haiintel-dark/80 ${
                    isFocused
                      ? "border-haiintel-blue/50 ring-1 ring-haiintel-blue/20"
                      : "border-haiintel-border"
                  }`
                : `bg-white ${
                    isFocused
                      ? "border-haiintel-blue/50 ring-1 ring-haiintel-blue/20 shadow-sm"
                      : "border-gray-300"
                  }`
            }`}
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Upload images"
            />

            {/* Image upload button */}
            <button
              type="button"
              onClick={handleImageClick}
              disabled={disabled}
              className={`flex-shrink-0 p-1 sm:p-1.5 rounded-lg transition-all duration-150 ${
                isDarkMode
                  ? "text-gray-500 hover:text-gray-300 hover:bg-haiintel-border/50"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              title="Upload images"
              aria-label="Upload images"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>

            {/* Voice button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={disabled}
              className={`hidden min-[400px]:flex flex-shrink-0 p-1 sm:p-1.5 rounded-lg transition-all duration-150 ${
                isListening
                  ? "text-red-500 bg-red-500/10 animate-pulse"
                  : isDarkMode
                  ? "text-gray-500 hover:text-gray-300 hover:bg-haiintel-border/50"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              title={isListening ? "Stop recording" : "Voice input"}
              aria-label={isListening ? "Stop recording" : "Voice input"}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>

            {/* Text input */}
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onInput={handleInput}
                placeholder="Message HaiIntel..."
                disabled={disabled}
                rows={1}
                className={`w-full bg-transparent text-xs sm:text-sm focus:outline-none resize-none scrollbar-hide leading-5 sm:leading-6 ${
                  isDarkMode
                    ? "text-haiintel-text placeholder-gray-500"
                    : "text-gray-900 placeholder-gray-400"
                }`}
                style={{ minHeight: "22px", maxHeight: "100px" }}
                aria-label="Chat message input"
              />
            </div>

            {/* Stop/Send button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-150 bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95 shadow-sm"
                aria-label="Stop generation"
                title="Stop generation"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={
                  (!message.trim() && uploadedImages.length === 0) || disabled
                }
                className={`flex-shrink-0 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-150 ${
                  (message.trim() || uploadedImages.length > 0) && !disabled
                    ? "bg-haiintel-blue text-white hover:bg-haiintel-blue/90 hover:scale-105 active:scale-95 shadow-sm"
                    : isDarkMode
                    ? "bg-haiintel-border/50 text-gray-600 cursor-not-allowed"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                aria-label="Send message"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Footer hint */}
          <div
            className={`hidden sm:flex items-center justify-between mt-1.5 sm:mt-2 px-1 text-[9px] sm:text-[10px] ${
              isDarkMode ? "text-gray-600" : "text-gray-400"
            }`}
          >
            <span>
              {isStreaming
                ? "AI is generating... Click stop to interrupt"
                : disabled && !isListening
                ? "AI is thinking..."
                : isListening
                ? "Listening... Speak now"
                : ""}
            </span>
            <span aria-live="polite">
              {message.length > 0 ? `${message.length} chars` : ""}
            </span>
          </div>
        </form>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
