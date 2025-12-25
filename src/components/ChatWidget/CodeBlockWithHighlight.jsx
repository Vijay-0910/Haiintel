import { memo, useState, useCallback, useEffect, useRef } from "react";
import hljs from "../../utils/highlightConfig";
import "highlight.js/styles/github-dark.css";
import { CopyIcon, CheckIcon } from "../common/Icon";

/**
 * Code Block Component with Syntax Highlighting
 * Only loaded when code blocks are present in the message
 * This reduces initial bundle size by ~45KB
 */
const CodeBlockWithHighlight = memo(
  ({ node, inline, className, children, isDarkMode, ...props }) => {
    const [copied, setCopied] = useState(false);
    const codeRef = useRef(null);
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";

    const handleCopy = useCallback(async () => {
      const code = String(children).replace(/\n$/, "");
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    }, [children]);

    // Apply syntax highlighting after render
    useEffect(() => {
      if (codeRef.current && !inline && language) {
        hljs.highlightElement(codeRef.current);
      }
    }, [children, inline, language]);

    if (inline) {
      return (
        <code
          className={`px-1.5 py-0.5 rounded text-sm font-mono ${
            isDarkMode
              ? "bg-haiintel-border/50 text-haiintel-accent"
              : "bg-gray-200 text-gray-800"
          }`}
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <div className="relative group my-4">
        {/* Language Label & Copy Button */}
        <div
          className={`flex items-center justify-between px-4 py-2 rounded-t-lg border-b ${
            isDarkMode
              ? "bg-haiintel-dark border-haiintel-border"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <span
            className={`text-xs font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {language || "code"}
          </span>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
              copied
                ? "text-green-500"
                : isDarkMode
                  ? "text-gray-400 hover:text-gray-200 hover:bg-haiintel-border/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }`}
            title={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <>
                <CheckIcon size="xs" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon size="xs" />
                <span>Copy code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content with Syntax Highlighting */}
        <pre
          className={`!mt-0 rounded-t-none rounded-b-lg overflow-x-auto ${
            isDarkMode ? "bg-[#0d1117]" : "bg-gray-50"
          }`}
        >
          <code ref={codeRef} className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  }
);
CodeBlockWithHighlight.displayName = "CodeBlockWithHighlight";

export default CodeBlockWithHighlight;
