import { memo } from "react";

/**
 * Ultra-lightweight markdown renderer for simple content
 * No dependencies, no react-markdown, just pure string parsing
 * Handles: bold, italic, code, links, lists, line breaks
 *
 * Use this for simple messages without tables, HTML, or complex features
 * Falls back to OptimizedMarkdown for complex content
 */

const SimplifiedMarkdown = memo(({ content, isDarkMode = true }) => {
  // Split into paragraphs and lines
  const lines = content.split('\n');
  const elements = [];
  let currentList = null;
  let currentListItems = [];

  const processInlineFormatting = (text) => {
    const parts = [];
    let lastIndex = 0;

    // Match: **bold**, *italic*, `code`, [link](url)
    const pattern = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      if (match[2]) {
        // Bold
        parts.push(
          <strong key={match.index} className="font-semibold">
            {match[2]}
          </strong>
        );
      } else if (match[4]) {
        // Italic
        parts.push(
          <em key={match.index} className="italic">
            {match[4]}
          </em>
        );
      } else if (match[6]) {
        // Inline code
        parts.push(
          <code
            key={match.index}
            className={`px-1.5 py-0.5 rounded text-sm font-mono ${
              isDarkMode
                ? "bg-haiintel-border/50 text-haiintel-accent"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {match[6]}
          </code>
        );
      } else if (match[8] && match[9]) {
        // Link
        parts.push(
          <a
            key={match.index}
            href={match[9]}
            className={`underline ${
              isDarkMode ? "text-haiintel-cyan" : "text-blue-600"
            } hover:opacity-80 transition-opacity`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {match[8]}
          </a>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line - close current list if any
    if (!trimmed) {
      if (currentList) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside my-2 space-y-1">
            {currentListItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
        currentList = null;
        currentListItems = [];
      }
      continue;
    }

    // List item: - item or * item
    if (/^[-*]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*]\s+/, '');
      currentListItems.push(processInlineFormatting(itemText));
      currentList = true;
      continue;
    }

    // Close list if we hit non-list content
    if (currentList) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside my-2 space-y-1">
          {currentListItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
      currentList = null;
      currentListItems = [];
    }

    // Heading: ### Heading
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const HeadingTag = `h${level}`;
      const sizeClasses = {
        1: 'text-2xl font-bold my-4',
        2: 'text-xl font-bold my-3',
        3: 'text-lg font-bold my-2',
      };

      elements.push(
        <HeadingTag
          key={i}
          className={`${sizeClasses[level]} ${
            isDarkMode ? "text-haiintel-text" : "text-gray-900"
          }`}
        >
          {processInlineFormatting(text)}
        </HeadingTag>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="my-2 leading-relaxed">
        {processInlineFormatting(trimmed)}
      </p>
    );
  }

  // Close any remaining list
  if (currentList) {
    elements.push(
      <ul key={`list-${elements.length}`} className="list-disc list-inside my-2 space-y-1">
        {currentListItems.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className={`text-sm sm:text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
      {elements}
    </div>
  );
});

SimplifiedMarkdown.displayName = "SimplifiedMarkdown";

export default SimplifiedMarkdown;
