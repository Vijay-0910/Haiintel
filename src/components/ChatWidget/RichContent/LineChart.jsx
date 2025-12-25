import { memo, useState, useCallback } from "react";

const LineChart = memo(({ data, isDarkMode = true }) => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const maxValue = Math.max(...data.values);
  const minValue = Math.min(...data.values, 0);
  const range = maxValue - minValue || 1;

  const downloadAsCSV = useCallback(() => {
    const csvContent = [
      ['Label', 'Value'],
      ...data.labels.map((label, index) => [label, data.values[index]])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/\s+/g, '_')}_chart.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  }, [data]);

  const downloadAsSVG = useCallback(() => {
    const width = 600;
    const height = 400;
    const padding = 60;

    // Create SVG
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${isDarkMode ? '#1a1a1a' : '#ffffff'}"/>
      <text x="${width/2}" y="30" text-anchor="middle" fill="${isDarkMode ? '#ffffff' : '#000000'}" font-size="18" font-weight="bold">${data.title}</text>`;

    // Draw axes
    svg += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="${isDarkMode ? '#666' : '#ccc'}" stroke-width="2"/>`;
    svg += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="${isDarkMode ? '#666' : '#ccc'}" stroke-width="2"/>`;

    // Calculate points
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const pointSpacing = chartWidth / (data.values.length - 1 || 1);

    let pathD = '';
    data.values.forEach((value, index) => {
      const x = padding + index * pointSpacing;
      const y = height - padding - ((value - minValue) / range) * chartHeight;

      if (index === 0) {
        pathD += `M ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
      }

      // Draw points
      svg += `<circle cx="${x}" cy="${y}" r="4" fill="#2e90fa"/>`;

      // Draw labels
      svg += `<text x="${x}" y="${height - padding + 20}" text-anchor="middle" fill="${isDarkMode ? '#999' : '#666'}" font-size="12">${data.labels[index]}</text>`;

      // Draw values
      svg += `<text x="${x}" y="${y - 10}" text-anchor="middle" fill="#2e90fa" font-size="12" font-weight="bold">${value}</text>`;
    });

    // Draw line
    svg += `<path d="${pathD}" stroke="#2e90fa" stroke-width="3" fill="none"/>`;

    svg += '</svg>';

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/\s+/g, '_')}_chart.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  }, [data, isDarkMode, maxValue, minValue, range]);

  const downloadAsPNG = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 500;
    const padding = 80;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = isDarkMode ? '#1a1a1a' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = isDarkMode ? '#ffffff' : '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(data.title, width / 2, 40);

    // Draw axes
    ctx.strokeStyle = isDarkMode ? '#666666' : '#cccccc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Calculate points
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const pointSpacing = chartWidth / (data.values.length - 1 || 1);

    // Draw line with gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#2e90fa');
    gradient.addColorStop(1, '#00d4ff');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    data.values.forEach((value, index) => {
      const x = padding + index * pointSpacing;
      const y = height - padding - ((value - minValue) / range) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points and labels
    data.values.forEach((value, index) => {
      const x = padding + index * pointSpacing;
      const y = height - padding - ((value - minValue) / range) * chartHeight;

      // Point
      ctx.fillStyle = '#2e90fa';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      // White border
      ctx.strokeStyle = isDarkMode ? '#1a1a1a' : '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = isDarkMode ? '#999999' : '#666666';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(data.labels[index], x, height - padding + 25);

      // Value
      ctx.fillStyle = '#2e90fa';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(value.toString(), x, y - 15);
    });

    canvas.toBlob((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.title.replace(/\s+/g, '_')}_chart.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
    setShowDownloadMenu(false);
  }, [data, isDarkMode, maxValue, minValue, range]);

  return (
    <div
      className={`my-2 sm:my-3 rounded-lg p-2.5 sm:p-3 md:p-4 border ${
        isDarkMode
          ? "bg-haiintel-dark/50 border-haiintel-border"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h4 className={`text-xs sm:text-sm font-semibold ${isDarkMode ? "text-haiintel-text" : "text-gray-900"}`}>
          {data.title}
        </h4>
        <div className="relative">
          <button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDarkMode
                ? "hover:bg-haiintel-border text-gray-400 hover:text-gray-300"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
            title="Download chart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          {showDownloadMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDownloadMenu(false)}
              />
              <div className={`absolute right-0 mt-1 w-32 rounded-lg border shadow-lg z-20 ${
                isDarkMode
                  ? "bg-haiintel-dark border-haiintel-border"
                  : "bg-white border-gray-200"
              }`}>
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
                <button
                  onClick={downloadAsCSV}
                  className={`w-full px-3 py-2 text-left text-xs hover:bg-opacity-10 transition-colors rounded-b-lg ${
                    isDarkMode
                      ? "text-gray-300 hover:bg-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  📄 CSV Data
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="w-full">
        <svg viewBox="0 0 400 250" className="w-full">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = 220 - (i * 40);
            return (
              <line
                key={i}
                x1="40"
                y1={y}
                x2="380"
                y2={y}
                stroke={isDarkMode ? '#2a2a2a' : '#f0f0f0'}
                strokeWidth="1"
              />
            );
          })}

          {/* Line path */}
          {(() => {
            const chartWidth = 340;
            const chartHeight = 160;
            const pointSpacing = chartWidth / (data.values.length - 1 || 1);

            let pathD = '';
            data.values.forEach((value, index) => {
              const x = 40 + index * pointSpacing;
              const y = 220 - ((value - minValue) / range) * chartHeight;

              if (index === 0) {
                pathD += `M ${x} ${y}`;
              } else {
                pathD += ` L ${x} ${y}`;
              }
            });

            return (
              <>
                <path
                  d={pathD}
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2e90fa" />
                    <stop offset="100%" stopColor="#00d4ff" />
                  </linearGradient>
                </defs>
              </>
            );
          })()}

          {/* Points and labels */}
          {data.values.map((value, index) => {
            const chartWidth = 340;
            const chartHeight = 160;
            const pointSpacing = chartWidth / (data.values.length - 1 || 1);
            const x = 40 + index * pointSpacing;
            const y = 220 - ((value - minValue) / range) * chartHeight;

            return (
              <g key={index}>
                {/* Point */}
                <circle cx={x} cy={y} r="5" fill="#2e90fa" />
                <circle cx={x} cy={y} r="3" fill={isDarkMode ? '#1a1a1a' : '#ffffff'} />

                {/* Label */}
                <text
                  x={x}
                  y="240"
                  textAnchor="middle"
                  className={`text-[10px] ${isDarkMode ? 'fill-gray-400' : 'fill-gray-600'}`}
                >
                  {data.labels[index]}
                </text>

                {/* Value */}
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  className="text-[10px] font-semibold fill-haiintel-blue"
                >
                  {value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
});

LineChart.displayName = "LineChart";

export default LineChart;
