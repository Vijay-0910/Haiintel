import { lazy, Suspense, memo } from "react";
import { hasMarkdownSyntax, hasCodeBlocks } from "../../utils/detectMarkdown";

// Lazy load optimized markdown renderer - only loads plugins it actually uses
const MarkdownRenderer = lazy(() => import("./OptimizedMarkdown"));

// Loading skeleton for markdown content
const MarkdownSkeleton = memo(({ isDarkMode }) => (
  <div className="space-y-2 animate-pulse">
    <div
      className={`h-4 rounded ${
        isDarkMode ? "bg-haiintel-border/50" : "bg-gray-200"
      }`}
      style={{ width: "90%" }}
    />
    <div
      className={`h-4 rounded ${
        isDarkMode ? "bg-haiintel-border/50" : "bg-gray-200"
      }`}
      style={{ width: "75%" }}
    />
    <div
      className={`h-4 rounded ${
        isDarkMode ? "bg-haiintel-border/50" : "bg-gray-200"
      }`}
      style={{ width: "85%" }}
    />
  </div>
));
MarkdownSkeleton.displayName = "MarkdownSkeleton";

/**
 * Smart Markdown Component
 * - Renders plain text if no markdown syntax detected (0 KB overhead)
 * - Lazy loads react-markdown only when markdown syntax found (96.8 KB)
 * - Lazy loads highlight.js only when code blocks found (45.1 KB)
 */
const LazyMarkdown = memo(({ content, isDarkMode, isStreaming, onOpenArtifacts }) => {
  // Quick check: Is this plain text?
  const hasMarkdown = hasMarkdownSyntax(content);
  const hasCode = hasCodeBlocks(content);

  // Plain text: Render directly (no bundle loading)
  if (!hasMarkdown) {
    return (
      <div
        className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
          isDarkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {content}
      </div>
    );
  }

  // Markdown detected: Load renderer lazily
  return (
    <Suspense fallback={<MarkdownSkeleton isDarkMode={isDarkMode} />}>
      <MarkdownRenderer
        content={content}
        isDarkMode={isDarkMode}
        isStreaming={isStreaming}
        onOpenArtifacts={onOpenArtifacts}
        hasCodeBlocks={hasCode}
      />
    </Suspense>
  );
});

LazyMarkdown.displayName = "LazyMarkdown";

export default LazyMarkdown;
