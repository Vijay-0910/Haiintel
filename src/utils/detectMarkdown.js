/**
 * Markdown Detection Utilities
 * Detects if text contains markdown syntax to avoid loading react-markdown unnecessarily
 */

/**
 * Check if text contains markdown syntax
 * Returns false for plain text to avoid loading 96 KB markdown bundle
 */
export const hasMarkdownSyntax = (text) => {
  if (!text || typeof text !== "string") return false;

  // Common markdown patterns
  const markdownPatterns = [
    /\*\*[^*]+\*\*/,           // Bold: **text**
    /\*[^*]+\*/,               // Italic: *text*
    /__[^_]+__/,               // Bold: __text__
    /_[^_]+_/,                 // Italic: _text_
    /^#{1,6}\s/m,              // Headers: # Header
    /^\s*[-*+]\s/m,            // Lists: - item
    /^\s*\d+\.\s/m,            // Numbered lists: 1. item
    /\[([^\]]+)\]\(([^)]+)\)/, // Links: [text](url)
    /!\[([^\]]*)\]\(([^)]+)\)/, // Images: ![alt](url)
    /`[^`]+`/,                 // Inline code: `code`
    /```[\s\S]*?```/,          // Code blocks: ```code```
    /^\s*>/m,                  // Blockquotes: > quote
    /^\s*---\s*$/m,            // Horizontal rules: ---
    /\|.*\|.*\|/,              // Tables: | col | col |
  ];

  return markdownPatterns.some((pattern) => pattern.test(text));
};

/**
 * Check if text contains code blocks
 * Returns true only if ``` or indented code blocks exist
 */
export const hasCodeBlocks = (text) => {
  if (!text || typeof text !== "string") return false;

  return (
    /```[\s\S]*?```/.test(text) ||    // Fenced code blocks
    /^\s{4,}[^\s]/m.test(text)        // Indented code blocks
  );
};

/**
 * Estimate content complexity to decide rendering strategy
 */
export const getContentComplexity = (text) => {
  if (!text) return "empty";
  if (!hasMarkdownSyntax(text)) return "plain";
  if (hasCodeBlocks(text)) return "code";
  return "markdown";
};
