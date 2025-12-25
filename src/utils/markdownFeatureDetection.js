/**
 * Detect which markdown features are used in content
 * This allows us to lazy load only the necessary plugins
 */

export function detectMarkdownFeatures(content) {
  if (!content || typeof content !== 'string') {
    return {
      hasGFM: false,
      hasTables: false,
      hasTaskLists: false,
      hasStrikethrough: false,
      hasHTML: false,
      hasAutolinks: false,
    };
  }

  return {
    // GFM Tables: | header | header |
    hasTables: /^\|[^\n]+\|/m.test(content),

    // Task lists: - [ ] or - [x]
    hasTaskLists: /^[-*]\s+\[[ xX]\]/m.test(content),

    // Strikethrough: ~~text~~
    hasStrikethrough: /~~[^~]+~~/.test(content),

    // HTML tags: <div>, <span>, etc.
    hasHTML: /<[a-z][\s\S]*>/i.test(content),

    // Autolinks: http:// or https://
    hasAutolinks: /https?:\/\/[^\s<>]+/i.test(content),

    // Any GFM feature
    get hasGFM() {
      return this.hasTables || this.hasTaskLists || this.hasStrikethrough || this.hasAutolinks;
    },
  };
}
