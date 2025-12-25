import { memo, useRef, useCallback } from "react";

const BarChart = memo(({ data, isDarkMode = true }) => {
  const maxValue = Math.max(...data.values);
  const chartRef = useRef(null);

  const handleDownload = useCallback(() => {
    // Create CSV content
    const csvContent = [
      ['Label', 'Value'],
      ...data.labels.map((label, index) => [label, data.values[index]])
    ].map(row => row.join(',')).join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/\s+/g, '_')}_chart.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [data]);

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
        <h4 className={`text-xs sm:text-sm font-semibold ${isDarkMode ? "text-haiintel-text" : "text-gray-900"}`}>
          {data.title}
        </h4>
        <button
          onClick={handleDownload}
          className={`p-1.5 rounded-lg transition-colors ${
            isDarkMode
              ? "hover:bg-haiintel-border text-gray-400 hover:text-gray-300"
              : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          }`}
          title="Download chart data as CSV"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {data.labels.map((label, index) => {
          const value = data.values[index];
          const percentage = (value / maxValue) * 100;

          return (
            <div key={index}>
              <div className={`flex justify-between text-[10px] sm:text-xs mb-0.5 sm:mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                <span className="truncate mr-2">{label}</span>
                <span className="font-semibold text-haiintel-blue flex-shrink-0">{value}</span>
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
