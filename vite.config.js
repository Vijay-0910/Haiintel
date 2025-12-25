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

// Preload critical chunks for faster initial load
function preloadCriticalChunks() {
  return {
    name: "preload-critical-chunks",
    transformIndexHtml(html) {
      // Note: Hash values are dynamic, this is a template
      // Actual implementation should extract from manifest
      return html.replace(
        "</head>",
        `  <!-- Preload critical resources -->
  <link rel="dns-prefetch" href="https://haiintel.vercel.app">
  <link rel="preconnect" href="https://haiintel.vercel.app" crossorigin>
</head>`
      );
    },
  };
}

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
      // Optimize JSX runtime
      babel: {
        plugins: [
          // Add any Babel plugins if needed
        ],
      },
    }),
    createHtmlPlugin({
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true,
      },
      inject: {
        data: {
          title: "HaiIntel - AI-Powered Enterprise Solutions",
        },
      },
    }),
    preloadCriticalChunks(),
    nonBlockingCss(),
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024, // Only compress files > 1KB
      deleteOriginFile: false,
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024,
      deleteOriginFile: false,
    }),
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: "treemap", // 'treemap', 'sunburst', 'network'
    }),
  ],

  server: {
    port: 5173,
    host: true, // Expose to network
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  preview: {
    port: 4173,
    host: true,
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
        // Safe optimizations only
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
        ecma: 2020,
      },
    },
    assetsInlineLimit: 4096, // Inline assets < 4KB
    sourcemap: false, // Disable in production
    cssCodeSplit: true, // Enable CSS code splitting per chunk
    chunkSizeWarningLimit: 600,
    modulePreload: {
      polyfill: false, // Modern browsers only
      resolveDependencies: (filename, deps, { hostId, hostType }) => {
        // Only preload critical dependencies
        if (filename.includes("index")) {
          return deps.filter(
            (dep) =>
              dep.includes("vendor-react") ||
              dep.includes("hero") ||
              dep.includes("navbar")
          );
        }
        return [];
      },
    },
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // ========================================
          // 1. CRITICAL PATH - Core React (always loaded first)
          // ========================================
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/") ||
            id.includes("node_modules/react-is/") ||
            id.includes("node_modules/prop-types/")
          ) {
            return "vendor-react";
          }

          // ========================================
          // 2. HERO SECTION - Critical for LCP
          // ========================================
          if (id.includes("src/components/landing/sections/HeroSection")) {
            return "hero";
          }

          // ========================================
          // 3. NAVBAR - Critical (above fold)
          // ========================================
          if (id.includes("src/components/landing/Navbar")) {
            return "navbar";
          }

          // ========================================
          // 4. LANDING PAGE SECTIONS - Lazy loaded on scroll
          // ========================================
          if (id.includes("src/components/landing/sections/")) {
            const sectionMatch = id.match(/\/sections\/([^/]+)\.jsx?$/);
            if (sectionMatch) {
              const sectionName = sectionMatch[1].toLowerCase();
              // Skip hero as it's already handled above
              if (sectionName !== "herosection") {
                return `lazy-${sectionName}`;
              }
            }
          }

          // ========================================
          // 5. FOOTER - Lazy loaded
          // ========================================
          if (id.includes("src/components/landing/Footer")) {
            return "lazy-footer";
          }

          // ========================================
          // 6. FRAMER MOTION - Deferred animation library
          // ========================================
          if (id.includes("framer-motion")) {
            return "lib-motion";
          }

          // ========================================
          // 7. CHAT WIDGET - Loaded on idle
          // ========================================
          if (id.includes("src/components/ChatWidget")) {
            return "lazy-chat";
          }

          // ========================================
          // 8. CODE HIGHLIGHTING - Loaded on demand
          // ========================================
          if (
            id.includes("highlight.js") ||
            id.includes("CodeBlockWithHighlight") ||
            id.includes("highlightConfig")
          ) {
            return "lazy-syntax";
          }

          // ========================================
          // 9. MARKDOWN RENDERERS - Loaded with chat
          // ========================================
          if (id.includes("SimplifiedMarkdown")) {
            return "lazy-markdown-simple";
          }

          if (id.includes("CustomMarkdown")) {
            return "lazy-markdown";
          }

          // ========================================
          // 10. ARTIFACTS & THINKING - Loaded on demand
          // ========================================
          if (id.includes("ArtifactsPanel")) {
            return "lazy-artifacts";
          }

          if (id.includes("ThinkingBlock")) {
            return "lazy-thinking";
          }

          // ========================================
          // 11. OTHER NODE_MODULES - Vendor bundle
          // ========================================
          if (id.includes("node_modules")) {
            // Group by package for better caching
            const match = id.match(/node_modules\/(@[^/]+\/[^/]+|[^/]+)/);
            if (match) {
              const packageName = match[1];

              // Common utilities together
              if (
                packageName === "lodash" ||
                packageName === "date-fns" ||
                packageName === "clsx" ||
                packageName === "classnames"
              ) {
                return "vendor-utils";
              }

              // UI/styling libraries
              if (
                packageName.includes("tailwind") ||
                packageName.includes("postcss")
              ) {
                return "vendor-style";
              }

              // Everything else
              return "vendor-libs";
            }
          }

          // Default: let Vite decide
          return undefined;
        },

        // Output file naming
        chunkFileNames: (chunkInfo) => {
          // Add hash for cache busting
          return "assets/js/[name]-[hash].js";
        },
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          // Organize assets by type
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return "assets/images/[name]-[hash].[ext]";
          }

          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return "assets/fonts/[name]-[hash].[ext]";
          }

          if (ext === "css") {
            return "assets/css/[name]-[hash].[ext]";
          }

          return "assets/[ext]/[name]-[hash].[ext]";
        },
      },

      // External dependencies (if any)
      external: [],
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
      "framer-motion", // Pre-optimize in dev
    ],
    exclude: [
      // Exclude large libs that should be lazy loaded
    ],
    esbuildOptions: {
      target: "esnext",
      supported: {
        // Ensure modern features are supported
        "top-level-await": true,
      },
    },
  },

  resolve: {
    alias: {
      // Add path aliases if needed
      // '@': path.resolve(__dirname, './src'),
      // '@components': path.resolve(__dirname, './src/components'),
    },
    dedupe: ["react", "react-dom", "scheduler", "framer-motion"],
    extensions: [".mjs", ".js", ".jsx", ".json", ".ts", ".tsx"],
  },

  // Ensure proper tree-shaking
  esbuild: {
    treeShaking: true,
    legalComments: "none", // Remove license comments
    logOverride: {
      "this-is-undefined-in-esm": "silent",
    },
  },

  // CSS configuration
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      // Add preprocessor options if using SCSS/LESS
    },
  },

  // Performance optimizations
  performance: {
    maxEntrypointSize: 512000, // 500KB
    maxAssetSize: 512000,
  },
});
