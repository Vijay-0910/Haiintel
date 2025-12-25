import { memo, lazy, Suspense, useMemo } from "react";
import { detectMarkdownFeatures } from "../../utils/markdownFeatureDetection";

// Lazy load react-markdown (only when markdown is detected)
const ReactMarkdown = lazy(() => import("react-markdown"));

// Lazy load plugins only when needed
const loadRemarkGfm = () => import("remark-gfm");
const loadRehypeRaw = () => import("rehype-raw");

// Lazy load syntax highlighting only when code blocks exist
const CodeBlockWithHighlight = lazy(() =>
  import("./CodeBlockWithHighlight")
);

/**
 * Simple inline code component (no highlighting needed)
 */
const SimpleInlineCode = memo(({ children, isDarkMode }) => (
  <code
    className={`px-1.5 py-0.5 rounded text-sm font-mono ${
      isDarkMode
        ? "bg-haiintel-border/50 text-haiintel-accent"
        : "bg-gray-200 text-gray-800"
    }`}
  >
    {children}
  </code>
));
SimpleInlineCode.displayName = "SimpleInlineCode";

/**
 * Simple code block (no highlighting)
 */
const SimpleCodeBlock = memo(({ children, isDarkMode }) => (
  <pre
    className={`my-4 p-4 rounded-lg overflow-x-auto ${
      isDarkMode ? "bg-[#0d1117]" : "bg-gray-50"
    }`}
  >
    <code>{children}</code>
  </pre>
));
SimpleCodeBlock.displayName = "SimpleCodeBlock";

/**
 * Loading skeleton
 */
const MarkdownSkeleton = memo(({ isDarkMode }) => (
  <div className="space-y-2 animate-pulse">
    {[90, 75, 85].map((width, i) => (
      <div
        key={i}
        className={`h-4 rounded ${
          isDarkMode ? "bg-haiintel-border/50" : "bg-gray-200"
        }`}
        style={{ width: `${width}%` }}
      />
    ))}
  </div>
));
MarkdownSkeleton.displayName = "MarkdownSkeleton";

/**
 * Optimized Markdown Component
 * Only loads the features and plugins actually used in the content
 */
const OptimizedMarkdown = memo(({ content, isDarkMode = true, hasCodeBlocks = false }) => {
  // Detect which features are used
  const features = useMemo(() => detectMarkdownFeatures(content), [content]);

  // Build plugins array based on detected features
  const plugins = useMemo(() => {
    const remarkPlugins = [];
    const rehypePlugins = [];

    // Only load GFM if GFM features are detected
    if (features.hasGFM) {
      remarkPlugins.push(loadRemarkGfm);
    }

    // Only load rehype-raw if HTML is detected
    if (features.hasHTML) {
      rehypePlugins.push(loadRehypeRaw);
    }

    return { remarkPlugins, rehypePlugins };
  }, [features]);

  // Code component - lazy load highlighting only if code blocks exist
  const CodeComponent = useMemo(() => {
    if (!hasCodeBlocks) {
      return ({ inline, children }) =>
        inline ? (
          <SimpleInlineCode isDarkMode={isDarkMode}>{children}</SimpleInlineCode>
        ) : (
          <SimpleCodeBlock isDarkMode={isDarkMode}>{children}</SimpleCodeBlock>
        );
    }

    return ({ node, inline, className, children, ...props }) => {
      if (inline) {
        return <SimpleInlineCode isDarkMode={isDarkMode}>{children}</SimpleInlineCode>;
      }

      return (
        <Suspense
          fallback={
            <div
              className={`my-4 h-24 rounded-lg animate-pulse ${
                isDarkMode ? "bg-haiintel-border/50" : "bg-gray-200"
              }`}
            />
          }
        >
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
      );
    };
  }, [hasCodeBlocks, isDarkMode]);

  // Markdown components
  const components = useMemo(
    () => ({
      code: CodeComponent,
      a: ({ children, ...props }) => (
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
      table: ({ children, ...props }) => (
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
      th: ({ children, ...props }) => (
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
      td: ({ children, ...props }) => (
        <td
          className={`px-4 py-2 text-sm ${
            isDarkMode ? "text-haiintel-text" : "text-gray-900"
          }`}
          {...props}
        >
          {children}
        </td>
      ),
      blockquote: ({ children, ...props }) => (
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
      ul: ({ children, ...props }) => (
        <ul className="list-disc list-inside my-2 space-y-1" {...props}>
          {children}
        </ul>
      ),
      ol: ({ children, ...props }) => (
        <ol className="list-decimal list-inside my-2 space-y-1" {...props}>
          {children}
        </ol>
      ),
      p: ({ children, ...props }) => (
        <p className="my-2 leading-relaxed" {...props}>
          {children}
        </p>
      ),
      h1: ({ children, ...props }) => (
        <h1
          className={`text-2xl font-bold my-4 ${
            isDarkMode ? "text-haiintel-text" : "text-gray-900"
          }`}
          {...props}
        >
          {children}
        </h1>
      ),
      h2: ({ children, ...props }) => (
        <h2
          className={`text-xl font-bold my-3 ${
            isDarkMode ? "text-haiintel-text" : "text-gray-900"
          }`}
          {...props}
        >
          {children}
        </h2>
      ),
      h3: ({ children, ...props }) => (
        <h3
          className={`text-lg font-bold my-2 ${
            isDarkMode ? "text-haiintel-text" : "text-gray-900"
          }`}
          {...props}
        >
          {children}
        </h3>
      ),
    }),
    [CodeComponent, isDarkMode]
  );

  return (
    <div
      className={`prose prose-sm max-w-none ${
        isDarkMode ? "prose-invert" : ""
      }`}
    >
      <Suspense fallback={<MarkdownSkeleton isDarkMode={isDarkMode} />}>
        <ReactMarkdown
          remarkPlugins={plugins.remarkPlugins}
          rehypePlugins={plugins.rehypePlugins}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </Suspense>
    </div>
  );
});

OptimizedMarkdown.displayName = "OptimizedMarkdown";

export default OptimizedMarkdown;
