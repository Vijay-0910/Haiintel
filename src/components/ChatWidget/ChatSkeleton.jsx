import { memo } from "react";
import { motion } from "framer-motion";

const ChatSkeleton = memo(({ isDarkMode = true }) => (
  <motion.div
    className={`fixed z-[9999] flex flex-col shadow-2xl inset-0 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[min(90vw,380px)] sm:h-[min(85vh,600px)] sm:rounded-2xl md:w-[min(85vw,440px)] md:h-[min(80vh,650px)] lg:w-[500px] lg:h-[min(80vh,700px)] xl:w-[550px] xl:max-h-[750px] border overflow-hidden ${
      isDarkMode
        ? "bg-haiintel-darker border-haiintel-border"
        : "bg-white border-gray-200"
    }`}
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
  >
    {/* Skeleton Header */}
    <div className={`px-4 py-3 border-b flex items-center justify-between ${
      isDarkMode ? "bg-haiintel-dark border-haiintel-border" : "bg-gray-50 border-gray-200"
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full animate-pulse ${
          isDarkMode ? "bg-haiintel-border" : "bg-gray-300"
        }`} />
        <div>
          <div className={`h-4 w-24 rounded animate-pulse mb-1 ${
            isDarkMode ? "bg-haiintel-border" : "bg-gray-300"
          }`} />
          <div className={`h-3 w-16 rounded animate-pulse ${
            isDarkMode ? "bg-haiintel-border/70" : "bg-gray-200"
          }`} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg animate-pulse ${
          isDarkMode ? "bg-haiintel-border" : "bg-gray-300"
        }`} />
        <div className={`w-8 h-8 rounded-lg animate-pulse ${
          isDarkMode ? "bg-haiintel-border" : "bg-gray-300"
        }`} />
      </div>
    </div>

    {/* Skeleton Messages */}
    <div className={`flex-1 overflow-hidden px-4 py-4 ${
      isDarkMode ? "bg-haiintel-darker" : "bg-gray-50"
    }`}>
      {/* Assistant Message Skeleton */}
      <div className="flex gap-2 mb-4">
        <div className={`w-6 h-6 rounded-full flex-shrink-0 animate-pulse ${
          isDarkMode ? "bg-haiintel-border" : "bg-gray-300"
        }`} />
        <div className="flex-1">
          <div className={`rounded-2xl rounded-tl-sm p-3 max-w-[85%] ${
            isDarkMode ? "bg-haiintel-dark" : "bg-white"
          }`}>
            <div className={`h-3 rounded animate-pulse mb-2 ${
              isDarkMode ? "bg-haiintel-border" : "bg-gray-300"
            }`} style={{ width: "90%" }} />
            <div className={`h-3 rounded animate-pulse mb-2 ${
              isDarkMode ? "bg-haiintel-border" : "bg-gray-300"
            }`} style={{ width: "75%" }} />
            <div className={`h-3 rounded animate-pulse ${
              isDarkMode ? "bg-haiintel-border" : "bg-gray-300"
            }`} style={{ width: "60%" }} />
          </div>
        </div>
      </div>

      {/* User Message Skeleton */}
      <div className="flex gap-2 justify-end mb-4">
        <div className="flex-1 flex justify-end">
          <div className={`rounded-2xl rounded-tr-sm p-3 max-w-[85%] ${
            isDarkMode ? "bg-haiintel-blue/20" : "bg-blue-100"
          }`}>
            <div className={`h-3 rounded animate-pulse ${
              isDarkMode ? "bg-haiintel-blue/40" : "bg-blue-300"
            }`} style={{ width: "120px" }} />
          </div>
        </div>
      </div>

      {/* Another Assistant Message Skeleton */}
      <div className="flex gap-2 mb-4">
        <div className={`w-6 h-6 rounded-full flex-shrink-0 animate-pulse ${
          isDarkMode ? "bg-haiintel-border" : "bg-gray-300"
        }`} />
        <div className="flex-1">
          <div className={`rounded-2xl rounded-tl-sm p-3 max-w-[85%] ${
            isDarkMode ? "bg-haiintel-dark" : "bg-white"
          }`}>
            <div className={`h-3 rounded animate-pulse mb-2 ${
              isDarkMode ? "bg-haiintel-border" : "bg-gray-300"
            }`} style={{ width: "95%" }} />
            <div className={`h-3 rounded animate-pulse ${
              isDarkMode ? "bg-haiintel-border" : "bg-gray-300"
            }`} style={{ width: "70%" }} />
          </div>
        </div>
      </div>
    </div>

    {/* Skeleton Input */}
    <div className={`px-4 py-3 border-t ${
      isDarkMode ? "bg-haiintel-dark border-haiintel-border" : "bg-gray-50 border-gray-200"
    }`}>
      <div className="flex items-end gap-2">
        <div className={`flex-1 rounded-xl px-4 py-3 border ${
          isDarkMode ? "bg-haiintel-darker border-haiintel-border" : "bg-white border-gray-200"
        }`}>
          <div className={`h-4 rounded animate-pulse ${
            isDarkMode ? "bg-haiintel-border" : "bg-gray-300"
          }`} style={{ width: "60%" }} />
        </div>
        <div className={`w-10 h-10 rounded-xl animate-pulse ${
          isDarkMode ? "bg-haiintel-blue/30" : "bg-blue-200"
        }`} />
      </div>
    </div>
  </motion.div>
));

ChatSkeleton.displayName = "ChatSkeleton";

export default ChatSkeleton;
