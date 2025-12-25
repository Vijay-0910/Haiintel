import { memo, lazy, Suspense } from "react";

// Lazy load syntax highlighting only when code blocks exist
const CodeBlockWithHighlight = lazy(() => import("./CodeBlockWithHighlight"));

/**
 * Custom Lightweight Markdown Parser
 * ZERO dependencies, ~3-4 KB total
 * Supports: bold, italic, links, images, lists, tables, code, blockquotes, headings, strikethrough, task lists
 */

const CodeBlockSkeleton = memo(({ isDarkMode }) => (
  <div className={`my-4 h-24 rounded-lg animate-pulse ${isDarkMode ? "bg-haiintel-border/50" : "bg-gray-200"}`} />
));
CodeBlockSkeleton.displayName = "CodeBlockSkeleton";

const CustomMarkdown = memo(({ content, isDarkMode = true, hasCodeBlocks = false }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let i = 0;

  // Process inline formatting (bold, italic, code, links, images, strikethrough)
  const processInline = (text) => {
    const parts = [];
    let lastIndex = 0;

    // Combined regex for all inline elements
    const pattern = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))|(!\[([^\]]*)\]\(([^)]+)\))|(~~([^~]+)~~)/g;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      if (match[2]) {
        // **bold**
        parts.push(<strong key={match.index} className="font-semibold">{match[2]}</strong>);
      } else if (match[4]) {
        // *italic*
        parts.push(<em key={match.index} className="italic">{match[4]}</em>);
      } else if (match[6]) {
        // `code`
        parts.push(
          <code key={match.index} className={`px-1.5 py-0.5 rounded text-sm font-mono ${isDarkMode ? "bg-haiintel-border/50 text-haiintel-accent" : "bg-gray-200 text-gray-800"}`}>
            {match[6]}
          </code>
        );
      } else if (match[8] && match[9]) {
        // [link](url)
        parts.push(
          <a key={match.index} href={match[9]} className={`underline ${isDarkMode ? "text-haiintel-cyan" : "text-blue-600"} hover:opacity-80`} target="_blank" rel="noopener noreferrer">
            {match[8]}
          </a>
        );
      } else if (match[11] && match[12]) {
        // ![alt](url)
        parts.push(<img key={match.index} src={match[12]} alt={match[11]} className="max-w-full h-auto rounded-lg my-2" />);
      } else if (match[14]) {
        // ~~strikethrough~~
        parts.push(<del key={match.index} className="line-through opacity-70">{match[14]}</del>);
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Parse tables
  const parseTable = (startIndex) => {
    const tableLines = [];
    let j = startIndex;

    while (j < lines.length && lines[j].trim().startsWith('|')) {
      tableLines.push(lines[j]);
      j++;
    }

    if (tableLines.length < 2) return null;

    const headers = tableLines[0].split('|').map(h => h.trim()).filter(h => h);
    const rows = tableLines.slice(2).map(row =>
      row.split('|').map(cell => cell.trim()).filter(cell => cell !== '')
    );

    elements.push(
      <div key={`table-${startIndex}`} className="overflow-x-auto my-4">
        <table className={`min-w-full divide-y ${isDarkMode ? "divide-haiintel-border" : "divide-gray-300"}`}>
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className={`px-4 py-2 text-left text-xs font-semibold ${isDarkMode ? "bg-haiintel-dark text-haiintel-text" : "bg-gray-100 text-gray-900"}`}>
                  {processInline(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className={`px-4 py-2 text-sm ${isDarkMode ? "text-haiintel-text" : "text-gray-900"}`}>
                    {processInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    return j - 1;
  };

  // Parse code blocks
  const parseCodeBlock = (startIndex) => {
    const langMatch = lines[startIndex].match(/```(\w+)?/);
    const language = langMatch?.[1] || '';
    let j = startIndex + 1;
    const codeLines = [];

    while (j < lines.length && !lines[j].trim().startsWith('```')) {
      codeLines.push(lines[j]);
      j++;
    }

    const code = codeLines.join('\n');

    if (hasCodeBlocks && language) {
      elements.push(
        <Suspense key={`code-${startIndex}`} fallback={<CodeBlockSkeleton isDarkMode={isDarkMode} />}>
          <CodeBlockWithHighlight className={`language-${language}`} isDarkMode={isDarkMode}>
            {code}
          </CodeBlockWithHighlight>
        </Suspense>
      );
    } else {
      elements.push(
        <pre key={`code-${startIndex}`} className={`my-4 p-4 rounded-lg overflow-x-auto ${isDarkMode ? "bg-[#0d1117]" : "bg-gray-50"}`}>
          <code>{code}</code>
        </pre>
      );
    }

    return j;
  };

  // Parse lists
  const parseList = (startIndex, ordered = false) => {
    const items = [];
    let j = startIndex;

    while (j < lines.length) {
      const trimmed = lines[j].trim();
      if (!trimmed) break;

      const isTaskList = /^[-*]\s+\[[ xX]\]/.test(trimmed);
      const isUnordered = /^[-*]\s+/.test(trimmed);
      const isOrdered = /^\d+\.\s+/.test(trimmed);

      if (ordered && !isOrdered) break;
      if (!ordered && !isUnordered) break;

      let itemText = '';
      let checked = false;

      if (isTaskList) {
        checked = /\[x\]/i.test(trimmed);
        itemText = trimmed.replace(/^[-*]\s+\[[ xX]\]\s*/, '');
      } else if (isUnordered) {
        itemText = trimmed.replace(/^[-*]\s+/, '');
      } else if (isOrdered) {
        itemText = trimmed.replace(/^\d+\.\s+/, '');
      }

      items.push(
        <li key={j} className={isTaskList ? "flex items-start gap-2" : ""}>
          {isTaskList && (
            <input type="checkbox" checked={checked} readOnly className="mt-1" />
          )}
          <span>{processInline(itemText)}</span>
        </li>
      );
      j++;
    }

    const ListTag = ordered ? 'ol' : 'ul';
    const listClass = ordered ? "list-decimal list-inside my-2 space-y-1" : "list-disc list-inside my-2 space-y-1";

    elements.push(
      <ListTag key={`list-${startIndex}`} className={listClass}>
        {items}
      </ListTag>
    );

    return j - 1;
  };

  // Main parsing loop
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      i++;
      continue;
    }

    // Code block
    if (trimmed.startsWith('```')) {
      i = parseCodeBlock(i) + 1;
      continue;
    }

    // Table
    if (trimmed.startsWith('|')) {
      const newIndex = parseTable(i);
      if (newIndex) {
        i = newIndex + 1;
        continue;
      }
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const Tag = `h${level}`;
      const classes = {
        1: 'text-2xl font-bold my-4',
        2: 'text-xl font-bold my-3',
        3: 'text-lg font-bold my-2',
        4: 'text-base font-bold my-2',
        5: 'text-sm font-bold my-2',
        6: 'text-xs font-bold my-2',
      };

      elements.push(
        <Tag key={i} className={`${classes[level]} ${isDarkMode ? "text-haiintel-text" : "text-gray-900"}`}>
          {processInline(text)}
        </Tag>
      );
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^>\s*/, '');
      elements.push(
        <blockquote key={i} className={`border-l-4 pl-4 my-4 italic ${isDarkMode ? "border-haiintel-blue text-gray-400" : "border-gray-300 text-gray-600"}`}>
          {processInline(quoteText)}
        </blockquote>
      );
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      i = parseList(i, false) + 1;
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      i = parseList(i, true) + 1;
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(trimmed)) {
      elements.push(
        <hr key={i} className={`my-4 ${isDarkMode ? "border-haiintel-border" : "border-gray-300"}`} />
      );
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="my-2 leading-relaxed">
        {processInline(trimmed)}
      </p>
    );
    i++;
  }

  return (
    <div className={`text-sm sm:text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
      {elements}
    </div>
  );
});

CustomMarkdown.displayName = "CustomMarkdown";

export default CustomMarkdown;
