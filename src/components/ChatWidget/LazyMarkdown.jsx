import { lazy, Suspense, memo } from "react";
import { hasMarkdownSyntax, hasCodeBlocks, needsFullMarkdown } from "../../utils/detectMarkdown";

// Lazy load renderers based on content complexity
const SimplifiedMarkdown = lazy(() => import("./SimplifiedMarkdown")); // ~2 KB - for simple formatting
const OptimizedMarkdown = lazy(() => import("./OptimizedMarkdown"));   // ~36 KB - for complex features

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
 * Smart Markdown Component - Three-tier strategy:
 * 1. Plain text: Direct render (0 KB overhead)
 * 2. Simple markdown: SimplifiedMarkdown (~2 KB) - bold, italic, links, lists, headings
 * 3. Complex markdown: OptimizedMarkdown (~36 KB) - tables, HTML, code blocks, etc.
 */
const LazyMarkdown = memo(({ content, isDarkMode, isStreaming, onOpenArtifacts }) => {
  // Quick check: Is this plain text?
  const hasMarkdown = hasMarkdownSyntax(content);
  const needsComplex = needsFullMarkdown(content);
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

  // Simple markdown: Use lightweight renderer (no react-markdown dependency)
  if (!needsComplex) {
    return (
      <Suspense fallback={<MarkdownSkeleton isDarkMode={isDarkMode} />}>
        <SimplifiedMarkdown content={content} isDarkMode={isDarkMode} />
      </Suspense>
    );
  }

  // Complex markdown: Load full optimized renderer
  return (
    <Suspense fallback={<MarkdownSkeleton isDarkMode={isDarkMode} />}>
      <OptimizedMarkdown
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
