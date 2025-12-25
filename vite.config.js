import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    // Gzip compression
    compression({
      algorithm: "gzip",
      ext: ".gz",
    }),
    // Brotli compression (better for web)
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Target modern browsers
    target: "esnext",
    // Use terser for better production minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    // Inline small assets
    assetsInlineLimit: 8192,
    // No source maps
    sourcemap: false,
    // CSS code splitting
    cssCodeSplit: true,
    // Warning threshold
    chunkSizeWarningLimit: 200,
    // Disable modulePreload polyfill
    modulePreload: {
      polyfill: false,
    },
    // Manual chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "chat-widget": [
            "./src/components/ChatWidget/ChatWidget.jsx",
            "./src/components/ChatWidget/ChatWindow.jsx",
            "./src/components/ChatWidget/ChatMessages.jsx",
            "./src/components/ChatWidget/MessageBubble.jsx",
          ],
          "landing-sections": [
            "./src/components/landing/sections/BannerSection.jsx",
            "./src/components/landing/sections/FeaturesSection.jsx",
            "./src/components/landing/sections/HowItWorksSection.jsx",
            "./src/components/landing/sections/UseCasesSection.jsx",
            "./src/components/landing/sections/CTASection.jsx",
          ],
        },
        // Optimize chunk file names
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
  },
  // Pre-bundle
  optimizeDeps: {
    include: ["react", "react-dom"],
    esbuildOptions: {
      // Optimize dependencies during dev
      target: "esnext",
    },
  },
});
