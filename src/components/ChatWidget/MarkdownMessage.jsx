import { memo, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';
import { CopyIcon, CheckIcon } from '../common/Icon';

/**
 * Code Block Component with Copy Button (like Claude)
 */
const CodeBlock = memo(({ node, inline, className, children, isDarkMode, ...props }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  const handleCopy = useCallback(async () => {
    const code = String(children).replace(/\n$/, '');
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [children]);

  if (inline) {
    return (
      <code
        className={`px-1.5 py-0.5 rounded text-sm font-mono ${
          isDarkMode
            ? 'bg-haiintel-border/50 text-haiintel-accent'
            : 'bg-gray-200 text-gray-800'
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
            ? 'bg-haiintel-dark border-haiintel-border'
            : 'bg-gray-100 border-gray-300'
        }`}
      >
        <span
          className={`text-xs font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
            copied
              ? 'text-green-500'
              : isDarkMode
              ? 'text-gray-400 hover:text-gray-200 hover:bg-haiintel-border/50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
          title={copied ? 'Copied!' : 'Copy code'}
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

      {/* Code Content */}
      <pre
        className={`!mt-0 rounded-t-none rounded-b-lg overflow-x-auto ${
          isDarkMode ? 'bg-[#0d1117]' : 'bg-gray-50'
        }`}
      >
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
});
CodeBlock.displayName = 'CodeBlock';

/**
 * Markdown Message Component (like Claude)
 * Renders markdown with syntax highlighting, tables, lists, etc.
 */
const MarkdownMessage = memo(({ content, isDarkMode = true }) => {
  return (
    <div
      className={`prose prose-sm max-w-none ${
        isDarkMode ? 'prose-invert' : ''
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Code blocks
          code: ({ node, inline, className, children, ...props }) => (
            <CodeBlock
              node={node}
              inline={inline}
              className={className}
              isDarkMode={isDarkMode}
              {...props}
            >
              {children}
            </CodeBlock>
          ),

          // Links
          a: ({ node, children, ...props }) => (
            <a
              className={`underline ${
                isDarkMode ? 'text-haiintel-cyan' : 'text-blue-600'
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
                  isDarkMode ? 'divide-haiintel-border' : 'divide-gray-300'
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
                  ? 'bg-haiintel-dark text-haiintel-text'
                  : 'bg-gray-100 text-gray-900'
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
                isDarkMode ? 'text-haiintel-text' : 'text-gray-900'
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
                  ? 'border-haiintel-blue text-gray-400'
                  : 'border-gray-300 text-gray-600'
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
                isDarkMode ? 'text-haiintel-text' : 'text-gray-900'
              }`}
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ node, children, ...props }) => (
            <h2
              className={`text-xl font-bold my-3 ${
                isDarkMode ? 'text-haiintel-text' : 'text-gray-900'
              }`}
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ node, children, ...props }) => (
            <h3
              className={`text-lg font-bold my-2 ${
                isDarkMode ? 'text-haiintel-text' : 'text-gray-900'
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

MarkdownMessage.displayName = 'MarkdownMessage';

export default MarkdownMessage;
