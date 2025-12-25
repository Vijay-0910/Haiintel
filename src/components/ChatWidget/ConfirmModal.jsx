import { memo } from "react";

const ConfirmModal = memo(
  ({ isOpen, onConfirm, onCancel, title, message, isDarkMode = true }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
        />

        {/* Modal */}
        <div
          className={`relative rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in ${
            isDarkMode
              ? "bg-haiintel-dark border border-haiintel-border"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Title */}
          <h3
            className={`text-lg font-semibold mb-3 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {title || "Confirm Action"}
          </h3>

          {/* Message */}
          <p
            className={`text-sm mb-6 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {message || "Are you sure you want to proceed?"}
          </p>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                isDarkMode
                  ? "bg-haiintel-border text-gray-300 hover:bg-haiintel-border-light"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg font-medium text-sm bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ConfirmModal.displayName = "ConfirmModal";

export default ConfirmModal;
