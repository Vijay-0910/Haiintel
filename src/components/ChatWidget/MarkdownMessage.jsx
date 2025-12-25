import { memo, lazy, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// Lazy load syntax highlighting only when code blocks exist
const CodeBlockWithHighlight = lazy(() =>
  import("./CodeBlockWithHighlight")
);

/**
 * Simple Code Block Component (no syntax highlighting)
 * Used when content has no code blocks to avoid loading highlight.js
 */
const SimpleCodeBlock = memo(
  ({ inline, className, children, isDarkMode, ...props }) => {
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
      <pre
        className={`my-4 p-4 rounded-lg overflow-x-auto ${
          isDarkMode ? "bg-[#0d1117]" : "bg-gray-50"
        }`}
      >
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  }
);
SimpleCodeBlock.displayName = "SimpleCodeBlock";

const CodeBlockSkeleton = memo(({ isDarkMode }) => (
  <div
    className={`my-4 h-24 rounded-lg animate-pulse ${
      isDarkMode ? "bg-haiintel-border/50" : "bg-gray-200"
    }`}
  />
));
CodeBlockSkeleton.displayName = "CodeBlockSkeleton";

/**
 * Markdown Message Component (like Claude)
 * Renders markdown with syntax highlighting, tables, lists, etc.
 * Optimized to lazy load syntax highlighting only when needed
 */
const MarkdownMessage = memo(({ content, isDarkMode = true, hasCodeBlocks = false }) => {
  // Choose code block component based on whether syntax highlighting is needed
  const CodeComponent = hasCodeBlocks
    ? ({ node, inline, className, children, ...props }) => (
        <Suspense fallback={<CodeBlockSkeleton isDarkMode={isDarkMode} />}>
          <CodeBlockWithHighlight
            node={node}
            inline={inline}
            className={className}
            isDarkMode={isDarkMode}
            {...props}
          >
            {children}
          </CodeBlockWithHighlight>
        </Suspense>
      )
    : ({ inline, className, children, ...props }) => (
        <SimpleCodeBlock
          inline={inline}
          className={className}
          isDarkMode={isDarkMode}
          {...props}
        >
          {children}
        </SimpleCodeBlock>
      );

  return (
    <div
      className={`prose prose-sm max-w-none ${
        isDarkMode ? "prose-invert" : ""
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Code blocks - conditionally use syntax highlighting
          code: CodeComponent,

          // Links
          a: ({ node, children, ...props }) => (
            <a
              className={`underline ${
                isDarkMode ? "text-haiintel-cyan" : "text-blue-600"
              } hover:opacity-80 transition-opacity`}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),

          // Tables
          table: ({ node, children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table
                className={`min-w-full divide-y ${
                  isDarkMode ? "divide-haiintel-border" : "divide-gray-300"
                }`}
                {...props}
              >
                {children}
              </table>
            </div>
          ),

          // Table headers
          th: ({ node, children, ...props }) => (
            <th
              className={`px-4 py-2 text-left text-xs font-semibold ${
                isDarkMode
                  ? "bg-haiintel-dark text-haiintel-text"
                  : "bg-gray-100 text-gray-900"
              }`}
              {...props}
            >
              {children}
            </th>
          ),

          // Table cells
          td: ({ node, children, ...props }) => (
            <td
              className={`px-4 py-2 text-sm ${
                isDarkMode ? "text-haiintel-text" : "text-gray-900"
              }`}
              {...props}
            >
              {children}
            </td>
          ),

          // Blockquotes
          blockquote: ({ node, children, ...props }) => (
            <blockquote
              className={`border-l-4 pl-4 my-4 italic ${
                isDarkMode
                  ? "border-haiintel-blue text-gray-400"
                  : "border-gray-300 text-gray-600"
              }`}
              {...props}
            >
              {children}
            </blockquote>
          ),

          // Unordered lists
          ul: ({ node, children, ...props }) => (
            <ul className="list-disc list-inside my-2 space-y-1" {...props}>
              {children}
            </ul>
          ),

          // Ordered lists
          ol: ({ node, children, ...props }) => (
            <ol className="list-decimal list-inside my-2 space-y-1" {...props}>
              {children}
            </ol>
          ),

          // Paragraphs
          p: ({ node, children, ...props }) => (
            <p className="my-2 leading-relaxed" {...props}>
              {children}
            </p>
          ),

          // Headings
          h1: ({ node, children, ...props }) => (
            <h1
              className={`text-2xl font-bold my-4 ${
                isDarkMode ? "text-haiintel-text" : "text-gray-900"
              }`}
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ node, children, ...props }) => (
            <h2
              className={`text-xl font-bold my-3 ${
                isDarkMode ? "text-haiintel-text" : "text-gray-900"
              }`}
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ node, children, ...props }) => (
            <h3
              className={`text-lg font-bold my-2 ${
                isDarkMode ? "text-haiintel-text" : "text-gray-900"
              }`}
              {...props}
            >
              {children}
            </h3>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownMessage.displayName = "MarkdownMessage";

export default MarkdownMessage;
