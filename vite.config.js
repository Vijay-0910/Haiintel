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
      // Convert CSS link tags to use preload with async loading
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
    // HTML optimization plugin
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: "HaiIntel - AI-Powered Enterprise Solutions",
        },
      },
    }),
    // Make CSS non-render-blocking
    nonBlockingCss(),
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
    // Bundle analyzer (run build to generate stats.html)
    visualizer({
      filename: "dist/stats.html",
      open: false,
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
    // Target modern browsers for better tree shaking
    target: "esnext",
    // Use terser for better production minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
        passes: 3,
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
      },
      mangle: {
        safari10: true,
        toplevel: true,
      },
      format: {
        comments: false,
      },
    },
    // Inline only very small assets (4KB instead of 8KB)
    // Prevents large images from being inlined as base64
    assetsInlineLimit: 4096,
    // No source maps
    sourcemap: false,
    // Disable CSS code splitting to reduce render-blocking requests
    cssCodeSplit: false,
    // Warning threshold
    chunkSizeWarningLimit: 500,
    // Disable modulePreload to eliminate dependency chains
    modulePreload: false,
    // CSS minification
    cssMinify: true,
    // Optimized chunk splitting to reduce initial requests
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core vendor bundle (React only - critical deps)
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/") ||
            id.includes("node_modules/react-is/") ||
            id.includes("node_modules/prop-types/")
          ) {
            return "vendor";
          }
          // Framer Motion - split domAnimation features separately
          // NOTE: With LazyMotion, only the minimal 'm' component and domAnimation features load
          if (id.includes("node_modules/framer-motion")) {
            // Keep domAnimation features in vendor for tree-shaking
            if (id.includes("render/dom")) {
              return "vendor";
            }
            // Separate full motion library (should barely be used now)
            return "animations";
          }
          // Chat libraries (lazy loaded)
          if (
            id.includes("react-markdown") ||
            id.includes("highlight.js") ||
            id.includes("rehype-") ||
            id.includes("remark-") ||
            id.includes("src/components/ChatWidget")
          ) {
            return "chat";
          }
        },
        // Optimize chunk file names
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
  },
  // Pre-bundle and deduplicate
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "scheduler",
      "react-is",
      "prop-types",
      // Pre-bundle Framer Motion domAnimation for faster dev startup
      "framer-motion/dist/es/render/dom/features-animation.mjs",
    ],
    esbuildOptions: {
      // Optimize dependencies during dev
      target: "esnext",
    },
  },
  // Deduplicate React packages
  resolve: {
    dedupe: ["react", "react-dom", "scheduler"],
  },
});
