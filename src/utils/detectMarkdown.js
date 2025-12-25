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
 * Check if content needs full react-markdown or can use simplified renderer
 * Returns true if complex features detected (tables, HTML, task lists, blockquotes, etc.)
 */
export const needsFullMarkdown = (text) => {
  if (!text || typeof text !== "string") return false;

  return (
    /^\s*\|.+\|/m.test(text) || // Tables
    /<[a-z][\s\S]*>/i.test(text) || // HTML tags
    /^[-*]\s+\[[ xX]\]/m.test(text) || // Task lists
    /~~[^~]+~~/.test(text) || // Strikethrough
    /^\s*>/m.test(text) || // Blockquotes
    /^\s*\d+\.\s/m.test(text) || // Numbered lists
    /^#{4,6}\s/m.test(text) || // H4-H6 headings
    /```[\s\S]*?```/.test(text) // Code blocks (need syntax highlighting)
  );
};

/**
 * Estimate content complexity to decide rendering strategy
 */
export const getContentComplexity = (text) => {
  if (!text) return "empty";
  if (!hasMarkdownSyntax(text)) return "plain";
  if (needsFullMarkdown(text)) return "complex";
  if (hasCodeBlocks(text)) return "code";
  return "simple";
};
