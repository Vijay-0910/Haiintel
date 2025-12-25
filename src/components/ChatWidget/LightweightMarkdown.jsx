import { memo, lazy, Suspense } from "react";
import Markdown from "markdown-to-jsx";

// Lazy load syntax highlighting only when needed
const CodeBlockWithHighlight = lazy(() => import("./CodeBlockWithHighlight"));

/**
 * Lightweight Markdown Component using markdown-to-jsx
 * ~8-10 KB vs ~35 KB for react-markdown (70% smaller!)
 *
 * Supports: GFM tables, task lists, strikethrough, and all standard markdown
 * No need for separate remark/rehype plugins
 */

const CodeBlockSkeleton = memo(({ isDarkMode }) => (
  <div
    className={`my-4 h-24 rounded-lg animate-pulse ${
      isDarkMode ? "bg-haiintel-border/50" : "bg-gray-200"
    }`}
  />
));
CodeBlockSkeleton.displayName = "CodeBlockSkeleton";

const LightweightMarkdown = memo(({ content, isDarkMode = true, hasCodeBlocks = false }) => {
  // Custom component overrides for styling
  const options = {
    overrides: {
      // Code blocks - with or without syntax highlighting
      code: {
        component: ({ className, children, ...props }) => {
          const inline = !className;

          // Inline code
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

          // Code blocks with syntax highlighting
          if (hasCodeBlocks) {
            return (
              <Suspense fallback={<CodeBlockSkeleton isDarkMode={isDarkMode} />}>
                <CodeBlockWithHighlight
                  className={className}
                  isDarkMode={isDarkMode}
                  {...props}
                >
                  {children}
                </CodeBlockWithHighlight>
              </Suspense>
            );
          }

          // Simple code block without highlighting
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
        },
      },

      // Links
      a: {
        component: ({ children, ...props }) => (
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
      },

      // Tables
      table: {
        component: ({ children, ...props }) => (
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
      },

      th: {
        component: ({ children, ...props }) => (
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
      },

      td: {
        component: ({ children, ...props }) => (
          <td
            className={`px-4 py-2 text-sm ${
              isDarkMode ? "text-haiintel-text" : "text-gray-900"
            }`}
            {...props}
          >
            {children}
          </td>
        ),
      },

      // Blockquotes
      blockquote: {
        component: ({ children, ...props }) => (
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
      },

      // Lists
      ul: {
        component: ({ children, ...props }) => (
          <ul className="list-disc list-inside my-2 space-y-1" {...props}>
            {children}
          </ul>
        ),
      },

      ol: {
        component: ({ children, ...props }) => (
          <ol className="list-decimal list-inside my-2 space-y-1" {...props}>
            {children}
          </ol>
        ),
      },

      // Paragraphs
      p: {
        component: ({ children, ...props }) => (
          <p className="my-2 leading-relaxed" {...props}>
            {children}
          </p>
        ),
      },

      // Headings
      h1: {
        component: ({ children, ...props }) => (
          <h1
            className={`text-2xl font-bold my-4 ${
              isDarkMode ? "text-haiintel-text" : "text-gray-900"
            }`}
            {...props}
          >
            {children}
          </h1>
        ),
      },

      h2: {
        component: ({ children, ...props }) => (
          <h2
            className={`text-xl font-bold my-3 ${
              isDarkMode ? "text-haiintel-text" : "text-gray-900"
            }`}
            {...props}
          >
            {children}
          </h2>
        ),
      },

      h3: {
        component: ({ children, ...props }) => (
          <h3
            className={`text-lg font-bold my-2 ${
              isDarkMode ? "text-haiintel-text" : "text-gray-900"
            }`}
            {...props}
          >
            {children}
          </h3>
        ),
      },

      // Strikethrough
      del: {
        component: ({ children, ...props }) => (
          <del className="line-through opacity-70" {...props}>
            {children}
          </del>
        ),
      },
    },
  };

  return (
    <div
      className={`prose prose-sm max-w-none ${
        isDarkMode ? "prose-invert" : ""
      }`}
    >
      <Markdown options={options}>{content}</Markdown>
    </div>
  );
});

LightweightMarkdown.displayName = "LightweightMarkdown";

export default LightweightMarkdown;
