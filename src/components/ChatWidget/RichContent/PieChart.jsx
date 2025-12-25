import { memo, useState, useCallback, useMemo } from "react";
import Tooltip from "../../common/Tooltip";

const PieChart = memo(({ data, isDarkMode = true }) => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const total = data.values.reduce((sum, val) => sum + val, 0);

  // Calculate percentages and colors
  const colors = useMemo(
    () => [
      "#2e90fa",
      "#00d4ff",
      "#8b5cf6",
      "#f59e0b",
      "#10b981",
      "#ef4444",
      "#ec4899",
      "#06b6d4",
      "#84cc16",
      "#f97316",
    ],
    []
  );

  const downloadAsSVG = useCallback(() => {
    const width = 400;
    const chartHeight = 400;
    const legendItemHeight = 25;
    const legendSpacing = 10;
    const totalHeight =
      chartHeight + data.labels.length * legendItemHeight + legendSpacing;

    const centerX = width / 2;
    const centerY = chartHeight / 2;
    const radius = 150;

    let svg = `<svg width="${width}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${totalHeight}" fill="${isDarkMode ? "#1a1a1a" : "#ffffff"}"/>
      <text x="${centerX}" y="30" text-anchor="middle" fill="${isDarkMode ? "#ffffff" : "#000000"}" font-size="18" font-weight="bold">${data.title}</text>`;

    let currentAngle = -90;
    data.values.forEach((value, index) => {
      const percentage = (value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle * (Math.PI / 180);
      const endAngle = (currentAngle + angle) * (Math.PI / 180);

      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const largeArc = angle > 180 ? 1 : 0;

      svg += `<path d="M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${colors[index % colors.length]}"/>`;

      currentAngle += angle;
    });

    // Legend
    const legendY = chartHeight + legendSpacing;
    data.labels.forEach((label, index) => {
      const yPos = legendY + index * legendItemHeight;
      svg += `<rect x="20" y="${yPos}" width="15" height="15" fill="${colors[index % colors.length]}"/>`;
      svg += `<text x="40" y="${yPos + 12}" fill="${isDarkMode ? "#999" : "#666"}" font-size="12">${label}: ${data.values[index]} (${((data.values[index] / total) * 100).toFixed(1)}%)</text>`;
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
  }, [data, isDarkMode, total, colors]);

  const downloadAsPNG = useCallback(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = 600;
    const chartHeight = 500;
    const legendItemHeight = 30;
    const legendSpacing = 40;
    const totalHeight =
      chartHeight + data.labels.length * legendItemHeight + legendSpacing;

    const centerX = width / 2;
    const centerY = chartHeight / 2;
    const radius = 180;

    canvas.width = width;
    canvas.height = totalHeight;

    // Background
    ctx.fillStyle = isDarkMode ? "#1a1a1a" : "#ffffff";
    ctx.fillRect(0, 0, width, totalHeight);

    // Title
    ctx.fillStyle = isDarkMode ? "#ffffff" : "#000000";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(data.title, centerX, 40);

    // Draw pie slices
    let currentAngle = -Math.PI / 2;
    data.values.forEach((value, index) => {
      const percentage = (value / total) * 100;
      const angle = (percentage / 100) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();

      currentAngle += angle;
    });

    // Legend
    const legendY = chartHeight + legendSpacing;
    data.labels.forEach((label, index) => {
      const yPos = legendY + index * legendItemHeight;
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(30, yPos, 20, 20);

      ctx.fillStyle = isDarkMode ? "#999999" : "#666666";
      ctx.font = "14px Arial";
      ctx.textAlign = "left";
      const percentage = ((data.values[index] / total) * 100).toFixed(1);
      ctx.fillText(
        `${label}: ${data.values[index]} (${percentage}%)`,
        60,
        yPos + 15
      );
    });

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
  }, [data, isDarkMode, total, colors]);

  return (
    <div
      className={`my-2 sm:my-3 rounded-lg p-2.5 sm:p-3 md:p-4 border ${
        isDarkMode
          ? "bg-haiintel-dark/50 border-haiintel-border"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h4
          className={`text-xs sm:text-sm font-semibold ${isDarkMode ? "text-haiintel-text" : "text-gray-900"}`}
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
                  className={`w-full px-3 py-2 text-left text-xs hover:bg-opacity-10 transition-colors rounded-b-lg ${
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

      {/* SVG Pie Chart */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 200 200" className="w-full max-w-xs">
          {(() => {
            let currentAngle = -90;
            return data.values.map((value, index) => {
              const percentage = (value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = currentAngle * (Math.PI / 180);
              const endAngle = (currentAngle + angle) * (Math.PI / 180);

              const x1 = 100 + 80 * Math.cos(startAngle);
              const y1 = 100 + 80 * Math.sin(startAngle);
              const x2 = 100 + 80 * Math.cos(endAngle);
              const y2 = 100 + 80 * Math.sin(endAngle);

              const largeArc = angle > 180 ? 1 : 0;

              const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

              currentAngle += angle;

              return (
                <path
                  key={index}
                  d={path}
                  fill={colors[index % colors.length]}
                  className="transition-opacity hover:opacity-80"
                />
              );
            });
          })()}
        </svg>

        {/* Legend */}
        <div className="mt-4 w-full space-y-1.5">
          {data.labels.map((label, index) => {
            const percentage = ((data.values[index] / total) * 100).toFixed(1);
            return (
              <div
                key={index}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    {label}
                  </span>
                </div>
                <span
                  className="font-semibold"
                  style={{ color: colors[index % colors.length] }}
                >
                  {data.values[index]} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

PieChart.displayName = "PieChart";

export default PieChart;
