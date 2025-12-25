import {
  memo,
  useState,
  useCallback,
  useMemo,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { m, AnimatePresence } from "framer-motion";
import hljs from "../../utils/highlightConfig";
import "highlight.js/styles/github-dark.css";

// Lazy load chart components
const BarChart = lazy(() => import("./RichContent/BarChart"));
const PieChart = lazy(() => import("./RichContent/PieChart"));
const LineChart = lazy(() => import("./RichContent/LineChart"));

/**
 * Artifacts Panel - Claude-style code preview panel
 * Shows code in a side panel with tabs for multiple code blocks
 */
const ArtifactsPanel = memo(
  ({ artifacts, isOpen, onClose, isDarkMode = true }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [viewMode, setViewMode] = useState("preview");
    const [copied, setCopied] = useState(false);
    const [chartType, setChartType] = useState("bar"); // 'bar', 'pie', or 'line'

    const currentArtifact = artifacts?.[activeTab];
    const isChart = currentArtifact?.type === "chart";

    // Auto-switch to preview mode for charts
    useEffect(() => {
      if (isChart) {
        setViewMode("preview");
      }
    }, [isChart]);

    // Reset state when panel opens
    useEffect(() => {
      if (isOpen) {
        setActiveTab(0);
        setChartType("bar");
      }
    }, [isOpen]);

    const canPreview = useMemo(() => {
      if (!currentArtifact) return false;
      if (isChart) return true;
      const lang = currentArtifact.language?.toLowerCase();
      return ["html", "xml", "svg", "javascript", "js", "jsx", "css"].includes(
        lang
      );
    }, [currentArtifact, isChart]);

    const handleCopy = useCallback(async () => {
      if (!currentArtifact) return;
      try {
        if (isChart) {
          const csvContent = [
            ["Label", "Value"],
            ...currentArtifact.data.labels.map((label, index) => [
              label,
              currentArtifact.data.values[index],
            ]),
          ]
            .map((row) => row.join(","))
            .join("\n");
          await navigator.clipboard.writeText(csvContent);
        } else {
          await navigator.clipboard.writeText(currentArtifact.code);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }, [currentArtifact, isChart]);

    const handleDownload = useCallback(() => {
      if (!currentArtifact || isChart) return; // Charts have their own download buttons
      const extensions = {
        javascript: "js",
        typescript: "ts",
        python: "py",
        html: "html",
        css: "css",
        json: "json",
        jsx: "jsx",
        tsx: "tsx",
      };
      const ext = extensions[currentArtifact.language?.toLowerCase()] || "txt";
      const filename =
        currentArtifact.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() ||
        "code";

      const blob = new Blob([currentArtifact.code], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, [currentArtifact, isChart]);

    const previewContent = useMemo(() => {
      if (!currentArtifact || viewMode !== "preview") return null;

      // Chart preview
      if (isChart) {
        const ChartComponent =
          chartType === "pie"
            ? PieChart
            : chartType === "line"
              ? LineChart
              : BarChart;
        return (
          <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
            <div className="w-full max-w-2xl">
              <Suspense
                fallback={<div className="text-center">Loading chart...</div>}
              >
                <ChartComponent
                  data={currentArtifact.data}
                  isDarkMode={isDarkMode}
                />
              </Suspense>
            </div>
          </div>
        );
      }

      // Code preview
      const lang = currentArtifact.language?.toLowerCase();

      if (lang === "html" || lang === "xml") {
        return (
          <iframe
            srcDoc={currentArtifact.code}
            className="w-full h-full border-0"
            sandbox="allow-scripts"
            title="Preview"
          />
        );
      }

      if (lang === "svg") {
        return (
          <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
            <div dangerouslySetInnerHTML={{ __html: currentArtifact.code }} />
          </div>
        );
      }

      return (
        <div
          className={`p-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Preview not available for {currentArtifact.language}
        </div>
      );
    }, [currentArtifact, viewMode, isDarkMode, isChart, chartType]);

    return (
      <AnimatePresence>
        {isOpen && artifacts && artifacts.length > 0 && (
          <>
            {/* Backdrop */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-[9997]"
            />

            {/* Panel */}
            <m.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed right-0 top-0 h-full w-full lg:w-1/2 xl:w-2/5 flex flex-col border-l shadow-2xl z-[9998] ${
                isDarkMode
                  ? "bg-haiintel-darker border-haiintel-border"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Header */}
              <div
                className={`flex items-center justify-between px-4 py-3 border-b ${
                  isDarkMode ? "border-haiintel-border" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-haiintel-blue"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  <h3
                    className={`font-semibold text-sm ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Artifacts
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {/* Chart Type Selector (only for charts) */}
                  {isChart && (
                    <div
                      className={`flex items-center gap-1 p-1 rounded-lg ${
                        isDarkMode ? "bg-haiintel-dark" : "bg-gray-100"
                      }`}
                    >
                      <button
                        onClick={() => setChartType("bar")}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          chartType === "bar"
                            ? isDarkMode
                              ? "bg-haiintel-blue text-white"
                              : "bg-blue-500 text-white"
                            : isDarkMode
                              ? "text-gray-400 hover:text-gray-200"
                              : "text-gray-600 hover:text-gray-900"
                        }`}
                        title="Bar Chart"
                      >
                        📊
                      </button>
                      <button
                        onClick={() => setChartType("pie")}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          chartType === "pie"
                            ? isDarkMode
                              ? "bg-haiintel-blue text-white"
                              : "bg-blue-500 text-white"
                            : isDarkMode
                              ? "text-gray-400 hover:text-gray-200"
                              : "text-gray-600 hover:text-gray-900"
                        }`}
                        title="Pie Chart"
                      >
                        🥧
                      </button>
                      <button
                        onClick={() => setChartType("line")}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          chartType === "line"
                            ? isDarkMode
                              ? "bg-haiintel-blue text-white"
                              : "bg-blue-500 text-white"
                            : isDarkMode
                              ? "text-gray-400 hover:text-gray-200"
                              : "text-gray-600 hover:text-gray-900"
                        }`}
                        title="Line Chart"
                      >
                        📈
                      </button>
                    </div>
                  )}

                  {/* View Mode Toggle (Code/Preview) - only for code artifacts */}
                  {canPreview && !isChart && (
                    <div
                      className={`flex items-center gap-1 p-1 rounded-lg ${
                        isDarkMode ? "bg-haiintel-dark" : "bg-gray-100"
                      }`}
                    >
                      <button
                        onClick={() => setViewMode("code")}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          viewMode === "code"
                            ? isDarkMode
                              ? "bg-haiintel-blue text-white"
                              : "bg-white text-gray-900 shadow-sm"
                            : isDarkMode
                              ? "text-gray-400 hover:text-gray-200"
                              : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Code
                      </button>
                      <button
                        onClick={() => setViewMode("preview")}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          viewMode === "preview"
                            ? isDarkMode
                              ? "bg-haiintel-blue text-white"
                              : "bg-white text-gray-900 shadow-sm"
                            : isDarkMode
                              ? "text-gray-400 hover:text-gray-200"
                              : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Preview
                      </button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <button
                    onClick={handleCopy}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? "hover:bg-haiintel-border text-gray-400 hover:text-gray-200"
                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    }`}
                    title={copied ? "Copied!" : "Copy code"}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {copied ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      )}
                    </svg>
                  </button>

                  {!isChart && (
                    <button
                      onClick={handleDownload}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? "hover:bg-haiintel-border text-gray-400 hover:text-gray-200"
                          : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                      }`}
                      title="Download file"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
                  )}

                  <button
                    onClick={onClose}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? "hover:bg-haiintel-border text-gray-400 hover:text-gray-200"
                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    }`}
                    title="Close panel"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tabs (if multiple artifacts) */}
              {artifacts.length > 1 && (
                <div
                  className={`flex items-center gap-2 px-4 py-2 border-b overflow-x-auto ${
                    isDarkMode ? "border-haiintel-border" : "border-gray-200"
                  }`}
                >
                  {artifacts.map((artifact, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors ${
                        activeTab === index
                          ? isDarkMode
                            ? "bg-haiintel-blue text-white"
                            : "bg-blue-500 text-white"
                          : isDarkMode
                            ? "bg-haiintel-dark text-gray-400 hover:text-gray-200"
                            : "bg-gray-100 text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {artifact.title || `Code ${index + 1}`}
                    </button>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                {isChart ? (
                  // Chart - always show preview
                  <div className="h-full overflow-auto">{previewContent}</div>
                ) : // Code - show code or preview based on viewMode
                viewMode === "code" ? (
                  <div className="h-full overflow-auto">
                    <div
                      className={`p-4 ${
                        isDarkMode ? "bg-[#0d1117]" : "bg-gray-50"
                      }`}
                    >
                      <div className="text-xs font-medium mb-2 uppercase tracking-wide opacity-60">
                        {currentArtifact?.language || "code"}
                      </div>
                      <pre className="!bg-transparent !p-0 !m-0 text-sm">
                        <code
                          className={`language-${currentArtifact?.language || "plaintext"}`}
                          dangerouslySetInnerHTML={{
                            __html: hljs.highlightAuto(
                              currentArtifact?.code || "",
                              [currentArtifact?.language]
                            ).value,
                          }}
                        />
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="h-full overflow-auto">{previewContent}</div>
                )}
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);

ArtifactsPanel.displayName = "ArtifactsPanel";

export default ArtifactsPanel;
