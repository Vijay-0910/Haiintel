/**
 * Extract code blocks from markdown content
 * Returns an array of { language, code, title, type: 'code' } objects
 */
export function extractCodeBlocks(markdown) {
  if (!markdown) return [];

  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const artifacts = [];
  let match;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const language = match[1] || "text";
    const code = match[2].trim();

    // Generate a title based on language
    const titles = {
      javascript: "JavaScript Code",
      js: "JavaScript Code",
      typescript: "TypeScript Code",
      ts: "TypeScript Code",
      python: "Python Code",
      py: "Python Code",
      java: "Java Code",
      cpp: "C++ Code",
      c: "C Code",
      go: "Go Code",
      rust: "Rust Code",
      html: "HTML Document",
      css: "CSS Styles",
      jsx: "React Component",
      tsx: "React TypeScript Component",
      json: "JSON Data",
      sql: "SQL Query",
      bash: "Bash Script",
      sh: "Shell Script",
      xml: "XML Document",
      yaml: "YAML Config",
      yml: "YAML Config",
      markdown: "Markdown",
      md: "Markdown",
    };

    artifacts.push({
      type: "code",
      language,
      code,
      title: titles[language.toLowerCase()] || `${language} Code`,
    });
  }

  return artifacts;
}

/**
 * Extract artifacts (code blocks and charts) from a message
 * Returns an array of artifacts with type: 'code' or 'chart'
 */
export function extractArtifacts(message) {
  if (!message) return [];

  const artifacts = [];

  // Extract code blocks from text
  if (message.text) {
    const codeBlocks = extractCodeBlocks(message.text);
    artifacts.push(...codeBlocks);
  }

  // Extract chart if present
  if (message.chart) {
    artifacts.push({
      type: "chart",
      chartType: "bar",
      data: message.chart,
      title: message.chart.title || "Chart",
    });
  }

  return artifacts;
}
