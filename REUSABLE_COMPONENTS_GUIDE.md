# Reusable Components Guide

Complete guide for using the new reusable component system in the HaiIntel Chat Widget.

---

## 📋 Table of Contents

1. [Configuration & Constants](#configuration--constants)
2. [Theme System](#theme-system)
3. [Utility Functions](#utility-functions)
4. [Reusable Components](#reusable-components)
5. [Migration Examples](#migration-examples)
6. [Best Practices](#best-practices)

---

## ⚙️ Configuration & Constants

### `src/config/constants.js`

Centralized configuration for all magic numbers and hardcoded values.

```javascript
import { CHAT_CONFIG, ANIMATION_CONFIG, UI_CONFIG } from '../config/constants';

// Instead of hardcoding:
const speed = 80; // ❌

// Use constants:
const speed = CHAT_CONFIG.STREAMING_SPEED; // ✅
```

**Available Constants:**
- `CHAT_CONFIG` - Chat-related timings and limits
- `ANIMATION_CONFIG` - Animation durations and delays
- `UI_CONFIG` - Z-indexes, sizes, breakpoints
- `THEME_CONFIG` - Theme configuration
- `API_CONFIG` - API endpoints and timeouts

---

## 🎨 Theme System

### Using Theme Context (Eliminates Prop Drilling)

**Current (40+ components passing `isDarkMode`):**
```javascript
// ❌ Prop drilling through multiple levels
<ChatWidget isDarkMode={isDarkMode}>
  <ChatWindow isDarkMode={isDarkMode}>
    <ChatMessages isDarkMode={isDarkMode}>
      <MessageBubble isDarkMode={isDarkMode} />
    </ChatMessages>
  </ChatWindow>
</ChatWidget>
```

**New Approach:**
```javascript
// ✅ Use Theme Context
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={isDarkMode ? 'dark-class' : 'light-class'}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

**Setup in App.jsx:**
```javascript
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

---

## 🛠️ Utility Functions

### `src/utils/themeUtils.js`

Helper functions to reduce repetitive theme-based styling.

**Before (Repetitive):**
```javascript
// ❌ Duplicated everywhere
className={`
  ${isDarkMode
    ? 'bg-haiintel-darker border-haiintel-border text-haiintel-text'
    : 'bg-white border-gray-200 text-gray-900'
  }
`}
```

**After (Reusable):**
```javascript
// ✅ Clean and reusable
import { getBgClasses, getTextClasses } from '../utils/themeUtils';

className={`${getBgClasses(isDarkMode)} ${getTextClasses(isDarkMode)}`}
```

**Available Utilities:**
- `getBgClasses(isDarkMode, options)` - Background and border classes
- `getTextClasses(isDarkMode, options)` - Text color classes
- `getMutedTextClasses(isDarkMode)` - Muted/secondary text
- `getInputClasses(isDarkMode, focused)` - Input field styling
- `getButtonClasses(isDarkMode, variant)` - Button variants
- `getCardClasses(isDarkMode, options)` - Card/container styling
- `getHoverClasses(isDarkMode)` - Hover state classes
- `getComponentTheme(isDarkMode, component)` - Predefined component themes
- `cx(...classes)` - Combine classes (filters falsy values)

---

## 🧩 Reusable Components

### 1. Icon Component

**Location:** `src/components/common/Icon.jsx`

Centralized SVG icons with consistent sizing.

```javascript
import Icon, { ChatIcon, CloseIcon, SendIcon } from '../components/common/Icon';

// Full control
<Icon type="chat" size="md" color="currentColor" />

// Named exports
<ChatIcon size="lg" className="text-blue-500" />
<CloseIcon size="sm" onClick={handleClose} />
<SendIcon size="md" ariaLabel="Send message" />
```

**Available Icons:**
- `chat`, `close`, `send`, `mic`
- `trash`, `copy`, `check`
- `sun`, `moon`, `menu`, `speaker`, `warning`
- `github`, `twitter`, `linkedin`

**Sizes:** `xs`, `sm`, `md`, `lg`, `xl`

**Example Migration:**
```javascript
// ❌ Before: Hardcoded SVG
<svg className="w-5 h-5" fill="none" stroke="currentColor">
  <path d="M6 18L18 6M6 6l12 12" />
</svg>

// ✅ After: Reusable Icon
<CloseIcon size="md" />
```

---

### 2. Input Component

**Location:** `src/components/common/Input.jsx`

Reusable text input with label, error states, and icons.

```javascript
import Input, { TextArea } from '../components/common/Input';

// Text Input
<Input
  type="email"
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  error={!!emailError}
  helperText={emailError || "We'll never share your email"}
  icon={<MailIcon />}
  iconPosition="left"
  isDarkMode={isDarkMode}
  fullWidth
/>

// TextArea
<TextArea
  label="Message"
  placeholder="Type your message..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  rows={3}
  autoResize
  minHeight="60px"
  maxHeight="200px"
  isDarkMode={isDarkMode}
/>
```

**Props:**
- `label` - Optional label text
- `error` - Boolean for error state
- `helperText` - Help or error message
- `icon` - Icon element to display
- `iconPosition` - 'left' or 'right'
- `fullWidth` - Take full width of container
- `autoResize` - Auto-resize based on content (TextArea only)

---

### 3. Enhanced Button Component

**Location:** `src/components/common/Button.jsx`

Enhanced with new variants, loading state, and accessibility.

```javascript
import Button from '../components/common/Button';

// Primary button with loading
<Button
  variant="primary"
  size="md"
  loading={isSubmitting}
  onClick={handleSubmit}
  type="submit"
  ariaLabel="Submit form"
  isDarkMode={isDarkMode}
>
  Submit
</Button>

// Button with icon
<Button
  variant="gradient"
  icon={<SendIcon />}
  iconPosition="right"
  fullWidth
>
  Send Message
</Button>

// Ghost button
<Button variant="ghost" size="sm">
  Cancel
</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>
```

**New Props:**
- `loading` - Show loading spinner
- `fullWidth` - Take full width
- `type` - 'button', 'submit', 'reset'
- `ariaLabel` - Accessibility label

**New Variants:**
- `ghost` - Transparent background
- `danger` - Red for destructive actions
- `success` - Green for success actions

**New Sizes:**
- `xs` - Extra small

---

## 🔄 Migration Examples

### Example 1: ChatInput Component

**Before:**
```javascript
// ❌ Hardcoded values
<textarea
  placeholder="Message HaiIntel..."
  style={{ minHeight: "22px", maxHeight: "100px" }}
  className={`bg-transparent ${
    isDarkMode ? "text-haiintel-text placeholder-gray-500" : "text-gray-900"
  }`}
/>
```

**After:**
```javascript
// ✅ Using reusable components and constants
import { TextArea } from '../components/common/Input';
import { CHAT_CONFIG } from '../config/constants';
import { useTheme } from '../contexts/ThemeContext';

function ChatInput() {
  const { isDarkMode } = useTheme();

  return (
    <TextArea
      placeholder={CHAT_CONFIG.DEFAULT_PLACEHOLDER}
      minHeight={`${CHAT_CONFIG.MIN_TEXTAREA_HEIGHT}px`}
      maxHeight={`${CHAT_CONFIG.MAX_TEXTAREA_HEIGHT}px`}
      autoResize
      isDarkMode={isDarkMode}
    />
  );
}
```

---

### Example 2: MessageBubble Component

**Before:**
```javascript
// ❌ Hardcoded streaming speed
const { displayedText } = useStreamingText(message.text, 80, isStreaming);

// ❌ Hardcoded copy timeout
setTimeout(() => setCopied(false), 2000);
```

**After:**
```javascript
// ✅ Using constants
import { CHAT_CONFIG } from '../config/constants';

const { displayedText } = useStreamingText(
  message.text,
  CHAT_CONFIG.STREAMING_SPEED,
  isStreaming
);

setTimeout(() => setCopied(false), CHAT_CONFIG.COPY_FEEDBACK_DURATION);
```

---

### Example 3: Theme-Aware Container

**Before:**
```javascript
// ❌ Inline ternary operator
<div className={`
  rounded-xl p-4 border
  ${isDarkMode
    ? 'bg-haiintel-dark/50 border-haiintel-border'
    : 'bg-white border-gray-200 shadow-sm'
  }
`}>
  Content
</div>
```

**After:**
```javascript
// ✅ Using theme utilities
import { getCardClasses } from '../utils/themeUtils';
import { useTheme } from '../contexts/ThemeContext';

function MyCard({ children }) {
  const { isDarkMode } = useTheme();

  return (
    <div className={getCardClasses(isDarkMode, { padding: 'p-4', rounded: 'rounded-xl' })}>
      {children}
    </div>
  );
}
```

---

### Example 4: Icon Usage

**Before:**
```javascript
// ❌ Duplicate SVG code in multiple components
<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
  />
</svg>
```

**After:**
```javascript
// ✅ Reusable Icon component
import { TrashIcon } from '../components/common/Icon';

<TrashIcon size="lg" className="text-white" />
```

---

## ✅ Best Practices

### 1. Use Theme Context
```javascript
// ✅ Good - Use context
import { useTheme } from '../contexts/ThemeContext';
const { isDarkMode } = useTheme();

// ❌ Bad - Prop drilling
<Component isDarkMode={isDarkMode} />
```

### 2. Use Constants for Values
```javascript
// ✅ Good - Centralized constants
import { CHAT_CONFIG } from '../config/constants';
const speed = CHAT_CONFIG.STREAMING_SPEED;

// ❌ Bad - Magic numbers
const speed = 80;
```

### 3. Use Utility Functions
```javascript
// ✅ Good - Reusable utilities
import { getBgClasses } from '../utils/themeUtils';
className={getBgClasses(isDarkMode)}

// ❌ Bad - Inline ternary
className={isDarkMode ? 'bg-dark' : 'bg-light'}
```

### 4. Use Reusable Components
```javascript
// ✅ Good - Reusable components
import Button from '../components/common/Button';
<Button variant="primary">Click</Button>

// ❌ Bad - Inline styles
<button className="bg-blue-500 text-white px-4 py-2">Click</button>
```

### 5. Proper Component Composition
```javascript
// ✅ Good - Compose from reusable parts
import Input from '../components/common/Input';
import { MailIcon } from '../components/common/Icon';

<Input icon={<MailIcon />} placeholder="Email" />

// ❌ Bad - Monolithic component
<CustomInputWithEverything type="email" showIcon />
```

---

## 📊 Component Reusability Checklist

When creating or refactoring a component, ensure:

- [ ] No hardcoded values - use `constants.js`
- [ ] No prop drilling - use Context when needed
- [ ] No inline ternary for theme - use `themeUtils.js`
- [ ] No duplicate SVG code - use `Icon` component
- [ ] No hardcoded form inputs - use `Input/TextArea` components
- [ ] All props have sensible defaults
- [ ] Component accepts `className` prop for customization
- [ ] Accessibility attributes included (`aria-label`, etc.)
- [ ] Component is memoized if appropriate (`memo()`)
- [ ] Component has a `displayName`

---

## 🎯 Next Steps

1. **Wrap App with ThemeProvider** in `src/main.jsx`
2. **Replace hardcoded values** with constants from `config/constants.js`
3. **Refactor components** to use `useTheme()` instead of prop drilling
4. **Replace inline theme conditionals** with utility functions
5. **Replace hardcoded icons** with `Icon` component
6. **Replace form inputs** with reusable `Input/TextArea` components
7. **Update Button usage** to use new variants and props

---

## 📝 Summary

This reusable component system provides:

✅ **Centralized Configuration** - All magic numbers in one place
✅ **Theme Context** - Eliminates 40+ prop drilling instances
✅ **Utility Functions** - Reduce repetitive theme-based code
✅ **Reusable Components** - Icon, Input, Button with full customization
✅ **Better Maintainability** - Change once, update everywhere
✅ **Type Safety Ready** - Easy to add TypeScript later
✅ **Better Accessibility** - Built-in ARIA attributes
✅ **Consistent UI** - Same patterns across all components

---

*For questions or issues, refer to individual component files or the codebase documentation.*
