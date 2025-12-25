# HaiIntel Color Extraction Guide

## Quick Method: Browser DevTools

### Step 1: Extract Colors from haiintel.com

1. **Open haiintel.com in Chrome/Firefox**
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Paste this script** and press Enter:

```javascript
// HaiIntel Color Extractor Script
(function() {
  const colors = new Set();

  // Get all elements
  const elements = document.querySelectorAll('*');

  // Extract colors from each element
  elements.forEach(el => {
    const styles = window.getComputedStyle(el);

    // Background colors
    if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      colors.add(`Background: ${styles.backgroundColor}`);
    }

    // Text colors
    if (styles.color) {
      colors.add(`Text: ${styles.color}`);
    }

    // Border colors
    if (styles.borderColor && styles.borderColor !== 'rgb(0, 0, 0)') {
      colors.add(`Border: ${styles.borderColor}`);
    }

    // Gradients
    if (styles.backgroundImage && styles.backgroundImage.includes('gradient')) {
      colors.add(`Gradient: ${styles.backgroundImage}`);
    }
  });

  // Convert to array and sort
  const colorArray = Array.from(colors).sort();

  // Display results
  console.log('=== HAIINTEL COLOR PALETTE ===');
  console.log('\nTotal unique colors found:', colors.size);
  console.log('\n--- ALL COLORS ---');
  colorArray.forEach(color => console.log(color));

  // RGB to HEX converter helper
  console.log('\n--- RGB TO HEX CONVERTER ---');
  console.log('To convert RGB to HEX, use: rgbToHex(r, g, b)');
  window.rgbToHex = (r, g, b) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join('');
  };

  // Copy most common colors
  const mostCommon = {
    backgrounds: [],
    texts: [],
    borders: [],
    gradients: []
  };

  colorArray.forEach(color => {
    if (color.startsWith('Background:')) mostCommon.backgrounds.push(color);
    if (color.startsWith('Text:')) mostCommon.texts.push(color);
    if (color.startsWith('Border:')) mostCommon.borders.push(color);
    if (color.startsWith('Gradient:')) mostCommon.gradients.push(color);
  });

  console.log('\n--- ORGANIZED BY TYPE ---');
  console.log('\nBackgrounds:', mostCommon.backgrounds.slice(0, 10));
  console.log('\nText Colors:', mostCommon.texts.slice(0, 10));
  console.log('\nBorders:', mostCommon.borders.slice(0, 10));
  console.log('\nGradients:', mostCommon.gradients.slice(0, 5));

  return {
    all: colorArray,
    backgrounds: mostCommon.backgrounds,
    texts: mostCommon.texts,
    borders: mostCommon.borders,
    gradients: mostCommon.gradients
  };
})();
```

### Step 2: Take Screenshots

1. **Take screenshot of homepage** - note the exact colors you see
2. **Use Color Picker Extension** (Chrome: ColorZilla, Eye Dropper)
3. **Click on different elements** to get exact hex values

### Step 3: Manual Inspection

1. **Right-click** on any element → Inspect
2. **Look at Styles tab** → check:
   - `background-color`
   - `color`
   - `border-color`
   - `background` (for gradients)
3. **Note CSS variables** (look for `--color-*` or `--brand-*`)

---

## Alternative Method: View Source

1. **Go to haiintel.com**
2. **Right-click** → View Page Source
3. **Search for**:
   - `.css` files (look for linked stylesheets)
   - `<style>` tags
   - CSS variables like `--color-primary`
   - Hex codes like `#` followed by 6 characters

---

## Step 4: Update Your Project

Once you have the colors, update `/tailwind.config.js`:

```javascript
colors: {
  'haiintel': {
    // REPLACE THESE with actual values from haiintel.com
    'dark': '#YOUR_COLOR_HERE',
    'darker': '#YOUR_COLOR_HERE',
    'elevated': '#YOUR_COLOR_HERE',
    'border': '#YOUR_COLOR_HERE',
    'border-light': '#YOUR_COLOR_HERE',
    'text': '#YOUR_COLOR_HERE',
    'text-secondary': '#YOUR_COLOR_HERE',
    'text-muted': '#YOUR_COLOR_HERE',
    'blue': '#YOUR_COLOR_HERE',
    'purple': '#YOUR_COLOR_HERE',
    'accent': '#YOUR_COLOR_HERE',
    'user-msg': '#YOUR_COLOR_HERE',
    'ai-msg': '#YOUR_COLOR_HERE',
  },
}
```

---

## Common Color Patterns to Look For

### Dark Theme Backgrounds
- **Darkest**: Usually `#000000` to `#0f0f0f`
- **Dark**: Usually `#0a0a0a` to `#1a1a1a`
- **Card backgrounds**: Usually `#141414` to `#1f1f1f`

### Text Colors
- **Primary**: Usually `#ffffff` (white)
- **Secondary**: Usually `#e5e5e5` to `#d1d1d1`
- **Muted**: Usually `#999999` to `#666666`

### Brand Colors
- Look for vibrant blues, purples, or unique brand colors
- Often used in buttons, links, highlights

### Borders
- Usually subtle: `#222222` to `#333333`

---

## RGB to HEX Quick Reference

Use this online tool: https://www.rgbtohex.net/

Or use the `rgbToHex()` function from the script above:
```javascript
rgbToHex(59, 130, 246)  // Returns: #3b82f6
```

---

## After Updating Colors

1. **Save** `tailwind.config.js`
2. **Restart dev server**:
   ```bash
   npm run dev
   ```
3. **Check the website** - colors should now match!
4. **Fine-tune** any colors that don't look quite right

---

## Need Help?

If colors look off:
1. Check contrast ratios (text should be readable)
2. Verify gradient directions
3. Make sure hover states are visible
4. Test in dark/light conditions

---

## Pro Tip: Screenshot Comparison

1. Take screenshot of haiintel.com
2. Take screenshot of your local site
3. Open both in image editor
4. Compare side-by-side
5. Use color picker on original to match exactly
