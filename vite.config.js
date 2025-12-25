import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";
import { createHtmlPlugin } from "vite-plugin-html";
import { visualizer } from "rollup-plugin-visualizer";

// Custom plugin to make CSS non-render-blocking
function nonBlockingCss() {
  return {
    name: "non-blocking-css",
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="([^"]+)">/g,
        '<link rel="preload" as="style" href="$1" onload="this.onload=null;this.rel=\'stylesheet\'" crossorigin><noscript><link rel="stylesheet" href="$1" crossorigin></noscript>'
      );
    },
  };
}

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: "HaiIntel - AI-Powered Enterprise Solutions",
        },
      },
    }),
    nonBlockingCss(),
    compression({
      algorithm: "gzip",
      ext: ".gz",
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
    visualizer({
      filename: "dist/stats.html",
      open: true, // ✅ Changed to true - opens after build
      gzipSize: true,
      brotliSize: true,
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
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
        passes: 3,
        // ✅ Removed aggressive unsafe optimizations that can break Framer Motion
        unsafe: false,
        unsafe_comps: false,
        unsafe_math: false,
        unsafe_methods: false,
        unsafe_proto: false,
        unsafe_regexp: false,
        unsafe_undefined: false,
      },
      mangle: {
        safari10: true,
        toplevel: true,
      },
      format: {
        comments: false,
      },
    },
    assetsInlineLimit: 4096,
    sourcemap: false,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 500,
    modulePreload: false,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core vendor bundle (React only)
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/") ||
            id.includes("node_modules/react-is/") ||
            id.includes("node_modules/prop-types/")
          ) {
            return "vendor";
          }

          // Syntax highlighting - separate chunk for code blocks only
          // Only loads when code blocks are detected in messages
          if (
            id.includes("highlight.js") ||
            id.includes("CodeBlockWithHighlight") ||
            id.includes("highlightConfig")
          ) {
            return "syntax";
          }

          // Markdown rendering (without syntax highlighting)
          // Loads for any markdown content
          if (
            id.includes("react-markdown") ||
            id.includes("rehype-") ||
            id.includes("remark-") ||
            id.includes("MarkdownMessage") ||
            id.includes("LazyMarkdown")
          ) {
            return "markdown";
          }

          // Chat widget core
          if (id.includes("src/components/ChatWidget")) {
            return "chat";
          }
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "scheduler",
      "react-is",
      "prop-types",
      "framer-motion", // ✅ Added - pre-optimize in dev
    ],
    esbuildOptions: {
      target: "esnext",
    },
  },
  resolve: {
    dedupe: ["react", "react-dom", "scheduler"],
  },
});
