/** @type {import('tailwindcss').Config} */

// ============================================
// HAIINTEL OFFICIAL BRAND COLORS
// ============================================
// Extracted from haiintel.com CSS (Dark Mode)
// HSL values converted to HEX
// ============================================

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'haiintel': {
          // Background colors (from hsl(220 40% 8%) and hsl(220 35% 12%))
          'dark': '#0a1628',           // Main background - Deep space blue
          'darker': '#141d2e',         // Card/elevated backgrounds
          'elevated': '#1a2942',       // Slightly elevated elements

          // Border colors (from hsl(220 25% 20%))
          'border': '#262e3f',         // Default borders
          'border-light': '#2f3a52',   // Light borders

          // Text colors (from hsl(0 0% 98%) and hsl(220 8% 65%))
          'text': '#fafafa',           // Primary text - Lightning white
          'text-secondary': '#e0e0e0', // Secondary text
          'text-muted': '#9ca3b4',     // Muted text (from muted-foreground)

          // Brand accent colors (from CSS variables)
          'blue': '#2e90fa',           // Intelligence Blue (hsl(214 84% 56%))
          'purple': '#a78bfa',         // Neon Purple (hsl(267 64% 60%))
          'accent': '#f59e0b',         // Warm Amber (hsl(38 92% 50%))
          'cyan': '#00d4ff',           // Electric Cyan (hsl(192 100% 50%))
          'green': '#32ff62',          // Electric Green (hsl(120 100% 55%))

          // Navy/Gray shades (from CSS variables)
          'navy': '#141d2e',           // Deep Navy (hsl(220 35% 12%))
          'gray': '#21283a',           // Soft Gray (hsl(220 25% 16%))

          // Message bubble colors
          'user-msg': '#2e90fa',       // User message - Intelligence Blue
          'ai-msg': '#1a2942',         // AI message - Darker background
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0a1628, #1a2942)',
        'gradient-accent': 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        'gradient-blue': 'linear-gradient(135deg, #2e90fa, #60a5fa)',
        'gradient-subtle': 'linear-gradient(180deg, #0a1628, #0d1a2d)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'elegant': '0 20px 25px -5px rgba(10, 22, 40, 0.4), 0 10px 10px -5px rgba(10, 22, 40, 0.2)',
        'intelligence': '0 10px 30px -10px rgba(46, 144, 250, 0.4)',
        'warm': '0 10px 30px -10px rgba(245, 158, 11, 0.3)',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translate3d(0, 20px, 0)', opacity: '0' },
          '100%': { transform: 'translate3d(0, 0, 0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translate3d(0, 0, 0)', opacity: '1' },
          '100%': { transform: 'translate3d(0, 20px, 0)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateZ(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateZ(0)' },
          '100%': { opacity: '0', transform: 'translateZ(0)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -8px, 0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'translateZ(0)' },
          '50%': { opacity: '0.7', transform: 'translateZ(0)' },
        },
        spin: {
          '0%': { transform: 'rotate3d(0, 0, 1, 0deg)' },
          '100%': { transform: 'rotate3d(0, 0, 1, 180deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0', transform: 'translateZ(0)' },
          '100%': { backgroundPosition: '1000px 0', transform: 'translateZ(0)' },
        },
      },
      animation: {
        'slide-up': 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) both',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) both',
        'fade-in': 'fadeIn 0.2s ease-out both',
        'fade-out': 'fadeOut 0.2s ease-out both',
        'bounce': 'bounce 0.6s ease-in-out infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'spin-slow': 'spin 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}
