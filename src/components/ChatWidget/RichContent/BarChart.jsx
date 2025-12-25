import { memo, useRef, useCallback, useState } from "react";
import Tooltip from "../../common/Tooltip";

const BarChart = memo(({ data, isDarkMode = true }) => {
  const maxValue = Math.max(...data.values);
  const chartRef = useRef(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const downloadAsSVG = useCallback(() => {
    const width = 600;
    const height = 400;
    const padding = 60;
    const barHeight = 30;
    const barSpacing = 20;

    // Create SVG
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${
        isDarkMode ? "#1a1a1a" : "#ffffff"
      }"/>
      <text x="${width / 2}" y="30" text-anchor="middle" fill="${
        isDarkMode ? "#ffffff" : "#000000"
      }" font-size="18" font-weight="bold">${data.title}</text>`;

    data.labels.forEach((label, index) => {
      const value = data.values[index];
      const percentage = (value / maxValue) * 100;
      const barWidth = ((width - padding * 2) * percentage) / 100;
      const y = 60 + index * (barHeight + barSpacing);

      // Bar background
      svg += `<rect x="${padding}" y="${y}" width="${
        width - padding * 2
      }" height="${barHeight}" fill="${
        isDarkMode ? "#333" : "#f0f0f0"
      }" rx="4"/>`;
      // Bar
      svg += `<rect x="${padding}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#2e90fa" rx="4"/>`;
      // Label
      svg += `<text x="${padding - 10}" y="${
        y + barHeight / 2 + 5
      }" text-anchor="end" fill="${
        isDarkMode ? "#999" : "#666"
      }" font-size="12">${label}</text>`;
      // Value
      svg += `<text x="${padding + barWidth + 10}" y="${
        y + barHeight / 2 + 5
      }" fill="#2e90fa" font-size="12" font-weight="bold">${value}</text>`;
    });

    svg += "</svg>";

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.title.replace(/\s+/g, "_")}_chart.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  }, [data, isDarkMode, maxValue]);

  const downloadAsPNG = useCallback(() => {
    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = 800;
    const height = 500;
    const padding = 80;
    const barHeight = 40;
    const barSpacing = 25;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = isDarkMode ? "#1a1a1a" : "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = isDarkMode ? "#ffffff" : "#000000";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(data.title, width / 2, 40);

    // Draw bars
    data.labels.forEach((label, index) => {
      const value = data.values[index];
      const percentage = (value / maxValue) * 100;
      const barWidth = ((width - padding * 2) * percentage) / 100;
      const y = 80 + index * (barHeight + barSpacing);

      // Bar background
      ctx.fillStyle = isDarkMode ? "#333333" : "#f0f0f0";
      ctx.beginPath();
      ctx.roundRect(padding, y, width - padding * 2, barHeight, 6);
      ctx.fill();

      // Bar
      const gradient = ctx.createLinearGradient(
        padding,
        y,
        padding + barWidth,
        y
      );
      gradient.addColorStop(0, "#2e90fa");
      gradient.addColorStop(1, "#00d4ff");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(padding, y, barWidth, barHeight, 6);
      ctx.fill();

      // Label
      ctx.fillStyle = isDarkMode ? "#999999" : "#666666";
      ctx.font = "14px Arial";
      ctx.textAlign = "right";
      ctx.fillText(label, padding - 15, y + barHeight / 2 + 5);

      // Value
      ctx.fillStyle = "#2e90fa";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "left";
      ctx.fillText(
        value.toString(),
        padding + barWidth + 15,
        y + barHeight / 2 + 5
      );
    });

    // Convert to PNG and download
    canvas.toBlob((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.title.replace(/\s+/g, "_")}_chart.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
    setShowDownloadMenu(false);
  }, [data, isDarkMode, maxValue]);

  return (
    <div
      ref={chartRef}
      className={`my-2 sm:my-3 rounded-lg p-2.5 sm:p-3 md:p-4 border ${
        isDarkMode
          ? "bg-haiintel-dark/50 border-haiintel-border"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h4
          className={`text-xs sm:text-sm font-semibold ${
            isDarkMode ? "text-haiintel-text" : "text-gray-900"
          }`}
        >
          {data.title}
        </h4>
        <div className="relative">
          <Tooltip
            text="Download chart"
            position="left"
            isDarkMode={isDarkMode}
          >
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode
                  ? "hover:bg-haiintel-border text-gray-400 hover:text-gray-300"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
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
          </Tooltip>

          {showDownloadMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDownloadMenu(false)}
              />
              <div
                className={`absolute right-0 mt-1 w-32 rounded-lg border shadow-lg z-20 ${
                  isDarkMode
                    ? "bg-haiintel-dark border-haiintel-border"
                    : "bg-white border-gray-200"
                }`}
              >
                <button
                  onClick={downloadAsPNG}
                  className={`w-full px-3 py-2 text-left text-xs hover:bg-opacity-10 transition-colors rounded-t-lg ${
                    isDarkMode
                      ? "text-gray-300 hover:bg-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  📊 PNG Image
                </button>
                <button
                  onClick={downloadAsSVG}
                  className={`w-full px-3 py-2 text-left text-xs hover:bg-opacity-10 transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:bg-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  🎨 SVG Image
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {data.labels.map((label, index) => {
          const value = data.values[index];
          const percentage = (value / maxValue) * 100;

          return (
            <div key={index}>
              <div
                className={`flex justify-between text-[10px] sm:text-xs mb-0.5 sm:mb-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <span className="truncate mr-2">{label}</span>
                <span className="font-semibold text-haiintel-blue flex-shrink-0">
                  {value}
                </span>
              </div>
              <div className="h-1.5 sm:h-2 bg-haiintel-border/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-haiintel-blue to-haiintel-accent rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

BarChart.displayName = "BarChart";

export default BarChart;
