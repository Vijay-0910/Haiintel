import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    // HTML optimization plugin
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: "HaiIntel - AI-Powered Enterprise Solutions",
        },
      },
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
    // Enable modulePreload for faster loading
    modulePreload: {
      polyfill: true,
      resolveDependencies: (filename, deps, { hostId, hostType }) => {
        // Preload all dependencies
        return deps;
      },
    },
    // Manual chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Keep React and React-DOM together - critical for initial render
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react-vendor";
          }
          // Framer Motion - used in hero section (critical)
          if (id.includes("node_modules/framer-motion")) {
            return "framer-motion";
          }
          // Chat widget - lazy loaded
          if (id.includes("src/components/ChatWidget")) {
            return "chat-widget";
          }
          // Landing sections - lazy loaded
          if (
            id.includes("src/components/landing/sections") &&
            !id.includes("HeroSection")
          ) {
            return "landing-sections";
          }
          // Other node_modules
          if (id.includes("node_modules")) {
            return "vendor";
          }
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
